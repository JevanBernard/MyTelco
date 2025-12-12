import json
import os

# Ini adalah daftar kolom final yang diharapkan oleh model XGBoost
# Berdasarkan engineering features + One Hot Encoding yang kita buat
feature_names_list = [
    # Fitur Numerik
    "travel_score",
    "complaint_count",
    "avg_call_duration",
    "is_refund_context",
    "cost_per_gb",
    "video_spend_est",
    "log_monthly_spend",
    "log_data_usage",
    "log_topup_freq",
    
    # Fitur One-Hot Encoding (Plan Type)
    "plan_type_Postpaid",
    "plan_type_Prepaid",
    
    # Fitur One-Hot Encoding (Device Brand)
    "device_brand_Apple",
    "device_brand_Huawei",
    "device_brand_Oppo",
    "device_brand_Samsung",
    "device_brand_Unknown",
    "device_brand_Vivo",
    "device_brand_Xiaomi"
]

# Tentukan lokasi penyimpanan (Sesuaikan dengan BASE_PATH di main.py kamu)
save_path = r"C:\Users\Pongo\MyTelco\ML_Engine\feature_names.json"

try:
    with open(save_path, 'w') as f:
        json.dump(feature_names_list, f)
    print(f"✅ SUKSES! File berhasil dibuat di: {save_path}")
    print("Sekarang restart uvicorn kamu!")
except Exception as e:
    print(f"❌ GAGAL: {e}")