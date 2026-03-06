from app.database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float
from datetime import datetime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False )
    hashed_password = Column(String(255), nullable=False )
    full_name = Column(String(255), nullable=False )
    created_at = Column(DateTime, default=func.now())
    is_active = Column(Boolean, default=True)
    calorie_goal = Column(Float, nullable=True)
    
    memoryLane = relationship("Memory", back_populates = "user")
    
    profile = relationship("Profile", back_populates="user", uselist=False) #One-to-One
    budget = relationship("Budget", back_populates="user", uselist=False) # One-to-One
    categories = relationship("Category", back_populates="user") # One-to-Many
    transactions = relationship("Transaction", back_populates="user") #One-to-Many
    budget_history = relationship("BudgetHistory", back_populates="user") # One-to-Many
    calorie_tracker = relationship("CalorieTracker", back_populates = "user")