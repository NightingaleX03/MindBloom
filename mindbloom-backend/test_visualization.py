import asyncio
import json
from main import Database, Collections
from bson import ObjectId

async def test_visualization_with_image():
    """Test visualization generation with image for a new memory"""
    
    # Initialize database connection
    await Database.connect_db()
    db = Database.get_db()
    
    # Create a new test memory
    test_memory = {
        "id": str(ObjectId()),
        "title": "Sunset at the Beach",
        "description": "Watching the sun set over the ocean, feeling peaceful and grateful for this beautiful moment.",
        "mood": "calm",
        "category": "memory",
        "tags": ["beach", "sunset", "peaceful"],
        "patient_id": "1",
        "user_id": "1",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    }
    
    # Insert the memory
    result = await db[Collections.MEMORIES].insert_one(test_memory)
    memory_id = str(result.inserted_id)
    
    print(f"✅ Created test memory with ID: {memory_id}")
    print(f"   Title: {test_memory['title']}")
    print(f"   Mood: {test_memory['mood']}")
    
    # Test visualization generation
    from main import gemini_ai
    visualization = await gemini_ai.generate_memory_visualization(
        test_memory['description'],
        test_memory['title'],
        test_memory['mood']
    )
    
    print(f"\n🎨 Generated visualization:")
    print(f"   Image URL: {visualization.get('image_url', 'None')}")
    print(f"   Image Prompt: {visualization.get('image_prompt', 'None')}")
    print(f"   Visual Description: {visualization.get('visual_description', 'None')[:100]}...")
    print(f"   Scene Elements: {visualization.get('scene_elements', [])}")
    
    # Clean up - delete the test memory
    await db[Collections.MEMORIES].delete_one({"_id": ObjectId(memory_id)})
    print(f"\n🧹 Cleaned up test memory")
    
    return memory_id, visualization

if __name__ == "__main__":
    asyncio.run(test_visualization_with_image()) 