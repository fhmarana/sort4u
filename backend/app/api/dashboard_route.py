from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.database import get_db
from app.models import User, Budget, Transaction, Category, Memory, CalorieTracker
from app.schemas import DashboardOverview
from app.utils import get_current_active_user



router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/overview", response_model=DashboardOverview, status_code=status.HTTP_200_OK)
async def get_dashboard_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # CALORIE TRACKER PREVIEW
    today = date.today()
    calorie_entries = db.query(CalorieTracker).filter(
        CalorieTracker.user_id == current_user.id,
        CalorieTracker.entry_date == today
    ).all()

    calorie_tracker = {
        "total_calories": sum(e.calories for e in calorie_entries),
        "calorie_goal": current_user.calorie_goal,
        "food_count": len(calorie_entries),
        "total_protein": sum(e.protein for e in calorie_entries),
        "total_carbs": sum(e.carbs for e in calorie_entries),
        "total_fat": sum(e.fat for e in calorie_entries),
        "total_fiber": sum(e.fiber for e in calorie_entries),
    }

    # MEMORY LANE PREVIEW
    total_memories = db.query(func.count(Memory.id)).filter(
                    Memory.user_id == current_user.id).scalar() or 0

    recent_memories = db.query(Memory).filter(
            Memory.user_id == current_user.id).order_by(
            Memory.created_at.desc()).limit(10).all()

    memory_lane = {
        "total_memories": total_memories,
        "memories": [
            {
                "id": memory.id,
                "description": memory.description,
                "image_url": memory.image_url
            } for memory in recent_memories
        ]
    }

    # BUDGET TRACKER PREVIEW

    budget = db.query(Budget).filter(
        Budget.user_id == current_user.id
    ).first()

    budget_tracker = None

    if budget:
        # BUDGET SUMMARY

        total_income = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "income",
            Transaction.cycle_number == budget.cycle_number
        ).scalar() or 0

        total_expense = db.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.cycle_number == budget.cycle_number
        ).scalar() or 0

        total_savings = budget.budget_amount + total_income - total_expense

        days_remaining = (budget.cycle_end_date - date.today()).days

        budget_summary = {
            "budget_amount": budget.budget_amount,
            "total_income": total_income,
            "total_expense": total_expense,
            "total_savings": total_savings,
            "cycle_info": {
                "cycle_number": budget.cycle_number,
                "start_date": budget.cycle_start_date,
                "end_date": budget.cycle_end_date,
                "days_remaining": days_remaining
            }
        }

        # SPENDING TRENDS
        daily_expense = db.query(
            Transaction.transaction_date,
            func.sum(Transaction.amount).label('daily_total')
        ).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.cycle_number == budget.cycle_number
        ).group_by(Transaction.transaction_date).all()

        expense_by_date = {str(txn_date): amount for txn_date, amount in daily_expense}

        trends = []
        current_date = budget.cycle_start_date
        end_date = min(budget.cycle_end_date, date.today())

        while current_date <= end_date:
            date_str = str(current_date)
            amount = expense_by_date.get(date_str, 0)
            trends.append({
                "date": date_str,
                "amount": amount
            })
            current_date += timedelta(days=1)

        spending_trends = {
            "trends": trends
        }

        # GET 10 MOST RECENT TRANSACTIONS

        recent_transactions = db.query(Transaction).filter(
            Transaction.user_id == current_user.id
        ).order_by(Transaction.transaction_date.desc()).limit(10).all()

        recent_transactions_data = {
            "transactions": [
                {
                    "id": transac.id,
                    "description": transac.description,
                    "amount": transac.amount,
                    "type": transac.type,
                    "category": {
                        "id": transac.category.id,
                        "name": transac.category.name
                    } if transac.category else None,
                    "transaction_date": transac.transaction_date
                } for transac in recent_transactions
            ]
        }

        budget_tracker = {
            "budget_summary": budget_summary,
            "spending_trends": spending_trends,
            "recent_transactions": recent_transactions_data
        }

    # RETURN COMPLETE DASHBOARD OVERVIEW
    return {
        "calorie_tracker": calorie_tracker,
        "memory_lane": memory_lane,
        "budget_tracker": budget_tracker
    }
