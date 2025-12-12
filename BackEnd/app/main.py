from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <--- WAJIB IMPORT INI
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas, database
from .services.logic_mapper import generate_user_profile

app = FastAPI(title="MyTelco API")

# --- KONFIGURASI CORS (Jembatan Frontend <-> Backend) ---
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"] artinya SEMUA website boleh ambil data.
    # Aman untuk dev, tapi saat production nanti ganti ke domain asli.
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], # Izinkan GET, POST, PUT, DELETE
    allow_headers=["*"], # Izinkan semua header
)

# ... (Sisa kode ke bawah sama persis seperti sebelumnya) ...

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

@app.post("/api/survey/submit")
def submit_survey(data: schemas.SurveyInput):
    profile = generate_user_profile(data.dict())
    
    # Logic Mockup
    offer = "General Offer"
    if profile['avg_data_usage_gb'] > 8.0: offer = "Device Upgrade Offer"
    elif profile['pct_video_usage'] > 0.7: offer = "Streaming Partner Pack"
    elif profile['travel_score'] > 0.6: offer = "Roaming Pass"
    elif profile['avg_data_usage_gb'] > 3.0 and profile['pct_video_usage'] < 0.3: offer = "Data Booster"

    return {
        "status": "success",
        "generated_profile": profile,
        "recommendation": offer
    }