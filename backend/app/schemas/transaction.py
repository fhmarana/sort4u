from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, Literal
from .category import CategoryResponse




class TransactionCreate(BaseModel):
    description: str
    amount: float
    type: Literal['income', 'expense']
    category_id: int
    transaction_date: Optional[date] = None
    
class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    type: Optional[Literal['income', 'expense']] = None
    category_id: Optional[int] = None
    transaction_date: Optional[date] = None
    
class TransactionResponse(BaseModel):
    id: int
    user_id: int
    description: str
    amount: float
    type: str
    category_id: int
    transaction_date: date
    created_at: datetime
    cycle_number: int
    updated_at: datetime
    
    category: CategoryResponse
    
    class Config:
        from_attributes = True