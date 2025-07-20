import asyncio
from database import Database, Collections

async def check_journals():
    """Check journal entries in the database"""
    await Database.connect_db()
    db = Database.get_db()
    
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    print("📝 Checking journal entries...")
    
    # Get all journal entries
    journals = await db[Collections.JOURNALS].find({}).to_list(length=None)
    
    print(f"📊 Total journal entries: {len(journals)}")
    
    # Group by patient
    patient_journals = {}
    for journal in journals:
        patient_id = journal.get('patient_id', 'unknown')
        if patient_id not in patient_journals:
            patient_journals[patient_id] = []
        patient_journals[patient_id].append(journal)
    
    print(f"👥 Journal entries by patient:")
    for patient_id, entries in patient_journals.items():
        print(f"  Patient {patient_id}: {len(entries)} entries")
        
        # Show a sample entry
        if entries:
            sample = entries[0]
            print(f"    Sample: {sample.get('content', '')[:100]}...")
    
    # Check unique patients
    unique_patients = set(journal.get('patient_id') for journal in journals)
    print(f"\n🎯 Unique patients with journals: {len(unique_patients)}")
    
    await Database.close_db()

if __name__ == "__main__":
    asyncio.run(check_journals()) 