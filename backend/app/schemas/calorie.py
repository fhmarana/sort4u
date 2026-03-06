from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime


class FoodLookupRequest(BaseModel):
    food_input: str
    
class GoalUpdate(BaseModel):
    calorie_goal: float
    
class NutritionData(BaseModel):
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    
class CalorieTrackerResponse(BaseModel):
    id: int
    user_id: int
    food_name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: float
    entry_date: date
    created_at: datetime
    
    class Config:
        from_attributes = True
        
class DailySummary(BaseModel):
    date: date
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    total_fiber: float
    entries: List[CalorieTrackerResponse]
    
class GoalResponse(BaseModel):
    calorie_goal: Optional[float]
    
class RateLimitResponse(BaseModel):
    used:int
    remaining: int
    limit: int
    