from sqlalchemy import Column, Integer, ForeignKey, DateTime, Boolean, String
from app.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  
    is_predefined = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates = "categories")
    transactions = relationship("Transaction", back_populates="category")