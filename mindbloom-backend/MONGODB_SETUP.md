# 🗄️ MongoDB Atlas Setup Guide for MindBloom

## 📋 Prerequisites
- MongoDB Atlas account (free tier)
- Your Auth0 configuration ready

## 🚀 Step-by-Step Setup

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0) - perfect for development

### 2. Create Your Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Click "Create"
6. Wait for cluster to be ready (2-3 minutes)

### 3. Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username (e.g., `mindbloom_user`)
4. Create a strong password (save this!)
5. Select "Read and write to any database"
6. Click "Add User"

### 4. Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Your Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

### 6. Update Your .env File
Create a `.env` file in the `mindbloom-backend` directory:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/mindbloom?retryWrites=true&w=majority

# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-audience
AUTH0_ISSUER=https://your-domain.auth0.com/

# API Configuration
API_BASE_URL=http://localhost:8000
```

**Important:** Replace the placeholders with your actual values!

### 7. Test Your Connection
Run the test script to verify everything works:

```bash
cd mindbloom-backend
python test_mongodb.py
```

## 🔧 Troubleshooting

### Connection Issues
- **"Authentication failed"**: Check your username and password
- **"Connection timeout"**: Check your IP whitelist
- **"Invalid URI"**: Make sure your connection string is correct

### Common Issues
1. **Wrong password**: Double-check your database user password
2. **IP not whitelisted**: Add your IP to Network Access
3. **Cluster not ready**: Wait for cluster to finish building
4. **Wrong connection string**: Use the exact string from Atlas

## 📊 Database Collections

MindBloom will automatically create these collections:
- `users` - User profiles and Auth0 integration
- `journal_entries` - Memory journal entries
- `calendar_events` - Calendar events and reminders
- `ai_conversations` - AI chat history
- `media_files` - Uploaded photos and videos

## 🚀 Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Update your `.env` file
3. ✅ Test the connection
4. 🎯 Start your backend server: `python main.py`
5. 🎯 Test your frontend: `npm start`

## 💡 Pro Tips

- **Free Tier Limits**: 512MB storage, 0.5GB RAM - perfect for development
- **Backup**: Free tier includes automated backups
- **Scaling**: Easy to upgrade to paid tiers when needed
- **Security**: Atlas handles security patches automatically

## 🆘 Need Help?

If you encounter issues:
1. Check the MongoDB Atlas documentation
2. Verify your connection string format
3. Test with the provided test script
4. Check your network access settings

---

**Ready to bloom? 🌸** Your MongoDB Atlas is now ready to store memories and support your MindBloom application! 