#!/usr/bin/env python3
"""
Script to add unique indexes to prevent future duplicates
"""

import asyncio
from database import Database, Collections, init_database

async def add_unique_indexes():
    """Add unique indexes to prevent future duplicates"""
    print("🔒 Adding unique indexes to prevent duplicates...")
    
    try:
        # Initialize database connection
        await init_database()
        db = Database.get_db()
        
        # Add unique indexes
        print("📋 Adding unique index to interviews collection...")
        try:
            await db[Collections.INTERVIEWS].create_index("id", unique=True)
            print("✅ Unique index added to interviews.id")
        except Exception as e:
            print(f"⚠️ Could not add unique index to interviews: {e}")
        
        print("👥 Adding unique index to users collection...")
        try:
            await db[Collections.USERS].create_index("email", unique=True)
            print("✅ Unique index added to users.email")
        except Exception as e:
            print(f"⚠️ Could not add unique index to users: {e}")
        
        print("📝 Adding compound unique index to journals collection...")
        try:
            await db[Collections.JOURNALS].create_index([
                ("user_id", 1),
                ("title", 1),
                ("created_at", 1)
            ], unique=True)
            print("✅ Compound unique index added to journals")
        except Exception as e:
            print(f"⚠️ Could not add unique index to journals: {e}")
        
        print("🧠 Adding compound unique index to memories collection...")
        try:
            await db[Collections.MEMORIES].create_index([
                ("user_id", 1),
                ("title", 1),
                ("created_at", 1)
            ], unique=True)
            print("✅ Compound unique index added to memories")
        except Exception as e:
            print(f"⚠️ Could not add unique index to memories: {e}")
        
        print("📅 Adding compound unique index to calendar collection...")
        try:
            await db[Collections.CALENDAR].create_index([
                ("user_id", 1),
                ("title", 1),
                ("date", 1)
            ], unique=True)
            print("✅ Compound unique index added to calendar")
        except Exception as e:
            print(f"⚠️ Could not add unique index to calendar: {e}")
        
        print("🤖 Adding compound unique index to AI chat collection...")
        try:
            await db[Collections.AI_CHAT].create_index([
                ("user_id", 1),
                ("message", 1),
                ("timestamp", 1)
            ], unique=True)
            print("✅ Compound unique index added to AI chat")
        except Exception as e:
            print(f"⚠️ Could not add unique index to AI chat: {e}")
        
        print("🏥 Adding compound unique index to patients collection...")
        try:
            await db[Collections.PATIENTS].create_index([
                ("name", 1),
                ("email", 1),
                ("age", 1)
            ], unique=True)
            print("✅ Compound unique index added to patients")
        except Exception as e:
            print(f"⚠️ Could not add unique index to patients: {e}")
        
        print("👨‍⚕️ Adding compound unique index to caregivers collection...")
        try:
            await db[Collections.CAREGIVERS].create_index([
                ("name", 1),
                ("email", 1),
                ("specialization", 1)
            ], unique=True)
            print("✅ Compound unique index added to caregivers")
        except Exception as e:
            print(f"⚠️ Could not add unique index to caregivers: {e}")
        
        print("\n🎉 Unique indexes added successfully!")
        print("🔒 Future duplicates will be prevented automatically.")
        
    except Exception as e:
        print(f"❌ Error adding indexes: {e}")
    finally:
        await Database.close_db()

if __name__ == "__main__":
    asyncio.run(add_unique_indexes()) 