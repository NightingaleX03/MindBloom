from fastapi import APIRouter, HTTPException, Depends, Request, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime, date
import os

from models.calendar import Calendar, CalendarCreate, CalendarUpdate, CalendarResponse, EventStatus
from models.user import User, UserRole
from routers.auth import get_current_user, get_db

router = APIRouter()

@router.post("/", response_model=CalendarResponse)
async def create_calendar_event(
    event_data: CalendarCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new calendar event"""
    event_dict = event_data.dict()
    event_dict["user_id"] = current_user.auth0_id
    event_dict["created_at"] = datetime.utcnow()
    event_dict["updated_at"] = datetime.utcnow()
    
    result = await db.calendar.insert_one(event_dict)
    event_dict["_id"] = str(result.inserted_id)
    
    return CalendarResponse(**event_dict)

@router.get("/", response_model=List[CalendarResponse])
async def get_calendar_events(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    event_type: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get calendar events for current user"""
    query = {"user_id": current_user.auth0_id}
    
    if start_date and end_date:
        query["date"] = {"$gte": start_date, "$lte": end_date}
    elif start_date:
        query["date"] = {"$gte": start_date}
    elif end_date:
        query["date"] = {"$lte": end_date}
    
    if event_type:
        query["event_type"] = event_type
    
    events = []
    cursor = db.calendar.find(query).sort("date", 1).sort("start_time", 1)
    
    async for event in cursor:
        event["_id"] = str(event["_id"])
        events.append(CalendarResponse(**event))
    
    return events

@router.get("/{event_id}", response_model=CalendarResponse)
async def get_calendar_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a specific calendar event"""
    event = await db.calendar.find_one({"_id": event_id, "user_id": current_user.auth0_id})
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event["_id"] = str(event["_id"])
    return CalendarResponse(**event)

@router.put("/{event_id}", response_model=CalendarResponse)
async def update_calendar_event(
    event_id: str,
    event_update: CalendarUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a calendar event"""
    existing_event = await db.calendar.find_one({"_id": event_id, "user_id": current_user.auth0_id})
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    await db.calendar.update_one(
        {"_id": event_id},
        {"$set": update_data}
    )
    
    updated_event = await db.calendar.find_one({"_id": event_id})
    updated_event["_id"] = str(updated_event["_id"])
    
    return CalendarResponse(**updated_event)

@router.delete("/{event_id}")
async def delete_calendar_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a calendar event"""
    result = await db.calendar.delete_one({"_id": event_id, "user_id": current_user.auth0_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Event deleted successfully"}

@router.post("/{event_id}/complete")
async def complete_event(
    event_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Mark an event as completed"""
    event = await db.calendar.find_one({"_id": event_id, "user_id": current_user.auth0_id})
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    new_status = EventStatus.COMPLETED if event.get("status") != EventStatus.COMPLETED else EventStatus.PENDING
    
    await db.calendar.update_one(
        {"_id": event_id},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": f"Event marked as {new_status}"}

@router.get("/overdue", response_model=List[CalendarResponse])
async def get_overdue_events(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get overdue events for current user"""
    now = datetime.now()
    current_time = now.strftime("%H:%M")
    today = now.date()
    
    # Find events that are overdue
    overdue_events = []
    cursor = db.calendar.find({
        "user_id": current_user.auth0_id,
        "status": {"$ne": EventStatus.COMPLETED},
        "$or": [
            {"date": {"$lt": today}},
            {
                "date": today,
                "start_time": {"$lt": current_time}
            }
        ]
    })
    
    async for event in cursor:
        event["_id"] = str(event["_id"])
        overdue_events.append(CalendarResponse(**event))
    
    return overdue_events

@router.get("/caregiver/{patient_id}", response_model=List[CalendarResponse])
async def get_patient_events(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get calendar events for a patient (caregiver access)"""
    if current_user.role != UserRole.CAREGIVER:
        raise HTTPException(status_code=403, detail="Caregiver access required")
    
    # Verify caregiver has access to this patient
    if patient_id not in current_user.patients:
        raise HTTPException(status_code=403, detail="Access to patient denied")
    
    events = []
    cursor = db.calendar.find({"user_id": patient_id}).sort("date", 1).sort("start_time", 1)
    
    async for event in cursor:
        event["_id"] = str(event["_id"])
        events.append(CalendarResponse(**event))
    
    return events

@router.post("/caregiver/{patient_id}/notes")
async def add_caregiver_notes(
    patient_id: str,
    event_id: str,
    notes: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Add caregiver notes to a patient's event"""
    if current_user.role != UserRole.CAREGIVER:
        raise HTTPException(status_code=403, detail="Caregiver access required")
    
    # Verify caregiver has access to this patient
    if patient_id not in current_user.patients:
        raise HTTPException(status_code=403, detail="Access to patient denied")
    
    # Update the event with caregiver notes
    result = await db.calendar.update_one(
        {"_id": event_id, "user_id": patient_id},
        {"$set": {"caregiver_notes": notes, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return {"message": "Caregiver notes added successfully"} 