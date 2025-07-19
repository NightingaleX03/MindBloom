import os
from typing import Dict, List, Optional
import random

class AIService:
    def __init__(self):
        # Using mock responses since Google Generative AI has compilation issues on Windows
        # In production, integrate with the actual Google Gemini API
        
        # Memory prompts for different use cases
        self.memory_prompts = [
            "Do you remember a special moment with your family?",
            "What's your favorite childhood memory?",
            "Tell me about a place that makes you happy",
            "Do you remember any special holidays?",
            "What's a story about your friends that you love?",
            "Tell me about something that made you laugh recently"
        ]
    
    async def analyze_journal_entry(self, content: str, mood: str) -> Dict:
        """Analyze a journal entry and generate insights"""
        # Mock analysis - replace with Google Gemini in production
        return {
            "sentiment": "positive" if "happy" in mood.lower() or "good" in content.lower() else "neutral",
            "themes": ["family", "memory", "love"],
            "questions": [
                "What else do you remember about that time?",
                "How did that make you feel?",
                "Who else was there with you?"
            ],
            "tags": ["family", "memory"],
            "safety_notes": None
        }
    
    async def generate_memory_prompt(self, user_context: str = "") -> str:
        """Generate a personalized memory prompt"""
        if user_context:
            return f"Based on your recent memories, do you remember {user_context}? Tell me more about that special time."
        else:
            return random.choice(self.memory_prompts)
    
    async def generate_conversation_response(self, user_message: str, conversation_history: List[Dict]) -> str:
        """Generate a compassionate AI response to user conversation"""
        # Mock responses - replace with Google Gemini in production
        responses = [
            "Thank you for sharing that with me. That sounds like a wonderful memory. Would you like to tell me more about it?",
            "I can see how special that moment was for you. What made it so meaningful?",
            "That's a beautiful story. It sounds like you have a lot of love in your life. Can you tell me more?",
            "I'm so glad you shared that memory with me. It sounds like it brought you a lot of joy.",
            "What a precious memory. It's wonderful that you can recall such special moments."
        ]
        return random.choice(responses)
    
    async def analyze_image(self, image_data: bytes) -> Dict:
        """Analyze an image and generate a description"""
        # Mock analysis - replace with Google Gemini Vision in production
        return {
            "description": "I can see this is a special photo for you. It looks like it captures a meaningful moment.",
            "tags": ["image", "memory"],
            "sentiment": "positive"
        }
    
    async def generate_story(self, user_input: str, story_type: str = "memory") -> str:
        """Generate a story based on user input"""
        # Mock story generation - replace with Google Gemini in production
        return f"Once upon a time, there was a special moment when {user_input}. It was a beautiful day filled with love and joy. Everyone who was there felt the warmth of that memory, and it became a treasure that would be cherished forever."
    
    async def generate_caregiver_insights(self, patient_data: Dict) -> Dict:
        """Generate insights for caregivers about their patient"""
        # Mock insights - replace with Google Gemini in production
        return {
            "insights": "Your loved one seems to be engaging well with their memories and showing positive emotional responses.",
            "suggestions": [
                "Try asking about their favorite memories",
                "Consider gentle physical activities",
                "Encourage sharing stories about family"
            ],
            "patterns": ["positive engagement", "memory sharing"],
            "encouragement": "You're doing a wonderful job supporting your loved one."
        } 