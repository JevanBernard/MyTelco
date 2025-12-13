from pydantic import BaseModel
from typing import Optional, List

# 1. Schema Input Survey (Dari Frontend)
class SurveyInput(BaseModel):
    name: str
    device: str
    budget: str   # LOW, MID, HIGH
    activity: str # GAMING, STREAMING, SOSMED, BROWSING
    travel: str   # TIDAK_PERNAH, SERING, dll

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