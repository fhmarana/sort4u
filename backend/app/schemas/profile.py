from pydantic import BaseModel
from typing import Optional

class ProfileBase(BaseModel):
    name: str
    age: Optional[int] = None
    about: Optional[str] = None
    image: Optional[str] = None

class ProfileCreate(ProfileBase):
    user_id: int

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True