from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from ..database import get_db
from ..models import MarketPrice
from ..schemas import MarketPriceResponse, MarketPriceComparisonResponse

router = APIRouter(prefix="/market-prices", tags=["Market Prices"])

@router.get("", response_model=List[MarketPriceResponse])
def get_market_prices(
    crop: Optional[str] = Query(None, description="Filter by crop name e.g. Tomato"),
    district: Optional[str] = Query(None, description="Filter by district e.g. Chennai"),
    market: Optional[str] = Query(None, description="Filter by market name e.g. Koyambedu"),
    date: Optional[str] = Query(None, description="Filter by price date YYYY-MM-DD"),
    search: Optional[str] = Query(None, description="Universal search query"),
    db: Session = Depends(get_db)
):
    query = db.query(MarketPrice)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                MarketPrice.crop_name.ilike(s),
                MarketPrice.market.ilike(s),
                MarketPrice.district.ilike(s)
            )
        )
    if crop:
        query = query.filter(MarketPrice.crop_name.ilike(f"%{crop.strip()}%"))
    if district:
        query = query.filter(MarketPrice.district.ilike(f"%{district.strip()}%"))
    if market:
        query = query.filter(MarketPrice.market.ilike(f"%{market.strip()}%"))
    if date:
        query = query.filter(MarketPrice.price_date == date.strip())

    return query.order_by(MarketPrice.crop_name.asc(), MarketPrice.modal_price.desc()).all()

@router.get("/compare", response_model=MarketPriceComparisonResponse)
def compare_farmer_price(
    crop_name: str = Query(..., description="Crop name to compare"),
    expected_price: float = Query(..., gt=0, description="Farmer's expected price per unit"),
    district: Optional[str] = Query(None, description="Optional district"),
    db: Session = Depends(get_db)
):
    base_name = crop_name.split("(")[0].strip()

    query = db.query(MarketPrice).filter(
        or_(
            MarketPrice.crop_name.ilike(f"%{base_name}%"),
            MarketPrice.crop_name.ilike(f"%{crop_name.strip()}%")
        )
    )
    if district:
        query = query.filter(MarketPrice.district.ilike(f"%{district.strip()}%"))

    records = query.all()

    if not records:
        records = db.query(MarketPrice).filter(
            MarketPrice.crop_name.ilike(f"%{base_name}%")
        ).all()

    if not records:
        return {
            "crop_name": crop_name,
            "expected_price": expected_price,
            "unit": "kg",
            "market_found": False,
            "min_price": None,
            "max_price": None,
            "modal_price": None,
            "market": None,
            "district": None,
            "status_message": f"No active government mandi price data currently found for '{crop_name}'. You can set your competitive price freely."
        }

    overall_min = min(r.min_price for r in records)
    overall_max = max(r.max_price for r in records)
    avg_modal = round(sum(r.modal_price for r in records) / len(records), 2)
    primary_market = records[0].market
    primary_district = records[0].district

    if expected_price < overall_min:
        msg = f"Your price (₹{expected_price}/kg) is below current mandi minimum (₹{overall_min}/kg). You may be underpricing your crop!"
    elif expected_price > overall_max:
        msg = f"Your price (₹{expected_price}/kg) is above the highest mandi rate (₹{overall_max}/kg). Buyers might negotiate or prefer competitive rates."
    else:
        msg = f"Your price (₹{expected_price}/kg) is within the current market range (₹{overall_min} - ₹{overall_max}/kg). This is very competitive!"

    return {
        "crop_name": crop_name,
        "expected_price": expected_price,
        "unit": records[0].unit,
        "market_found": True,
        "min_price": overall_min,
        "max_price": overall_max,
        "modal_price": avg_modal,
        "market": primary_market,
        "district": primary_district,
        "status_message": msg
    }

@router.get("/crop/{crop_name}", response_model=List[MarketPriceResponse])
@router.get("/{crop_name}", response_model=List[MarketPriceResponse])
def get_prices_for_crop(crop_name: str, db: Session = Depends(get_db)):
    if crop_name == "compare":
        return []
    base_name = crop_name.split("(")[0].strip()
    records = db.query(MarketPrice).filter(
        or_(
            MarketPrice.crop_name.ilike(f"%{base_name}%"),
            MarketPrice.crop_name.ilike(f"%{crop_name.strip()}%")
        )
    ).all()
    if not records:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No market price records found for {crop_name}"
        )
    return records
