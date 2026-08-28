import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="farmer")  # "farmer" or "buyer"
    location = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    crops = relationship("Crop", back_populates="farmer", cascade="all, delete-orphan")
    sent_enquiries = relationship("Enquiry", foreign_keys="[Enquiry.buyer_id]", back_populates="buyer")
    received_enquiries = relationship("Enquiry", foreign_keys="[Enquiry.farmer_id]", back_populates="farmer")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_name = Column(String(100), nullable=False, index=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False, default="kg")  # kg, quintal, ton, bag, box
    price = Column(Float, nullable=False)  # Price per unit in ₹
    location = Column(String(150), nullable=False, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    availability = Column(String(50), nullable=False, default="Available")  # Available, Sold, Under Negotiation
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    farmer = relationship("User", back_populates="crops")
    enquiries = relationship("Enquiry", back_populates="crop", cascade="all, delete-orphan")


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id", ondelete="CASCADE"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    required_quantity = Column(Float, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(30), nullable=False, default="Pending")  # Pending, Accepted, Rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    crop = relationship("Crop", back_populates="enquiries")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="sent_enquiries")
    farmer = relationship("User", foreign_keys=[farmer_id], back_populates="received_enquiries")


class MarketPrice(Base):
    __tablename__ = "market_prices"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False, index=True)
    market = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    modal_price = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False, default="kg")
    price_date = Column(String(30), nullable=False, index=True)
    source = Column(String(100), nullable=False, default="AGMARKNET")  # AGMARKNET, e-NAM, data.gov.in
