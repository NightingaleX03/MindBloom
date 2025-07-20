#!/usr/bin/env python3
"""
🚀 MindBloom Render Setup Script

This script helps you prepare your MindBloom app for Render deployment.
"""

import os
import sys
import subprocess
from pathlib import Path

def print_banner():
    print("🚀 MindBloom Render Setup")
    print("=" * 40)

def check_git():
    """Check if git is initialized and has remote"""
    try:
        result = subprocess.run(['git', 'status'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Git repository not found!")
            print("Please initialize git first:")
            print("   git init")
            print("   git add .")
            print("   git commit -m 'Initial commit'")
            return False
        
        # Check for remote
        result = subprocess.run(['git', 'remote', '-v'], capture_output=True, text=True)
        if not result.stdout.strip():
            print("⚠️  No remote repository found!")
            print("Please add a GitHub remote:")
            print("   git remote add origin https://github.com/yourusername/yourrepo.git")
            return False
            
        print("✅ Git repository ready")
        return True
    except FileNotFoundError:
        print("❌ Git not found. Please install git first.")
        return False

def check_files():
    """Check if required files exist"""
    required_files = [
        'mindbloom-backend/requirements.txt',
        'mindbloom-backend/main.py',
        'mindbloom/package.json',
        'render.yaml'
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print("❌ Missing required files:")
        for file in missing_files:
            print(f"   - {file}")
        return False
    
    print("✅ All required files found")
    return True

def check_environment():
    """Check environment variables"""
    required_vars = ['MONGODB_URI', 'GEMINI_API_KEY']
    optional_vars = ['RIBBON_API_KEY']
    
    print("\n🔧 Environment Variables Check:")
    print("-" * 30)
    
    missing_required = []
    for var in required_vars:
        if not os.getenv(var):
            missing_required.append(var)
            print(f"❌ {var}: Not set")
        else:
            print(f"✅ {var}: Set")
    
    for var in optional_vars:
        if not os.getenv(var):
            print(f"⚠️  {var}: Not set (optional)")
        else:
            print(f"✅ {var}: Set")
    
    if missing_required:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_required)}")
        print("Please set these in your Render dashboard:")
        for var in missing_required:
            print(f"   {var}=your_value_here")
        return False
    
    return True

def build_frontend():
    """Build the frontend"""
    print("\n📦 Building frontend...")
    try:
        os.chdir('mindbloom')
        result = subprocess.run(['npm', 'install'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ npm install failed!")
            print(result.stderr)
            return False
        
        result = subprocess.run(['npm', 'run', 'build'], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ npm build failed!")
            print(result.stderr)
            return False
        
        os.chdir('..')
        print("✅ Frontend built successfully!")
        return True
    except Exception as e:
        print(f"❌ Build failed: {e}")
        return False

def show_render_instructions():
    """Show Render deployment instructions"""
    print("\n🎯 Render Deployment Instructions:")
    print("=" * 50)
    print("1. Go to https://render.com")
    print("2. Sign up/Login with GitHub")
    print("3. Click 'New' → 'Web Service'")
    print("4. Connect your GitHub repository")
    print("5. Configure settings:")
    print("   - Name: mindbloom-backend")
    print("   - Environment: Python 3")
    print("   - Build Command: cd mindbloom-backend && pip install -r requirements.txt")
    print("   - Start Command: cd mindbloom-backend && python main.py")
    print("   - Plan: Free")
    print("6. Add environment variables in Render dashboard")
    print("7. Click 'Create Web Service'")
    print("\n8. For frontend:")
    print("   - Click 'New' → 'Static Site'")
    print("   - Connect same repository")
    print("   - Build Command: cd mindbloom && npm install && npm run build")
    print("   - Publish Directory: mindbloom/build")

def main():
    print_banner()
    
    # Check prerequisites
    if not check_git():
        return
    
    if not check_files():
        return
    
    # Check environment variables
    check_environment()
    
    # Build frontend
    if not build_frontend():
        return
    
    # Show instructions
    show_render_instructions()
    
    print("\n🎉 Setup complete! Follow the instructions above to deploy to Render.")
    print("\n📖 For detailed instructions, see DEPLOYMENT.md")

if __name__ == "__main__":
    main() 