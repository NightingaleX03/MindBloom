import asyncio
from database import Database, Collections

async def test_memories():
    """Test memories endpoint and database"""
    await Database.connect_db()
    db = Database.get_db()
    
    if db is None:
        print("❌ Database not connected")
        return
    
    print("✅ Database connected")
    
    # Check memories for patient 1
    print("\n🔍 Checking memories for patient 1...")
    memories = await db[Collections.MEMORIES].find({"patient_id": "1"}).to_list(length=None)
    print(f"Found {len(memories)} memories for patient 1")
    
    for memory in memories:
        print(f"  - {memory.get('title', 'Untitled')} (ID: {memory.get('_id')})")
    
    # Check all memories
    print("\n🔍 Checking all memories...")
    all_memories = await db[Collections.MEMORIES].find({}).to_list(length=None)
    print(f"Total memories in database: {len(all_memories)}")
    
    # Check patients
    print("\n🔍 Checking patients...")
    patients = await db[Collections.PATIENTS].find({}).to_list(length=None)
    print(f"Total patients: {len(patients)}")
    
    for patient in patients:
        print(f"  - {patient.get('name', 'Unknown')} (ID: {patient.get('_id')})")
    
    await Database.close_db()

if __name__ == "__main__":
    asyncio.run(test_memories()) 