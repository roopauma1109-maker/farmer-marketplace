from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import User, Crop
from ..schemas import UserResponse, FarmerPublicResponse, UserUpdate, CropResponse
from ..auth import require_farmer, get_current_user

router = APIRouter(prefix="/farmers", tags=["Farmers"])

@router.get("/{id}")
def get_farmer_public_profile(id: int, db: Session = Depends(get_db)):
    farmer = db.query(User).filter(User.id == id, User.role == "farmer").first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Farmer with ID {id} not found."
        )
    
    crops = db.query(Crop).filter(Crop.farmer_id == id, Crop.availability == "Available").all()
    
    return {
        "id": farmer.id,
        "name": farmer.name,
        "location": farmer.location,
        "role": farmer.role,
        "created_at": farmer.created_at,
        "active_crops_count": len(crops),
        "crops": crops
    }

@router.put("/profile", response_model=UserResponse)
def update_farmer_profile(
    profile_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    if profile_data.name:
        current_user.name = profile_data.name.strip()
    if profile_data.mobile:
        # Check if mobile exists in another user
        existing = db.query(User).filter(User.mobile == profile_data.mobile.strip(), User.id != current_user.id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number already registered by another account."
            )
        current_user.mobile = profile_data.mobile.strip()
    if profile_data.location is not None:
        current_user.location = profile_data.location.strip()

    db.commit()
    db.refresh(current_user)
    return current_user
