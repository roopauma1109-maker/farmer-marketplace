from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserRegister, UserLogin, UserResponse, Token
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if email or mobile already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered. Please use another email or login."
        )

    existing_mobile = db.query(User).filter(User.mobile == user_data.mobile).first()
    if existing_mobile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mobile number is already registered. Please login."
        )

    # Create new user
    new_user = User(
        name=user_data.name.strip(),
        email=user_data.email.strip().lower(),
        mobile=user_data.mobile.strip(),
        password_hash=get_password_hash(user_data.password),
        role=user_data.role.strip().lower(),
        location=user_data.location.strip() if user_data.location else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token
    access_token = create_access_token(
        data={"sub": str(new_user.id), "role": new_user.role, "email": new_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    identifier = login_data.username.strip()
    
    # Check user by email or mobile
    user = db.query(User).filter(
        (User.email == identifier.lower()) | (User.mobile == identifier)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/mobile number or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role, "email": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
