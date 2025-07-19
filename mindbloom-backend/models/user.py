from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    CAREGIVER = "caregiver"
    ADMIN = "admin"

class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    auth0_id: str = Field(..., description="Auth0 user ID")
    email: str = Field(..., description="User email")
    name: str = Field(..., description="User's full name")
    role: UserRole = Field(UserRole.USER, description="User role")
    profile: Optional[dict] = Field(default_factory=dict, description="User profile data")
    caregiver_id: Optional[str] = Field(None, description="Caregiver's user ID if this is a patient")
    patients: Optional[List[str]] = Field(default_factory=list, description="List of patient IDs if this is a caregiver")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "auth0_id": "auth0|123456789",
                "email": "john.doe@example.com",
                "name": "John Doe",
                "role": "user",
                "profile": {
                    "age": 75,
                    "emergency_contact": "Jane Doe",
                    "medical_info": "Mild dementia"
                },
                "caregiver_id": "auth0|987654321"
            }
        }

class UserCreate(BaseModel):
    auth0_id: str
    email: str
    name: str
    role: UserRole = UserRole.USER
    profile: Optional[dict] = None
    caregiver_id: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    profile: Optional[dict] = None
    caregiver_id: Optional[str] = None
    patients: Optional[List[str]] = None

class UserResponse(BaseModel):
    id: str
    auth0_id: str
    email: str
    name: str
    role: UserRole
    profile: dict
    caregiver_id: Optional[str] = None
    patients: List[str] = []
    created_at: datetime
    updated_at: datetime 