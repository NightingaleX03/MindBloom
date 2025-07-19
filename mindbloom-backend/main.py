from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Import routers
from routers import auth, journal, ai, calendar, media

# Load environment variables
load_dotenv()

# Database connection
class Database:
    client: AsyncIOMotorClient = None

db = Database()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    db.client = AsyncIOMotorClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
    app.mongodb_client = db.client
    app.mongodb = db.client.mindbloom
    print("Connected to MongoDB")
    
    yield
    
    # Shutdown
    db.client.close()
    print("Disconnected from MongoDB")

# Create FastAPI app
app = FastAPI(
    title="MindBloom API",
    description="A compassionate memory companion API for people with dementia",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])
app.include_router(media.router, prefix="/api/media", tags=["Media"])

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "MindBloom API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "MindBloom API"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 