#!/usr/bin/env python3
"""
Script to clean up duplicate entries in MongoDB collections
"""

import asyncio
from database import Database, Collections, init_database
from bson import ObjectId

async def cleanup_duplicates():
    """Remove duplicate entries from all collections"""
    print("🧹 Starting duplicate cleanup...")
    
    try:
        # Initialize database connection
        await init_database()
        db = Database.get_db()
        
        # Clean up interviews collection
        print("📋 Cleaning interviews collection...")
        interviews = await db[Collections.INTERVIEWS].find({}).to_list(length=None)
        seen_ids = set()
        duplicates_removed = 0
        
        for interview in interviews:
            interview_id = interview.get('id')
            if interview_id in seen_ids:
                # Remove duplicate
                await db[Collections.INTERVIEWS].delete_one({'_id': interview['_id']})
                duplicates_removed += 1
            else:
                seen_ids.add(interview_id)
        
        print(f"✅ Removed {duplicates_removed} duplicate interviews")
        
        # Clean up users collection
        print("👥 Cleaning users collection...")
        users = await db[Collections.USERS].find({}).to_list(length=None)
        seen_emails = set()
        duplicates_removed = 0
        
        for user in users:
            email = user.get('email')
            if email and email in seen_emails:
                # Remove duplicate
                await db[Collections.USERS].delete_one({'_id': user['_id']})
                duplicates_removed += 1
            else:
                if email:
                    seen_emails.add(email)
        
        print(f"✅ Removed {duplicates_removed} duplicate users")
        
        # Clean up journals collection
        print("📝 Cleaning journals collection...")
        journals = await db[Collections.JOURNALS].find({}).to_list(length=None)
        seen_journals = set()
        duplicates_removed = 0
        
        for journal in journals:
            # Create unique key based on user_id, title, and created_at
            unique_key = f"{journal.get('user_id', '')}_{journal.get('title', '')}_{journal.get('created_at', '')}"
            if unique_key in seen_journals:
                # Remove duplicate
                await db[Collections.JOURNALS].delete_one({'_id': journal['_id']})
                duplicates_removed += 1
            else:
                seen_journals.add(unique_key)
        
        print(f"✅ Removed {duplicates_removed} duplicate journals")
        
        # Clean up memories collection
        print("🧠 Cleaning memories collection...")
        memories = await db[Collections.MEMORIES].find({}).to_list(length=None)
        seen_memories = set()
        duplicates_removed = 0
        
        for memory in memories:
            # Create unique key based on user_id, title, and created_at
            unique_key = f"{memory.get('user_id', '')}_{memory.get('title', '')}_{memory.get('created_at', '')}"
            if unique_key in seen_memories:
                # Remove duplicate
                await db[Collections.MEMORIES].delete_one({'_id': memory['_id']})
                duplicates_removed += 1
            else:
                seen_memories.add(unique_key)
        
        print(f"✅ Removed {duplicates_removed} duplicate memories")
        
        # Clean up calendar collection
        print("📅 Cleaning calendar collection...")
        calendar_events = await db[Collections.CALENDAR].find({}).to_list(length=None)
        seen_events = set()
        duplicates_removed = 0
        
        for event in calendar_events:
            # Create unique key based on user_id, title, and date
            unique_key = f"{event.get('user_id', '')}_{event.get('title', '')}_{event.get('date', '')}"
            if unique_key in seen_events:
                # Remove duplicate
                await db[Collections.CALENDAR].delete_one({'_id': event['_id']})
                duplicates_removed += 1
            else:
                seen_events.add(unique_key)
        
        print(f"✅ Removed {duplicates_removed} duplicate calendar events")
        
        # Clean up AI chat collection
        print("🤖 Cleaning AI chat collection...")
        chat_entries = await db[Collections.AI_CHAT].find({}).to_list(length=None)
        seen_chats = set()
        duplicates_removed = 0
        
        for chat in chat_entries:
            # Create unique key based on user_id, message, and timestamp
            unique_key = f"{chat.get('user_id', '')}_{chat.get('message', '')}_{chat.get('timestamp', '')}"
            if unique_key in seen_chats:
                # Remove duplicate
                await db[Collections.AI_CHAT].delete_one({'_id': chat['_id']})
                duplicates_removed += 1
            else:
                seen_chats.add(unique_key)
        
        print(f"✅ Removed {duplicates_removed} duplicate AI chat entries")
        
        # Clean up patients collection
        print("🏥 Cleaning patients collection...")
        patients = await db[Collections.PATIENTS].find({}).to_list(length=None)
        seen_patients = set()
        duplicates_removed = 0
        
        for patient in patients:
            # Create unique key based on name, email, and age
            unique_key = f"{patient.get('name', '')}_{patient.get('email', '')}_{patient.get('age', '')}"
            if unique_key in seen_patients:
                await db[Collections.PATIENTS].delete_one({'_id': patient['_id']})
                duplicates_removed += 1
            else:
                seen_patients.add(unique_key)
        
        print(f"✅ Removed {duplicates_removed} duplicate patients")
        
        # Clean up caregivers collection
        print("👨‍⚕️ Cleaning caregivers collection...")
        caregivers = await db[Collections.CAREGIVERS].find({}).to_list(length=None)
        seen_caregivers = set()
        duplicates_removed = 0
        
        for caregiver in caregivers:
            # Create unique key based on name, email, and specialization
            unique_key = f"{caregiver.get('name', '')}_{caregiver.get('email', '')}_{caregiver.get('specialization', '')}"
            if unique_key in seen_caregivers:
                await db[Collections.CAREGIVERS].delete_one({'_id': caregiver['_id']})
                duplicates_removed += 1
            else:
                seen_caregivers.add(unique_key)
        
        print(f"✅ Removed {duplicates_removed} duplicate caregivers")
        
        # Print summary
        print("\n🎉 Duplicate cleanup completed!")
        print("📊 Database is now clean and optimized.")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
    finally:
        # Close database connection
        await Database.close_db()

async def show_collection_stats():
    """Show current collection statistics"""
    try:
        await init_database()
        db = Database.get_db()
        
        print("\n📊 Current Database Statistics:")
        print("=" * 40)
        
        collections = [
            Collections.USERS,
            Collections.JOURNALS, 
            Collections.MEMORIES,
            Collections.CALENDAR,
            Collections.INTERVIEWS,
            Collections.AI_CHAT,
            Collections.PATIENTS,
            Collections.CAREGIVERS
        ]
        
        for collection_name in collections:
            count = await db[collection_name].count_documents({})
            print(f"{collection_name:15}: {count:3} documents")
        
        print("=" * 40)
        
    except Exception as e:
        print(f"❌ Error getting stats: {e}")
    finally:
        await Database.close_db()

if __name__ == "__main__":
    print("🧹 MindBloom Database Cleanup Tool")
    print("=" * 40)
    
    # Show current stats
    asyncio.run(show_collection_stats())
    
    # Ask user if they want to proceed
    response = input("\nDo you want to remove duplicates? (y/N): ")
    if response.lower() in ['y', 'yes']:
        asyncio.run(cleanup_duplicates())
        print("\n📊 Final Statistics:")
        asyncio.run(show_collection_stats())
    else:
        print("❌ Cleanup cancelled.") 