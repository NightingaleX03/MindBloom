#!/usr/bin/env python3
"""
Test script for Gemini AI integration
"""

import asyncio
import os
import sys
sys.path.append('.')

from services.interview_analysis import InterviewAnalysisService
from database import Database

async def test_gemini_integration():
    """Test the Gemini AI integration"""
    print("🧪 Testing Gemini AI Integration...")
    
    # Connect to database
    print("🔌 Connecting to database...")
    await Database.connect_db()
    
    # Create the service
    service = InterviewAnalysisService()
    
    # Test response analysis
    test_response = "I remember when my grandmother used to cook Sunday dinner for the whole family. The house would smell amazing with her homemade bread and roast chicken. We would all sit around the big table and share stories."
    test_question = "Tell me about a special family tradition from your childhood."
    
    print(f"📝 Testing with response: {test_response[:50]}...")
    
    # Test find relevant memories
    result = await service.find_relevant_memories(test_response, "1", test_question)
    
    print("✅ Test completed!")
    print(f"📊 Found {len(result.get('relevant_memories', []))} relevant memories")
    print(f"💬 Follow-up: {result.get('suggested_follow_up', 'N/A')}")
    
    if result.get('relevant_memories'):
        for i, memory in enumerate(result['relevant_memories'][:2]):
            print(f"  {i+1}. {memory['memory_title']} (Score: {memory['relevance_score']:.1f})")
    
    # Close database connection
    await Database.close_db()
    
    return result

if __name__ == "__main__":
    asyncio.run(test_gemini_integration()) 