from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileBase

router = APIRouter()

# GET: Fetch profile for a specific user
@router.get("/{user_id}", response_model=ProfileBase)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        # Return empty defaults if no profile exists yet
        return {"name": "", "age": 0, "about": "", "image": None}
    return profile

# POST: Update or Create profile
@router.post("/{user_id}")
def update_profile(user_id: int, data: ProfileBase, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    
    if profile:
        # Update existing
        profile.name = data.name
        profile.age = data.age
        profile.about = data.about
        profile.image = data.image
    else:
        # Create new
        profile = Profile(user_id=user_id, **data.dict())
        db.add(profile)
    
    db.commit()
    return {"message": "Profile updated successfully"}