import asyncio
from database import Database, Collections
from datetime import datetime, timedelta
import random

async def add_more_memories():
    """Add more memories to the database for testing"""
    await Database.connect_db()
    db = Database.get_db()
    
    if db is None:
        print("❌ Database not connected")
        return
    
    print("✅ Database connected")
    
    # Sample memories for different patients
    sample_memories = [
        # Patient 1 - Sarah Johnson
        {
            "title": "Family Dinner at Grandma's",
            "description": "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous apple pie filled the whole house. Everyone was laughing and sharing stories. It was such a warm, loving atmosphere that made me feel so grateful for my family.",
            "mood": "happy",
            "category": "memory",
            "tags": ["family", "grandma", "dinner", "apple pie"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-15T00:00:00Z"
        },
        {
            "title": "Walking in the Park",
            "description": "The beautiful spring day when we walked through the park and saw all the flowers blooming. The air was fresh and the birds were singing. It reminded me of simpler times when life was less complicated.",
            "mood": "calm",
            "category": "reflection",
            "tags": ["nature", "spring", "walking", "peaceful"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-14T00:00:00Z"
        },
        {
            "title": "Morning Coffee Ritual",
            "description": "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
            "mood": "calm",
            "category": "memory",
            "tags": ["coffee", "morning", "porch", "father"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-13T00:00:00Z"
        },
        {
            "title": "Old Photographs Found",
            "description": "Found some old photographs in the attic today. Looking at pictures from my wedding day brought back so many wonderful memories. My wife looked so beautiful in her white dress.",
            "mood": "nostalgic",
            "category": "reflection",
            "tags": ["photographs", "wedding", "wife", "nostalgic"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-12T00:00:00Z"
        },
        {
            "title": "Feeling Lonely Today",
            "description": "Today was a difficult day. I miss my husband so much. The house feels so empty without him. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
            "mood": "sad",
            "category": "reflection",
            "tags": ["husband", "lonely", "missing", "grief"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-11T00:00:00Z"
        },
        {
            "title": "Garden Visit",
            "description": "Spent the afternoon in the garden today. The roses are blooming beautifully. It reminded me of when I used to garden with my mother. She taught me everything about plants and flowers.",
            "mood": "happy",
            "category": "memory",
            "tags": ["garden", "roses", "mother", "flowers"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-10T00:00:00Z"
        },
        {
            "title": "Baking Cookies",
            "description": "Decided to bake some chocolate chip cookies today. The smell reminded me of when my children were little and we would bake together. They always loved licking the spoon!",
            "mood": "happy",
            "category": "memory",
            "tags": ["baking", "cookies", "children", "chocolate"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-09T00:00:00Z"
        },
        {
            "title": "Rainy Day Thoughts",
            "description": "It's raining today and I'm sitting by the window watching the drops fall. It's so peaceful. Reminds me of rainy days when I was a child, reading books under a blanket.",
            "mood": "calm",
            "category": "reflection",
            "tags": ["rain", "window", "peaceful", "childhood"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-08T00:00:00Z"
        },
        {
            "title": "Phone Call from Daughter",
            "description": "Had a wonderful phone call with my daughter today. She told me about her new job and how well things are going. I'm so proud of her and all she's accomplished.",
            "mood": "excited",
            "category": "memory",
            "tags": ["daughter", "phone call", "proud", "job"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-07T00:00:00Z"
        },
        {
            "title": "Feeling Anxious",
            "description": "Today I felt a bit anxious about my upcoming doctor's appointment. I know it's probably nothing to worry about, but I can't help feeling nervous about medical things.",
            "mood": "anxious",
            "category": "reflection",
            "tags": ["doctor", "appointment", "nervous", "medical"],
            "patient_id": "1",
            "user_id": "1",
            "created_at": "2024-01-06T00:00:00Z"
        },
        
        # Patient 2 - Robert Smith
        {
            "title": "Morning Coffee Ritual",
            "description": "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
            "mood": "calm",
            "category": "memory",
            "tags": ["coffee", "morning", "porch", "father"],
            "patient_id": "2",
            "user_id": "2",
            "created_at": "2024-01-15T00:00:00Z"
        },
        {
            "title": "Old Photographs Found",
            "description": "Found some old photographs in the attic today. Looking at pictures from my wedding day brought back so many wonderful memories. My wife looked so beautiful in her white dress.",
            "mood": "nostalgic",
            "category": "reflection",
            "tags": ["photographs", "wedding", "wife", "nostalgic"],
            "patient_id": "2",
            "user_id": "2",
            "created_at": "2024-01-14T00:00:00Z"
        },
        {
            "title": "Feeling Lonely Today",
            "description": "Today was a difficult day. I miss my wife so much. The house feels so empty without her. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
            "mood": "sad",
            "category": "reflection",
            "tags": ["wife", "lonely", "missing", "grief"],
            "patient_id": "2",
            "user_id": "2",
            "created_at": "2024-01-13T00:00:00Z"
        },
        {
            "title": "Garden Visit",
            "description": "Spent the afternoon in the garden today. The roses are blooming beautifully. It reminded me of when I used to garden with my wife. She taught me everything about plants and flowers.",
            "mood": "happy",
            "category": "memory",
            "tags": ["garden", "roses", "wife", "flowers"],
            "patient_id": "2",
            "user_id": "2",
            "created_at": "2024-01-12T00:00:00Z"
        },
        {
            "title": "Baking Cookies",
            "description": "Decided to bake some chocolate chip cookies today. The smell reminded me of when my children were little and we would bake together. They always loved licking the spoon!",
            "mood": "happy",
            "category": "memory",
            "tags": ["baking", "cookies", "children", "chocolate"],
            "patient_id": "2",
            "user_id": "2",
            "created_at": "2024-01-11T00:00:00Z"
        },
        
        # Patient 3 - Margaret Davis
        {
            "title": "Feeling Lonely Today",
            "description": "Today was a difficult day. I miss my husband so much. The house feels so empty without him. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
            "mood": "sad",
            "category": "reflection",
            "tags": ["husband", "lonely", "missing", "grief"],
            "patient_id": "3",
            "user_id": "3",
            "created_at": "2024-01-15T00:00:00Z"
        },
        {
            "title": "Phone Call from Son",
            "description": "Had a wonderful phone call with my son today. He told me about his new job and how well things are going. I'm so proud of him and all he's accomplished.",
            "mood": "excited",
            "category": "memory",
            "tags": ["son", "phone call", "proud", "job"],
            "patient_id": "3",
            "user_id": "3",
            "created_at": "2024-01-14T00:00:00Z"
        },
        {
            "title": "Feeling Anxious",
            "description": "Today I felt a bit anxious about my upcoming doctor's appointment. I know it's probably nothing to worry about, but I can't help feeling nervous about medical things.",
            "mood": "anxious",
            "category": "reflection",
            "tags": ["doctor", "appointment", "nervous", "medical"],
            "patient_id": "3",
            "user_id": "3",
            "created_at": "2024-01-13T00:00:00Z"
        },
        {
            "title": "Rainy Day Thoughts",
            "description": "It's raining today and I'm sitting by the window watching the drops fall. It's so peaceful. Reminds me of rainy days when I was a child, reading books under a blanket.",
            "mood": "calm",
            "category": "reflection",
            "tags": ["rain", "window", "peaceful", "childhood"],
            "patient_id": "3",
            "user_id": "3",
            "created_at": "2024-01-12T00:00:00Z"
        },
        {
            "title": "Baking Bread",
            "description": "Decided to bake some bread today. The smell reminded me of when my mother used to bake fresh bread every Sunday. The house always smelled so wonderful.",
            "mood": "happy",
            "category": "memory",
            "tags": ["baking", "bread", "mother", "sunday"],
            "patient_id": "3",
            "user_id": "3",
            "created_at": "2024-01-11T00:00:00Z"
        }
    ]
    
    # Add memories to database
    for memory in sample_memories:
        memory["id"] = str(memory["_id"]) if "_id" in memory else None
        memory["updated_at"] = memory["created_at"]
        
        # Remove _id if it exists (let MongoDB generate it)
        if "_id" in memory:
            del memory["_id"]
        
        result = await db[Collections.MEMORIES].insert_one(memory)
        print(f"✅ Added memory: {memory['title']} for patient {memory['patient_id']}")
    
    print(f"\n🎉 Successfully added {len(sample_memories)} memories to the database!")
    
    # Check total memories now
    total_memories = await db[Collections.MEMORIES].count_documents({})
    print(f"📊 Total memories in database: {total_memories}")
    
    await Database.close_db()

if __name__ == "__main__":
    asyncio.run(add_more_memories()) 