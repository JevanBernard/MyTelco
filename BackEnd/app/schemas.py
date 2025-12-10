from pydantic import BaseModel
from typing import Optional, Dict, Any

# 1. Schema Input Survey (Dari Frontend)
class SurveyInput(BaseModel):
    name: str
    device: str
    budget: str   # LOW, MID, HIGH
    activity: str # GAMING, STREAMING, SOSMED, BROWSING
    travel: str   # TIDAK_PERNAH, SERING, dll

# 2. Schema Output Produk (Ke Frontend)
class ProductBase(BaseModel):
    product_id: int
    category: str
    name: str
    price: float
    data_quota: Optional[str] = None
    validity: Optional[str] = None
    description: Optional[str] = None
    ai_tags: Dict[str, Any]
    
    class Config:
        from_attributes = True