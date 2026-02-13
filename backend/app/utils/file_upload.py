import os
import uuid
from datetime import datetime
from fastapi import UploadFile, HTTPException


UPLOAD_DIRECTORY = "app/uploads"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "gif", "png"}
MAX_FILE_SIZE = 10 * 1024 * 1024 #10 MB

def upload_directory_verify():
    if not os.path.exists(UPLOAD_DIRECTORY):
        os.makedirs(UPLOAD_DIRECTORY)
        
        
async def validate_file(file: UploadFile) -> None:
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    file_extension = file.filename.split(".")[-1].lower()
    
    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code = 400, 
                            detail=f"file is not supported. Allowed types {', '.join(ALLOWED_EXTENSIONS)}"
                           )
        
    file_content = await file.read()
    file_size = len(file_content)
    
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code = 400,
                            detail=f"File to large. Maximum sized is {MAX_FILE_SIZE / (1024 * 1024): .0f}MB"
                            )
    
    await file.seek(0)
    
    
async def save_upload_file(file: UploadFile) -> str:
    
    upload_directory_verify()
    await validate_file(file)
    
    # Generate Unique Filename
    original_filename = file.filename
    file_extension = original_filename.split(".")[-1]
    base_name = original_filename.rsplit(".", 1)[0]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    unique_filename = f"{timestamp}_{unique_id}_{base_name}.{file_extension}"
    
    # create file path
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
    
    
    with open(file_path, "wb") as buffer:
        file_content = await file.read()
        buffer.write(file_content)
        
    return f"/{UPLOAD_DIRECTORY}/{unique_filename}"
    
    