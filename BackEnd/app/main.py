from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Import modul internal kita
from . import models, schemas, database
from .services.logic_mapper import generate_user_profile

# Inisialisasi App
app = FastAPI(title="MyTelco Intelligence API")

# Setup CORS (Wajib agar Frontend bisa akses)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint Health Check
@app.get("/")
def read_root():
    return {"status": "MyTelco API Running", "mode": "Supabase Connected"}

# Endpoint 1: Ambil Katalog Produk (Dipakai di Halaman Produk)
@app.get("/api/products", response_model=List[schemas.ProductBase])
def get_products(db: Session = Depends(database.get_db)):
    # Ambil semua produk aktif dari DB
    products = db.query(models.Product).filter(models.Product.is_active == True).all()
    return products

# Endpoint 2: Submit Survey & Dapatkan Rekomendasi (Dipakai di Halaman Survey)
@app.post("/api/survey/submit")
def submit_survey_and_predict(data: schemas.SurveyInput):
    print(f"📥 New Survey: {data.name} | {data.activity}")
    
    # 1. Jalankan Logic Mapper (User -> Angka Statistik)
    ml_profile = generate_user_profile(data.dict())
    
    # 2. Simulasi Prediksi (Rule-Based Mockup sebelum ML masuk)
    # Logic sederhana: Jika usage besar -> Data Booster / Upgrade
    recommended_category = "General Offer" # Default
    
    if ml_profile['avg_data_usage_gb'] > 8.0:
        recommended_category = "Device Upgrade Offer"
    elif ml_profile['pct_video_usage'] > 0.7:
        recommended_category = "Streaming Partner Pack"
    elif ml_profile['travel_score'] > 0.6:
        recommended_category = "Roaming Pass"
    elif ml_profile['avg_data_usage_gb'] > 3.0 and ml_profile['pct_video_usage'] < 0.3:
        recommended_category = "Data Booster"

    # 3. Return Hasil
    return {
        "status": "success",
        "generated_profile": ml_profile, # Data untuk debug/ML
        "recommendation": recommended_category
    }