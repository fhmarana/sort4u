from sqlalchemy import Column, Integer, ForeignKey, Date, DateTime, Float, String
from app.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship




class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String(50), nullable=False)
    transaction_date = Column(Date, default=func.now(), nullable=False)
    cycle_number = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")