from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Optional
from pydantic import BaseModel
import os

from models.user import User
from routers.auth import get_current_user, get_db
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

class ConversationRequest(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = []

class StoryRequest(BaseModel):
    input_text: str
    story_type: str = "memory"

class MemoryPromptRequest(BaseModel):
    user_context: Optional[str] = ""

@router.post("/conversation")
async def generate_conversation_response(
    request: ConversationRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a compassionate AI response to user conversation"""
    try:
        response = await ai_service.generate_conversation_response(
            request.message,
            request.conversation_history
        )
        return {"response": response, "user_id": current_user.auth0_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate response")

@router.post("/conversation/test")
async def generate_conversation_response_test(
    request: ConversationRequest
):
    """Generate a compassionate AI response to user conversation (test endpoint without auth)"""
    try:
        response = await ai_service.generate_conversation_response(
            request.message,
            request.conversation_history
        )
        return {"response": response, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate response")

@router.post("/image-analysis")
async def analyze_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Analyze an uploaded image and generate a description"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_data = await file.read()
        analysis = await ai_service.analyze_image(image_data)
        return {
            "analysis": analysis,
            "filename": file.filename,
            "user_id": current_user.auth0_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to analyze image")

@router.post("/story-generation")
async def generate_story(
    request: StoryRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a story based on user input"""
    try:
        story = await ai_service.generate_story(
            request.input_text,
            request.story_type
        )
        return {
            "story": story,
            "input": request.input_text,
            "story_type": request.story_type,
            "user_id": current_user.auth0_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate story")

@router.post("/memory-prompt")
async def generate_memory_prompt(
    request: MemoryPromptRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate a personalized memory prompt"""
    try:
        prompt = await ai_service.generate_memory_prompt(request.user_context)
        return {
            "prompt": prompt,
            "user_id": current_user.auth0_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate prompt")

@router.get("/prompts/suggested")
async def get_suggested_prompts(
    current_user: User = Depends(get_current_user)
):
    """Get a list of suggested memory prompts"""
    prompts = [
        "Tell me about your family",
        "What's your favorite childhood memory?",
        "Do you remember any special holidays?",
        "Tell me about a place you love",
        "What makes you happy?",
        "Share a story about your friends",
        "Do you remember a special meal?",
        "Tell me about a time you laughed",
        "What's your favorite season?",
        "Do you remember learning something new?"
    ]
    
    return {
        "prompts": prompts,
        "user_id": current_user.auth0_id
    }

@router.get("/prompts/suggested/test")
async def get_suggested_prompts_test():
    """Get a list of suggested memory prompts (test endpoint without auth)"""
    prompts = [
        "Tell me about your family",
        "What's your favorite childhood memory?",
        "Do you remember any special holidays?",
        "Tell me about a place you love",
        "What makes you happy?",
        "Share a story about your friends",
        "Do you remember a special meal?",
        "Tell me about a time you laughed",
        "What's your favorite season?",
        "Do you remember learning something new?"
    ]
    
    return {
        "prompts": prompts,
        "status": "success"
    } 