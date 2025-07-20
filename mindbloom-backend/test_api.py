import asyncio
import httpx
from database import Database, Collections

async def test_api():
    """Test the API endpoint directly"""
    try:
        async with httpx.AsyncClient() as client:
            # Test the memories endpoint
            response = await client.get("http://localhost:8000/api/memories?patient_id=1")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Test the test endpoint
            response2 = await client.get("http://localhost:8000/api/test/db")
            print(f"\nTest DB Status: {response2.status_code}")
            print(f"Test DB Response: {response2.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_api()) 