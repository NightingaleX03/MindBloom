from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

    @classmethod
    async def connect_db(cls):
        """Create database connection."""
        # MongoDB connection string
        mongodb_url = os.getenv(
            "MONGODB_URL", 
            "mongodb+srv://tester1:tester1@cluster0.pjvmo7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        )
        
        # Add SSL configuration to handle certificate issues
        cls.client = AsyncIOMotorClient(
            mongodb_url,
            tlsAllowInvalidCertificates=True,
            tlsAllowInvalidHostnames=True
        )
        cls.database = cls.client.mindbloom_db
        
        # Test the connection
        try:
            await cls.client.admin.command('ping')
            print("✅ Successfully connected to MongoDB!")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
            # Don't raise the exception, just log it
            print("⚠️ Continuing with limited functionality...")

    @classmethod
    async def close_db(cls):
        """Close database connection."""
        if cls.client:
            cls.client.close()
            print("🔌 MongoDB connection closed.")

    @classmethod
    def get_db(cls) -> AsyncIOMotorDatabase:
        """Get database instance."""
        if cls.database is None:
            raise Exception("Database not connected. Call connect_db() first.")
        return cls.database

# Database collections
class Collections:
    USERS = "users"
    JOURNALS = "journals"
    MEMORIES = "memories"
    CALENDAR = "calendar"
    MEDIA = "media"
    INTERVIEWS = "interviews"
    INTERVIEW_FLOWS = "interview_flows"
    AI_CHAT = "ai_chat"
    AI_TRAINING = "ai_training"
    PATIENTS = "patients"
    CAREGIVERS = "caregivers"

# Initialize database connection
async def init_database():
    await Database.connect_db()
    await create_indexes()

async def create_indexes():
    """Create database indexes for better performance."""
    try:
        db = Database.get_db()
        
        # Users collection indexes
        await db[Collections.USERS].create_index("auth0_id", unique=True)
        await db[Collections.USERS].create_index("email")
        
        # Journals collection indexes
        await db[Collections.JOURNALS].create_index("user_id")
        await db[Collections.JOURNALS].create_index("created_at")
        await db[Collections.JOURNALS].create_index("mood")
        
        # Memories collection indexes
        await db[Collections.MEMORIES].create_index("user_id")
        await db[Collections.MEMORIES].create_index("created_at")
        await db[Collections.MEMORIES].create_index("category")
        
        # Calendar collection indexes
        await db[Collections.CALENDAR].create_index("user_id")
        await db[Collections.CALENDAR].create_index("date")
        await db[Collections.CALENDAR].create_index("event_type")
        
        # Interviews collection indexes
        await db[Collections.INTERVIEWS].create_index("patient_id")
        await db[Collections.INTERVIEWS].create_index("status")
        await db[Collections.INTERVIEWS].create_index("created_at")
        
        # AI Chat collection indexes
        await db[Collections.AI_CHAT].create_index("user_id")
        await db[Collections.AI_CHAT].create_index("created_at")
        
        print("✅ Database indexes created successfully!")
    except Exception as e:
        print(f"⚠️ Could not create database indexes: {e}")
        print("⚠️ Continuing without indexes...")

async def migrate_existing_data():
    """Migrate existing JSON data to MongoDB (only if collections are empty)."""
    import json
    from pathlib import Path
    
    data_dir = Path("data")
    db = Database.get_db()
    
    # Check if we already have data in collections
    users_count = await db[Collections.USERS].count_documents({})
    journals_count = await db[Collections.JOURNALS].count_documents({})
    memories_count = await db[Collections.MEMORIES].count_documents({})
    calendar_count = await db[Collections.CALENDAR].count_documents({})
    interviews_count = await db[Collections.INTERVIEWS].count_documents({})
    media_count = await db[Collections.MEDIA].count_documents({})
    
    # Only migrate if collections are empty
    if users_count > 0 or journals_count > 0 or memories_count > 0 or calendar_count > 0 or interviews_count > 0 or media_count > 0:
        print("ℹ️ Database already contains data, skipping JSON migration")
        return
    
    print("📦 Migrating JSON data to MongoDB...")
    
    # Migrate users
    try:
        with open(data_dir / "users.json", 'r') as f:
            users_data = json.load(f)
            if users_data:
                await db[Collections.USERS].insert_many(users_data)
                print(f"✅ Migrated {len(users_data)} users to MongoDB")
    except FileNotFoundError:
        print("ℹ️ No existing users.json found")
    
    # Migrate journals
    try:
        with open(data_dir / "journals.json", 'r') as f:
            journals_data = json.load(f)
            if journals_data:
                await db[Collections.JOURNALS].insert_many(journals_data)
                print(f"✅ Migrated {len(journals_data)} journals to MongoDB")
    except FileNotFoundError:
        print("ℹ️ No existing journals.json found")
    
    # Migrate memories
    try:
        with open(data_dir / "memories.json", 'r') as f:
            memories_data = json.load(f)
            if memories_data:
                await db[Collections.MEMORIES].insert_many(memories_data)
                print(f"✅ Migrated {len(memories_data)} memories to MongoDB")
    except FileNotFoundError:
        print("ℹ️ No existing memories.json found")
    
    # Migrate calendar
    try:
        with open(data_dir / "calendar.json", 'r') as f:
            calendar_data = json.load(f)
            if calendar_data:
                await db[Collections.CALENDAR].insert_many(calendar_data)
                print(f"✅ Migrated {len(calendar_data)} calendar events to MongoDB")
    except FileNotFoundError:
        print("ℹ️ No existing calendar.json found")
    
    # Migrate interviews
    try:
        with open(data_dir / "interviews.json", 'r') as f:
            interviews_data = json.load(f)
            if interviews_data:
                await db[Collections.INTERVIEWS].insert_many(interviews_data)
                print(f"✅ Migrated {len(interviews_data)} interviews to MongoDB")
    except FileNotFoundError:
        print("ℹ️ No existing interviews.json found")
    
    # Migrate media
    try:
        with open(data_dir / "media.json", 'r') as f:
            media_data = json.load(f)
            if media_data:
                await db[Collections.MEDIA].insert_many(media_data)
                print(f"✅ Migrated {len(media_data)} media files to MongoDB")
    except FileNotFoundError:
        print("ℹ️ No existing media.json found")
    
    print("🎉 Data migration completed!")

async def seed_initial_data():
    """Seed initial data for testing."""
    db = Database.get_db()
    
    # Check if we already have data in any collection
    patients_count = await db[Collections.PATIENTS].count_documents({})
    caregivers_count = await db[Collections.CAREGIVERS].count_documents({})
    memories_count = await db[Collections.MEMORIES].count_documents({})
    calendar_count = await db[Collections.CALENDAR].count_documents({})
    
    if patients_count > 0 or caregivers_count > 0 or memories_count > 0 or calendar_count > 0:
        print("ℹ️ Database already has data, skipping seed")
        return
    
    # Seed sample patients
    sample_patients = [
        {
            "id": "1",
            "name": "Sarah Johnson",
            "age": 78,
            "email": "sarah.johnson@example.com",
            "role": "patient",
            "caregiver_id": "caregiver-1",
            "medical_info": "Mild dementia, loves gardening",
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "2", 
            "name": "Robert Smith",
            "age": 82,
            "email": "robert.smith@example.com",
            "role": "patient",
            "caregiver_id": "caregiver-1",
            "medical_info": "Moderate dementia, enjoys music",
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "id": "3",
            "name": "Margaret Davis", 
            "age": 75,
            "email": "margaret.davis@example.com",
            "role": "patient",
            "caregiver_id": "caregiver-1",
            "medical_info": "Early stage dementia, loves cooking",
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
    
    await db[Collections.PATIENTS].insert_many(sample_patients)
    print(f"✅ Seeded {len(sample_patients)} sample patients")
    
    # Seed sample caregivers
    sample_caregivers = [
        {
            "id": "caregiver-1",
            "name": "Dr. Emily Wilson",
            "email": "emily.wilson@mindbloom.com",
            "role": "caregiver",
            "patients": ["1", "2", "3"],
            "specialization": "Dementia Care",
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
    
    await db[Collections.CAREGIVERS].insert_many(sample_caregivers)
    print(f"✅ Seeded {len(sample_caregivers)} sample caregivers")
    
    # Seed sample memories
    sample_memories = [
        {
            "user_id": "1",
            "title": "Family Dinner at Grandma's",
            "content": "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous apple pie filled the whole house. Everyone was laughing and sharing stories. It was such a warm, loving atmosphere that made me feel so grateful for my family.",
            "mood": "happy",
            "type": "memory",
            "tags": ["family", "grandma", "dinner", "apple pie"],
            "date": "2024-01-15",
            "is_pinned": True,
            "patient_id": "1",
            "created_at": "2024-01-15T00:00:00Z"
        },
        {
            "user_id": "1",
            "title": "Walking in the Park",
            "content": "The beautiful spring day when we walked through the park and saw all the flowers blooming. The air was fresh and the birds were singing. It reminded me of simpler times when life was less complicated.",
            "mood": "calm",
            "type": "reflection",
            "tags": ["nature", "spring", "walking", "peaceful"],
            "date": "2024-01-14",
            "patient_id": "1",
            "created_at": "2024-01-14T00:00:00Z"
        },
        {
            "user_id": "2",
            "title": "Morning Coffee Ritual",
            "content": "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
            "mood": "calm",
            "type": "memory",
            "tags": ["coffee", "morning", "porch", "father"],
            "date": "2024-01-15",
            "is_pinned": True,
            "patient_id": "2",
            "created_at": "2024-01-15T00:00:00Z"
        }
    ]
    
    await db[Collections.MEMORIES].insert_many(sample_memories)
    print(f"✅ Seeded {len(sample_memories)} sample memories")
    
    # Seed sample calendar events
    sample_events = [
        {
            "user_id": "1",
            "title": "Morning Medication",
            "description": "Take morning medication with breakfast",
            "date": "2024-01-20",
            "start_time": "09:00",
            "end_time": "09:15",
            "event_type": "medication",
            "priority": "high",
            "completed": False,
            "patient_id": "1",
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "user_id": "1",
            "title": "Afternoon Walk",
            "description": "Gentle walk in the garden",
            "date": "2024-01-20",
            "start_time": "14:00",
            "end_time": "15:00",
            "event_type": "activity",
            "priority": "medium",
            "completed": False,
            "patient_id": "1",
            "created_at": "2024-01-01T00:00:00Z"
        },
        {
            "user_id": "1",
            "title": "Evening Medication",
            "description": "Take evening medication",
            "date": "2024-01-20",
            "start_time": "20:00",
            "end_time": "20:15",
            "event_type": "medication",
            "priority": "high",
            "completed": False,
            "patient_id": "1",
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
    
    await db[Collections.CALENDAR].insert_many(sample_events)
    print(f"✅ Seeded {len(sample_events)} sample calendar events")
    
    print("🎉 Initial data seeding completed!") 