from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import Category, User
from app.schemas import CategoryCreate, CategoryResponse
from app.utils import get_current_active_user

router = APIRouter(prefix="/categories", tags=["Categories"])
@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    
    new_category = Category(
        user_id = current_user.id,
        name = category_data.name, 
        type = category_data.type,
        is_predefined = False
    )
    
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=list[CategoryResponse])
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    categories = db.query(Category).filter(
        or_(
            Category.user_id == None,
            Category.user_id == current_user.id
        )
    ).all()
    
    return categories

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id,
        Category.is_predefined == False
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category.is_predefined:
        raise HTTPException(status_code=403, detail="Cannot delete predefined categories")

    
    db.delete(category)
    db.commit()
    return None