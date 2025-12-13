import pandas as pd
import numpy as np
import joblib
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title = 'Telco Personalized Offer Prediction API',
    description = 'API for predicting personalized offers for Telco customers using an XGBoost model.',
    version = '2.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_PATH = r"C:\Users\Pongo\MyTelco\ML_Engine" 

print("Sedang memuat model dan artifacts...")

try:
    model = joblib.load(os.path.join(BASE_PATH, "xgb_model.pkl")) # Ganti nama jika beda
    encoder = joblib.load(os.path.join(BASE_PATH, "label_encoder.pkl"))
    preprocessor = joblib.load(os.path.join(BASE_PATH, "preprocessor.pkl"))
    feature_names = joblib.load(os.path.join(BASE_PATH, "final_features.pkl"))
        
    print("✅ Model, Encoder, dan Feature Names berhasil dimuat!")
    
except FileNotFoundError as e:
    print(f"❌ ERROR: File tidak ditemukan! Pastikan path benar. Detail: {e}")
    # Kita tidak stop app, tapi endpoint akan error jika di-hit

# --- 2. DATA SCHEMA (Sama seperti sebelumnya) ---
class Customer(BaseModel):
    customer_id: str = 'unknown'
    monthly_spend: float
    avg_data_usage_gb: float
    pct_video_usage: float
    travel_score: float
    complaint_count: int
    avg_call_duration: float
    topup_freq: int
    plan_type: str = "Prepaid"
    device_brand: str = "Unknown"
    account_age_days: int = 60

# --- 3. FEATURE ENGINEERING (Logic Otak Kiri) ---
def engineer_features(df_input):
    df = df_input.copy()
    
    # 1. Penanganan Konteks (Clip negatif)
    df['is_refund_context'] = (df['monthly_spend'] < 0).astype(int)
    df['monthly_spend'] = df['monthly_spend'].clip(lower=0)
    df['is_duration_error'] = (df['avg_call_duration'] < 0).astype(int)
    
    # 2. Ratio Features
    df['cost_per_gb'] = df['monthly_spend'] / (df['avg_data_usage_gb'] + 0.001)
    df['video_spend_est'] = df['monthly_spend'] * df['pct_video_usage']

    # 3. Log Transform (Penting buat XGBoost)
    df['log_monthly_spend'] = np.log1p(df['monthly_spend'])
    df['log_data_usage'] = np.log1p(df['avg_data_usage_gb'])
    df['log_topup_freq'] = np.log1p(df['topup_freq'])

    # 4. Hapus kolom mentah yang tidak dipakai training
    # (Pastikan list ini sesuai dengan engineering di notebook)
    drop_cols = ['customer_id', 'monthly_spend', 'avg_data_usage_gb', 'topup_freq', 'sms_freq']
    df = df.drop(columns=[c for c in drop_cols if c in df.columns], errors='ignore')

    return df

# --- 4. ENDPOINT REKOMENDASI UTAMA ---
@app.get("/")
def home():
    return {"message": "Telco API Ready. Use /recommend endpoint."}

@app.post("/recommend")
def recommend(customer: Customer):
    try:
        # A. Konversi Input ke DataFrame
        raw_data = customer.dict()
        df_input = pd.DataFrame([raw_data])
        df_engineered = engineer_features(df_input)
        df_final = preprocessor.transform(df_engineered)
        pred_idx = model.predict(df_final)[0]

        # B. Prediksi Model (ML Pure)
        pred_idx = model.predict(df_final)[0]
        base_offer = encoder.inverse_transform([pred_idx])[0]
        
        # Ambil confidence score (Opsional, untuk info tambahan)
        probs = model.predict_proba(df_final)[0]
        confidence = float(probs.max())

        # C. HYBRID RULES (Logic Otak Kanan / Business Override)
        final_offer = base_offer
        override_reason = "Model Prediction"

        # --- RULE 1: Crisis Management (Retention) ---
        if raw_data['complaint_count'] >= 2:
            final_offer = 'Retention Offer'
            override_reason = "Rule: High Complaint Count"

        # --- RULE 2: Streaming Addict ---
        elif raw_data['pct_video_usage'] > 0.6:
            final_offer = 'Streaming Partner Pack'
            override_reason = "Rule: High Video Usage"
            
        # --- RULE 3: Top-up Logic Correction ---
        # Jika model saranin Top-up Promo, TAPI user sebenernya rajin isi pulsa (>2x)
        # Ganti ke Data Booster (Lebih cuan)
        elif (base_offer == 'Top-up Promo') and (raw_data['topup_freq'] > 2):
            final_offer = 'Data Booster' 
            override_reason = "Rule: Frequent Top-up Correction"
            
        # --- RULE 4: Pancingan Top-up (Untuk user pasif) ---
        elif (raw_data['topup_freq'] <= 1) and (raw_data['monthly_spend'] < 30000):
            final_offer = 'Top-up Promo'
            override_reason = "Rule: Low Activity User"
            
        # --- RULE 5: Roaming (Orang Kaya/Traveler) ---
        elif raw_data['travel_score'] > 0.6: # Sesuaikan threshold
            final_offer = 'Roaming Pass'
            override_reason = "Rule: High Travel Score"

        # --- RULE 6: Roaming Check (DEFENSIVE - Blokir kalau skor rendah) ---
        elif (base_offer == 'Roaming Pass') and (raw_data['travel_score'] < 0.5):
            final_offer = 'General Offer'
            override_reason = "Rule: Invalid Roaming Prediction (Low Score)"

        # F. Return Hasil
        return {
            "customer_id": customer.customer_id,
            "status": "success",
            "final_recommendation": final_offer,
            "confidence_score": f"{confidence*100:.1f}%",
            "meta_data": {
                "original_model_prediction": base_offer,
                "logic_source": override_reason
            }
        }

    except Exception as e:
        # Menangkap error detail biar gampang debug
        import traceback
        print(traceback.format_exc()) 
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Health check
@app.get("/health")
def health():

    return {'status': 'healthy'}
