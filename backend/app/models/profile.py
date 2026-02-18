from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    # We remove the old 'id' column.
    # user_id now becomes the primary_key. 
    # Since it's a primary_key, 'unique=True' is implied.
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True, index=True)
    
    name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    about = Column(Text, nullable=True)
    image = Column(Text, nullable=True) 

    user = relationship("User", back_populates="profile")