from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Memory, User
from app.schemas import MemoryComplete, MemoryCreate, MemoryResponse, MemoryUpdate
from app.utils import save_upload_file, get_current_user
from sqlalchemy.sql import func
from typing import List, Optional
from datetime import datetime


router = APIRouter(prefix="/memory", tags=["Memory Lane"])

# CREATE — Post a new memory
@router.post("/", response_model=MemoryResponse, status_code=status.HTTP_201_CREATED)
async def create_memory(
    description: str = Form(...),
    location: Optional[str] = Form(None),
    person: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_url = None
    if image:
        image_url = await save_upload_file(image)

    new_memory = Memory(
        user_id=current_user.id,
        description=description,
        image_url=image_url,
        location=location,
        person=person,
        tags=tags
    )

    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    return new_memory

# READ ALL — Get all memories for the logged-in user
@router.get("/", response_model=List[MemoryResponse])
def get_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memories = db.query(Memory).filter(Memory.user_id == current_user.id).all()
    return memories

# READ ONE — Get a single memory by ID
@router.get("/{memory_id}", response_model=MemoryResponse)
def get_memory(
    memory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memory = db.query(Memory).filter(Memory.id == memory_id, Memory.user_id == current_user.id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    return memory

# UPDATE — Edit a memory
@router.put("/{memory_id}", response_model=MemoryResponse)
def update_memory(
    memory_id: int,
    memory_data: MemoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memory = db.query(Memory).filter(Memory.id == memory_id, Memory.user_id == current_user.id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    memory.description = memory_data.description
    memory.image_url = memory_data.image_url
    memory.location = memory_data.location
    memory.person = memory_data.person
    memory.tags = memory_data.tags

    db.commit()
    db.refresh(memory)
    return memory

# DELETE — Remove a memory
@router.delete("/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(
    memory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memory = db.query(Memory).filter(Memory.id == memory_id, Memory.user_id == current_user.id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    db.delete(memory)
    db.commit()

# MARK COMPLETE — Toggle completion status
@router.patch("/{memory_id}/complete", response_model=MemoryResponse)
def complete_memory(
    memory_id: int,
    data: MemoryComplete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memory = db.query(Memory).filter(Memory.id == memory_id, Memory.user_id == current_user.id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    memory.is_completed = data.is_completed
    memory.completed_at = func.now() if data.is_completed else None

    db.commit()
    db.refresh(memory)
    return memory