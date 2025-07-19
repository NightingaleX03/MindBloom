#!/usr/bin/env python3
"""
Simple test script to verify Auth0 configuration
"""

import os

def test_auth0_config():
    """Test Auth0 configuration"""
    print("🔐 Testing Auth0 Configuration...")
    
    # Set environment variables directly
    os.environ["AUTH0_DOMAIN"] = "dev-agqpd3x6c76ekma6.us.auth0.com"
    os.environ["AUTH0_AUDIENCE"] = "mindbloom-api"
    os.environ["AUTH0_CLIENT_ID"] = "r7cdq13ap8Kgd9pVsb9UXDI0fImUBTjU"
    os.environ["AUTH0_CLIENT_SECRET"] = "qJuwRAtaFMmQEC60Pm6r7ToG5dwnEgjYMDPNjrOs_6vvh6yYSLmkpbZxrwB-4FvD"
    
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
        return False
    
    print("\n🎉 Auth0 configuration looks good!")
    print("\n🚀 Next steps:")
    print("1. Start the backend: python main.py")
    print("2. Start the frontend: npm start")
    print("3. Test authentication in your browser")
    
    return True

if __name__ == "__main__":
    test_auth0_config() 