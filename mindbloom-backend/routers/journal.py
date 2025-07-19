from fastapi import APIRouter, HTTPException, Depends, Request, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Optional
from datetime import datetime
import os

from models.journal import Journal, JournalCreate, JournalUpdate, JournalResponse
from models.user import User, UserRole
from routers.auth import get_current_user, get_db
from services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/", response_model=JournalResponse)
async def create_journal_entry(
    journal_data: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new journal entry"""
    journal_dict = journal_data.dict()
    journal_dict["user_id"] = current_user.auth0_id
    journal_dict["created_at"] = datetime.utcnow()
    journal_dict["updated_at"] = datetime.utcnow()
    
    # Generate AI insights
    try:
        ai_insights = await ai_service.analyze_journal_entry(
            journal_dict["content"],
            journal_dict["mood"]
        )
        journal_dict["ai_insights"] = ai_insights
    except Exception as e:
        # Continue without AI insights if service fails
        pass
    
    result = await db.journals.insert_one(journal_dict)
    journal_dict["_id"] = str(result.inserted_id)
    
    return JournalResponse(**journal_dict)

@router.get("/", response_model=List[JournalResponse])
async def get_journal_entries(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    pinned_only: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get journal entries for current user"""
    query = {"user_id": current_user.auth0_id}
    
    if pinned_only:
        query["is_pinned"] = True
    
    journals = []
    cursor = db.journals.find(query).skip(skip).limit(limit).sort("created_at", -1)
    
    async for journal in cursor:
        journal["_id"] = str(journal["_id"])
        journals.append(JournalResponse(**journal))
    
    return journals

@router.get("/{journal_id}", response_model=JournalResponse)
async def get_journal_entry(
    journal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a specific journal entry"""
    journal = await db.journals.find_one({"_id": journal_id, "user_id": current_user.auth0_id})
    
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    journal["_id"] = str(journal["_id"])
    return JournalResponse(**journal)

@router.put("/{journal_id}", response_model=JournalResponse)
async def update_journal_entry(
    journal_id: str,
    journal_update: JournalUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a journal entry"""
    # Check if journal exists and belongs to user
    existing_journal = await db.journals.find_one({"_id": journal_id, "user_id": current_user.auth0_id})
    if not existing_journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    update_data = journal_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # If content was updated, regenerate AI insights
    if "content" in update_data:
        try:
            ai_insights = await ai_service.analyze_journal_entry(
                update_data["content"],
                update_data.get("mood", existing_journal.get("mood"))
            )
            update_data["ai_insights"] = ai_insights
        except Exception as e:
            # Continue without AI insights if service fails
            pass
    
    await db.journals.update_one(
        {"_id": journal_id},
        {"$set": update_data}
    )
    
    # Get updated journal
    updated_journal = await db.journals.find_one({"_id": journal_id})
    updated_journal["_id"] = str(updated_journal["_id"])
    
    return JournalResponse(**updated_journal)

@router.delete("/{journal_id}")
async def delete_journal_entry(
    journal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a journal entry"""
    result = await db.journals.delete_one({"_id": journal_id, "user_id": current_user.auth0_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    return {"message": "Journal entry deleted successfully"}

@router.post("/{journal_id}/pin")
async def pin_journal_entry(
    journal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Pin or unpin a journal entry"""
    journal = await db.journals.find_one({"_id": journal_id, "user_id": current_user.auth0_id})
    
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    new_pinned_status = not journal.get("is_pinned", False)
    
    await db.journals.update_one(
        {"_id": journal_id},
        {"$set": {"is_pinned": new_pinned_status, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": f"Journal entry {'pinned' if new_pinned_status else 'unpinned'} successfully"}

@router.get("/caregiver/{patient_id}", response_model=List[JournalResponse])
async def get_patient_journals(
    patient_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get journal entries for a patient (caregiver access)"""
    if current_user.role != UserRole.CAREGIVER:
        raise HTTPException(status_code=403, detail="Caregiver access required")
    
    # Verify caregiver has access to this patient
    if patient_id not in current_user.patients:
        raise HTTPException(status_code=403, detail="Access to patient denied")
    
    journals = []
    cursor = db.journals.find({"user_id": patient_id}).skip(skip).limit(limit).sort("created_at", -1)
    
    async for journal in cursor:
        journal["_id"] = str(journal["_id"])
        journals.append(JournalResponse(**journal))
    
    return journals 