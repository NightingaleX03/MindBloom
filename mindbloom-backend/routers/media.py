from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import os
import aiofiles
from datetime import datetime
import uuid

from models.user import User
from routers.auth import get_current_user, get_db
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

# Media upload configuration
UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov", ".wav", ".mp3"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_file_extension(filename: str) -> str:
    """Get file extension from filename"""
    return os.path.splitext(filename)[1].lower()

def is_allowed_file(filename: str) -> bool:
    """Check if file type is allowed"""
    return get_file_extension(filename) in ALLOWED_EXTENSIONS

@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload a media file"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Check file size
    file_size = 0
    file_content = await file.read()
    file_size = len(file_content)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large")
    
    # Generate unique filename
    file_extension = get_file_extension(file.filename)
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(file_content)
    
    # Analyze image if it's an image file
    ai_analysis = None
    if file_extension in {".jpg", ".jpeg", ".png", ".gif"}:
        try:
            ai_analysis = await ai_service.analyze_image(file_content)
        except Exception as e:
            # Continue without AI analysis if it fails
            pass
    
    # Save file metadata to database
    file_metadata = {
        "user_id": current_user.auth0_id,
        "original_filename": file.filename,
        "stored_filename": unique_filename,
        "file_path": file_path,
        "file_size": file_size,
        "content_type": file.content_type,
        "ai_analysis": ai_analysis,
        "created_at": datetime.utcnow()
    }
    
    result = await db.media.insert_one(file_metadata)
    file_metadata["_id"] = str(result.inserted_id)
    
    return {
        "message": "File uploaded successfully",
        "file_id": str(result.inserted_id),
        "filename": unique_filename,
        "original_filename": file.filename,
        "file_size": file_size,
        "ai_analysis": ai_analysis
    }

@router.get("/files", response_model=List[dict])
async def get_user_files(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all media files for current user"""
    files = []
    cursor = db.media.find({"user_id": current_user.auth0_id}).sort("created_at", -1)
    
    async for file in cursor:
        file["_id"] = str(file["_id"])
        files.append(file)
    
    return files

@router.get("/files/{file_id}")
async def get_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a specific file"""
    file_data = await db.media.find_one({"_id": file_id, "user_id": current_user.auth0_id})
    
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = file_data["file_path"]
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file_path,
        filename=file_data["original_filename"],
        media_type=file_data["content_type"]
    )

@router.delete("/files/{file_id}")
async def delete_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a file"""
    file_data = await db.media.find_one({"_id": file_id, "user_id": current_user.auth0_id})
    
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete from disk
    file_path = file_data["file_path"]
    if os.path.exists(file_path):
        os.remove(file_path)
    
    # Delete from database
    await db.media.delete_one({"_id": file_id})
    
    return {"message": "File deleted successfully"}

@router.get("/files/{file_id}/analysis")
async def get_file_analysis(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get AI analysis for a file"""
    file_data = await db.media.find_one({"_id": file_id, "user_id": current_user.auth0_id})
    
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")
    
    return {
        "file_id": file_id,
        "ai_analysis": file_data.get("ai_analysis"),
        "original_filename": file_data["original_filename"]
    }

@router.post("/files/{file_id}/reanalyze")
async def reanalyze_file(
    file_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Reanalyze a file with AI"""
    file_data = await db.media.find_one({"_id": file_id, "user_id": current_user.auth0_id})
    
    if not file_data:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = file_data["file_path"]
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    # Check if it's an image file
    file_extension = get_file_extension(file_data["original_filename"])
    if file_extension not in {".jpg", ".jpeg", ".png", ".gif"}:
        raise HTTPException(status_code=400, detail="Only image files can be analyzed")
    
    try:
        # Read file and analyze
        async with aiofiles.open(file_path, 'rb') as f:
            file_content = await f.read()
        
        ai_analysis = await ai_service.analyze_image(file_content)
        
        # Update database with new analysis
        await db.media.update_one(
            {"_id": file_id},
            {"$set": {"ai_analysis": ai_analysis}}
        )
        
        return {
            "message": "File reanalyzed successfully",
            "ai_analysis": ai_analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to analyze file") 