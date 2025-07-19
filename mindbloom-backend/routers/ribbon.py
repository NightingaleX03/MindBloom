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
async def create_memory_interview(
    patient_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a specialized memory interview for dementia patients"""
    try:
        # Get patient name from database
        patient_data = await db.patients.find_one({"patient_id": patient_id})
        patient_name = patient_data.get("name", f"Patient {patient_id}") if patient_data else f"Patient {patient_id}"
        
        # Create memory interview flow
        flow_data = await ribbon_service.create_memory_interview_flow(patient_id, patient_name)
        
        # Create interview session
        interview_data = await ribbon_service.create_interview(
            flow_data.get("id"),
            patient_name
        )
        
        # Store both flow and interview metadata
        flow_metadata = {
            "flow_id": flow_data.get("id"),
            "name": flow_data.get("name"),
            "patient_id": patient_id,
            "patient_name": patient_name,
            "created_by": current_user.auth0_id,
            "created_at": datetime.utcnow(),
            "type": "memory_interview"
        }
        
        interview_metadata = {
            "interview_id": interview_data.get("id"),
            "flow_id": flow_data.get("id"),
            "patient_id": patient_id,
            "patient_name": patient_name,
            "created_by": current_user.auth0_id,
            "created_at": datetime.utcnow(),
            "status": "created"
        }
        
        await db.interview_flows.insert_one(flow_metadata)
        await db.interviews.insert_one(interview_metadata)
        
        return {
            "message": "Memory interview created successfully",
            "flow": flow_data,
            "interview": interview_data,
            "interview_url": interview_data.get("url"),
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