import asyncio
import random
from datetime import datetime, timedelta
from database import Database, Collections

# Sample journal entry templates
JOURNAL_TEMPLATES = [
    "Today I felt {emotion}. {activity} helped me feel better.",
    "I had a {emotion} day. {activity} was particularly challenging.",
    "Feeling {emotion} today. I tried {activity} and it was {result}.",
    "My mood was {emotion} today. {activity} made me feel {result}.",
    "I experienced {emotion} emotions today. {activity} was {result}.",
    "Today was {emotion}. I found {activity} to be {result}.",
    "I'm feeling {emotion} about {activity}. It was {result}.",
    "My day was {emotion}. {activity} helped me cope.",
    "I felt {emotion} during {activity}. It was {result}.",
    "Today I was {emotion}. {activity} provided some relief."
]

EMOTIONS = [
    "anxious", "calm", "frustrated", "hopeful", "overwhelmed", 
    "peaceful", "stressed", "grateful", "worried", "content",
    "irritated", "relaxed", "nervous", "happy", "sad",
    "excited", "tired", "energetic", "lonely", "connected"
]

ACTIVITIES = [
    "meditation", "walking outside", "talking to a friend", "reading a book",
    "listening to music", "cooking", "gardening", "painting", "writing",
    "exercising", "calling family", "watching TV", "cleaning", "shopping",
    "volunteering", "attending therapy", "practicing breathing exercises",
    "journaling", "doing puzzles", "spending time with pets"
]

RESULTS = [
    "helpful", "challenging", "refreshing", "difficult", "enjoyable",
    "therapeutic", "stressful", "calming", "frustrating", "rewarding",
    "soothing", "overwhelming", "comforting", "annoying", "peaceful"
]

async def add_journal_entries():
    """Add random journal entries for each patient"""
    await Database.connect_db()
    db = Database.get_db()
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    print("📝 Adding journal entries for patients...")
    
    # Get all patients
    patients = await db[Collections.PATIENTS].find({}).to_list(length=None)
    
    if not patients:
        print("❌ No patients found in database")
        return
    
    entries_added = 0
    
    for patient in patients:
        patient_id = str(patient['_id'])
        patient_name = patient.get('name', 'Unknown')
        
        print(f"👤 Adding entries for {patient_name}...")
        
        # Add 5-6 random entries for each patient
        num_entries = random.randint(5, 6)
        
        for i in range(num_entries):
            # Generate random date within last 30 days
            days_ago = random.randint(0, 30)
            entry_date = datetime.now() - timedelta(days=days_ago)
            
            # Create random journal entry
            template = random.choice(JOURNAL_TEMPLATES)
            emotion = random.choice(EMOTIONS)
            activity = random.choice(ACTIVITIES)
            result = random.choice(RESULTS)
            
            content = template.format(
                emotion=emotion,
                activity=activity,
                result=result
            )
            
            # Add some variety to content
            if random.random() < 0.3:
                content += f" I hope tomorrow will be better."
            elif random.random() < 0.3:
                content += f" I'm grateful for the support I have."
            elif random.random() < 0.3:
                content += f" I need to remember to be patient with myself."
            
            journal_entry = {
                "patient_id": patient_id,
                "content": content,
                "mood": emotion,
                "timestamp": entry_date,
                "tags": [emotion, activity],
                "created_at": entry_date,
                "updated_at": entry_date
            }
            
            try:
                await db[Collections.JOURNALS].insert_one(journal_entry)
                entries_added += 1
            except Exception as e:
                print(f"⚠️ Error adding entry for {patient_name}: {e}")
    
    print(f"✅ Successfully added {entries_added} journal entries!")
    print(f"📊 Added entries for {len(patients)} patients")

if __name__ == "__main__":
    asyncio.run(add_journal_entries()) 