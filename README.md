# 🧠 MindBloom - Dementia Support Application

A comprehensive full-stack web application designed to assist people with dementia through interactive memory recall and cognitive support tools. Built with React, Node.js/Express, MongoDB, and integrated with Google Gemini AI and Auth0 for secure authentication.

## 🌟 Features

### 🎯 Core Functionality
- **Memory Journal**: Text, audio, and image-based memory entries
- **AI-Powered Assistance**: Gemini AI integration for memory prompts and analysis
- **3D Memory Garden**: Interactive Three.js visualization of memories
- **Calendar & Routines**: Daily activity and medication management
- **Caregiver Dashboard**: Analytics and monitoring tools
- **Secure Authentication**: Auth0 integration with role-based access

### 🧠 AI Integration
- **Memory Prompts**: Personalized conversation starters
- **Image Analysis**: Automatic captioning and tagging
- **Story Generation**: AI-assisted memory storytelling
- **Journal Insights**: Sentiment analysis and suggestions
- **Caregiver Analytics**: AI-powered pattern recognition

### 🔐 Security & Access
- **Role-Based Access**: User, Caregiver, and Admin roles
- **Secure Authentication**: Auth0 with JWT tokens
- **Data Protection**: Encrypted storage and secure APIs
- **Caregiver Monitoring**: Controlled access to patient data

## 🏗️ Architecture

### Frontend (React)
```
mindbloom/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── styles/        # CSS and styling
```

### Backend (Node.js/Express)
```
mindbloom-backend/
├── models/            # MongoDB schemas
├── routes/            # API endpoints
├── middleware/        # Authentication & validation
├── config/            # Configuration files
└── uploads/           # File storage
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Auth0 account
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HackThe6ix
```

### 2. Backend Setup
```bash
cd mindbloom-backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Configure environment variables
# Edit .env with your API keys and database URL

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd mindbloom

# Install dependencies
npm install

# Start development server
npm start
```

## 📚 API Documentation

### Authentication Endpoints
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/users` - Get all users (admin)
- `POST /api/auth/assign-caregiver` - Assign caregiver to patient

### Journal Endpoints
- `GET /api/journal` - Get user journals
- `POST /api/journal` - Create journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry
- `GET /api/journal/mood/:mood` - Get journals by mood
- `GET /api/journal/tags/:tags` - Get journals by tags

### Calendar Endpoints
- `GET /api/calendar` - Get calendar events
- `POST /api/calendar` - Create calendar event
- `PUT /api/calendar/:id` - Update calendar event
- `DELETE /api/calendar/:id` - Delete calendar event
- `GET /api/calendar/today/events` - Get today's events
- `GET /api/calendar/overdue/events` - Get overdue events

### AI Endpoints
- `POST /api/ai/image-caption` - Analyze image with AI
- `POST /api/ai/memory-prompts` - Generate memory prompts
- `POST /api/ai/storygen` - Generate story from input
- `POST /api/ai/conversation` - Generate conversation response
- `POST /api/ai/caregiver-insights` - Generate caregiver insights

### Media Endpoints
- `POST /api/media/upload` - Upload single file
- `POST /api/media/upload-multiple` - Upload multiple files
- `POST /api/media/analyze-image` - Analyze image with AI
- `GET /api/media/file/:filename` - Get file
- `DELETE /api/media/file/:filename` - Delete file

## 🎨 Frontend Components

### Core Components
- **Dashboard**: Main user interface with navigation
- **Memory Journal**: Create and view memory entries
- **AI Assistant**: Chat interface with Gemini AI
- **3D Memory Garden**: Interactive Three.js visualization
- **Calendar**: Daily routine management
- **Caregiver View**: Analytics and monitoring dashboard

### Accessibility Features
- Large font sizes for easy reading
- High contrast color schemes
- Simple navigation structure
- Voice input support
- Screen reader compatibility

## 🔧 Development

### Backend Development
```bash
# Start development server with nodemon
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Frontend Development
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🧪 Testing

### Backend Tests
```bash
cd mindbloom-backend
npm test
```

### Frontend Tests
```bash
cd mindbloom
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)
4. Set up Auth0 application
5. Configure CORS settings

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to your preferred platform (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up Auth0 application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini AI for AI capabilities
- Auth0 for secure authentication
- Three.js for 3D visualization
- MongoDB for database management
- React and Node.js communities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**MindBloom** - Empowering memories, one moment at a time. 🧠✨ 
