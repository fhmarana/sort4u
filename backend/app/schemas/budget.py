from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime



class BudgetInitialize(BaseModel):
    budget_amount: float
    cycle_duration: Optional[int] = 30
    start_date: Optional[date] = None
    
class BudgetUpdate(BaseModel):
    budget_amount: Optional[float] = None
    cycle_duration: Optional[int] = None
    
class BudgetResponse(BaseModel):
    id: int
    user_id: int
    budget_amount:float
    cycle_duration: int
    cycle_number: int
    cycle_start_date: date
    cycle_end_date: date
    is_active: bool
    created_at: datetime
    updated_at: datetime
    days_remaining: Optional[int] = None
    is_cycle_complete: Optional[bool] = None
    
    class Config:
        from_attributes = True

class BudgetNewCycle(BaseModel):
    budget_amount: Optional[float] = None
    cycle_duration: Optional[int] = None

class BudgetHistoryResponse(BaseModel):
    id: int
    user_id: int
    cycle_number: int
    start_date: date
    end_date: date
    cycle_duration: int
    budget_amount: float
    total_income: float
    total_expense: float
    total_savings: float
    created_at: datetime

    class Config:
        from_attributes = True