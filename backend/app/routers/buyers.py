from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserResponse, UserUpdate
from ..auth import require_buyer

router = APIRouter(prefix="/buyers", tags=["Buyers"])

@router.put("/profile", response_model=UserResponse)
def update_buyer_profile(
    profile_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_buyer)
):
    if profile_data.name:
        current_user.name = profile_data.name.strip()
    if profile_data.mobile:
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
