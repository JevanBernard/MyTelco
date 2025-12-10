import random

# KONFIGURASI BOBOT AKTIVITAS
PROFILE_CONFIG = {
    'STREAMING': {'video_range': (0.75, 0.98), 'call_range': (1.0, 5.0), 'data_multiplier': 1.3},
    'GAMING':    {'video_range': (0.10, 0.30), 'call_range': (0.5, 3.5), 'data_multiplier': 1.2},
    'SOSMED':    {'video_range': (0.40, 0.70), 'call_range': (4.0, 9.0), 'data_multiplier': 1.0},
    'BROWSING':  {'video_range': (0.05, 0.20), 'call_range': (8.0, 16.0), 'data_multiplier': 0.7}
}

def generate_user_profile(survey_data):
    """
    Generator Data Sintetis: Mengubah Input Survey Manusia -> Angka Statistik Dataset
    """
    
    # 1. Ambil Input
    budget_tier = survey_data.get('budget', 'LOW')
    activity = survey_data.get('activity', 'BROWSING')
    device_brand = survey_data.get('device', 'Android')
    
    config = PROFILE_CONFIG.get(activity, PROFILE_CONFIG['BROWSING'])

    # 2. Monthly Spend (Anchor)
    spend_map = {'LOW': 45000.0, 'MID': 75000.0, 'HIGH': 150000.0}
    base_spend = spend_map.get(budget_tier, 75000.0)
    monthly_spend = base_spend * random.uniform(0.95, 1.05) # Sedikit variasi

    # 3. Plan Type (The VIP Rule)
    flagship_brands = ['iPhone', 'Apple', 'Samsung', 'Google', 'Huawei']
    if (monthly_spend > 100000) or (device_brand in flagship_brands):
        plan_type = 'Postpaid'
    else:
        plan_type = 'Prepaid'

    # 4. Data Usage (Daily Average Logic)
    # Rumus: (Spend/10rb) * 0.5 * Multiplier
    base_gb = (monthly_spend / 10000.0) * 0.5 
    avg_data = base_gb * config['data_multiplier'] * random.uniform(0.9, 1.1)

    # 5. Lain-lain
    pct_video = random.uniform(*config['video_range'])
    avg_call = random.uniform(*config['call_range'])
    
    # SMS (Echo Call)
    if avg_call < 5.0: sms_freq = random.randint(0, 5)
    elif avg_call < 10.0: sms_freq = random.randint(5, 12)
    else: sms_freq = random.randint(12, 25)

    # Travel Score
    is_traveler = survey_data.get('travel') in ['SERING', 'RUTIN']
    travel_score = random.uniform(0.7, 0.9) if is_traveler else random.uniform(0.0, 0.3)

    return {
        "monthly_spend": round(monthly_spend, 2),
        "plan_type": plan_type,
        "device_brand": device_brand,
        "avg_data_usage_gb": avg_data,
        "pct_video_usage": pct_video,
        "avg_call_duration": avg_call,
        "sms_freq": sms_freq,
        "topup_freq": random.randint(2, 6),
        "travel_score": travel_score,
        "complaint_count": 0
    }