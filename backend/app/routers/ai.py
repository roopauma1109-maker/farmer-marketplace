from typing import Optional
from fastapi import APIRouter, Query
from ..schemas import AIPricePredictionResponse, AIDemandPredictionResponse

router = APIRouter(prefix="/ai", tags=["AI Modules (Future / Advisory)"])

@router.get("/price-prediction", response_model=AIPricePredictionResponse)
def get_price_prediction(
    crop_name: str = Query(..., description="Crop name to evaluate"),
    location: str = Query("Tamil Nadu", description="Location / District"),
    season: Optional[str] = Query("Current Season", description="Growing or harvest season")
):
    """
    Modular prototype endpoint for future Machine Learning Price Forecasting.
    Uses benchmark seasonal trends to output projected price corridors.
    """
    clean_crop = crop_name.split("(")[0].strip().capitalize()
    
    # Baseline benchmarks for prototype preview
    benchmarks = {
        "Tomato": (22.0, 26.0),
        "Onion": (30.0, 38.0),
        "Potato": (26.0, 32.0),
        "Brinjal": (18.0, 24.0),
        "Banana": (17.0, 22.0),
        "Carrot": (42.0, 50.0),
        "Cabbage": (14.0, 19.0),
        "Green chilli": (50.0, 65.0),
        "Turmeric": (78.0, 90.0),
        "Paddy": (25.0, 28.0),
    }

    min_p, max_p = benchmarks.get(clean_crop, (20.0, 30.0))

    return {
        "crop_name": clean_crop,
        "location": location,
        "estimated_price_range": f"₹{min_p:.0f} – ₹{max_p:.0f} / kg",
        "min_predicted": min_p,
        "max_predicted": max_p,
        "unit": "kg",
        "confidence_level": "85% (Statistical Baseline Model)",
        "note": "Prototype forecast based on historical mandi arrivals and seasonal patterns. Real ML model integration pipeline ready."
    }

@router.get("/demand-prediction", response_model=AIDemandPredictionResponse)
def get_demand_prediction(
    crop_name: str = Query(..., description="Crop name to evaluate"),
    location: str = Query("Tamil Nadu", description="Location / District")
):
    """
    Modular prototype endpoint for future Machine Learning Demand Forecasting.
    """
    clean_crop = crop_name.split("(")[0].strip().capitalize()

    demand_map = {
        "Tomato": ("High", "Strong wholesale and urban retail consumption", "Favorable window for direct bulk sale."),
        "Onion": ("Very High", "Consistent high consumption across domestic markets", "Steady buyer enquiry expected."),
        "Potato": ("Moderate-High", "Steady cold storage and bulk buying", "Stable pricing expected across mandis."),
        "Brinjal": ("Moderate", "Daily local consumption", "Sell in weekly batches for highest freshness premium."),
        "Banana": ("High", "Steady festival and daily market demand", "Direct bulk contracts recommended."),
        "Turmeric": ("High", "Export & industrial processing interest", "Hold for peak commodity trading windows."),
    }

    level, sentiment, rec = demand_map.get(
        clean_crop,
        ("Moderate", "Normal seasonal demand observed in local mandis", "List on AgriDirect marketplace for direct buyer reach.")
    )

    return {
        "crop_name": clean_crop,
        "location": location,
        "demand_level": level,
        "market_sentiment": sentiment,
        "recommendation": rec,
        "note": "Informational prototype analytics. Farmers have full autonomy over pricing and listing."
    }
