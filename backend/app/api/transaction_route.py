from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import Transaction, Category, Budget, User
from app.utils import get_current_active_user
from app.schemas import TransactionCreate, TransactionUpdate, TransactionResponse
from datetime import date
from typing import Optional


router = APIRouter(prefix="/transactions", tags=["Transactions"])
@router.post("/", response_model = TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
    ):
    
    budget = db.query(Budget).filter(Budget.user_id == current_user.id, Budget.is_active == True).first()
    if not budget:
        raise HTTPException(status_code=400, detail="No active budget found for the user")
    
    category = db.query(Category).filter(
        Category.id == transaction_data.category_id,
        or_(
            Category.user_id == None,
            Category.user_id == current_user.id
        )
    ).first()
    if not category:
        raise HTTPException(status_code=400, detail="Category not found for the user")
    
    
    new_transaction = Transaction(
        user_id = current_user.id,
        amount = transaction_data.amount,
        description = transaction_data.description,
        type = transaction_data.type,
        category_id = transaction_data.category_id,
        transaction_date = transaction_data.transaction_date if transaction_data.transaction_date else date.today(),
        cycle_number = budget.cycle_number
    )
    
    
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    cycle_number: Optional[int] = None,
    type: Optional[str] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    )

    if cycle_number is not None:
        query = query.filter(Transaction.cycle_number == cycle_number)

    if type is not None:
        query = query.filter(Transaction.type == type)

    if category_id is not None:
        query = query.filter(Transaction.category_id == category_id)

    transactions = query.order_by(Transaction.transaction_date.desc()).all()
    return transactions


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_data: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Step 1 & 2: Find transaction and check if it exists
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Step 3: Check ownership (security)
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this transaction")

    # Step 4: If category_id is being changed, validate it
    if transaction_data.category_id is not None:
        category = db.query(Category).filter(
            Category.id == transaction_data.category_id,
            or_(
                Category.user_id == None,
                Category.user_id == current_user.id
            )
        ).first()
        if not category:
            raise HTTPException(status_code=400, detail="Category not found for the user")

    # Step 5: Update only fields that were provided
    if transaction_data.description is not None:
        transaction.description = transaction_data.description
    if transaction_data.amount is not None:
        transaction.amount = transaction_data.amount
    if transaction_data.type is not None:
        transaction.type = transaction_data.type
    if transaction_data.category_id is not None:
        transaction.category_id = transaction_data.category_id
    if transaction_data.transaction_date is not None:
        transaction.transaction_date = transaction_data.transaction_date

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Step 1 & 2: Find transaction and check if it exists
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Step 3: Check ownership (security)
    if transaction.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this transaction")

    # Step 4 & 5: Delete and return 204
    db.delete(transaction)
    db.commit()
    return None
