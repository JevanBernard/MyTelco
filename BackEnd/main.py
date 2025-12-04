from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from utils import create_features, apply_business_rules
from fastapi.middleware.cors import CORSMiddleware
# items = []  

# @app.get("/")
# async def read_root():
#     return {"Hello": "World"}

# @app.get("/item/")
# def create_item(item: str):
#     items.append(item)
#     return items

preprocessor = joblib.load(r"C:\Users\Pongo\MyTelco\ML_Engine\preprocessor.pkl")
model = joblib.load(r"C:\Users\Pongo\MyTelco\ML_Engine\xgb_model.pkl")

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

# schema input

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
    account_age_days: int = 60 # untuk user baru

    # def to_model_input(self):
    #     data = self.dict()
    #     data.pop('customer_id', None)
    #     data.pop('device_brand', None)
    #     return pd.DataFrame([data])

@app.get("/")
def home():
    return {"message": "Welcome to the Telco Personalized Offer Prediction API"}

@app.post("/recommend")
def recommend(customer: Customer):
    try:
        offer_map = {
            0: "General Offer",
            1: "Top-up Promo",
            2: "Device Upgrade Offer",
            3: "Data Booster",
            4: "Retention Offer",
            5: "Streaming Partner Pack",
            6: "Roaming Pass",
            7: "Voice Bundle",
            8: "Family Plan Offer"       
        }
        # Ubah ke DataFrame
        df = pd.DataFrame([customer.dict()])

        # Hilangkan kolom yang tidak dipakai model
        df = df.drop(columns=["customer_id"], errors="ignore")

        # Feature engineering (harus sama persis dengan training)
        df = create_features(df)

        # Preprocessing (OneHot + Scaling)
        df_processed = preprocessor.transform(df)

        # Prediksi probabilitas
        probs = model.predict_proba(df_processed)[0]
        classes = model.classes_

        # Ranking 3 teratas
        top_idx = probs.argsort()[::-1][:3]
        recommendations = [
            {
                "rank": int(i+1),
                "offer": offer_map[int(classes[idx])],
                "confidence": f"{probs[idx]*100:.1f}%"
            }
            for i, idx in enumerate(top_idx)
        ]

        # Business rules override
        recommendations = apply_business_rules(recommendations, customer)

        return {
            "customer_id": customer.customer_id,
            "status": "success",
            "recommendations": recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
# Health check endpoint
@app.get("/health")
def health():
    return {'status':'healthy', "model_loaded": True}