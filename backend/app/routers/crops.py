from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from ..database import get_db
from ..models import Crop, User
from ..schemas import CropCreate, CropUpdate, CropResponse
from ..auth import get_current_user, require_farmer

router = APIRouter(prefix="/crops", tags=["Crops"])

@router.post("", response_model=CropResponse, status_code=status.HTTP_201_CREATED)
def create_crop(
    crop_data: CropCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    new_crop = Crop(
        farmer_id=current_user.id,
        crop_name=crop_data.crop_name.strip(),
        quantity=crop_data.quantity,
        unit=crop_data.unit.strip(),
        price=crop_data.price,
        location=crop_data.location.strip(),
        description=crop_data.description.strip() if crop_data.description else None,
        image_url=crop_data.image_url.strip() if crop_data.image_url else None,
        availability=crop_data.availability
    )
    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)
    return new_crop

@router.get("", response_model=List[CropResponse])
def get_crops(
    search: Optional[str] = Query(None, description="Search by crop name, description or location"),
    crop: Optional[str] = Query(None, description="Filter specifically by crop name"),
    location: Optional[str] = Query(None, description="Filter by location or district"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    availability: Optional[str] = Query(None, description="Filter by availability status"),
    db: Session = Depends(get_db)
):
    query = db.query(Crop).options(joinedload(Crop.farmer))

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Crop.crop_name.ilike(search_term),
                Crop.location.ilike(search_term),
                Crop.description.ilike(search_term)
            )
        )
    if crop:
        query = query.filter(Crop.crop_name.ilike(f"%{crop.strip()}%"))
    if location:
        query = query.filter(Crop.location.ilike(f"%{location.strip()}%"))
    if min_price is not None:
        query = query.filter(Crop.price >= min_price)
    if max_price is not None:
        query = query.filter(Crop.price <= max_price)
    if availability:
        query = query.filter(Crop.availability == availability)

    # Order by newest listings first
    return query.order_by(Crop.created_at.desc()).all()

@router.get("/my", response_model=List[CropResponse])
def get_my_crops(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    return db.query(Crop).options(joinedload(Crop.farmer))\
        .filter(Crop.farmer_id == current_user.id)\
        .order_by(Crop.created_at.desc())\
        .all()

@router.get("/{id}", response_model=CropResponse)
def get_crop_by_id(id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).options(joinedload(Crop.farmer)).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {id} not found."
        )
    return crop

@router.put("/{id}", response_model=CropResponse)
def update_crop(
    id: int,
    crop_data: CropUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    crop = db.query(Crop).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {id} not found."
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own crop listings."
        )

    update_dict = crop_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        if value is not None:
            if isinstance(value, str):
                setattr(crop, field, value.strip())
            else:
                setattr(crop, field, value)

    db.commit()
    db.refresh(crop)
    return crop

@router.patch("/{id}/sold", response_model=CropResponse)
def mark_crop_as_sold(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    crop = db.query(Crop).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {id} not found."
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only manage your own crop listings."
        )

    crop.availability = "Sold"
    db.commit()
    db.refresh(crop)
    return crop

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_crop(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    crop = db.query(Crop).filter(Crop.id == id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {id} not found."
        )
    if crop.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own crop listings."
        )

    db.delete(crop)
    db.commit()
    return {"message": "Crop listing deleted successfully."}
