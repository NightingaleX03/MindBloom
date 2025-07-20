#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

def create_env_file():
    """Create .env file with proper UTF-8 encoding"""
    
    env_content = """# MongoDB Configuration
MONGODB_URL=mongodb+srv://tester1:tester1@cluster0.pjvmo7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Gemini AI Configuration (optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
HOST=127.0.0.1
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000
"""
    
    try:
        with open('.env', 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("✅ .env file created successfully with UTF-8 encoding!")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

if __name__ == "__main__":
    create_env_file() 