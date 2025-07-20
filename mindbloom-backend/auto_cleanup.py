#!/usr/bin/env python3
"""
Automatic duplicate cleanup for MindBloom database
"""

import asyncio
from database import Database, Collections, init_database

async def auto_cleanup_duplicates():
    """Automatically remove duplicate entries from all collections"""
    print("🧹 Starting automatic duplicate cleanup...")
    
    try:
        # Initialize database connection
        await init_database()
        db = Database.get_db()
        
        total_removed = 0
        
        # Clean up interviews collection
        print("📋 Cleaning interviews collection...")
        interviews = await db[Collections.INTERVIEWS].find({}).to_list(length=None)
        seen_ids = set()
        removed = 0
        
        for interview in interviews:
            interview_id = interview.get('id')
            if interview_id in seen_ids:
                await db[Collections.INTERVIEWS].delete_one({'_id': interview['_id']})
                removed += 1
            else:
                seen_ids.add(interview_id)
        
        print(f"✅ Removed {removed} duplicate interviews")
        total_removed += removed
        
        # Clean up users collection
        print("👥 Cleaning users collection...")
        users = await db[Collections.USERS].find({}).to_list(length=None)
        seen_emails = set()
        removed = 0
        
        for user in users:
            email = user.get('email')
            if email and email in seen_emails:
                await db[Collections.USERS].delete_one({'_id': user['_id']})
                removed += 1
            else:
                if email:
                    seen_emails.add(email)
        
        print(f"✅ Removed {removed} duplicate users")
        total_removed += removed
        
        # Clean up journals collection
        print("📝 Cleaning journals collection...")
        journals = await db[Collections.JOURNALS].find({}).to_list(length=None)
        seen_journals = set()
        removed = 0
        
        for journal in journals:
            unique_key = f"{journal.get('user_id', '')}_{journal.get('title', '')}_{journal.get('created_at', '')}"
            if unique_key in seen_journals:
                await db[Collections.JOURNALS].delete_one({'_id': journal['_id']})
                removed += 1
            else:
                seen_journals.add(unique_key)
        
        print(f"✅ Removed {removed} duplicate journals")
        total_removed += removed
        
        # Clean up memories collection
        print("🧠 Cleaning memories collection...")
        memories = await db[Collections.MEMORIES].find({}).to_list(length=None)
        seen_memories = set()
        removed = 0
        
        for memory in memories:
            unique_key = f"{memory.get('user_id', '')}_{memory.get('title', '')}_{memory.get('created_at', '')}"
            if unique_key in seen_memories:
                await db[Collections.MEMORIES].delete_one({'_id': memory['_id']})
                removed += 1
            else:
                seen_memories.add(unique_key)
        
        print(f"✅ Removed {removed} duplicate memories")
        total_removed += removed
        
        # Clean up calendar collection
        print("📅 Cleaning calendar collection...")
        calendar_events = await db[Collections.CALENDAR].find({}).to_list(length=None)
        seen_events = set()
        removed = 0
        
        for event in calendar_events:
            unique_key = f"{event.get('user_id', '')}_{event.get('title', '')}_{event.get('date', '')}"
            if unique_key in seen_events:
                await db[Collections.CALENDAR].delete_one({'_id': event['_id']})
                removed += 1
            else:
                seen_events.add(unique_key)
        
        print(f"✅ Removed {removed} duplicate calendar events")
        total_removed += removed
        
        # Clean up AI chat collection
        print("🤖 Cleaning AI chat collection...")
        chat_entries = await db[Collections.AI_CHAT].find({}).to_list(length=None)
        seen_chats = set()
        removed = 0
        
        for chat in chat_entries:
            unique_key = f"{chat.get('user_id', '')}_{chat.get('message', '')}_{chat.get('timestamp', '')}"
            if unique_key in seen_chats:
                await db[Collections.AI_CHAT].delete_one({'_id': chat['_id']})
                removed += 1
            else:
                seen_chats.add(unique_key)
        
        print(f"✅ Removed {removed} duplicate AI chat entries")
        total_removed += removed
        
        # Clean up patients collection
        print("🏥 Cleaning patients collection...")
        patients = await db[Collections.PATIENTS].find({}).to_list(length=None)
        seen_patients = set()
        removed = 0
        
        for patient in patients:
            # Create unique key based on name, email, and age
            unique_key = f"{patient.get('name', '')}_{patient.get('email', '')}_{patient.get('age', '')}"
            if unique_key in seen_patients:
                await db[Collections.PATIENTS].delete_one({'_id': patient['_id']})
                removed += 1
            else:
                seen_patients.add(unique_key)
        
        print(f"✅ Removed {removed} duplicate patients")
        total_removed += removed
        
        # Clean up caregivers collection
        print("👨‍⚕️ Cleaning caregivers collection...")
        caregivers = await db[Collections.CAREGIVERS].find({}).to_list(length=None)
        seen_caregivers = set()
        removed = 0
        
        for caregiver in caregivers:
            # Create unique key based on name, email, and specialization
            unique_key = f"{caregiver.get('name', '')}_{caregiver.get('email', '')}_{caregiver.get('specialization', '')}"
            if unique_key in seen_caregivers:
                await db[Collections.CAREGIVERS].delete_one({'_id': caregiver['_id']})
                removed += 1
            else:
                seen_caregivers.add(unique_key)
        
        print(f"✅ Removed {removed} duplicate caregivers")
        total_removed += removed
        
        print(f"\n🎉 Cleanup completed! Removed {total_removed} total duplicates.")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
    finally:
        await Database.close_db()

if __name__ == "__main__":
    asyncio.run(auto_cleanup_duplicates()) 