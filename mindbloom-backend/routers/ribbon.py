from fastapi import APIRouter, HTTPException, Depends, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List, Dict, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from models.user import User
from routers.auth import get_current_user, get_db
from services.ribbon_service import RibbonService



router = APIRouter()
ribbon_service = RibbonService()

class InterviewFlowRequest(BaseModel):
    flow_name: str
    questions: Optional[List[str]] = None
    patient_id: str

class InterviewRequest(BaseModel):
    flow_id: str
    patient_name: str

class InterviewResultsRequest(BaseModel):
    interview_id: str
    patient_id: str

@router.post("/flows")
async def create_interview_flow(
    request: InterviewFlowRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new interview flow for memory collection"""
    try:
        flow_data = await ribbon_service.create_interview_flow(
            request.flow_name,
            request.questions,
            request.patient_id
        )
        
        # Store flow metadata in our database
        flow_metadata = {
            "flow_id": flow_data.get("id"),
            "name": flow_data.get("name"),
            "patient_id": request.patient_id,
            "created_by": current_user.auth0_id,
            "created_at": datetime.utcnow(),
            "type": "memory_interview"
        }
        
        await db.interview_flows.insert_one(flow_metadata)
        
        return {
            "message": "Interview flow created successfully",
            "flow": flow_data,
            "patient_id": request.patient_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create interview flow: {str(e)}")

@router.post("/interviews")
async def create_interview(
    request: InterviewRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new interview session"""
    try:
        interview_data = await ribbon_service.create_interview(
            request.flow_id,
            request.patient_name
        )
        
        # Store interview metadata
        interview_metadata = {
            "interview_id": interview_data.get("id"),
            "flow_id": request.flow_id,
            "patient_name": request.patient_name,
            "created_by": current_user.auth0_id,
            "created_at": datetime.utcnow(),
            "status": "created"
        }
        
        await db.interviews.insert_one(interview_metadata)
        
        return {
            "message": "Interview created successfully",
            "interview": interview_data,
            "interview_url": interview_data.get("url")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create interview: {str(e)}")

@router.get("/interviews/{interview_id}/status")
async def get_interview_status(
    interview_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get the status of an interview"""
    try:
        status_data = await ribbon_service.get_interview_status(interview_id)
        
        # Update status in our database
        await db.interviews.update_one(
            {"interview_id": interview_id},
            {"$set": {"status": status_data.get("status"), "updated_at": datetime.utcnow()}}
        )
        
        return {
            "interview_id": interview_id,
            "status": status_data.get("status"),
            "details": status_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get interview status: {str(e)}")

@router.post("/interviews/{interview_id}/results")
async def get_interview_results(
    interview_id: str,
    request: InterviewResultsRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get interview results and convert to memory entry"""
    try:
        # Get results from Ribbon
        results_data = await ribbon_service.get_interview_results(interview_id)
        
        # Convert to memory entry
        memory_entry = await ribbon_service.process_interview_to_memory(
            results_data,
            request.patient_id
        )
        
        # Store memory entry in our database
        memory_entry["user_id"] = current_user.auth0_id
        memory_entry["created_at"] = datetime.utcnow()
        
        result = await db.memories.insert_one(memory_entry)
        memory_entry["_id"] = str(result.inserted_id)
        
        # Update interview status
        await db.interviews.update_one(
            {"interview_id": interview_id},
            {"$set": {
                "status": "completed",
                "memory_id": str(result.inserted_id),
                "completed_at": datetime.utcnow()
            }}
        )
        
        return {
            "message": "Interview completed and memory created",
            "memory": memory_entry,
            "interview_results": results_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process interview results: {str(e)}")

@router.post("/memory-interview/{patient_id}")
async def create_memory_interview(patient_id: str):
    """Create a specialized memory interview for dementia patients"""
    try:
        # Get patient name (mock for demo)
        patient_name = f"Patient {patient_id}"
        
        # Create mock flow and interview data
        flow_data = {
            "id": f"flow-memory-{patient_id}",
            "name": f"Memory Interview - {patient_name}",
            "type": "general",
            "questions": [
                "Hello! I'm here to help you share some special memories. Can you tell me about a happy time from your childhood?",
                "That sounds wonderful! Do you remember any special family traditions that you loved?",
                "I'd love to hear about a place that made you feel peaceful and happy. Can you describe it?",
                "Tell me about someone who was very kind and caring in your life.",
                "What's a story or memory that always makes you smile when you think about it?"
            ],
            "created_at": datetime.utcnow().isoformat()
        }
        
        interview_data = {
            "id": f"interview-{patient_id}",
            "flow_id": flow_data["id"],
            "status": "created",
            "interview_url": f"https://ribbon.ai/interview/mock-{patient_id}",
            "created_at": datetime.utcnow().isoformat()
        }
        
        print(f"🎭 Created mock interview for patient {patient_id}")
        
        return {
            "message": "Memory interview created successfully",
            "flow": flow_data,
            "interview": interview_data,
            "interview_url": interview_data.get("interview_url"),
            "patient_name": patient_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create memory interview: {str(e)}")

@router.get("/interviews")
async def get_user_interviews(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all interviews created by the current user"""
    try:
        interviews = await db.interviews.find(
            {"created_by": current_user.auth0_id}
        ).sort("created_at", -1).to_list(length=50)
        
        return {
            "interviews": interviews,
            "total": len(interviews)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get interviews: {str(e)}")

@router.get("/flows")
async def get_user_flows(
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all interview flows created by the current user"""
    try:
        flows = await db.interview_flows.find(
            {"created_by": current_user.auth0_id}
        ).sort("created_at", -1).to_list(length=50)
        
        return {
            "flows": flows,
            "total": len(flows)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get flows: {str(e)}") 