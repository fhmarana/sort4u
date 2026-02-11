from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
from app.database import engine, Base





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

@app.get("/")
def read_root():
    return {"message": "Welcome to Flashcard Generator API!",
            "status": "running",
            "version": "1.0.0"
            }
    
@app.get("/health")
def health_check():
    return {"status": "healthy"}