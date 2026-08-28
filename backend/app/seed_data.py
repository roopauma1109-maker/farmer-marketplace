import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import User, Crop, Enquiry, MarketPrice
from .auth import get_password_hash

# Authentic high-resolution crop images
CROP_IMAGE_MAP = {
    "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    "brinjal": "https://images.unsplash.com/photo-1628773822503-930a84d9f957?w=600&auto=format&fit=crop&q=80",
    "cabbage": "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80",
    "potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    "banana": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    "chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
    "onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    "carrot": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
    "turmeric": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    "paddy": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
    "drumstick": "https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80"
}

def seed_database(force_reseed=False):
    """
    Creates tables and seeds initial sample data with verified UTF-8 strings and authentic crop images.
    """
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        if not force_reseed and db.query(User).count() > 0:
            print("Database already contains data. Skipping initial seeding.")
            return

        if force_reseed:
            print("Clearing old data for clean UTF-8 seeding...")
            db.query(Enquiry).delete()
            db.query(Crop).delete()
            db.query(MarketPrice).delete()
            db.query(User).delete()
            db.commit()

        print("Seeding AgriDirect database with verified demo records...")

        # 1. Create Farmers
        farmers = [
            User(
                name="Kumar Velusamy",
                email="kumar.farmer@gmail.com",
                mobile="9876543210",
                password_hash=get_password_hash("farmer123"),
                role="farmer",
                location="Tambaram, Chengalpattu, Tamil Nadu",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=20)
            ),
            User(
                name="Murugan Palaniswamy",
                email="murugan.farmer@gmail.com",
                mobile="9876543211",
                password_hash=get_password_hash("farmer123"),
                role="farmer",
                location="Vadipatti, Madurai, Tamil Nadu",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=15)
            ),
            User(
                name="Selvam Natarajan",
                email="selvam.farmer@gmail.com",
                mobile="9876543212",
                password_hash=get_password_hash("farmer123"),
                role="farmer",
                location="Attur, Salem, Tamil Nadu",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=10)
            )
        ]
        db.add_all(farmers)
        db.commit()

        for f in farmers:
            db.refresh(f)

        # 2. Create Buyers
        buyers = [
            User(
                name="Anand Traders (Wholesale)",
                email="anand.traders@gmail.com",
                mobile="9123456780",
                password_hash=get_password_hash("buyer123"),
                role="buyer",
                location="Koyambedu Market, Chennai, Tamil Nadu",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=18)
            ),
            User(
                name="Priya Organics & Retail",
                email="priya.organics@gmail.com",
                mobile="9123456781",
                password_hash=get_password_hash("buyer123"),
                role="buyer",
                location="RS Puram, Coimbatore, Tamil Nadu",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=12)
            )
        ]
        db.add_all(buyers)
        db.commit()

        for b in buyers:
            db.refresh(b)

        # 3. Create Crops with verified authentic image URLs
        sample_crops = [
            Crop(
                farmer_id=farmers[0].id,
                crop_name="Tomato",
                quantity=500.0,
                unit="kg",
                price=24.0,
                location="Tambaram",
                description="Freshly harvested farm-grade juicy red tomatoes. Grown without excess chemical pesticides. Ready for immediate pickup or dispatch.",
                image_url=CROP_IMAGE_MAP["tomato"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
            ),
            Crop(
                farmer_id=farmers[0].id,
                crop_name="Brinjal",
                quantity=350.0,
                unit="kg",
                price=20.0,
                location="Tambaram",
                description="Tender and glossy medium-sized purple brinjal straight from our organic vegetable plot.",
                image_url=CROP_IMAGE_MAP["brinjal"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            ),
            Crop(
                farmer_id=farmers[0].id,
                crop_name="Cabbage",
                quantity=600.0,
                unit="kg",
                price=16.0,
                location="Tambaram",
                description="Compact and firm high quality green cabbage heads. Harvested this morning.",
                image_url=CROP_IMAGE_MAP["cabbage"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
            ),
            Crop(
                farmer_id=farmers[1].id,
                crop_name="Potato",
                quantity=800.0,
                unit="kg",
                price=28.0,
                location="Vadipatti, Madurai",
                description="Grade-A medium and large sized dry hill potatoes with great shelf life.",
                image_url=CROP_IMAGE_MAP["potato"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=4)
            ),
            Crop(
                farmer_id=farmers[1].id,
                crop_name="Banana",
                quantity=1500.0,
                unit="kg",
                price=18.0,
                location="Vadipatti, Madurai",
                description="Premium grade green mature Robusta banana bunches, optimal for wholesale ripening.",
                image_url=CROP_IMAGE_MAP["banana"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
            ),
            Crop(
                farmer_id=farmers[1].id,
                crop_name="Green Chilli",
                quantity=200.0,
                unit="kg",
                price=55.0,
                location="Vadipatti, Madurai",
                description="Spicy and fresh G-4 variety green chillies. Sorted and packed in aerated gunny bags.",
                image_url=CROP_IMAGE_MAP["chilli"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
            ),
            Crop(
                farmer_id=farmers[2].id,
                crop_name="Onion",
                quantity=1200.0,
                unit="kg",
                price=32.0,
                location="Attur, Salem",
                description="Top quality pungent Tamil Nadu country shallots (Sambar onion), thoroughly cured and dried.",
                image_url=CROP_IMAGE_MAP["onion"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=6)
            ),
            Crop(
                farmer_id=farmers[2].id,
                crop_name="Carrot",
                quantity=400.0,
                unit="kg",
                price=45.0,
                location="Attur, Salem",
                description="Sweet and crisp washed orange carrots suitable for supermarkets and catering vendors.",
                image_url=CROP_IMAGE_MAP["carrot"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=3)
            ),
            Crop(
                farmer_id=farmers[2].id,
                crop_name="Turmeric",
                quantity=1000.0,
                unit="kg",
                price=80.0,
                location="Attur, Salem",
                description="High curcumin Salem finger turmeric rhizomes freshly harvested from fertile red soil.",
                image_url=CROP_IMAGE_MAP["turmeric"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=7)
            ),
            Crop(
                farmer_id=farmers[1].id,
                crop_name="Paddy",
                quantity=3000.0,
                unit="kg",
                price=26.0,
                location="Vadipatti, Madurai",
                description="Single origin clean unpolished Samba paddy grain with moisture level under 12%.",
                image_url=CROP_IMAGE_MAP["paddy"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=8)
            ),
            Crop(
                farmer_id=farmers[0].id,
                crop_name="Drumstick",
                quantity=300.0,
                unit="kg",
                price=35.0,
                location="Tambaram",
                description="Freshly harvested tender green drumsticks (moringa pods) direct from farm trees.",
                image_url=CROP_IMAGE_MAP["drumstick"],
                availability="Available",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            )
        ]
        db.add_all(sample_crops)
        db.commit()

        for c in sample_crops:
            db.refresh(c)

        # 4. Create Market Prices (AGMARKNET / e-NAM benchmark data)
        today_str = datetime.date.today().strftime("%Y-%m-%d")
        market_prices = [
            MarketPrice(crop_name="Tomato", market="Koyambedu Wholesale Market", district="Chennai", min_price=18.0, max_price=25.0, modal_price=22.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Tomato", market="Mattuthavani Central Market", district="Madurai", min_price=19.0, max_price=24.0, modal_price=21.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Tomato", market="VOC Market", district="Salem", min_price=17.0, max_price=23.0, modal_price=20.0, unit="kg", price_date=today_str, source="e-NAM"),
            MarketPrice(crop_name="Onion", market="Koyambedu Wholesale Market", district="Chennai", min_price=28.0, max_price=36.0, modal_price=32.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Onion", market="Leigh Bazaar", district="Salem", min_price=26.0, max_price=34.0, modal_price=30.0, unit="kg", price_date=today_str, source="e-NAM"),
            MarketPrice(crop_name="Potato", market="Koyambedu Wholesale Market", district="Chennai", min_price=24.0, max_price=30.0, modal_price=27.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Potato", market="Mattuthavani Central Market", district="Madurai", min_price=25.0, max_price=31.0, modal_price=28.0, unit="kg", price_date=today_str, source="data.gov.in"),
            MarketPrice(crop_name="Brinjal", market="Koyambedu Wholesale Market", district="Chennai", min_price=16.0, max_price=23.0, modal_price=19.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Brinjal", market="Gandhi Market", district="Tiruchirappalli", min_price=15.0, max_price=22.0, modal_price=18.0, unit="kg", price_date=today_str, source="e-NAM"),
            MarketPrice(crop_name="Banana", market="Mattuthavani Central Market", district="Madurai", min_price=15.0, max_price=20.0, modal_price=18.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Banana", market="Ukkadam Market", district="Coimbatore", min_price=16.0, max_price=22.0, modal_price=19.0, unit="kg", price_date=today_str, source="e-NAM"),
            MarketPrice(crop_name="Carrot", market="Koyambedu Wholesale Market", district="Chennai", min_price=38.0, max_price=48.0, modal_price=43.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Carrot", market="Mettupalayam Agro Mandi", district="Coimbatore", min_price=35.0, max_price=45.0, modal_price=40.0, unit="kg", price_date=today_str, source="e-NAM"),
            MarketPrice(crop_name="Cabbage", market="Koyambedu Wholesale Market", district="Chennai", min_price=12.0, max_price=18.0, modal_price=15.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Green Chilli", market="Mattuthavani Central Market", district="Madurai", min_price=48.0, max_price=60.0, modal_price=54.0, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Turmeric", market="Erode Regulated Market", district="Erode", min_price=72.0, max_price=88.0, modal_price=82.0, unit="kg", price_date=today_str, source="e-NAM"),
            MarketPrice(crop_name="Paddy", market="Thanjavur Direct Purchase Centre", district="Thanjavur", min_price=23.0, max_price=27.0, modal_price=25.5, unit="kg", price_date=today_str, source="AGMARKNET"),
            MarketPrice(crop_name="Drumstick", market="Ottanchathiram Market", district="Dindigul", min_price=28.0, max_price=42.0, modal_price=35.0, unit="kg", price_date=today_str, source="AGMARKNET")
        ]
        db.add_all(market_prices)
        db.commit()

        # 5. Create Sample Enquiries
        sample_enquiries = [
            Enquiry(
                crop_id=sample_crops[0].id,
                buyer_id=buyers[0].id,
                farmer_id=farmers[0].id,
                required_quantity=200.0,
                message="Vanakkam Kumar, we run a daily retail chain in Chennai. We require 200 kg of fresh tomatoes every Tuesday and Friday. Can you provide transport or shall we arrange pickup?",
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=6)
            ),
            Enquiry(
                crop_id=sample_crops[1].id,
                buyer_id=buyers[0].id,
                farmer_id=farmers[0].id,
                required_quantity=100.0,
                message="Hello, interested in 100 kg purple brinjal for Koyambedu distribution. Kindly confirm availability.",
                status="Accepted",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
            ),
            Enquiry(
                crop_id=sample_crops[4].id,
                buyer_id=buyers[1].id,
                farmer_id=farmers[1].id,
                required_quantity=500.0,
                message="Vanakkam Murugan, Priya Organics is interested in buying 500 kg Robusta Bananas. Please contact us regarding quality grades.",
                status="Pending",
                created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=14)
            )
        ]
        db.add_all(sample_enquiries)
        db.commit()

        print("Database seeded successfully with clean UTF-8 records and verified crop images.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(force_reseed=True)
