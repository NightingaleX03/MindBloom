# MindBloom FastAPI Backend

A compassionate memory companion API built with FastAPI, designed to support people with dementia through AI-powered memory recall and cognitive support tools.

## Features

- **FastAPI Framework**: High-performance, modern Python web framework
- **MongoDB Integration**: Async database operations with Motor
- **Auth0 Authentication**: Secure JWT-based authentication
- **AI Integration**: Google Gemini AI for memory analysis and conversation
- **File Upload**: Secure media file handling with AI analysis
- **Role-Based Access**: Support for users, caregivers, and admins
- **Automatic API Documentation**: Swagger UI at `/docs`

## Quick Start

### Prerequisites

- Python 3.8+
- MongoDB
- Auth0 account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   cd mindbloom-backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

5. **Start the server**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `AUTH0_DOMAIN` | Your Auth0 domain | Yes |
| `AUTH0_AUDIENCE` | Auth0 API audience | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `HOST` | Server host | No (default: 0.0.0.0) |
| `PORT` | Server port | No (default: 8000) |
| `DEBUG` | Debug mode | No (default: True) |

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /users` - Get all users (admin only)
- `POST /caregiver/assign` - Assign caregiver to patient
- `GET /caregiver/patients` - Get caregiver's patients

### Journal (`/api/journal`)
- `POST /` - Create journal entry
- `GET /` - Get journal entries
- `GET /{journal_id}` - Get specific entry
- `PUT /{journal_id}` - Update entry
- `DELETE /{journal_id}` - Delete entry
- `POST /{journal_id}/pin` - Pin/unpin entry
- `GET /caregiver/{patient_id}` - Get patient journals (caregiver)

### AI (`/api/ai`)
- `POST /conversation` - Generate AI response
- `POST /image-analysis` - Analyze uploaded image
- `POST /story-generation` - Generate story from input
- `POST /memory-prompt` - Generate memory prompt
- `GET /prompts/suggested` - Get suggested prompts

### Calendar (`/api/calendar`)
- `POST /` - Create calendar event
- `GET /` - Get calendar events
- `GET /{event_id}` - Get specific event
- `PUT /{event_id}` - Update event
- `DELETE /{event_id}` - Delete event
- `POST /{event_id}/complete` - Mark event complete
- `GET /overdue` - Get overdue events
- `GET /caregiver/{patient_id}` - Get patient events (caregiver)

### Media (`/api/media`)
- `POST /upload` - Upload media file
- `GET /files` - Get user files
- `GET /files/{file_id}` - Download file
- `DELETE /files/{file_id}` - Delete file
- `GET /files/{file_id}/analysis` - Get file AI analysis
- `POST /files/{file_id}/reanalyze` - Reanalyze file

## Database Models

### User
- Auth0 integration
- Role-based access (user, caregiver, admin)
- Profile management
- Caregiver-patient relationships

### Journal
- Memory entries with AI insights
- Mood tracking
- Media attachments
- Location and people tagging
- Pinning functionality

### Calendar
- Event management
- Priority levels
- Caregiver notes
- AI suggestions
- Overdue tracking

## AI Features

- **Memory Analysis**: Analyze journal entries for sentiment and themes
- **Image Analysis**: Describe uploaded photos compassionately
- **Conversation**: Generate empathetic responses
- **Story Generation**: Create personalized stories
- **Memory Prompts**: Generate gentle memory prompts
- **Caregiver Insights**: Provide insights for caregivers

## Security

- JWT token validation with Auth0
- Role-based access control
- File upload validation
- CORS configuration
- Input validation with Pydantic

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
```

### Type Checking
```bash
mypy .
```

## Deployment

### Docker
```bash
docker build -t mindbloom-backend .
docker run -p 8000:8000 mindbloom-backend
```

### Production Considerations
- Use proper MongoDB authentication
- Set up SSL/TLS certificates
- Configure proper CORS origins
- Set up monitoring and logging
- Use environment-specific configurations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License. 