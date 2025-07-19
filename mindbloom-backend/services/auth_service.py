import os
from typing import Optional, Dict
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

class SimpleAuthService:
    def __init__(self):
        # Simple auth service without external dependencies
        self.secret_key = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    async def verify_token(self, token: str) -> Dict:
        """Simple token verification (for development)"""
        # For development, accept any token that looks valid
        if token and len(token) > 10:
            return {
                "sub": "user-123",
                "email": "user@example.com",
                "name": "Test User"
            }
        raise HTTPException(status_code=401, detail="Invalid token")
    
    async def get_user_info(self, token: str) -> Dict:
        """Get user information (mock for development)"""
        return {
            "sub": "user-123",
            "email": "user@example.com",
            "name": "Test User"
        } 