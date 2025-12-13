from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

# Schema untuk menerima data Survey dari Frontend
class SurveyInput(BaseModel):
    userId: UUID  # Frontend mengirim "userId"
    budget: int
    name: str
    device: str
    activity: str
    travel: str
    provider: str

# 2. Schema Output Produk (Ke Frontend)
# REVISI: Menghapus ai_tags, menyesuaikan dengan kolom DB baru
class ProductBase(BaseModel):
    product_id: int
    category: str
    name: str
    price: float
    
    # Data Tampilan & Logika
    data_quota: Optional[str] = None          # String: "25 GB"
    data_quota_internet: Optional[int] = 0    # Int: 25
    validity: Optional[int] = None            # Int: 30
    
    description: Optional[str] = None
    daily_usage_score: Optional[float] = 0.0  # Virtual Property dari Models
    
    class Config:
        from_attributes = True # Wajib untuk membaca data dari SQLAlchemy
        
# Schema untuk Response
class ProfileResponse(BaseModel):
    profile_id: int
    user_id: UUID
    plan_type: str
    monthly_spend: float
    avg_data_usage_gb: float
    
    class Config:
        from_attributes = True # Dulu orm_mode = True
        
# Schema Input untuk Pembelian
class PurchaseInput(BaseModel):
    user_id: UUID
    product_id: int
    amount: float
    method: str # pulsa, gopay, dll

# Schema Output sederhana
class TransactionResponse(BaseModel):
    status: str
    message: str
    new_balance: dict # Mengembalikan data profil terbaru (spend/freq)