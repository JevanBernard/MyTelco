import pandas as pd
import numpy as np


def create_features(df):
    df['log_monthly_spend'] = np.log1p(df['monthly_spend'])
    df['has_complaint'] = (df['complaint_count'] >= 1).astype(int)
    df['video_addict'] = (df['pct_video_usage'] > 0.7).astype(int)
    df['heavy_data_user'] = (df['avg_data_usage_gb'] > 15).astype(int)
    df['high_traveler'] = (df['travel_score'] > 0.7).astype(int)
    df['is_postpaid_proxy'] = (df['topup_freq'] == 2).astype(int)  # kurang dari 2 kali topup per bulan = postpaid
    return df

def apply_business_rules(recommendations, customer):
    c = customer
    # Rule 1: banyak komplain -> retention wajib
    if c.complaint_count >= 1:
        recommendations [0] = {'rank':int(1), 'offer':'Retention Offer', 'confidence':'99.0%'}
        # Rule2: Spend besar + postpaid -> Family Plan
    elif c.monthly_spend > 300000 and c.topup_freq == 2:
        recommendations [0] = {'rank':int(1), 'offer':'Family Plan Offer', 'confidence':'98.0%'}
    # Rule 3: User baru kurang dari 7 hari -> berikan produk unggulan
    elif c.account_age_days < 7:
        return [
            {'rank':int(1), 'offer':'Premium Package', 'coinfidence':'Unggulan'},
            {'rank':int(2), 'offer':'Internet Malam Unlimited', 'coinfidence':'Unggulan'},
            {'rank':int(3), 'offer':'YouTube Unlimited', 'coinfidence':'Unggulan'}            
            ]
    return recommendations