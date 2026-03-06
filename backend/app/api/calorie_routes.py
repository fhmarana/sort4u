from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List

from app.database import get_db
from app.models import CalorieTracker, User
from app.schemas import (
    FoodLookupRequest,
    NutritionData,
    CalorieTrackerResponse,
    DailySummary,
    GoalUpdate,
    GoalResponse,
    RateLimitResponse
)
from app.utils import get_current_active_user, rate_limiter
from app.services import call_gemini_api


router = APIRouter(prefix="/calorie-tracker", tags=["Calorie Tracker"])


@router.post("/lookup", response_model=NutritionData, status_code=status.HTTP_200_OK)
async def lookup_food(
    request: FoodLookupRequest,
    current_user: User = Depends(get_current_active_user)
):
    rate_limiter.check_limit(current_user.id)
    nutrition_data = await call_gemini_api(request.food_input)
    return nutrition_data


@router.post("/add", response_model=CalorieTrackerResponse, status_code=status.HTTP_201_CREATED)
async def add_food(
    nutrition: NutritionData,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    try:
        entry = CalorieTracker(
            user_id=current_user.id,
            food_name=nutrition.food_name,
            calories=nutrition.calories,
            protein=nutrition.protein,
            carbs=nutrition.carbs,
            fat=nutrition.fat,
            fiber=nutrition.fiber,
            entry_date=date.today()
        )

        db.add(entry)
        db.commit()
        db.refresh(entry)

        return entry

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to save food entry. Please Try Again."
        )


@router.get("/today", response_model=DailySummary, status_code=status.HTTP_200_OK)
async def get_today_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):

    today = date.today()

    # Get today's entries
    entries = db.query(CalorieTracker).filter(
        CalorieTracker.user_id == current_user.id,
        CalorieTracker.entry_date == today
    ).order_by(CalorieTracker.created_at.asc()).all()

    # Calculate totals
    total_calories = sum(e.calories for e in entries)
    total_protein = sum(e.protein for e in entries)
    total_carbs = sum(e.carbs for e in entries)
    total_fat = sum(e.fat for e in entries)
    total_fiber = sum(e.fiber for e in entries)

    return {
        "date": today,
        "total_calories": total_calories,
        "total_protein": total_protein,
        "total_carbs": total_carbs,
        "total_fat": total_fat,
        "total_fiber": total_fiber,
        "entries": entries
    }
    
@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    
    entry = db.query(CalorieTracker).filter(
        CalorieTracker.id == entry_id
    ).first()
    
    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Entry not found"
        )
    
    if entry.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this entry"
        )
    
    db.delete(entry)
    db.commit()
    
    return None

@router.get("/history", response_model=List[DailySummary])
async def get_history(
    days: int = 30,  # Last 30 days by default
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get calorie history grouped by date
    
    Query Parameters:
    - days: Number of days to look back (default: 30)
    
    Returns:
    - List of daily summaries with entries and totals
    """
    start_date = date.today() - timedelta(days=days)
    
    # Get all entries in date range
    entries = db.query(CalorieTracker).filter(
        CalorieTracker.user_id == current_user.id,
        CalorieTracker.entry_date >= start_date
    ).order_by(CalorieTracker.entry_date.desc()).all()
    
    # Group by date
    from collections import defaultdict
    entries_by_date = defaultdict(list)
    
    for entry in entries:
        entries_by_date[entry.entry_date].append(entry)
    
    # Build summaries
    summaries = []
    for entry_date, day_entries in entries_by_date.items():
        summaries.append({
            "date": entry_date,
            "total_calories": sum(e.calories for e in day_entries),
            "total_protein": sum(e.protein for e in day_entries),
            "total_carbs": sum(e.carbs for e in day_entries),
            "total_fat": sum(e.fat for e in day_entries),
            "total_fiber": sum(e.fiber for e in day_entries),
            "entries": day_entries
        })
    
    return summaries

@router.get("/goal", response_model=GoalResponse)
async def get_goal(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get user's daily calorie goal
    
    Returns:
    - User's calorie goal (default: 2000 if not set)
    """
    return {
        "calorie_goal": current_user.calorie_goal
    }
    
@router.put("/goal", response_model=GoalResponse)
async def update_goal(
    goal_data: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update user's daily calorie goal
    
    Request Body:
    - calorie_goal: New daily calorie goal (e.g., 2500)
    
    Returns:
    - Updated calorie goal
    """
    current_user.calorie_goal = goal_data.calorie_goal
    db.commit()
    
    return {
        "calorie_goal": current_user.calorie_goal
    }


@router.get("/limits", response_model=RateLimitResponse)
async def get_limits(
    current_user: User = Depends(get_current_active_user)
):
    return rate_limiter.get_remaining(current_user.id)