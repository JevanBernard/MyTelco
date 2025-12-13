from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware 
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any

from . import models, schemas, database
from .services import logic_mapper, transaction_service

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

@app.post("/api/survey/submit", response_model=Dict[str, Any])
def submit_survey(data: schemas.SurveyInput, db: Session = Depends(get_db)):
    profile_data = logic_mapper.generate_user_profile(data.dict())
    profile_data['user_id'] = str(data.userId)
    
    existing_profile = db.query(models.CustomerProfile).filter(
        models.CustomerProfile.user_id == str(data.userId)
    ).first()
    
    if existing_profile:
        for key, value in profile_data.items():
            setattr(existing_profile, key, value)
        db_profile = existing_profile
    else:
        db_profile = models.CustomerProfile(**profile_data)
        db.add(db_profile)
    
    try:
        db.commit()
        db.refresh(db_profile)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

    return {
        "status": "success",
        "message": "Survey processed",
        "data": profile_data
    }

# --- ENDPOINT DASHBOARD (WAJIB ADA) ---
@app.get("/api/dashboard/{user_id}")
def get_user_dashboard(user_id: str, db: Session = Depends(get_db)):
    # 1. Cek User
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User ID tidak valid")

    # 2. Ambil Profil
    profile = db.query(models.CustomerProfile).filter(
        models.CustomerProfile.user_id == user_id
    ).first()
    
    profile_data = {
        "plan_type": "New Member",
        "monthly_spend": 0,
        "data_usage": 0,
        "topup_freq": 0
    }
    
    recommended_offer = "General Offer"

    if profile:
        profile_data = {
            "plan_type": profile.plan_type,
            "monthly_spend": profile.monthly_spend,
            "data_usage": profile.avg_data_usage_gb,
            "topup_freq": profile.topup_freq
        }
        
        # LOGIKA REKOMENDASI MANUAL (PENGGANTI ML SEMENTARA)
        usage = float(profile.avg_data_usage_gb or 0)
        video = float(profile.pct_video_usage or 0)
        travel = float(profile.travel_score or 0)

        if usage > 2.0: recommended_offer = "Device Upgrade Offer"
        elif video > 0.6: recommended_offer = "Streaming Partner Pack"
        elif travel > 0.5: recommended_offer = "Roaming Pass"
        elif usage > 1.0: recommended_offer = "Data Booster"

    # 3. Cari Produk Sesuai Rekomendasi
    recommended_products = db.query(models.Product).filter(
        models.Product.category == recommended_offer,
        models.Product.is_active == True
    ).limit(3).all()

    # 4. History Transaksi
    transactions = db.query(models.Transaction, models.Product).join(
        models.Product, models.Transaction.product_id == models.Product.product_id
    ).filter(
        models.Transaction.user_id == user_id
    ).order_by(desc(models.Transaction.purchase_date)).limit(3).all()

    history_list = []
    for trx, prod in transactions:
        history_list.append({
            "product_name": prod.name,
            "amount": trx.amount,
            "date": trx.purchase_date,
            "status": trx.status
        })

    return {
        "user": {
            "name": user.name,
            "id": user_id,
            "phone": user.phone_number
        },
        "profile": profile_data,
        "recommendation": {
            "offer_name": recommended_offer,
            "products": recommended_products
        },
        "history": history_list
    }