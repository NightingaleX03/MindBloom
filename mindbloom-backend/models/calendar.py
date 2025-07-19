from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class EventType(str, Enum):
    MEDICATION = "medication"
    APPOINTMENT = "appointment"
    ACTIVITY = "activity"
    REMINDER = "reminder"

class PriorityType(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class EventStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    OVERDUE = "overdue"
    CANCELLED = "cancelled"

class Calendar(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str = Field(..., description="User ID who owns the event")
    title: str = Field(..., description="Event title")
    description: Optional[str] = Field(None, description="Event description")
    event_type: EventType = Field(EventType.ACTIVITY, description="Type of event")
    start_time: str = Field(..., description="Start time in HH:MM format")
    end_time: Optional[str] = Field(None, description="End time in HH:MM format")
    date: str = Field(..., description="Event date")
    priority: PriorityType = Field(PriorityType.MEDIUM, description="Event priority")
    status: EventStatus = Field(EventStatus.PENDING, description="Event status")
    caregiver_notes: Optional[str] = Field(None, description="Notes from caregiver")
    ai_suggestions: Optional[dict] = Field(None, description="AI-generated suggestions")
    recurrence: Optional[str] = Field(None, description="Recurrence pattern (daily, weekly, etc.)")
    reminders: List[str] = Field(default_factory=list, description="List of reminder times")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "user_id": "auth0|123456789",
                "title": "Morning Medication",
                "description": "Take blood pressure medication",
                "event_type": "medication",
                "start_time": "09:00",
                "end_time": "09:15",
                "date": "2024-01-15",
                "priority": "high",
                "status": "pending",
                "caregiver_notes": "Make sure to take with food",
                "ai_suggestions": {
                    "optimal_time": "09:00",
                    "reminder_frequency": "daily"
                },
                "recurrence": "daily",
                "reminders": ["08:45", "09:00"]
            }
        }

class CalendarCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: EventType = EventType.ACTIVITY
    start_time: str
    end_time: Optional[str] = None
    date: str
    priority: PriorityType = PriorityType.MEDIUM
    recurrence: Optional[str] = None
    reminders: List[str] = []

class CalendarUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[EventType] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    date: Optional[str] = None
    priority: Optional[PriorityType] = None
    status: Optional[EventStatus] = None
    caregiver_notes: Optional[str] = None
    ai_suggestions: Optional[dict] = None
    recurrence: Optional[str] = None
    reminders: Optional[List[str]] = None

class CalendarResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: Optional[str]
    event_type: EventType
    start_time: str
    end_time: Optional[str]
    date: str
    priority: PriorityType
    status: EventStatus
    caregiver_notes: Optional[str]
    ai_suggestions: Optional[dict]
    recurrence: Optional[str]
    reminders: List[str]
    created_at: datetime
    updated_at: datetime 