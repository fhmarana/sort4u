from pydantic import BaseModel
from datetime import date
from typing import List, Optional


# Sub Schemas

# Calorie Tracker
class CalorieTrackerPreview(BaseModel):
    total_calories: float
    calorie_goal: Optional[float]
    food_count: int
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float

# Memory Lane
class MemoryItem (BaseModel):
    id: int
    description: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class MemoryLanePreview (BaseModel):
    total_memories: int
    memories: List[MemoryItem]

#Budget Tracker
class CycleInfo(BaseModel):
    cycle_number: int
    start_date: date
    end_date: date
    days_remaining: int

class BudgetSummary(BaseModel):
    budget_amount: float
    total_income: float
    total_expense: float
    total_savings: float
    cycle_info: CycleInfo

class TrendPoint(BaseModel):
    date: str
    amount: float

class SpendingTrends(BaseModel):
    trends: List[TrendPoint]

class TransactionCategory(BaseModel):
    id: int
    name: str

class RecentTransaction(BaseModel):
    id: int
    description: str
    amount: float
    type: str
    category: Optional[TransactionCategory] = None
    transaction_date: date

    class Config:
        from_attributes = True

class RecentTransactions(BaseModel):
    transactions: List[RecentTransaction]

class BudgetTrackerPreview(BaseModel):
    budget_summary: BudgetSummary
    spending_trends: SpendingTrends
    recent_transactions: RecentTransactions

# Home Dashboard
class DashboardOverview(BaseModel):
    calorie_tracker: Optional[CalorieTrackerPreview] = None
    memory_lane: Optional[MemoryLanePreview] = None
    budget_tracker: Optional[BudgetTrackerPreview] = None
