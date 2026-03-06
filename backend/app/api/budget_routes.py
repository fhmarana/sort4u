from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Budget, User, BudgetHistory as BudgetHistoryModel, Category, Transaction
from app.schemas import BudgetInitialize, BudgetResponse, BudgetUpdate, BudgetHistoryResponse, BudgetNewCycle
from app.utils import get_current_active_user
from datetime import date, timedelta

router = APIRouter(prefix="/budget", tags=["Budget"])


@router.post("/initialize", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(
    budget_data: BudgetInitialize,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    existing_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id).first()
    if existing_budget:
        raise HTTPException(
            status_code=400, detail="Budget already exists for this user")

    start_date = budget_data.start_date if budget_data.start_date else date.today()
    end_date = start_date + timedelta(days=budget_data.cycle_duration)

    budget = Budget(
        user_id=current_user.id,
        budget_amount=budget_data.budget_amount,
        cycle_duration=budget_data.cycle_duration,
        cycle_number=1,
        cycle_start_date=start_date,
        cycle_end_date=end_date,
        is_active=True

    )

    # predefined Category
    expense_Categories = [
        "Food & Dining",
        "Transportation",
        "Entertainment",
        "Utilities",
        "Health & Fitness",
        "Education",
        "Shopping",
        "Travel",
        "Personal Care",
        "Other"
    ]

    income_Categories = [
        "Salary",
        "Allowance",
        "Owed Money",
        "Other"
    ]

    existing_predefined = db.query(Category).filter(Category.is_predefined == True).first()
    if not existing_predefined:
        for category_name in expense_Categories:
            category = Category(
                user_id=None,
                name=category_name,
                type="expense",
                is_predefined=True
            )
            db.add(category)

        for category_name in income_Categories:
            category = Category(
                user_id=None,
                name=category_name,
                type="income",
                is_predefined=True
            )
            db.add(category)

    # return budget
    db.add(budget)
    db.commit()
    db.refresh(budget)

    budget.days_remaining = (budget.cycle_end_date - date.today()).days
    budget.is_cycle_complete = date.today() > budget.cycle_end_date

    return budget


@router.get("/", response_model=BudgetResponse)
def get_budget(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    existing_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id).first()
    if not existing_budget:
        raise HTTPException(
            status_code=404, detail="Budget not found for this user")

    existing_budget.days_remaining = (
        existing_budget.cycle_end_date - date.today()).days
    existing_budget.is_cycle_complete = date.today() > existing_budget.cycle_end_date

    return existing_budget


@router.put("/", response_model=BudgetResponse)
def update_budget(
    budget_data: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    existing_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id).first()
    if not existing_budget:
        raise HTTPException(
            status_code=404, detail="Budget not found for this user")

    if budget_data.budget_amount is not None:
        existing_budget.budget_amount = budget_data.budget_amount
    if budget_data.cycle_duration is not None:
        existing_budget.cycle_duration = budget_data.cycle_duration
        existing_budget.cycle_end_date = existing_budget.cycle_start_date + \
            timedelta(days=budget_data.cycle_duration)

    db.commit()
    db.refresh(existing_budget)

    existing_budget.days_remaining = (
        existing_budget.cycle_end_date - date.today()).days
    existing_budget.is_cycle_complete = date.today() > existing_budget.cycle_end_date

    return existing_budget

@router.get("/history", response_model=list[BudgetHistoryResponse])
def get_budget_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    history = db.query(BudgetHistoryModel).filter(BudgetHistoryModel.user_id == current_user.id).order_by(BudgetHistoryModel.cycle_number.desc()).all()
    return history

@router.post("/new-cycle", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def new_cycle(
    budget_data: BudgetNewCycle,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    
    if not budget:
        raise HTTPException(status_code=400, detail="No active budget found for the user")
    
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
    
    total_saving = budget.budget_amount + total_income - total_expense
    
    history_entry = BudgetHistoryModel(
        user_id = current_user.id,
        cycle_number = budget.cycle_number,
        start_date = budget.cycle_start_date,
        end_date = budget.cycle_end_date,
        cycle_duration = budget.cycle_duration,
        budget_amount = budget.budget_amount,
        total_income = total_income,
        total_expense = total_expense,
        total_savings = total_saving
    )
    db.add(history_entry)

    budget.cycle_number += 1
    
    new_start_date = budget.cycle_end_date + timedelta(days=1)
    
    new_duration = budget_data.cycle_duration if budget_data.cycle_duration else budget.cycle_duration
    new_end_date = new_start_date + timedelta(days=new_duration)
    
    #Update budget fields
    budget.cycle_start_date = new_start_date
    budget.cycle_end_date = new_end_date
    budget.cycle_duration = new_duration
    
    #update budget amount if provided
    if budget_data.budget_amount is not None:
        budget.budget_amount = budget_data.budget_amount
        
    
    db.commit()
    db.refresh(budget)
    
    budget.days_remaining = (budget.cycle_end_date - date.today()).days
    budget.is_cycle_complete = False
    
    return budget
    
    
        
    
    
    
    
