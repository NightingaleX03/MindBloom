#!/usr/bin/env python3
"""
Test MongoDB Atlas connection
Run this script to verify your MongoDB Atlas setup
"""

import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

async def test_mongodb_connection():
    """Test MongoDB Atlas connection"""
    print("🔍 Testing MongoDB Atlas connection...")
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv("MONGODB_URI")
    
    if not mongodb_uri:
        print("❌ MONGODB_URI not found in .env file")
        print("Please add your MongoDB Atlas connection string to .env file")
        return False
    
    try:
        # Create client
        client = AsyncIOMotorClient(mongodb_uri)
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Test database access
        db = client.mindbloom
        collections = await db.list_collection_names()
        print(f"📊 Database 'mindbloom' accessible")
        print(f"📁 Collections: {collections}")
        
        # Close connection
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your MONGODB_URI in .env file")
        print("2. Make sure your IP is whitelisted in MongoDB Atlas")
        print("3. Verify your username and password are correct")
        print("4. Check if your cluster is running")
        return False

async def create_sample_data():
    """Create sample data to test database operations"""
    print("\n📝 Creating sample data...")
    
    mongodb_uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(mongodb_uri)
    db = client.mindbloom
    
    try:
        # Create sample user
        user_data = {
            "auth0_id": "test_user_123",
            "email": "test@mindbloom.com",
            "name": "Test User",
            "role": "user",
            "created_at": "2024-01-01T00:00:00Z"
        }
        
        result = await db.users.insert_one(user_data)
        print(f"✅ Created test user with ID: {result.inserted_id}")
        
        # Create sample journal entry
        journal_data = {
            "user_id": str(result.inserted_id),
            "title": "My First Memory",
            "content": "Today I remembered playing in the garden as a child...",
            "mood": "happy",
            "created_at": "2024-01-01T10:00:00Z"
        }
        
        result = await db.journal_entries.insert_one(journal_data)
        print(f"✅ Created test journal entry with ID: {result.inserted_id}")
        
        # Clean up test data
        await db.users.delete_one({"auth0_id": "test_user_123"})
        await db.journal_entries.delete_one({"user_id": str(result.inserted_id)})
        print("🧹 Cleaned up test data")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        client.close()
        return False

async def main():
    """Main test function"""
    print("🚀 MindBloom MongoDB Atlas Test")
    print("=" * 40)
    
    # Test connection
    connection_ok = await test_mongodb_connection()
    
    if connection_ok:
        # Test database operations
        await create_sample_data()
        print("\n🎉 All tests passed! MongoDB Atlas is ready to use.")
    else:
        print("\n❌ Please fix the connection issues before proceeding.")

if __name__ == "__main__":
    asyncio.run(main()) 