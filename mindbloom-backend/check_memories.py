import asyncio
from database import Database, Collections

async def check_memories():
    """Check the actual structure of memories in the database"""
    await Database.connect_db()
    db = Database.get_db()
    
    if db is None:
        print("❌ Database not connected")
        return
    
    print("✅ Database connected")
    
    # Check all memories
    print("\n🔍 Checking all memories...")
    all_memories = await db[Collections.MEMORIES].find({}).to_list(length=None)
    print(f"Total memories in database: {len(all_memories)}")
    
    for i, memory in enumerate(all_memories):
        print(f"\nMemory {i+1}:")
        print(f"  _id: {memory.get('_id')}")
        print(f"  title: {memory.get('title', 'N/A')}")
        print(f"  patient_id: {memory.get('patient_id', 'N/A')}")
        print(f"  user_id: {memory.get('user_id', 'N/A')}")
        print(f"  description: {memory.get('description', 'N/A')[:50]}...")
        print(f"  mood: {memory.get('mood', 'N/A')}")
        print(f"  category: {memory.get('category', 'N/A')}")
        print(f"  created_at: {memory.get('created_at', 'N/A')}")
    
    await Database.close_db()

if __name__ == "__main__":
    asyncio.run(check_memories()) 