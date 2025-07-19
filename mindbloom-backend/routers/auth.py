from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
import jwt
import os
from datetime import datetime

from models.user import User, UserCreate, UserUpdate, UserResponse, UserRole
from services.auth_service import SimpleAuthService

router = APIRouter()
security = HTTPBearer()
auth_service = SimpleAuthService()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(lambda: None)  # Will be injected
) -> User:
    """Verify JWT token and return current user"""
    try:
        token = credentials.credentials
        
        # Verify token with simple auth service
        payload = await auth_service.verify_token(token)
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        user_data = await db.users.find_one({"auth0_id": user_id})
        if not user_data:
            # Create user if they don't exist
            user_info = await auth_service.get_user_info(token)
            user_data = {
                "auth0_id": user_id,
                "email": user_info.get("email", ""),
                "name": user_info.get("name", ""),
                "role": UserRole.USER,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.users.insert_one(user_data)
        
        return User(**user_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

async def get_db(request: Request) -> AsyncIOMotorDatabase:
    """Get database instance from request"""
    return request.app.mongodb

@router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"auth0_id": user_data.auth0_id})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    return UserResponse(**user_dict)

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get current user's profile"""
    return UserResponse(**current_user.dict())

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update current user's profile"""
    update_data = user_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"_id": current_user.id},
        {"$set": update_data}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": current_user.id})
    return UserResponse(**updated_user)

@router.get("/users", response_model=List[UserResponse])
async def get_users(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all users (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = []
    async for user in db.users.find():
        user["_id"] = str(user["_id"])
        users.append(UserResponse(**user))
    
    return users

@router.post("/caregiver/assign")
async def assign_caregiver(
    patient_id: str,
    caregiver_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Assign a caregiver to a patient"""
    if current_user.role not in [UserRole.ADMIN, UserRole.CAREGIVER]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Update patient's caregiver_id
    await db.users.update_one(
        {"auth0_id": patient_id},
        {"$set": {"caregiver_id": caregiver_id, "updated_at": datetime.utcnow()}}
    )
    
    # Add patient to caregiver's patients list
    await db.users.update_one(
        {"auth0_id": caregiver_id},
        {"$addToSet": {"patients": patient_id}, "$set": {"updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Caregiver assigned successfully"}

@router.get("/caregiver/patients", response_model=List[UserResponse])
async def get_caregiver_patients(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get patients assigned to current caregiver"""
    if current_user.role != UserRole.CAREGIVER:
        raise HTTPException(status_code=403, detail="Caregiver access required")
    
    patients = []
    for patient_id in current_user.patients:
        patient = await db.users.find_one({"auth0_id": patient_id})
        if patient:
            patient["_id"] = str(patient["_id"])
            patients.append(UserResponse(**patient))
    
    return patients 