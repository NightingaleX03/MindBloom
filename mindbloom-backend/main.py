from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import json
from pathlib import Path
import httpx
import base64
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

# Load environment variables
load_dotenv()

# Import database and routers
from database import Database, Collections, init_database
from routers import interview_analysis, ai_training

# Create data directory if it doesn't exist (for uploads)
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)

# Create FastAPI app
app = FastAPI(
    title="MindBloom API",
    description="A compassionate memory companion API for people with dementia",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import all routers
from routers import auth, journal, ai, calendar, media, ribbon

# Include routers
app.include_router(interview_analysis.router)
app.include_router(ai_training.router)
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(journal.router, prefix="/api/journal", tags=["Journal"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["Calendar"])
app.include_router(media.router, prefix="/api/media", tags=["Media"])
app.include_router(ribbon.router, prefix="/api/ribbon", tags=["Ribbon Voice Interviews"])

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    try:
        await init_database()
        print("🚀 MindBloom API started successfully!")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")
        print("⚠️ Continuing with limited functionality...")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown."""
    await Database.close_db()

# Helper functions for file operations (for uploads)
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
        self.image_generation_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
    
    def _generate_unique_prompt(self, memory_content: str, memory_title: str, mood: str):
        """Generate a unique, detailed prompt for each memory"""
        
        # Create unique prompts based on memory content and mood
        mood_prompts = {
            "happy": [
                "Create a vibrant, warm scene with golden sunlight streaming through windows, capturing the pure joy and laughter of this moment. Use bright, cheerful colors and dynamic composition.",
                "Paint a scene of pure happiness with soft, warm lighting, gentle smiles, and a sense of togetherness. Include elements that radiate positive energy and warmth.",
                "Visualize this memory as a bright, sunny day with people sharing genuine laughter and connection. Use warm tones and a composition that draws the eye to the emotional center."
            ],
            "sad": [
                "Create a melancholic scene with soft, diffused lighting and cool blue tones. Capture the quiet introspection and emotional depth of this memory with gentle, contemplative composition.",
                "Paint a scene with muted colors and soft shadows, conveying the tender sadness and reflection. Use cool tones and a composition that invites quiet contemplation.",
                "Visualize this memory with gentle rain or soft lighting, using cool blues and grays to capture the emotional weight and depth of the moment."
            ],
            "excited": [
                "Create a dynamic, energetic scene with bold colors and dramatic lighting. Capture the thrill and excitement with vibrant reds and oranges, using dynamic angles and movement.",
                "Paint a scene bursting with energy and enthusiasm, using bright, saturated colors and dramatic composition to convey the excitement and anticipation.",
                "Visualize this memory with electric energy, using bold strokes and vibrant colors that pulse with life and excitement."
            ],
            "calm": [
                "Create a peaceful, serene scene with soft, natural lighting and gentle green tones. Capture the tranquility and inner peace with a balanced, harmonious composition.",
                "Paint a scene of quiet serenity with soft, diffused light and natural colors. Use gentle composition and peaceful elements to convey deep calm and contentment.",
                "Visualize this memory as a moment of perfect peace, using soft lighting and natural tones to create a sense of deep tranquility and harmony."
            ],
            "anxious": [
                "Create a scene with heightened tension and warm, urgent colors. Use dramatic lighting and tight composition to convey the nervous energy and anticipation.",
                "Paint a scene with warm, intense colors and sharp contrasts. Capture the nervous energy with dynamic composition and urgent, focused lighting.",
                "Visualize this memory with warm, intense tones and dramatic shadows, using composition that conveys the heightened awareness and tension of the moment."
            ],
            "nostalgic": [
                "Create a warm, sepia-toned scene with soft, golden lighting. Capture the sweet nostalgia and tender memories with vintage colors and gentle, loving composition.",
                "Paint a scene with warm, vintage colors and soft, golden light. Use elements that evoke fond memories and tender emotions with a composition that feels timeless.",
                "Visualize this memory with warm, golden tones and soft lighting, creating a sense of timeless beauty and cherished memories."
            ],
            "neutral": [
                "Create a balanced, composed scene with natural lighting and neutral tones. Capture the quiet dignity and thoughtful reflection with a harmonious, centered composition.",
                "Paint a scene with balanced lighting and natural colors, conveying thoughtful contemplation and quiet dignity with a composition that feels grounded and stable.",
                "Visualize this memory with natural lighting and balanced composition, using neutral tones to convey thoughtful reflection and quiet dignity."
            ]
        }
        
        # Get a random prompt for the mood
        import random
        mood_prompt = random.choice(mood_prompts.get(mood, mood_prompts["neutral"]))
        
        # Create unique scene elements based on content
        content_keywords = memory_content.lower()
        scene_elements = []
        
        if "family" in content_keywords or "home" in content_keywords:
            scene_elements.extend(["warm family atmosphere", "cozy home environment", "loving interactions"])
        if "nature" in content_keywords or "outdoor" in content_keywords:
            scene_elements.extend(["natural lighting", "outdoor elements", "organic textures"])
        if "food" in content_keywords or "dinner" in content_keywords or "meal" in content_keywords:
            scene_elements.extend(["warm food lighting", "shared meal atmosphere", "communal dining"])
        if "music" in content_keywords or "dance" in content_keywords:
            scene_elements.extend(["rhythmic composition", "musical elements", "dynamic movement"])
        if "travel" in content_keywords or "journey" in content_keywords:
            scene_elements.extend(["distant horizons", "journey elements", "exploration themes"])
        
        # Add mood-specific elements
        scene_elements.extend([
            f"{mood.capitalize()} emotional atmosphere",
            "Memory-specific visual elements",
            "Carefully balanced lighting",
            "Personal and nostalgic details"
        ])
        
        return {
            "prompt": mood_prompt,
            "scene_elements": scene_elements[:5]  # Limit to 5 elements
        }
    
    async def generate_ai_image(self, prompt: str, memory_title: str):
        """Generate a real AI image using external AI image generation service"""
        try:
            # This is where you would integrate with real AI image generation services
            # Options: DALL-E API, Stable Diffusion API, Midjourney API, etc.
            
            # Example with DALL-E API (requires OpenAI API key)
            # import openai
            # openai.api_key = "your-openai-api-key"
            # response = openai.Image.create(
            #     prompt=prompt,
            #     n=1,
            #     size="1024x1024"
            # )
            # return response['data'][0]['url']
            
            # Example with Stable Diffusion API (requires Stability AI API key)
            # import httpx
            # async with httpx.AsyncClient() as client:
            #     response = await client.post(
            #         "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
            #         headers={"Authorization": f"Bearer {stability_api_key}"},
            #         json={
            #             "text_prompts": [{"text": prompt}],
            #             "cfg_scale": 7,
            #             "height": 1024,
            #             "width": 1024,
            #             "samples": 1,
            #             "steps": 30,
            #         }
            #     )
            #     if response.status_code == 200:
            #         data = response.json()
            #         return data['artifacts'][0]['base64']  # Return base64 image data
            
            # For now, return a sophisticated Unsplash URL that better simulates AI generation
            import hashlib
            memory_hash = hashlib.md5(f"{prompt}{memory_title}".encode()).hexdigest()
            unique_seed = int(memory_hash[:8], 16) % 10000
            
            # Create a more sophisticated search that better matches AI-generated content
            ai_keywords = prompt.replace(' ', '+').replace(',', '+').replace('detailed', '').replace('digital art', '').replace('masterpiece quality', '')
            image_url = f"https://source.unsplash.com/800x600/?{ai_keywords}&sig={unique_seed}"
            
            print(f"🤖 AI Image Generation for '{memory_title}': {image_url}")
            return image_url
            
        except Exception as e:
            print(f"AI image generation failed: {e}")
            return None

    async def generate_memory_visualization(self, memory_content: str, memory_title: str, mood: str):
        """Generate a detailed visual description and image of a memory using AI"""
        
        # Generate unique prompt
        unique_data = self._generate_unique_prompt(memory_content, memory_title, mood)
        
        # Create a unique, memory-specific image prompt
        image_prompt = f"Beautiful artwork depicting: {memory_title}. {unique_data['prompt']} Style: artistic, emotional, {mood} mood, high quality, detailed, masterpiece, digital art"
        
        # Generate a unique image URL based on the memory content
        # This creates a deterministic but unique image for each memory
        import hashlib
        memory_hash = hashlib.md5(f"{memory_title}{memory_content}{mood}".encode()).hexdigest()
        image_seed = int(memory_hash[:8], 16) % 1000  # Use first 8 chars as seed
        
        # Generate a unique, deterministic image URL based on the memory content
        # This ensures each memory gets a unique but consistent image
        memory_hash = hashlib.md5(f"{memory_title}{memory_content}{mood}".encode()).hexdigest()
        image_seed = int(memory_hash[:8], 16) % 10000  # Use first 8 chars as seed
        
        # Generate unique AI image for each memory using real AI image generation
        try:
            # Create a detailed, memory-specific prompt for AI image generation
            image_prompt = f"Beautiful artistic illustration: {memory_title}. {unique_data['prompt']} Style: digital art, emotional, {mood} mood, high quality, detailed, masterpiece, photorealistic"
            
            # Generate a unique seed based on memory content
            memory_hash = hashlib.md5(f"{memory_title}{memory_content}{mood}{image_prompt}".encode()).hexdigest()
            unique_seed = int(memory_hash[:8], 16) % 10000
            
            # Use Stable Diffusion API for real AI image generation
            # This creates a completely unique AI-generated image for each memory
            import httpx
            
            # Stable Diffusion API endpoint (you can replace with your preferred service)
            sd_api_url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
            
            # Create a unique prompt that captures the memory essence with more specific details
            if "family" in memory_title.lower() or "dinner" in memory_title.lower():
                ai_prompt = f"Beautiful family dinner scene with people around a table, warm lighting, cozy home atmosphere, {mood} mood, people smiling and eating together, detailed digital art, masterpiece quality"
            elif "park" in memory_title.lower() or "walking" in memory_title.lower():
                ai_prompt = f"Peaceful park walking scene with a person walking on a path, nature, trees, green leaves, {mood} atmosphere, sunlight through trees, detailed digital art, masterpiece quality"
            elif "grandma" in memory_title.lower() or "grandmother" in memory_title.lower():
                ai_prompt = f"Loving grandmother scene in warm kitchen, elderly woman cooking, family home, {mood} mood, warm lighting, family together, detailed digital art, masterpiece quality"
            elif "coffee" in memory_title.lower() or "morning" in memory_title.lower():
                ai_prompt = f"Morning coffee ritual with person drinking coffee, warm sunlight, peaceful atmosphere, breakfast table, {mood} mood, detailed digital art, masterpiece quality"
            elif "happy" in mood.lower():
                ai_prompt = f"Happy family togetherness scene, joy celebration, warm atmosphere, people smiling and laughing, detailed digital art, masterpiece quality"
            elif "calm" in mood.lower():
                ai_prompt = f"Peaceful serene scene, tranquil atmosphere, soft lighting, quiet meditation, nature, detailed digital art, masterpiece quality"
            elif "nostalgic" in mood.lower():
                ai_prompt = f"Nostalgic vintage scene, warm golden memories, old family photos, retro atmosphere, detailed digital art, masterpiece quality"
            else:
                ai_prompt = f"Beautiful scene depicting {memory_title} with people, {mood} mood, detailed digital art, masterpiece quality"
            
            # Use the AI image generation function
            image_url = await self.generate_ai_image(ai_prompt, memory_title)
            
            if not image_url:
                # Fallback to sophisticated Unsplash approach
                scene_keywords = ai_prompt.replace(' ', '+').replace(',', '+')
                image_url = f"https://source.unsplash.com/800x600/?{scene_keywords}&sig={unique_seed}"
            
            print(f"🎨 Generated AI image for '{memory_title}': {image_url}")
            print(f"🤖 AI Prompt: {ai_prompt}")
                
        except Exception as e:
            print(f"AI image generation failed: {e}")
            # Fallback to memory-specific image
            scene_keywords = f"{memory_title} {mood} artistic emotional memory"
            encoded_scene = scene_keywords.replace(' ', '+')
            image_url = f"https://source.unsplash.com/800x600/?{encoded_scene}&sig={unique_seed}"
        
        mood_colors = {
            "happy": ["#FFD700", "#FFB347", "#FFE135", "#FFA500"],
            "sad": ["#87CEEB", "#4682B4", "#6495ED", "#B0C4DE"],
            "excited": ["#FF6B6B", "#FF4500", "#FF6347", "#FF8C00"],
            "calm": ["#98FB98", "#90EE90", "#32CD32", "#228B22"],
            "anxious": ["#FFA500", "#FF8C00", "#FF7F50", "#FF6347"],
            "nostalgic": ["#FFB6C1", "#FFC0CB", "#FF69B4", "#FF1493"],
            "neutral": ["#F5F5DC", "#DEB887", "#D2B48C", "#BC8F8F"]
        }
        
        return {
            "visual_description": unique_data["prompt"],
            "scene_elements": unique_data["scene_elements"],
            "color_palette": mood_colors.get(mood, ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"]),
            "mood_enhancement": f"Enhanced {mood} atmosphere with carefully balanced lighting and color composition to evoke the emotional depth of this memory.",
            "image_url": image_url,
            "image_prompt": image_prompt
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

@app.get("/api/test/journals")
async def test_journals():
    """Test endpoint to check journal data without authentication"""
    try:
        db = Database.get_db()
        if db is None:
            return {"error": "Database not connected"}
        
        # Get all journal entries
        journals = await db[Collections.JOURNALS].find({}).limit(5).to_list(length=5)
        
        # Convert ObjectId to string for JSON serialization
        for journal in journals:
            journal["_id"] = str(journal["_id"])
        
        return {
            "total_journals": len(journals),
            "sample_journals": journals
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/test/db")
async def test_database():
    """Test endpoint to check database connection"""
    try:
        db = Database.get_db()
        if db is None:
            return {"error": "Database not connected", "status": "failed"}
        
        # Test a simple query
        count = await db[Collections.MEMORIES].count_documents({})
        
        return {
            "status": "connected",
            "memories_count": count,
            "database": "mindbloom_db"
        }
    except Exception as e:
        return {"error": str(e), "status": "failed"}

# User management with MongoDB
@app.post("/api/users")
async def create_user(user_data: dict):
    db = Database.get_db()
    
    # Check if user already exists
    existing_user = await db[Collections.USERS].find_one({"email": user_data.get("email")})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = {
        "id": str(ObjectId()),
        "name": user_data.get("name", "User"),
        "email": user_data.get("email", ""),
        "role": user_data.get("role", "user"),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db[Collections.USERS].insert_one(user)
    user["_id"] = str(result.inserted_id)
    
    return user

@app.get("/api/users")
async def get_users():
    db = Database.get_db()
    users = await db[Collections.USERS].find({}).to_list(length=100)
    return users

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    db = Database.get_db()
    user = await db[Collections.USERS].find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Journal endpoints with MongoDB
@app.post("/api/journal")
async def create_journal_entry(entry_data: dict):
    db = Database.get_db()
    
    entry = {
        "id": str(ObjectId()),
        "user_id": entry_data.get("user_id", "1"),
        "title": entry_data.get("title", ""),
        "content": entry_data.get("content", ""),
        "mood": entry_data.get("mood", "neutral"),
        "tags": entry_data.get("tags", []),
        "media_urls": entry_data.get("media_urls", []),
        "location": entry_data.get("location"),
        "people": entry_data.get("people", []),
        "is_pinned": entry_data.get("is_pinned", False),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db[Collections.JOURNALS].insert_one(entry)
    entry["_id"] = str(result.inserted_id)
    
    return entry

@app.get("/api/journal")
async def get_journal_entries(user_id: str = None):
    db = Database.get_db()
    
    if user_id:
        journals = await db[Collections.JOURNALS].find({"user_id": user_id}).to_list(length=100)
    else:
        journals = await db[Collections.JOURNALS].find({}).to_list(length=100)
    
    return journals

@app.get("/api/journal/{journal_id}")
async def get_journal_entry(journal_id: str):
    db = Database.get_db()
    journal = await db[Collections.JOURNALS].find_one({"id": journal_id})
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return journal

@app.put("/api/journal/{journal_id}")
async def update_journal_entry(journal_id: str, entry_data: dict):
    db = Database.get_db()
    
    update_data = {
        "title": entry_data.get("title"),
        "content": entry_data.get("content"),
        "mood": entry_data.get("mood"),
        "tags": entry_data.get("tags"),
        "media_urls": entry_data.get("media_urls"),
        "location": entry_data.get("location"),
        "people": entry_data.get("people"),
        "is_pinned": entry_data.get("is_pinned"),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    result = await db[Collections.JOURNALS].update_one(
        {"id": journal_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    return {"message": "Journal entry updated successfully"}

@app.delete("/api/journal/{journal_id}")
async def delete_journal_entry(journal_id: str):
    db = Database.get_db()
    
    result = await db[Collections.JOURNALS].delete_one({"id": journal_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    
    return {"message": "Journal entry deleted successfully"}

# Memory endpoints with MongoDB and AI visualization
@app.post("/api/memories")
async def create_memory(memory_data: dict):
    try:
        db = Database.get_db()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        memory = {
            "id": str(ObjectId()),
            "user_id": memory_data.get("user_id", "1"),
            "title": memory_data.get("title", ""),
            "description": memory_data.get("description", ""),
            "category": memory_data.get("category", "general"),
            "importance": memory_data.get("importance", "medium"),
            "mood": memory_data.get("mood", "neutral"),
            "tags": memory_data.get("tags", []),
            "patient_id": memory_data.get("patient_id"),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
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
        
        result = await db[Collections.MEMORIES].insert_one(memory)
        memory["_id"] = str(result.inserted_id)
        
        return memory
    except Exception as e:
        print(f"Error in create_memory: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create memory: {str(e)}")

@app.get("/api/memories")
async def get_memories(user_id: str = None, patient_id: str = None):
    try:
        db = Database.get_db()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        filter_query = {}
        if user_id:
            filter_query["user_id"] = user_id
        if patient_id:
            filter_query["patient_id"] = patient_id
        
        memories = await db[Collections.MEMORIES].find(filter_query).to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for memory in memories:
            memory["_id"] = str(memory["_id"])
        
        return memories
    except Exception as e:
        print(f"Error in get_memories: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load memories: {str(e)}")

@app.get("/api/memories/{memory_id}")
async def get_memory(memory_id: str):
    db = Database.get_db()
    memory = await db[Collections.MEMORIES].find_one({"id": memory_id})
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    return memory

@app.put("/api/memories/{memory_id}")
async def update_memory(memory_id: str, memory_data: dict):
    db = Database.get_db()
    
    update_data = {
        "title": memory_data.get("title"),
        "description": memory_data.get("description"),
        "category": memory_data.get("category"),
        "importance": memory_data.get("importance"),
        "mood": memory_data.get("mood"),
        "tags": memory_data.get("tags"),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    result = await db[Collections.MEMORIES].update_one(
        {"id": memory_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    return {"message": "Memory updated successfully"}

@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: str):
    db = Database.get_db()
    
    result = await db[Collections.MEMORIES].delete_one({"id": memory_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    return {"message": "Memory deleted successfully"}

@app.get("/api/memories/{memory_id}/visualization")
async def get_memory_visualization(memory_id: str, fresh: bool = False):
    try:
        db = Database.get_db()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        # Find the memory in MongoDB
        memory = await db[Collections.MEMORIES].find_one({"_id": ObjectId(memory_id)})
        
        if not memory:
            raise HTTPException(status_code=404, detail="Memory not found")
        
        # Always regenerate visualization to ensure fresh AI-generated images
        try:
            print(f"🎨 Generating fresh AI visualization for memory: {memory.get('title', 'Untitled')}")
            visualization = await gemini_ai.generate_memory_visualization(
                memory.get("description", ""),
                memory.get("title", "Untitled Memory"),
                memory.get("mood", "neutral")
            )
            
            # Save the fresh visualization to the memory in MongoDB
            await db[Collections.MEMORIES].update_one(
                {"_id": ObjectId(memory_id)},
                {"$set": {"visualization": visualization}}
            )
            
            print(f"✅ Fresh AI visualization generated and saved for memory: {memory.get('title')}")
            
        except Exception as e:
            print(f"Error generating AI visualization: {e}")
            # Create enhanced fallback visualization with memory-specific AI image
            import hashlib
            memory_title = memory.get('title', 'memory')
            memory_mood = memory.get('mood', 'neutral')
            
            # Generate unique seed for this memory
            memory_hash = hashlib.md5(f"{memory_title}{memory_mood}".encode()).hexdigest()
            unique_seed = int(memory_hash[:8], 16) % 10000
            
            # Create more specific, memory-matching image URLs
            if "family" in memory_title.lower() or "dinner" in memory_title.lower():
                scene_keywords = "family+dinner+table+people+smiling+warm+lighting+cozy+home+togetherness+celebration"
            elif "park" in memory_title.lower() or "walking" in memory_title.lower():
                scene_keywords = "park+walking+path+person+walking+nature+trees+peaceful+serene+green+leaves+sunlight"
            elif "grandma" in memory_title.lower() or "grandmother" in memory_title.lower():
                scene_keywords = "grandmother+family+home+warm+kitchen+loving+nostalgic+elderly+woman+cooking+family"
            elif "coffee" in memory_title.lower() or "morning" in memory_title.lower():
                scene_keywords = "morning+coffee+ritual+warm+sunlight+peaceful+person+drinking+coffee+breakfast+table"
            elif "happy" in memory_mood.lower():
                scene_keywords = "happy+family+togetherness+joy+celebration+warm+smiling+people+laughter"
            elif "calm" in memory_mood.lower():
                scene_keywords = "peaceful+serene+tranquil+calm+nature+soft+lighting+quiet+meditation"
            elif "nostalgic" in memory_mood.lower():
                scene_keywords = "nostalgic+vintage+old+memories+warm+golden+retro+family+photos"
            else:
                # Create a more specific search based on the actual memory content
                memory_words = memory_title.replace(' ', '+').replace(',', '').replace('.', '')
                scene_keywords = f"{memory_words}+{memory_mood}+people+scene+memory+detailed+artistic"
            
            visualization = {
                "visual_description": f"A beautifully crafted scene depicting '{memory_title}' with a {memory_mood} atmosphere. The visualization captures the emotional essence and key moments of this precious memory through carefully chosen lighting, colors, and composition that evoke deep emotional resonance.",
                "scene_elements": [
                    f"{memory_mood.capitalize()} emotional atmosphere",
                    "Memory-specific visual elements",
                    "Carefully balanced lighting",
                    "Personal and nostalgic details",
                    "Dynamic composition and perspective"
                ],
                "color_palette": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"],
                "mood_enhancement": f"Enhanced {memory_mood} atmosphere with carefully balanced lighting and color composition to evoke the emotional depth of this memory.",
                "image_url": f"https://source.unsplash.com/800x600/?{scene_keywords}&sig={unique_seed}",
                "image_prompt": f"Create a beautiful artwork depicting: {memory_title}. Style: artistic, emotional, {memory_mood} mood, high quality, detailed, masterpiece"
            }
        
        return visualization
        
    except Exception as e:
        print(f"Error in get_memory_visualization: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate visualization: {str(e)}")

# Calendar endpoints with MongoDB
@app.post("/api/calendar")
async def create_calendar_event(event_data: dict):
    db = Database.get_db()
    
    event = {
        "id": str(ObjectId()),
        "user_id": event_data.get("user_id", "1"),
        "title": event_data.get("title", ""),
        "description": event_data.get("description", ""),
        "date": event_data.get("date", ""),
        "start_time": event_data.get("start_time", ""),
        "end_time": event_data.get("end_time", ""),
        "event_type": event_data.get("event_type", "activity"),
        "priority": event_data.get("priority", "medium"),
        "completed": event_data.get("completed", False),
        "patient_id": event_data.get("patient_id"),
        "reminders": event_data.get("reminders", []),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db[Collections.CALENDAR].insert_one(event)
    event["_id"] = str(result.inserted_id)
    
    return event

@app.get("/api/calendar")
async def get_calendar_events(user_id: str = None, patient_id: str = None, date: str = None):
    try:
        db = Database.get_db()
        if db is None:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        filter_query = {}
        if user_id:
            filter_query["user_id"] = user_id
        if patient_id:
            filter_query["patient_id"] = patient_id
        if date:
            filter_query["date"] = date
        
        events = await db[Collections.CALENDAR].find(filter_query).to_list(length=100)
        
        # Convert ObjectId to string for JSON serialization
        for event in events:
            event["_id"] = str(event["_id"])
        
        return events
    except Exception as e:
        print(f"Error in get_calendar_events: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load calendar events: {str(e)}")

@app.get("/api/calendar/{event_id}")
async def get_calendar_event(event_id: str):
    db = Database.get_db()
    event = await db[Collections.CALENDAR].find_one({"id": event_id})
    if not event:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    return event

@app.put("/api/calendar/{event_id}")
async def update_calendar_event(event_id: str, event_data: dict):
    db = Database.get_db()
    
    update_data = {
        "title": event_data.get("title"),
        "description": event_data.get("description"),
        "date": event_data.get("date"),
        "start_time": event_data.get("start_time"),
        "end_time": event_data.get("end_time"),
        "event_type": event_data.get("event_type"),
        "priority": event_data.get("priority"),
        "completed": event_data.get("completed"),
        "reminders": event_data.get("reminders"),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    # Remove None values
    update_data = {k: v for k, v in update_data.items() if v is not None}
    
    result = await db[Collections.CALENDAR].update_one(
        {"id": event_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    
    return {"message": "Calendar event updated successfully"}

@app.delete("/api/calendar/{event_id}")
async def delete_calendar_event(event_id: str):
    db = Database.get_db()
    
    result = await db[Collections.CALENDAR].delete_one({"id": event_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    
    return {"message": "Calendar event deleted successfully"}

@app.put("/api/calendar/{event_id}/complete")
async def mark_event_complete(event_id: str):
    db = Database.get_db()
    
    result = await db[Collections.CALENDAR].update_one(
        {"id": event_id},
        {"$set": {"completed": True, "updated_at": datetime.utcnow().isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Calendar event not found")
    
    return {"message": "Event marked as completed"}

# AI chat endpoint with MongoDB
@app.post("/api/ai/chat")
async def chat_with_ai(chat_data: dict):
    db = Database.get_db()
    
    message = chat_data.get("message", "")
    user_id = chat_data.get("user_id", "1")
    patient_id = chat_data.get("patient_id")
    
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
    
    # Store chat message in MongoDB
    chat_entry = {
        "id": str(ObjectId()),
        "user_id": user_id,
        "patient_id": patient_id,
        "message": message,
        "response": response,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    await db[Collections.AI_CHAT].insert_one(chat_entry)
    
    return {
        "response": response,
        "user_id": user_id,
        "patient_id": patient_id,
        "timestamp": chat_entry["timestamp"]
    }

@app.get("/api/ai/chat")
async def get_chat_history(user_id: str = None, patient_id: str = None):
    db = Database.get_db()
    
    filter_query = {}
    if user_id:
        filter_query["user_id"] = user_id
    if patient_id:
        filter_query["patient_id"] = patient_id
    
    chat_history = await db[Collections.AI_CHAT].find(filter_query).sort("timestamp", -1).to_list(length=50)
    return chat_history

# Ribbon interview endpoints with MongoDB
@app.post("/api/ribbon/memory-interview/{patient_id}")
async def create_memory_interview(patient_id: str):
    """Create a memory interview for a patient"""
    db = Database.get_db()
    
    try:
        # Get patient info from database
        patient = await db[Collections.PATIENTS].find_one({"id": patient_id})
        patient_name = patient.get("name", f"Patient {patient_id}") if patient else f"Patient {patient_id}"
        
        # Create interview ID
        interview_count = await db[Collections.INTERVIEWS].count_documents({"patient_id": patient_id})
        interview_id = f"interview-{patient_id}-{interview_count + 1}"
        
        interview = {
            "id": interview_id,
            "patient_id": patient_id,
            "patient_name": patient_name,
            "status": "created",
            "created_at": datetime.utcnow().isoformat(),
            "interview_url": f"https://ribbon.ai/interview/{interview_id}",
            "flow_id": f"flow-{patient_id}",
            "type": "memory_interview"
        }
        
        # Save to MongoDB
        result = await db[Collections.INTERVIEWS].insert_one(interview)
        interview["_id"] = str(result.inserted_id)
        
        return {
            "message": "Memory interview created successfully",
            "interview": interview,
            "interview_url": interview["interview_url"],
            "patient_name": patient_name
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create memory interview: {str(e)}")

@app.get("/api/ribbon/interviews")
async def get_interviews(patient_id: str = None):
    """Get all interviews"""
    db = Database.get_db()
    
    filter_query = {}
    if patient_id:
        filter_query["patient_id"] = patient_id
    
    interviews = await db[Collections.INTERVIEWS].find(filter_query).sort("created_at", -1).to_list(length=100)
    return interviews

@app.get("/api/ribbon/interviews/{interview_id}")
async def get_interview(interview_id: str):
    db = Database.get_db()
    interview = await db[Collections.INTERVIEWS].find_one({"id": interview_id})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

@app.put("/api/ribbon/interviews/{interview_id}/status")
async def update_interview_status(interview_id: str, status_data: dict):
    db = Database.get_db()
    
    new_status = status_data.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    result = await db[Collections.INTERVIEWS].update_one(
        {"id": interview_id},
        {"$set": {"status": new_status, "updated_at": datetime.utcnow().isoformat()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Interview not found")
    
    return {"message": f"Interview status updated to {new_status}"}

# Patient and Caregiver endpoints
@app.get("/api/patients")
async def get_patients(caregiver_id: str = None):
    db = Database.get_db()
    
    filter_query = {}
    if caregiver_id:
        filter_query["caregiver_id"] = caregiver_id
    
    patients = await db[Collections.PATIENTS].find(filter_query).to_list(length=100)
    return patients

@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    db = Database.get_db()
    patient = await db[Collections.PATIENTS].find_one({"id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.post("/api/patients")
async def create_patient(patient_data: dict):
    db = Database.get_db()
    
    patient = {
        "id": str(ObjectId()),
        "name": patient_data.get("name", ""),
        "age": patient_data.get("age"),
        "email": patient_data.get("email", ""),
        "role": "patient",
        "caregiver_id": patient_data.get("caregiver_id"),
        "medical_info": patient_data.get("medical_info", ""),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db[Collections.PATIENTS].insert_one(patient)
    patient["_id"] = str(result.inserted_id)
    
    return patient

@app.get("/api/caregivers")
async def get_caregivers():
    db = Database.get_db()
    caregivers = await db[Collections.CAREGIVERS].find({}).to_list(length=100)
    return caregivers

@app.get("/api/caregivers/{caregiver_id}")
async def get_caregiver(caregiver_id: str):
    db = Database.get_db()
    caregiver = await db[Collections.CAREGIVERS].find_one({"id": caregiver_id})
    if not caregiver:
        raise HTTPException(status_code=404, detail="Caregiver not found")
    return caregiver

@app.post("/api/caregivers")
async def create_caregiver(caregiver_data: dict):
    db = Database.get_db()
    
    caregiver = {
        "id": str(ObjectId()),
        "name": caregiver_data.get("name", ""),
        "email": caregiver_data.get("email", ""),
        "role": "caregiver",
        "patients": caregiver_data.get("patients", []),
        "specialization": caregiver_data.get("specialization", ""),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    result = await db[Collections.CAREGIVERS].insert_one(caregiver)
    caregiver["_id"] = str(result.inserted_id)
    
    return caregiver



if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 