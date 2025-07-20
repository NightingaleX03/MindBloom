import os
import httpx
import json
from typing import Dict, List, Optional
import random

# Try to import Gemini AI, with fallback if grpc is not available
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
    print("✅ Gemini AI available with google-generativeai")
except ImportError as e:
    print(f"Warning: google-generativeai not available: {e}")
    GEMINI_AVAILABLE = False

# Alternative Gemini API approach using direct HTTP requests
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and not GEMINI_AVAILABLE:
    print("🔑 Gemini API Key found, will use direct HTTP requests")
    GEMINI_AVAILABLE = True

if GEMINI_AVAILABLE and GEMINI_API_KEY:
    if 'genai' in locals():
        genai.configure(api_key=GEMINI_API_KEY)

class AIService:
    def __init__(self):
        # Initialize Gemini model if available
        self.model = None
        if GEMINI_AVAILABLE:
            try:
                if 'genai' in globals() and genai is not None:
                    self.model = genai.GenerativeModel('gemini-pro')
                elif GEMINI_API_KEY:
                    # We'll use HTTP requests instead
                    self.model = "http"
                else:
                    print("Warning: Gemini not properly configured")
                    self.model = None
            except Exception as e:
                print(f"Warning: Could not initialize Gemini model: {e}")
                self.model = None
        
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
        try:
            # Enhanced fallback responses based on user message content
            user_message_lower = user_message.lower()
            
            if any(word in user_message_lower for word in ["family", "mother", "father", "grandma", "grandpa"]):
                responses = [
                    "Family memories are so precious! I can feel the love in your story. What else do you remember about your family?",
                    "Family bonds are truly special. It sounds like you have wonderful memories with your loved ones. Can you tell me more?",
                    "I love hearing about family stories. They're the foundation of who we are. What made those moments so special?"
                ]
            elif any(word in user_message_lower for word in ["childhood", "young", "kid", "school"]):
                responses = [
                    "Childhood memories are like treasures! I can picture you as a young person. What was it like growing up then?",
                    "Those early years are so important. It sounds like you have wonderful childhood memories. What else do you remember?",
                    "Childhood is such a magical time. Your memories bring back the innocence and wonder of those days."
                ]
            elif any(word in user_message_lower for word in ["happy", "joy", "laugh", "smile"]):
                responses = [
                    "I can feel the happiness in your voice! Joy is such a beautiful emotion. What made you so happy in that moment?",
                    "Your happiness is contagious! It sounds like it was a truly wonderful time. What else brought you joy?",
                    "Happiness is one of life's greatest gifts. I'm so glad you shared this joyful memory with me."
                ]
            elif any(word in user_message_lower for word in ["home", "house", "kitchen", "garden"]):
                responses = [
                    "Home is where the heart is! I can feel the warmth and comfort in your story. What made your home so special?",
                    "Home memories are so comforting. It sounds like you have wonderful memories of your living space. Tell me more!",
                    "There's nothing quite like the feeling of home. Your memories capture that sense of belonging perfectly."
                ]
            else:
                responses = [
                    "Thank you for sharing that with me. That sounds like a wonderful memory. Would you like to tell me more about it?",
                    "I can see how special that moment was for you. What made it so meaningful?",
                    "That's a beautiful story. It sounds like you have a lot of love in your life. Can you tell me more?",
                    "I'm so glad you shared that memory with me. It sounds like it brought you a lot of joy.",
                    "What a precious memory. It's wonderful that you can recall such special moments."
                ]
            
            return random.choice(responses)
        except Exception as e:
            print(f"Error generating conversation response: {str(e)}")
            return "Thank you for sharing that with me. I'd love to hear more about your memories."
    
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
    
    async def _get_gemini_response(self, prompt: str) -> str:
        """
        Get response from Gemini AI using either google-generativeai or direct HTTP
        """
        try:
            # Try using google-generativeai if available
            if self.model and self.model != "http":
                response = self.model.generate_content(prompt)
                return response.text
            # Try direct HTTP request to Gemini API
            elif self.model == "http" and GEMINI_API_KEY:
                return await self._get_gemini_http_response(prompt)
            else:
                return '{"error": "Gemini AI not available"}'
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            # Try HTTP fallback only if API key is available
            if GEMINI_API_KEY:
                try:
                    return await self._get_gemini_http_response(prompt)
                except Exception as http_error:
                    print(f"Gemini HTTP API error: {str(http_error)}")
            return '{"error": "Gemini API error"}'
    
    async def _get_gemini_http_response(self, prompt: str) -> str:
        """
        Make direct HTTP request to Gemini API
        """
        try:
            url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GEMINI_API_KEY}"
            }
            
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt
                            }
                        ]
                    }
                ]
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=data, timeout=30.0)
                
                if response.status_code == 200:
                    result = response.json()
                    if "candidates" in result and len(result["candidates"]) > 0:
                        content = result["candidates"][0]["content"]
                        if "parts" in content and len(content["parts"]) > 0:
                            return content["parts"][0]["text"]
                
                print(f"Gemini HTTP API error: {response.status_code} - {response.text}")
                return '{"error": "Gemini HTTP API error"}'
                
        except Exception as e:
            print(f"Gemini HTTP request error: {str(e)}")
            return '{"error": "Gemini HTTP request error"}' 