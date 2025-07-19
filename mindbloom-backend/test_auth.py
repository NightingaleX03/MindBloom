#!/usr/bin/env python3
"""
Test script to verify Auth0 configuration
"""

import os
from dotenv import load_dotenv

def test_auth0_config():
    """Test Auth0 configuration"""
    load_dotenv()
    
    print("🔐 Testing Auth0 Configuration...")
    
    # Check required environment variables
    required_vars = [
        "AUTH0_DOMAIN",
        "AUTH0_AUDIENCE", 
        "AUTH0_CLIENT_ID",
        "AUTH0_CLIENT_SECRET"
    ]
    
    missing_vars = []
    config_status = {}
    
    for var in required_vars:
        value = os.getenv(var)
        if not value or value.startswith("your-"):
            missing_vars.append(var)
            config_status[var] = "❌ Missing or placeholder"
        else:
            # Show first 10 characters for security
            display_value = value[:10] + "..." if len(value) > 10 else value
            config_status[var] = f"✓ {display_value}"
    
    print("\n📋 Configuration Status:")
    for var, status in config_status.items():
        print(f"   {var}: {status}")
    
    if missing_vars:
        print(f"\n❌ Missing or invalid Auth0 variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n🔧 Setup Instructions:")
        print("1. Go to your Auth0 Dashboard")
        print("2. Create a Single Page Application")
        print("3. Create an API with identifier: mindbloom-api")
        print("4. Copy the values to your .env file")
        print("\n📝 Example .env format:")
        print("AUTH0_DOMAIN=your-tenant.auth0.com")
        print("AUTH0_AUDIENCE=mindbloom-api")
        print("AUTH0_CLIENT_ID=your-client-id")
        print("AUTH0_CLIENT_SECRET=your-client-secret")
        return False
    
    print("\n🎉 Auth0 configuration looks good!")
    print("\n🚀 Next steps:")
    print("1. Start the backend: python main.py")
    print("2. Start the frontend: npm start")
    print("3. Test authentication in your browser")
    
    return True

if __name__ == "__main__":
    test_auth0_config() 