from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Dict, Optional
import json
from services.interview_analysis import interview_analysis_service

router = APIRouter(prefix="/api/interview-analysis", tags=["Interview Analysis"])

@router.post("/analyze-speech")
async def analyze_speech_patterns(
    audio_file: UploadFile = File(...),
    patient_id: str = Form(...)
):
    """
    Analyze speech patterns for dementia indicators
    """
    try:
        audio_data = await audio_file.read()
        analysis = await interview_analysis_service.analyze_speech_patterns(audio_data, patient_id)
        
        if 'error' in analysis:
            raise HTTPException(status_code=400, detail=analysis['error'])
        
        return JSONResponse(content=analysis)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze-response")
async def analyze_response_to_question(
    question: str = Form(...),
    response_text: str = Form(...),
    patient_id: str = Form(...)
):
    """
    Analyze patient's response to specific memory questions
    """
    try:
        analysis = await interview_analysis_service.analyze_response_to_question(
            question, response_text, patient_id
        )
        
        if 'error' in analysis:
            raise HTTPException(status_code=400, detail=analysis['error'])
        
        return JSONResponse(content=analysis)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/summary/{patient_id}")
async def get_interview_summary(patient_id: str):
    """
    Generate comprehensive interview summary and recommendations
    """
    try:
        summary = await interview_analysis_service.generate_interview_summary(patient_id)
        
        if 'error' in summary:
            raise HTTPException(status_code=404, detail=summary['error'])
        
        return JSONResponse(content=summary)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summary generation failed: {str(e)}")

@router.post("/real-time-feedback")
async def get_real_time_feedback(
    current_response: str = Form(...),
    question: str = Form(...)
):
    """
    Get real-time feedback during interview
    """
    try:
        feedback = await interview_analysis_service.get_real_time_feedback(current_response, question)
        
        if 'error' in feedback:
            raise HTTPException(status_code=400, detail=feedback['error'])
        
        return JSONResponse(content=feedback)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback generation failed: {str(e)}")

@router.get("/patient-context/{patient_id}")
async def get_patient_context(patient_id: str):
    """
    Get stored context for a patient
    """
    try:
        context = interview_analysis_service.get_patient_context(patient_id)
        return JSONResponse(content=context)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get patient context: {str(e)}")

@router.post("/simulate-analysis")
async def simulate_analysis(
    response_text: str = Form(...),
    question: str = Form(...),
    patient_id: str = Form(...)
):
    """
    Simulate analysis for demo purposes (when Gemini API is not available)
    """
    try:
        # Simulate analysis based on response patterns
        analysis = {
            "memory_recall_accuracy": 8.5,
            "emotional_engagement": 9.0,
            "cognitive_coherence": 8.0,
            "memory_type": "episodic",
            "dementia_indicators": {
                "word_finding_difficulty": "low",
                "memory_consistency": "high",
                "emotional_stability": "stable"
            },
            "care_recommendations": [
                "Continue memory exercises",
                "Encourage social interaction",
                "Monitor for any changes in speech patterns"
            ],
            "observations": [
                "Patient shows strong episodic memory recall",
                "Emotional engagement is high and positive",
                "Speech patterns are clear and coherent",
                "Good word-finding abilities demonstrated"
            ]
        }
        
        return JSONResponse(content={
            "question": question,
            "response": response_text,
            "analysis": analysis,
            "patient_id": patient_id,
            "timestamp": "2024-01-15T10:30:00Z"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}") 