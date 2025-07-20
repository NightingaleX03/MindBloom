#!/usr/bin/env python3
"""
Script to set up Gemini API key
"""

import os
import sys

def set_gemini_key():
    """Set up Gemini API key"""
    print("🔑 Setting up Gemini API Key...")
    print("📝 To get a Gemini API key:")
    print("1. Go to https://makersuite.google.com/app/apikey")
    print("2. Create a new API key")
    print("3. Copy the key and paste it below")
    print()
    
    api_key = input("Enter your Gemini API key (or press Enter to skip): ").strip()
    
    if api_key:
        # Set environment variable for current session
        os.environ["GEMINI_API_KEY"] = api_key
        print("✅ Gemini API key set for current session!")
        print("💡 To make it permanent, add to your environment variables:")
        print(f"   GEMINI_API_KEY={api_key}")
        
        # Test the key
        print("\n🧪 Testing API key...")
        test_gemini_connection(api_key)
    else:
        print("⏭️  Skipping Gemini API key setup")
        print("ℹ️  The system will use fallback analysis without AI")

def test_gemini_connection(api_key):
    """Test if the Gemini API key works"""
    try:
        import httpx
        import asyncio
        
        async def test_api():
            url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}"
            }
            
            data = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": "Hello, this is a test message."
                            }
                        ]
                    }
                ]
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json=data, timeout=10.0)
                
                if response.status_code == 200:
                    print("✅ Gemini API key is valid!")
                    print("🤖 AI-powered memory analysis will be enabled!")
                else:
                    print(f"❌ Gemini API key test failed: {response.status_code}")
                    print("🔧 Please check your API key and try again")
        
        asyncio.run(test_api())
        
    except Exception as e:
        print(f"❌ Error testing Gemini API: {str(e)}")

if __name__ == "__main__":
    set_gemini_key() 