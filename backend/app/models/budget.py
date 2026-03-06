from sqlalchemy import Column, Integer, ForeignKey, Date, DateTime, Boolean, Float
from app.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Budget(Base):
    __tablename__ = "budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    budget_amount = Column(Float, nullable=False)
    cycle_duration = Column(Integer, default=30, nullable=False)  
    cycle_number = Column(Integer, default=1, nullable=False)
    cycle_start_date = Column(Date, nullable=False)
    cycle_end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    user = relationship("User", back_populates="budget")