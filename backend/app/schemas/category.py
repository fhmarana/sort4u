from pydantic import BaseModel
from typing import Optional, Literal
from datetime import date, datetime



class CategoryCreate(BaseModel):
    name: str
    type: Literal['income', 'expense']
    
class CategoryResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    type: str
    is_predefined: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
        
