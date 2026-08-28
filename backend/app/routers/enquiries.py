from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import Enquiry, Crop, User
from ..schemas import EnquiryCreate, EnquiryStatusUpdate, EnquiryResponse
from ..auth import get_current_user, require_farmer, require_buyer

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])

@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
def create_enquiry(
    enquiry_data: EnquiryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_buyer)
):
    crop = db.query(Crop).filter(Crop.id == enquiry_data.crop_id).first()
    if not crop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Crop with ID {enquiry_data.crop_id} not found."
        )

    # A farmer cannot send enquiry to themselves
    if crop.farmer_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot submit an enquiry for your own crop listing."
        )

    new_enquiry = Enquiry(
        crop_id=crop.id,
        buyer_id=current_user.id,
        farmer_id=crop.farmer_id,
        required_quantity=enquiry_data.required_quantity,
        message=enquiry_data.message.strip(),
        status="Pending"
    )
    db.add(new_enquiry)
    db.commit()
    db.refresh(new_enquiry)

    # Return fully populated response
    return db.query(Enquiry)\
        .options(
            joinedload(Enquiry.crop),
            joinedload(Enquiry.buyer),
            joinedload(Enquiry.farmer)
        )\
        .filter(Enquiry.id == new_enquiry.id)\
        .first()

@router.get("/farmer", response_model=List[EnquiryResponse])
def get_farmer_enquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    return db.query(Enquiry)\
        .options(
            joinedload(Enquiry.crop),
            joinedload(Enquiry.buyer),
            joinedload(Enquiry.farmer)
        )\
        .filter(Enquiry.farmer_id == current_user.id)\
        .order_by(Enquiry.created_at.desc())\
        .all()

@router.get("/buyer", response_model=List[EnquiryResponse])
def get_buyer_enquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_buyer)
):
    return db.query(Enquiry)\
        .options(
            joinedload(Enquiry.crop),
            joinedload(Enquiry.buyer),
            joinedload(Enquiry.farmer)
        )\
        .filter(Enquiry.buyer_id == current_user.id)\
        .order_by(Enquiry.created_at.desc())\
        .all()

@router.patch("/{id}/status", response_model=EnquiryResponse)
def update_enquiry_status(
    id: int,
    status_update: EnquiryStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_farmer)
):
    enquiry = db.query(Enquiry).filter(Enquiry.id == id).first()
    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enquiry with ID {id} not found."
        )

    if enquiry.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update status for enquiries on your crops."
        )

    enquiry.status = status_update.status
    db.commit()
    db.refresh(enquiry)

    return db.query(Enquiry)\
        .options(
            joinedload(Enquiry.crop),
            joinedload(Enquiry.buyer),
            joinedload(Enquiry.farmer)
        )\
        .filter(Enquiry.id == enquiry.id)\
        .first()
