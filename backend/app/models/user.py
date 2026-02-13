from app.database import Base
from sqlalchemy import Column, Integer, String, DateTime
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
    
    memoryLane = relationship("Memory", back_populates = "user")