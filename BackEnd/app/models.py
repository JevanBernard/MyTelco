from sqlalchemy import Column, Integer, String, Boolean, Numeric, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import JSONB
from .database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    name = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    data_quota = Column(String)
    validity = Column(String)
    description = Column(String)
    
    # JSONB Wajib untuk Postgres
    ai_tags = Column(JSONB, nullable=False)
    
    image_url = Column(String)
    is_active = Column(Boolean, server_default='true')