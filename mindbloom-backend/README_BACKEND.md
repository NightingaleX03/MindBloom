# MindBloom Backend

A compassionate memory companion API for people with dementia, built with FastAPI and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with:
   ```env
   # MongoDB Atlas Configuration
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
   
   # Simple Authentication (for development)
   SECRET_KEY=your-secret-key-here
   
   # API Configuration
   API_BASE_URL=http://localhost:8000
   
   # Optional: Google Gemini API (if you want to use real AI)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Ribbon API Configuration (optional for development)
   RIBBON_API_KEY=your_ribbon_api_key_here
   ```

3. **Run the server:**
   ```bash
   # Option 1: Using the startup script
   python start_server.py
   
   # Option 2: Using uvicorn directly
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## 📖 API Documentation

Once the server is running, you can access:
- **Interactive API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health
- **Server URL:** http://localhost:8000

## 🔧 Features

### Core Endpoints
- **Users:** `/api/users` - User management
- **Journal:** `/api/journal` - Memory journal entries
- **Memories:** `/api/memories` - Memory storage and retrieval
- **Calendar:** `/api/calendar` - Event scheduling
- **AI Chat:** `/api/ai/chat` - AI companion conversations
- **Voice Interviews:** `/api/ribbon` - Voice-based memory collection

### Authentication
- Simple JWT-based authentication
- Role-based access (User, Caregiver, Admin)
- Patient-caregiver relationships

### AI Integration
- Gemini AI for memory visualization
- AI-powered journal analysis
- Intelligent conversation responses

### Voice Integration
- Ribbon AI for voice interviews
- Memory collection through voice
- Interview flow management

## 🗄️ Database

The backend uses MongoDB with the following collections:
- `users` - User accounts and profiles
- `journals` - Journal entries
- `memories` - Memory storage
- `calendar` - Event scheduling
- `interviews` - Voice interview sessions
- `ai_chat` - AI conversation history
- `patients` - Patient information
- `caregivers` - Caregiver information

## 🛠️ Development

### Project Structure
```
mindbloom-backend/
├── main.py              # FastAPI application
├── database.py          # Database connection and setup
├── models/              # Pydantic models
├── routers/             # API route handlers
├── services/            # Business logic services
├── data/               # JSON data files (for migration)
└── requirements.txt     # Python dependencies
```

### Testing
```bash
# Test imports
python test_imports.py

# Test authentication
python test_auth.py

# Test MongoDB connection
python test_mongodb.py
```

## 🔒 Security

- CORS enabled for frontend integration
- JWT token authentication
- Role-based access control
- Input validation with Pydantic models

## 🌟 Key Features

1. **Compassionate Design:** Built specifically for dementia patients and caregivers
2. **Voice Integration:** Voice-based memory collection through Ribbon AI
3. **AI Companion:** Intelligent conversations and memory analysis
4. **Memory Visualization:** AI-generated visual descriptions of memories
5. **Caregiver Support:** Tools for caregivers to manage patients
6. **Journal System:** Digital memory journal with mood tracking
7. **Calendar Integration:** Event scheduling and reminders

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check your MongoDB URI in the `.env` file
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **Import Errors:**
   - Run `python test_imports.py` to check dependencies
   - Install missing packages with `pip install -r requirements.txt`

3. **Port Already in Use:**
   - Change the port in `start_server.py` or use a different port
   - Kill existing processes on port 8000

4. **API Key Errors:**
   - Optional services (Gemini, Ribbon) will use mock responses if API keys are not provided
   - Check the console for warnings about missing API keys

## 📞 Support

For issues or questions:
1. Check the API documentation at http://localhost:8000/docs
2. Review the logs for error messages
3. Test individual components using the test files 