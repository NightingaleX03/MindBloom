#!/usr/bin/env python3
"""
Test script to compare fallback vs AI analysis
"""

import asyncio
import os
import sys
sys.path.append('.')

from services.interview_analysis import InterviewAnalysisService
from database import Database

async def test_analysis_comparison():
    """Test the difference between fallback and AI analysis"""
    print("🧪 Testing Analysis Comparison...")
    
    # Connect to database
    print("🔌 Connecting to database...")
    await Database.connect_db()
    
    # Test response
    test_response = "I remember when my grandmother used to cook Sunday dinner for the whole family. The house would smell amazing with her homemade bread and roast chicken. We would all sit around the big table and share stories."
    test_question = "Tell me about a special family tradition from your childhood."
    
    print(f"📝 Test response: {test_response[:50]}...")
    print()
    
    # Test 1: Without Gemini API key (fallback)
    print("🔍 TEST 1: Fallback Analysis (No Gemini API Key)")
    os.environ.pop("GEMINI_API_KEY", None)  # Remove API key
    service1 = InterviewAnalysisService()
    
    result1 = await service1.find_relevant_memories(test_response, "1", test_question)
    
    print(f"📊 Found {len(result1.get('relevant_memories', []))} relevant memories")
    print(f"💬 Follow-up: {result1.get('suggested_follow_up', 'N/A')}")
    print(f"🎯 Analysis type: {type(result1.get('analysis', {})).__name__}")
    print()
    
    # Test 2: With mock Gemini API key (HTTP requests)
    print("🤖 TEST 2: AI Analysis (With Gemini API Key)")
    os.environ["GEMINI_API_KEY"] = "test-key-for-demo"  # Set mock key
    service2 = InterviewAnalysisService()
    
    result2 = await service2.find_relevant_memories(test_response, "1", test_question)
    
    print(f"📊 Found {len(result2.get('relevant_memories', []))} relevant memories")
    print(f"💬 Follow-up: {result2.get('suggested_follow_up', 'N/A')}")
    print(f"🎯 Analysis type: {type(result2.get('analysis', {})).__name__}")
    print()
    
    # Compare results
    print("📈 COMPARISON:")
    print(f"Fallback memories found: {len(result1.get('relevant_memories', []))}")
    print(f"AI memories found: {len(result2.get('relevant_memories', []))}")
    
    if result1.get('relevant_memories') and result2.get('relevant_memories'):
        print("\n🏆 Top memory comparison:")
        fallback_top = result1['relevant_memories'][0]
        ai_top = result2['relevant_memories'][0]
        print(f"Fallback: {fallback_top['memory_title']} (Score: {fallback_top['relevance_score']:.1f})")
        print(f"AI: {ai_top['memory_title']} (Score: {ai_top['relevance_score']:.1f})")
    
    # Close database connection
    await Database.close_db()
    
    return result1, result2

if __name__ == "__main__":
    asyncio.run(test_analysis_comparison()) 