import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

# ----------------- User Schemas -----------------

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    mobile: str = Field(..., min_length=10, max_length=15)
    role: str = Field(..., pattern="^(farmer|buyer)$")
    location: Optional[str] = Field(None, max_length=150)

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    username: str = Field(..., description="Email or Mobile number")
    password: str = Field(..., min_length=1)

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    mobile: Optional[str] = Field(None, min_length=10, max_length=15)
    location: Optional[str] = Field(None, max_length=150)

class UserResponse(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class FarmerPublicResponse(BaseModel):
    id: int
    name: str
    location: Optional[str] = None
    role: str

    class Config:
        from_attributes = True

class BuyerPublicResponse(BaseModel):
    id: int
    name: str
    email: str
    mobile: str
    location: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

# ----------------- Crop Schemas -----------------

class CropBase(BaseModel):
    crop_name: str = Field(..., min_length=2, max_length=100)
    quantity: float = Field(..., gt=0)
    unit: str = Field("kg", max_length=20)
    price: float = Field(..., gt=0)
    location: str = Field(..., min_length=2, max_length=150)
    description: Optional[str] = None
    image_url: Optional[str] = None
    availability: str = Field("Available", pattern="^(Available|Sold|Under Negotiation)$")

class CropCreate(CropBase):
    pass

class CropUpdate(BaseModel):
    crop_name: Optional[str] = Field(None, min_length=2, max_length=100)
    quantity: Optional[float] = Field(None, gt=0)
    unit: Optional[str] = Field(None, max_length=20)
    price: Optional[float] = Field(None, gt=0)
    location: Optional[str] = Field(None, min_length=2, max_length=150)
    description: Optional[str] = None
    image_url: Optional[str] = None
    availability: Optional[str] = Field(None, pattern="^(Available|Sold|Under Negotiation)$")

class CropResponse(CropBase):
    id: int
    farmer_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    farmer: Optional[FarmerPublicResponse] = None

    class Config:
        from_attributes = True

# ----------------- Enquiry Schemas -----------------

class EnquiryCreate(BaseModel):
    crop_id: int
    required_quantity: float = Field(..., gt=0)
    message: str = Field(..., min_length=3, max_length=1000)

class EnquiryStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Pending|Accepted|Rejected)$")

class EnquiryResponse(BaseModel):
    id: int
    crop_id: int
    buyer_id: int
    farmer_id: int
    required_quantity: float
    message: str
    status: str
    created_at: datetime.datetime
    crop: Optional[CropResponse] = None
    buyer: Optional[BuyerPublicResponse] = None
    farmer: Optional[FarmerPublicResponse] = None

    class Config:
        from_attributes = True

# ----------------- Market Price Schemas -----------------

class MarketPriceResponse(BaseModel):
    id: int
    crop_name: str
    market: str
    district: str
    min_price: float
    max_price: float
    modal_price: float
    unit: str
    price_date: str
    source: str

    class Config:
        from_attributes = True

class MarketPriceComparisonResponse(BaseModel):
    crop_name: str
    expected_price: float
    unit: str
    market_found: bool
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    modal_price: Optional[float] = None
    market: Optional[str] = None
    district: Optional[str] = None
    status_message: str

# ----------------- AI Modules Schemas -----------------

class AIPricePredictionRequest(BaseModel):
    crop_name: str
    location: str
    season: Optional[str] = "Current"

class AIPricePredictionResponse(BaseModel):
    crop_name: str
    location: str
    estimated_price_range: str
    min_predicted: float
    max_predicted: float
    unit: str
    confidence_level: str
    note: str

class AIDemandPredictionRequest(BaseModel):
    crop_name: str
    location: str

class AIDemandPredictionResponse(BaseModel):
    crop_name: str
    location: str
    demand_level: str
    market_sentiment: str
    recommendation: str
    note: str
