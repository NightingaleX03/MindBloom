#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""

def test_imports():
    """Test all major imports"""
    try:
        # Test FastAPI imports
        from fastapi import FastAPI, HTTPException, Depends
        from fastapi.middleware.cors import CORSMiddleware
        print("✓ FastAPI imports successful")
        
        # Test database imports
        from motor.motor_asyncio import AsyncIOMotorClient
        print("✓ Motor imports successful")
        
        # Test Pydantic imports
        from pydantic import BaseModel, Field
        print("✓ Pydantic imports successful")
        
        # Test our models
        from models.user import User, UserRole
        from models.journal import Journal, MoodType
        from models.calendar import Calendar, EventType
        print("✓ Model imports successful")
        
        # Test routers
        from routers import auth, journal, ai, calendar, media
        print("✓ Router imports successful")
        
        # Test services
        from services.ai_service import AIService
        print("✓ Service imports successful")
        
        print("\n🎉 All imports successful! FastAPI backend is ready to run.")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_imports() 