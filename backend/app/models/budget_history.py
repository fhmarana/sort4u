from sqlalchemy import Column, Integer, Float, Date, DateTime, ForeignKey
from app.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class BudgetHistory(Base):
    __tablename__ = "budget_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cycle_number = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    cycle_duration = Column(Integer, nullable=False)
    budget_amount = Column(Float, nullable=False)
    total_income = Column(Float, nullable=False)
    total_expense = Column(Float, nullable=False)
    total_savings = Column(Float, nullable=False)
    created_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="budget_history")
