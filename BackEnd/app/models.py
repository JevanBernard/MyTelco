from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text, TIMESTAMP, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# 1. USERS
class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, index=True) # UUID String
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    phone_number = Column(String)
    password_hash = Column(String)
    created_at = Column(TIMESTAMP, server_default=func.now())

# 2. ACTIVITY (Kamus Behavior)
class Activity(Base):
    __tablename__ = "activity"

    act_id = Column(Integer, primary_key=True, index=True)
    nama_activity = Column(String, nullable=False)
    
    # Kolom Bobot (Sesuai SQL Baru)
    avg_data_usage_gb = Column(Float) # Multiplier
    call_min = Column(Float)
    call_max = Column(Float)
    video_min = Column(Float)
    video_max = Column(Float)

# 3. CUSTOMER PROFILES (Input ML)
class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    profile_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id", ondelete="CASCADE"))
    act_id = Column(Integer, ForeignKey("activity.act_id", ondelete="SET NULL"))
    
    # Identitas Segmentasi
    plan_type = Column(String)
    device_brand = Column(String)
    
    # Fitur Numerik
    monthly_spend = Column(Numeric(10, 2))
    avg_data_usage_gb = Column(Float)
    pct_video_usage = Column(Float)
    avg_call_duration = Column(Float)
    
    # Fitur Frekuensi
    # sms_freq SUDAH DIHAPUS
    topup_freq = Column(Integer)
    travel_score = Column(Float)
    complaint_count = Column(Integer, default=0)
    
    last_updated = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    # Relasi (Opsional untuk join mudah)
    user_data = relationship("User")
    activity_data = relationship("Activity")

# 4. PRODUCTS (Katalog)
class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    
    # Kolom Logic (Int) & UI (Str)
    data_quota_internet = Column(Integer) 
    data_quota = Column(String)
    validity = Column(Integer)
    
    description = Column(Text)
    is_active = Column(Boolean, server_default='true')
    # image_url SUDAH DIHAPUS
    # ai_tags SUDAH DIHAPUS

    # --- VIRTUAL PROPERTY (PENTING) ---
    # Python menghitung skor ini secara otomatis saat data diambil
    # Rumus: Kuota / Hari
    @property
    def daily_usage_score(self):
        if self.data_quota_internet and self.validity and self.validity > 0:
            return float(self.data_quota_internet) / float(self.validity)
        return 0.0

# 5. TRANSACTIONS
class Transaction(Base):
    __tablename__ = "transactions"

    trx_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    product_id = Column(Integer, ForeignKey("products.product_id"))
    amount = Column(Numeric(10, 2))
    purchase_date = Column(TIMESTAMP, server_default=func.now())
    status = Column(String, default='SUCCESS')

# 6. COMPLAINT
class Complaint(Base):
    __tablename__ = "complaint" # Singular sesuai DB

    comp_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    phone_number = Column(String)
    kategori_masalah = Column(String)
    judul_laporan = Column(Text)
    detail_kendala = Column(Text)
    tanggal = Column(TIMESTAMP, server_default=func.now())

# 7. RECOMMENDATIONS
class Recommendation(Base):
    __tablename__ = "recommendations"

    rec_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"))
    target_offer = Column(String)
    confidence_score = Column(Float)
    reasoning = Column(Text)
    generated_at = Column(TIMESTAMP, server_default=func.now())