from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import json
from pathlib import Path

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
        "media.json": []
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
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
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

# Memory endpoints
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
        "created_at": "2024-01-01T00:00:00Z"
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

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 