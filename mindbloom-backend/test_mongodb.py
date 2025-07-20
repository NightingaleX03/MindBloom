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
    """Test MongoDB connection and basic operations"""
    try:
        # Get MongoDB connection string
        mongodb_url = os.getenv(
            "MONGODB_URL", 
            "mongodb+srv://tester1:tester1@cluster0.pjvmo7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        )
        
        print("🔌 Testing MongoDB connection...")
        
        # Create client
        client = AsyncIOMotorClient(mongodb_url)
        db = client.mindbloom_db
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Test basic operations
        print("🧪 Testing basic database operations...")
        
        # Test collection creation
        test_collection = db.test_collection
        await test_collection.insert_one({"test": "data", "timestamp": "2024-01-01"})
        print("✅ Insert operation successful!")
        
        # Test find operation
        result = await test_collection.find_one({"test": "data"})
        if result:
            print("✅ Find operation successful!")
        
        # Test update operation
        await test_collection.update_one(
            {"test": "data"}, 
            {"$set": {"updated": True}}
        )
        print("✅ Update operation successful!")
        
        # Test delete operation
        await test_collection.delete_one({"test": "data"})
        print("✅ Delete operation successful!")
        
        # Close connection
        client.close()
        print("🎉 All MongoDB operations successful!")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoDB test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_mongodb_connection()) 