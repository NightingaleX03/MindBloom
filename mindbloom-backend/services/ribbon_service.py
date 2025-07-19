import os
import httpx
from typing import Dict, List, Optional
from datetime import datetime
import json

class RibbonService:
    def __init__(self):
        self.api_key = os.getenv("RIBBON_API_KEY")
        self.base_url = "https://api.ribbon.ai"
        
        if not self.api_key:
            raise ValueError("RIBBON_API_KEY environment variable is required")
    
    async def create_interview_flow(self, flow_name: str, questions: List[str], patient_id: str) -> Dict:
        """Create a new interview flow for memory collection"""
        
        # Memory-focused questions for dementia patients
        memory_questions = [
            "Can you tell me about a happy memory from your childhood?",
            "What's your favorite family tradition?",
            "Do you remember a special place that makes you feel peaceful?",
            "Tell me about someone who was very kind to you.",
            "What's a story that always makes you smile?",
            "Do you remember a time when you felt very proud?",
            "What's your favorite holiday memory?",
            "Tell me about a friend who was important to you.",
            "Do you remember a special meal or food that you loved?",
            "What's a place you visited that you'll never forget?"
        ]
        
        # Use provided questions or default memory questions
        interview_questions = questions if questions else memory_questions
        
        flow_data = {
            "name": f"{flow_name} - Memory Interview",
            "type": "general",
            "questions": interview_questions,
            "metadata": {
                "patient_id": patient_id,
                "created_at": datetime.utcnow().isoformat(),
                "purpose": "memory_collection"
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/interview-flows",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=flow_data
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                raise Exception(f"Failed to create interview flow: {response.text}")
    
    async def create_interview(self, flow_id: str, patient_name: str) -> Dict:
        """Create a new interview session from a flow"""
        
        interview_data = {
            "flow_id": flow_id,
            "metadata": {
                "patient_name": patient_name,
                "created_at": datetime.utcnow().isoformat(),
                "session_type": "memory_interview"
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/interviews",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=interview_data
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                raise Exception(f"Failed to create interview: {response.text}")
    
    async def get_interview_results(self, interview_id: str) -> Dict:
        """Get the results of a completed interview"""
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/interviews/{interview_id}/results",
                headers={
                    "Authorization": f"Bearer {self.api_key}"
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Failed to get interview results: {response.text}")
    
    async def get_interview_status(self, interview_id: str) -> Dict:
        """Get the current status of an interview"""
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/interviews/{interview_id}",
                headers={
                    "Authorization": f"Bearer {self.api_key}"
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise Exception(f"Failed to get interview status: {response.text}")
    
    async def create_memory_interview_flow(self, patient_id: str, patient_name: str) -> Dict:
        """Create a specialized memory interview flow for dementia patients"""
        
        # Compassionate, memory-focused questions
        memory_questions = [
            "Hello! I'm here to help you share some special memories. Can you tell me about a happy time from your childhood?",
            "That sounds wonderful! Do you remember any special family traditions that you loved?",
            "I'd love to hear about a place that made you feel peaceful and happy. Can you describe it?",
            "Tell me about someone who was very kind and caring in your life.",
            "What's a story or memory that always makes you smile when you think about it?",
            "Do you remember a time when you felt very proud of something you did?",
            "What's your favorite holiday memory? I'd love to hear about it.",
            "Tell me about a friend who was very important to you.",
            "Do you remember any special meals or foods that you really loved?",
            "What's a place you visited that you'll never forget? Can you tell me about it?"
        ]
        
        flow_data = {
            "name": f"Memory Interview - {patient_name}",
            "type": "general",
            "questions": memory_questions,
            "metadata": {
                "patient_id": patient_id,
                "patient_name": patient_name,
                "created_at": datetime.utcnow().isoformat(),
                "purpose": "dementia_memory_collection",
                "caregiver_notes": "Gentle memory prompts for dementia patients"
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/interview-flows",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json=flow_data
            )
            
            if response.status_code == 201:
                return response.json()
            else:
                raise Exception(f"Failed to create memory interview flow: {response.text}")
    
    async def process_interview_to_memory(self, interview_results: Dict, patient_id: str) -> Dict:
        """Convert interview results into a memory entry"""
        
        # Extract key information from interview
        responses = interview_results.get("responses", [])
        
        # Combine all responses into a memory entry
        memory_content = ""
        memory_title = ""
        
        for i, response in enumerate(responses):
            question = response.get("question", "")
            answer = response.get("answer", "")
            
            if i == 0:
                # Use first response to generate title
                memory_title = f"Voice Memory - {question[:30]}..."
            
            memory_content += f"Question: {question}\nAnswer: {answer}\n\n"
        
        # Generate mood based on content analysis
        positive_words = ["happy", "wonderful", "love", "special", "beautiful", "amazing", "great"]
        mood = "neutral"
        
        for word in positive_words:
            if word.lower() in memory_content.lower():
                mood = "happy"
                break
        
        return {
            "title": memory_title,
            "content": memory_content,
            "mood": mood,
            "patient_id": patient_id,
            "source": "ribbon_interview",
            "created_at": datetime.utcnow().isoformat(),
            "interview_data": interview_results
        } 