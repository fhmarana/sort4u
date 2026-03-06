from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Budget, Transaction, Category, User, BudgetHistory
from app.utils import get_current_active_user
from datetime import date, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])
@router.get("/summary")
async def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id, Budget.is_active == True).first()
    
    if not budget:
        raise HTTPException(status_code=400, detail="No active budget found for the user")
    
    total_income = db.query(func.sum(Transaction.amount)).filter(
                    Transaction.user_id == current_user.id, 
                    Transaction.type == "income",
                    Transaction.cycle_number == budget.cycle_number).scalar() or 0
    
    total_expense = db.query(func.sum(Transaction.amount)).filter(
                    Transaction.user_id == current_user.id,
                    Transaction.type == "expense",
                    Transaction.cycle_number == budget.cycle_number).scalar() or 0


    total_savings = budget.budget_amount + total_income - total_expense
    
    days_remaining = (budget.cycle_end_date - date.today()).days
    
    return {
        "budget_amount": budget.budget_amount,
        "total_income": total_income,
        "total_expense": total_expense,
        "total_savings": total_savings,
        "days_remaining": days_remaining,
        "cycle_start_date": budget.cycle_start_date,
        "cycle_end_date": budget.cycle_end_date,
        "cycle_number": budget.cycle_number
    }
    
    
@router.get("/categories")
async def get_category_breakdown(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    
    if not budget:
        raise HTTPException(status_code=400, detail="No active budget found for the user")
    
    total_expense = db.query(func.sum(Transaction.amount)).filter(
                    Transaction.user_id == current_user.id,
                    Transaction.type == "expense",
                    Transaction.cycle_number == budget.cycle_number).scalar() or 0
    
    category_data = db.query(
        Transaction.category_id, 
        func.sum(Transaction.amount).label("total_amount"),
        func.count(Transaction.id).label("transaction_count")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.cycle_number == budget.cycle_number
    ).group_by(Transaction.category_id).all()
    
    
    categories = []
    for category_id, amount, count in category_data:
    
        category = db.query(Category).filter(Category.id == category_id).first()
        
        percentage = (amount/total_expense) * 100 if total_expense > 0 else 0
        
        categories.append({
            "category_id": category_id,
            "category_name": category.name if category else "Unknown",
            "total_amount": amount,
            "transaction_count": count,
            "percentage": round(percentage, 1)
        })

    return {
        "categories": categories,
        "total_expense": total_expense
    }
    
    
@router.get("/spending-trends")
async def get_spending_trends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):   
    
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    
    if not budget:
        raise HTTPException(status_code=400, detail="No active budget found for the user")
    
    daily_data = db.query(
        Transaction.transaction_date,
        func.sum(Transaction.amount).label("daily_amount")
    ).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.cycle_number == budget.cycle_number
    ).group_by(Transaction.transaction_date).all()
    
    #create dict {date: amount}
    spending_by_date = {str(date): amount for date, amount in daily_data}

    trends = []
    
    current_date = budget.cycle_start_date
    
    while current_date <= budget.cycle_end_date:
        date_str = str(current_date)
        amount = spending_by_date.get(date_str, 0) 
        
        trends.append({
            "date": date_str,
            "amount": amount
        })
        
        current_date += timedelta(days=1)
        
    total_expense = sum(item["amount"] for item in trends)
    
    return {
        "trends": trends,
        "total_expense": total_expense,
        "start_date": str(budget.cycle_start_date),
        "end_date": str(budget.cycle_end_date)
    }