import random

# Konfigurasi Rules (Sesuai Opsi HTML Frontend)
ACTIVITY_RULES = {
    'Streaming Film / Video': {
        'multiplier': 1.3,
        'call_range': (1.0, 5.0),
        'video_range': (0.70, 1.0),
        'act_id': 1
    },
    'Gaming & Esports': {
        'multiplier': 1.2,
        'call_range': (0.5, 3.0),
        'video_range': (0.10, 0.30),
        'act_id': 2
    },
    'Social Media & Chat': {
        'multiplier': 1.0,
        'call_range': (4.0, 9.0),
        'video_range': (0.40, 0.70),
        'act_id': 3
    },
    'Browsing & Kerja': {
        'multiplier': 0.7,
        'call_range': (8.0, 16.0),
        'video_range': (0.05, 0.20),
        'act_id': 4
    }
}

TRAVEL_SCORES = {
    'Tidak Pernah': 0.0,
    'Jarang': 0.2,
    'Kadang': 0.5,
    'Sering': 0.8,
    'Rutin': 1.0
}

def generate_user_profile(survey_data: dict) -> dict:
    """
    Mengubah raw survey data menjadi fitur input ML.
    Logika Baru: Plan Type eksplisit dari input user, Topup Freq 0.
    """
    
    # 1. Extract Inputs (Handling key dari Frontend)
    try:
        budget = int(survey_data.get('budget', 0))
    except (ValueError, TypeError):
        budget = 0
        
    activity = survey_data.get('activity', 'Social Media & Chat')
    device = survey_data.get('device', 'Other')
    travel = survey_data.get('travel', 'Tidak Pernah')
    provider_input = survey_data.get('provider', 'Prabayar') # Default ke Prabayar
    
    # 2. Ambil Rule berdasarkan Aktivitas
    rule = ACTIVITY_RULES.get(activity, ACTIVITY_RULES['Social Media & Chat'])
    
    # 3. Hitung Avg Data Usage (GB)
    if budget > 0:
        estimated_monthly_gb = (budget / 10000.0) * rule['multiplier']
        raw_data_daily = estimated_monthly_gb / 30.0
        if raw_data_daily < 0.1: raw_data_daily = 0.1
    else:
        raw_data_gb = 0.0
        
    avg_data_usage_gb = round(raw_data_daily, 2)
    
    # 4. Generate Random Call Duration & Video Usage
    avg_call_duration = round(random.uniform(*rule['call_range']), 2)
    pct_video_usage = round(random.uniform(*rule['video_range']), 2)
    
    # 5. Tentukan Plan Type
    # Frontend mengirim string: "Prabayar" atau "Pascabayar"
    # Kita mapping ke standar database: "Prepaid" atau "Postpaid"
    if provider_input == 'Pascabayar':
        plan_type = 'Postpaid'
    else:
        plan_type = 'Prepaid'
        
    # 6. Travel Score
    travel_score = TRAVEL_SCORES.get(travel, 0.1)
    
    # 7. Return Result
    return {
        "act_id": rule['act_id'],
        "plan_type": plan_type,
        "device_brand": device,
        "monthly_spend": budget,
        "avg_data_usage_gb": avg_data_usage_gb,
        "pct_video_usage": pct_video_usage,
        "avg_call_duration": avg_call_duration,
        "topup_freq": 0,
        "travel_score": travel_score,
        "complaint_count": 0 
    }