from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from . import models, schemas, database
from .services import logic_mapper
from .services import transaction_service

# Inisialisasi DB (Opsional jika sudah ada via SQL script)
# models.Base.metadata.create_all(bind=database.engine) 

app = FastAPI(title="MyTelco API")

# --- KONFIGURASI CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "MyTelco API Running", "db_mode": "Supabase PostgreSQL"}

@app.get("/api/products", response_model=List[schemas.ProductBase])
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    return products

@app.post("/api/survey/submit", response_model=Dict[str, Any])
def submit_survey(data: schemas.SurveyInput, db: Session = Depends(get_db)):
    """
    Menerima data survei -> Hitung Fitur Profil -> Simpan ke DB
    """
    # 1. Hitung Fitur Profil (Logic Mapper)
    profile_data = logic_mapper.generate_user_profile(data.dict())
    
    # Tambahkan User ID
    profile_data['user_id'] = str(data.userId)
    
    # 2. Simpan/Update Profil ke Database
    # Cek apakah profil sudah ada
    existing_profile = db.query(models.CustomerProfile).filter(
        models.CustomerProfile.user_id == str(data.userId)
    ).first()
    
    if existing_profile:
        # Update
        for key, value in profile_data.items():
            setattr(existing_profile, key, value)
        db_profile = existing_profile
    else:
        # Insert Baru
        db_profile = models.CustomerProfile(**profile_data)
        db.add(db_profile)
    
    try:
        db.commit()
        db.refresh(db_profile)
    except Exception as e:
        db.rollback()
        print(f"Database Error: {e}")
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

    # 3. Simple Rule-Based Recommendation (Mockup untuk ML)
    # Gunakan profile_data (dict) untuk logika ini, bukan db_profile (object)
    offer = "General Offer"
    avg_data = profile_data.get('avg_data_usage_gb', 0)
    pct_video = profile_data.get('pct_video_usage', 0)
    travel_score = profile_data.get('travel_score', 0)

    if avg_data > 8.0: 
        offer = "Device Upgrade Offer"
    elif pct_video > 0.7: 
        offer = "Streaming Partner Pack"
    elif travel_score > 0.6: 
        offer = "Roaming Pass"
    elif avg_data > 3.0 and pct_video < 0.3: 
        offer = "Data Booster"

    # 4. Return Response
    return {
        "status": "success",
        "message": "Survey processed successfully",
        "data": {
            "profile_id": db_profile.profile_id,
            "user_id": db_profile.user_id,
            "plan_type": db_profile.plan_type,
            "calculated_features": profile_data,
            "initial_recommendation": offer
        }
    }

@app.post("/api/purchase", response_model=schemas.TransactionResponse)
def purchase_product(data: schemas.PurchaseInput, db: Session = Depends(get_db)):
    try:
        result = transaction_service.process_purchase(db, data)
        return {
            "status": "success", 
            "message": "Transaksi berhasil dicatat",
            "new_balance": result
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"Transaction Error: {e}")
        raise HTTPException(status_code=500, detail="Terjadi kesalahan server")