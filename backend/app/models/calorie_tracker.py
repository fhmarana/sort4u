from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Float, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class CalorieTracker (Base):
    __tablename__ = "calorie_tracker"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    food_name = Column(String(255), nullable=False)
    calories = Column(Float, nullable=False)
    protein = Column(Float, nullable=False)
    carbs = Column(Float, nullable=False)
    fat = Column(Float, nullable=False)
    fiber = Column(Float, nullable=False)
    
    entry_date = Column(Date, nullable = False)
    created_at = Column(DateTime, default=func.now())
    
    user = relationship("User", back_populates="calorie_tracker")