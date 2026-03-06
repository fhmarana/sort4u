from pydantic import BaseModel
from datetime import datetime
from typing import Optional



class MemoryCreate(BaseModel):
    description: str
    image_url: Optional[str] = None
    location: Optional[str] = None
    person: Optional[str] = None
    tags: Optional[str] = None

class MemoryUpdate(BaseModel):
    description: str
    image_url: Optional[str] = None
    location: Optional[str] = None
    person: Optional[str] = None
    tags: Optional[str] = None
    
class MemoryResponse(BaseModel):
    id: int
    user_id: int
    description: str 
    image_url: Optional[str] = None
    location: Optional[str] = None
    person: Optional[str] = None
    tags: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime]
    is_completed: bool
    
    class Config:
        from_attributes = True
        
class MemoryComplete(BaseModel):
    is_completed: bool