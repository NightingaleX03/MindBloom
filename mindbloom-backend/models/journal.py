from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class MoodType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    EXCITED = "excited"
    CALM = "calm"
    ANXIOUS = "anxious"
    NEUTRAL = "neutral"

class Journal(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str = Field(..., description="User ID who created the entry")
    title: str = Field(..., description="Memory title")
    content: str = Field(..., description="Memory content")
    mood: MoodType = Field(MoodType.NEUTRAL, description="Mood associated with the memory")
    tags: List[str] = Field(default_factory=list, description="Tags for categorization")
    media_urls: List[str] = Field(default_factory=list, description="List of media file URLs")
    ai_insights: Optional[dict] = Field(None, description="AI-generated insights about the memory")
    location: Optional[str] = Field(None, description="Location where the memory occurred")
    people: List[str] = Field(default_factory=list, description="People mentioned in the memory")
    is_pinned: bool = Field(False, description="Whether this memory is pinned")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": "auth0|123456789",
                "title": "Family Dinner at Grandma's",
                "content": "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous apple pie filled the whole house...",
                "mood": "happy",
                "tags": ["family", "food", "grandma"],
                "media_urls": ["uploads/memory1.jpg"],
                "ai_insights": {
                    "sentiment": "positive",
                    "key_themes": ["family", "tradition", "food"],
                    "suggested_prompts": ["Tell me more about your grandma's cooking"]
                },
                "location": "Grandma's house",
                "people": ["Grandma", "Mom", "Dad"],
                "is_pinned": True
            }
        }

class JournalCreate(BaseModel):
    title: str
    content: str
    mood: MoodType = MoodType.NEUTRAL
    tags: List[str] = []
    media_urls: List[str] = []
    location: Optional[str] = None
    people: List[str] = []

class JournalUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[MoodType] = None
    tags: Optional[List[str]] = None
    media_urls: Optional[List[str]] = None
    ai_insights: Optional[dict] = None
    location: Optional[str] = None
    people: Optional[List[str]] = None
    is_pinned: Optional[bool] = None

class JournalResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    mood: MoodType
    tags: List[str]
    media_urls: List[str]
    ai_insights: Optional[dict]
    location: Optional[str]
    people: List[str]
    is_pinned: bool
    created_at: datetime
    updated_at: datetime 