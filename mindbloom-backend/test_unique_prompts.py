import asyncio
import json
from main import GeminiAI

async def test_unique_prompts():
    """Test that unique prompts are generated for different memories"""
    
    gemini_ai = GeminiAI()
    
    # Test different memories
    test_memories = [
        {
            "title": "Family Dinner at Grandma's",
            "content": "We all gathered around the table, sharing stories and laughter. The smell of grandma's cooking filled the air.",
            "mood": "happy"
        },
        {
            "title": "Rainy Day Walk",
            "content": "Walking through the park in the gentle rain, feeling peaceful and reflective.",
            "mood": "calm"
        },
        {
            "title": "First Day of School",
            "content": "Nervous excitement filled my heart as I walked into the classroom for the first time.",
            "mood": "anxious"
        },
        {
            "title": "Summer Vacation",
            "content": "Exploring new places and creating unforgettable memories with family.",
            "mood": "excited"
        }
    ]
    
    print("🎨 Testing Unique Prompt Generation\n")
    
    for i, memory in enumerate(test_memories, 1):
        print(f"📝 Memory {i}: {memory['title']}")
        print(f"   Mood: {memory['mood']}")
        print(f"   Content: {memory['content'][:50]}...")
        
        # Generate unique prompt
        unique_data = gemini_ai._generate_unique_prompt(
            memory['content'], 
            memory['title'], 
            memory['mood']
        )
        
        print(f"   🎯 Unique Prompt: {unique_data['prompt'][:100]}...")
        print(f"   🎨 Scene Elements: {unique_data['scene_elements']}")
        print()
    
    print("✅ Unique prompt generation test completed!")

if __name__ == "__main__":
    asyncio.run(test_unique_prompts()) 