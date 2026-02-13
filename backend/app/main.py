from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import routes, memory_route
from app.database import engine, Base
import os





# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SORT4U", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Include API routers
app.include_router(routes.router)
app.include_router(memory_route.router)

# Serve uploaded files
os.makedirs("app/uploads", exist_ok=True)
app.mount("/app/uploads", StaticFiles(directory="app/uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to Flashcard Generator API!",
            "status": "running",
            "version": "1.0.0"
            }
    
@app.get("/health")
def health_check():
    return {"status": "healthy"}