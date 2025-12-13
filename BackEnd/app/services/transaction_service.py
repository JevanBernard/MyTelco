from sqlalchemy.orm import Session
from .. import models, schemas
from datetime import datetime

def process_purchase(db: Session, data: schemas.PurchaseInput):
    # 1. Ambil Data Produk
    product = db.query(models.Product).filter(models.Product.product_id == data.product_id).first()
    if not product:
        raise ValueError("Produk tidak ditemukan")

    # 2. Catat Transaksi
    new_trx = models.Transaction(
        user_id=str(data.user_id),
        product_id=data.product_id,
        amount=product.price,
        status="SUCCESS",
        purchase_date=datetime.now()
    )
    db.add(new_trx)

    # 3. Update Profil
    profile = db.query(models.CustomerProfile).filter(models.CustomerProfile.user_id == str(data.user_id)).first()

    if profile:
        # LOGIKA RESET BULANAN & DUAL-SOURCE
        
        last_update = profile.last_updated or datetime.now()
        current_time = datetime.now()
        
        # Cek apakah sudah ganti bulan?
        is_new_month = (last_update.month != current_time.month) or (last_update.year != current_time.year)
        
        # Cek apakah ini transaksi pertama SEUMUR HIDUP user?
        is_first_purchase_ever = (profile.topup_freq == 0)

        # A. Monthly Spend Logic (Sama seperti sebelumnya)
        if is_new_month:
            profile.monthly_spend = float(product.price)
        elif is_first_purchase_ever:
            profile.monthly_spend = float(product.price) # Override nilai survey
        else:
            current_spend = float(profile.monthly_spend or 0)
            profile.monthly_spend = current_spend + float(product.price)

        # B. Avg Data Usage Logic (REVISI SESUAI REQUEST)
        # Hitung Data Capacity bulanan dari produk ini
        # Rumus: (Kuota / Validity Hari) * 30 Hari
        quota_bought = float(product.data_quota_internet or 0)
        validity_days = float(product.validity or 30)
        
        if validity_days < 1: validity_days = 30 # Safety check division by zero
        
        # Proyeksi penggunaan sebulan dari paket ini
        monthly_projection_gb = (quota_bought / validity_days) * 30
        
        daily_capacity_gb = quota_bought / validity_days
        
        # Logika Update
        if quota_bought > 0:
            if is_new_month or is_first_purchase_ever:
                # Reset ke kapasitas harian paket terbaru
                profile.avg_data_usage_gb = round(daily_capacity_gb, 2)
            else:
                # Akumulasi Kapasitas Harian (Stacked Packages)
                # Jika user punya 2 paket aktif bersamaan, bandwidth hariannya bertambah
                current_avg = float(profile.avg_data_usage_gb or 0)
                profile.avg_data_usage_gb = round(current_avg + daily_capacity_gb, 2)
        else:
            pass

        # C. Topup Freq (Increment)
        if is_new_month:
             # profile.topup_freq = 1 # Uncomment jika mau reset bulanan
             profile.topup_freq = (profile.topup_freq or 0) + 1
        else:
             profile.topup_freq = (profile.topup_freq or 0) + 1

        profile.last_updated = current_time
        
    else:
        # Fallback (Jarang terjadi)
        new_profile = models.CustomerProfile(
            user_id=str(data.user_id),
            monthly_spend=product.price,
            topup_freq=1,
            avg_data_usage_gb=float(product.data_quota_internet or 0),
            plan_type="Prepaid",
            travel_score=0.1,
            complaint_count=0
        )
        db.add(new_profile)

    db.commit()
    db.refresh(new_trx)
    
    if profile:
        db.refresh(profile)
        return {
            "spend": profile.monthly_spend,
            "freq": profile.topup_freq,
            "data_usage": profile.avg_data_usage_gb
        }
    return {"spend": product.price, "freq": 1}