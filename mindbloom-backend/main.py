from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import json
from pathlib import Path
import httpx
import base64

# Remove problematic router imports for now
# from routers import auth, journal, ai, calendar, media, ribbon

# Create data directory if it doesn't exist
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)

# Create JSON files for data storage
def init_data_files():
    files = {
        "users.json": [],
        "journals.json": [],
        "memories.json": [],
        "calendar.json": [],
        "media.json": [],
        "interviews.json": []
    }
    
    for filename, default_data in files.items():
        filepath = data_dir / filename
        if not filepath.exists():
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(default_data, f, indent=2)

# Initialize data files
init_data_files()

# Create FastAPI app
app = FastAPI(
    title="MindBloom API",
    description="A compassionate memory companion API for people with dementia",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper functions for JSON file operations
def read_json_file(filename: str):
    filepath = data_dir / filename
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def write_json_file(filename: str, data):
    filepath = data_dir / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

# Gemini AI integration
class GeminiAI:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    
    async def generate_memory_visualization(self, memory_content: str, memory_title: str, mood: str):
        """Generate a visual description of a memory using Gemini AI"""
        
        if self.api_key == "your_gemini_api_key_here":
            # Return mock visualization if no API key
            return {
                "visual_description": f"A warm, nostalgic scene depicting {memory_title.lower()}. The atmosphere is {mood} with soft lighting and rich colors that capture the emotional essence of this memory.",
                "scene_elements": [
                    "Soft, warm lighting",
                    "Rich, vibrant colors",
                    "Emotional atmosphere",
                    "Nostalgic elements"
                ],
                "color_palette": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
                "mood_enhancement": mood
            }
        
        try:
            prompt = f"""
            Create a detailed visual description for a memory titled "{memory_title}" with the following content:
            "{memory_content}"
            
            The mood of this memory is: {mood}
            
            Please provide:
            1. A vivid visual description of how this memory would look if visualized
            2. Key visual elements that capture the essence of this memory
            3. A color palette that reflects the mood and atmosphere
            4. Suggestions for visual enhancement based on the mood
            
            Format the response as a JSON object with:
            - visual_description: A detailed scene description
            - scene_elements: Array of key visual elements
            - color_palette: Array of hex colors
            - mood_enhancement: How to visually enhance the mood
            """
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}?key={self.api_key}",
                    json={
                        "contents": [{
                            "parts": [{
                                "text": prompt
                            }]
                        }]
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    # Parse the AI response and extract the JSON
                    ai_text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    
                    # Try to extract JSON from the response
                    try:
                        # Find JSON in the response
                        start_idx = ai_text.find('{')
                        end_idx = ai_text.rfind('}') + 1
                        if start_idx != -1 and end_idx != 0:
                            json_str = ai_text[start_idx:end_idx]
                            return json.loads(json_str)
                    except:
                        pass
                    
                    # Fallback to structured response
                    return {
                        "visual_description": ai_text[:500] + "..." if len(ai_text) > 500 else ai_text,
                        "scene_elements": ["AI-generated scene elements"],
                        "color_palette": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
                        "mood_enhancement": mood
                    }
                else:
                    raise Exception(f"Gemini API error: {response.status_code}")
                    
        except Exception as e:
            print(f"Error generating visualization: {e}")
            # Return fallback visualization
            return {
                "visual_description": f"A beautiful scene representing the memory '{memory_title}' with a {mood} atmosphere. The visualization captures the emotional essence and key moments of this precious memory.",
                "scene_elements": [
                    "Emotional atmosphere",
                    "Memory-specific elements",
                    "Mood-appropriate lighting",
                    "Nostalgic details"
                ],
                "color_palette": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
                "mood_enhancement": mood
            }

# Initialize Gemini AI
gemini_ai = GeminiAI()

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "MindBloom API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "MindBloom API"}

# Simple user management (no Auth0)
@app.post("/api/users")
async def create_user(user_data: dict):
    users = read_json_file("users.json")
    user_id = str(len(users) + 1)
    user = {
        "id": user_id,
        "name": user_data.get("name", "User"),
        "email": user_data.get("email", ""),
        "created_at": "2024-01-01T00:00:00Z"
    }
    users.append(user)
    write_json_file("users.json", users)
    return user

@app.get("/api/users")
async def get_users():
    return read_json_file("users.json")

# Journal endpoints
@app.post("/api/journal")
async def create_journal_entry(entry_data: dict):
    journals = read_json_file("journals.json")
    entry_id = str(len(journals) + 1)
    entry = {
        "id": entry_id,
        "user_id": entry_data.get("user_id", "1"),
        "title": entry_data.get("title", ""),
        "content": entry_data.get("content", ""),
        "mood": entry_data.get("mood", "neutral"),
        "created_at": "2024-01-01T00:00:00Z"
    }
    journals.append(entry)
    write_json_file("journals.json", journals)
    return entry

@app.get("/api/journal")
async def get_journal_entries(user_id: str = None):
    journals = read_json_file("journals.json")
    if user_id:
        journals = [j for j in journals if j.get("user_id") == user_id]
    return journals

# Memory endpoints with AI visualization
@app.post("/api/memories")
async def create_memory(memory_data: dict):
    memories = read_json_file("memories.json")
    memory_id = str(len(memories) + 1)
    memory = {
        "id": memory_id,
        "user_id": memory_data.get("user_id", "1"),
        "title": memory_data.get("title", ""),
        "description": memory_data.get("description", ""),
        "category": memory_data.get("category", "general"),
        "importance": memory_data.get("importance", "medium"),
        "mood": memory_data.get("mood", "neutral"),
        "created_at": "2024-01-01T00:00:00Z"
    }
    
    # Generate AI visualization for the memory
    try:
        visualization = await gemini_ai.generate_memory_visualization(
            memory["description"],
            memory["title"],
            memory["mood"]
        )
        memory["visualization"] = visualization
    except Exception as e:
        print(f"Error generating visualization: {e}")
        memory["visualization"] = {
            "visual_description": f"A beautiful scene representing the memory '{memory['title']}'",
            "scene_elements": ["AI-generated elements"],
            "color_palette": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
            "mood_enhancement": memory["mood"]
        }
    
    memories.append(memory)
    write_json_file("memories.json", memories)
    return memory

@app.get("/api/memories")
async def get_memories(user_id: str = None):
    memories = read_json_file("memories.json")
    if user_id:
        memories = [m for m in memories if m.get("user_id") == user_id]
    return memories

@app.get("/api/memories/{memory_id}/visualization")
async def get_memory_visualization(memory_id: str):
    memories = read_json_file("memories.json")
    memory = next((m for m in memories if m.get("id") == memory_id), None)
    
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    # Generate or retrieve visualization
    if "visualization" not in memory:
        try:
            visualization = await gemini_ai.generate_memory_visualization(
                memory["description"],
                memory["title"],
                memory.get("mood", "neutral")
            )
            memory["visualization"] = visualization
            # Update the memory in storage
            memories = [m if m.get("id") != memory_id else memory for m in memories]
            write_json_file("memories.json", memories)
        except Exception as e:
            print(f"Error generating visualization: {e}")
            memory["visualization"] = {
                "visual_description": f"A beautiful scene representing the memory '{memory['title']}'",
                "scene_elements": ["AI-generated elements"],
                "color_palette": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
                "mood_enhancement": memory.get("mood", "neutral")
            }
    
    return memory["visualization"]

# Calendar endpoints
@app.post("/api/calendar")
async def create_calendar_event(event_data: dict):
    events = read_json_file("calendar.json")
    event_id = str(len(events) + 1)
    event = {
        "id": event_id,
        "user_id": event_data.get("user_id", "1"),
        "title": event_data.get("title", ""),
        "description": event_data.get("description", ""),
        "date": event_data.get("date", "2024-01-01"),
        "time": event_data.get("time", "00:00"),
        "reminder": event_data.get("reminder", False),
        "created_at": "2024-01-01T00:00:00Z"
    }
    events.append(event)
    write_json_file("calendar.json", events)
    return event

@app.get("/api/calendar")
async def get_calendar_events(user_id: str = None):
    events = read_json_file("calendar.json")
    if user_id:
        events = [e for e in events if e.get("user_id") == user_id]
    return events

# AI chat endpoint (simplified)
@app.post("/api/ai/chat")
async def chat_with_ai(chat_data: dict):
    message = chat_data.get("message", "")
    user_id = chat_data.get("user_id", "1")
    
    # Simple response logic
    responses = {
        "hello": "Hello! How are you feeling today?",
        "how are you": "I'm doing well, thank you for asking! How about you?",
        "memory": "I'm here to help you with your memories. Would you like to share something?",
        "help": "I'm your memory companion. I can help you with journaling, memories, and calendar events."
    }
    
    response = "I'm here to help you! How can I assist you today?"
    for key, value in responses.items():
        if key.lower() in message.lower():
            response = value
            break
    
    return {
        "response": response,
        "user_id": user_id,
        "timestamp": "2024-01-01T00:00:00Z"
    }

# Ribbon interview endpoints (simplified without authentication)
@app.post("/api/ribbon/memory-interview/{patient_id}")
async def create_memory_interview(patient_id: str):
    """Create a memory interview for a patient (simplified)"""
    try:
        # Mock interview creation
        interview_id = f"interview-{patient_id}-{len(read_json_file('interviews.json')) + 1}"
        
        # Get patient name based on ID
        patient_names = {
            "1": "Sarah Johnson",
            "2": "Robert Smith", 
            "3": "Margaret Davis"
        }
        patient_name = patient_names.get(patient_id, f"Patient {patient_id}")
        
        interview = {
            "id": interview_id,
            "patient_id": patient_id,
            "patient_name": patient_name,
            "status": "created",
            "created_at": "2024-01-01T00:00:00Z",
            "interview_url": f"https://ribbon.ai/interview/{interview_id}",
            "flow_id": f"flow-{patient_id}",
            "type": "memory_interview"
        }
        
        # Save to JSON file
        interviews = read_json_file("interviews.json")
        interviews.append(interview)
        write_json_file("interviews.json", interviews)
        
        return {
            "message": "Memory interview created successfully",
            "interview": interview,
            "interview_url": interview["interview_url"],
            "patient_name": patient_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create memory interview: {str(e)}")

@app.get("/api/ribbon/interviews")
async def get_interviews():
    """Get all interviews"""
    return read_json_file("interviews.json")

# Include routers
# app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
# app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
# app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
# app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])
# app.include_router(media.router, prefix="/api/media", tags=["Media"])
# app.include_router(ribbon.router, prefix="/api/ribbon", tags=["Ribbon Voice Interviews"])

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    ) 