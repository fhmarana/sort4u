from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Memory(Base):
    __tablename__ = "memory_lane"
    
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable = False)
    
    image_url  = Column(String(500), nullable=True)
    description = Column(Text, nullable = False)
    location = Column(String(255), nullable = True)
    person = Column(String(255), nullable = True)
    tags = Column(String(255), nullable = True)
    
    is_completed = Column(Boolean, default = False)
    
    created_at = Column(DateTime, default = func.now())
    completed_at = Column(DateTime, nullable = True)
    
    user = relationship("User", back_populates = "memoryLane")