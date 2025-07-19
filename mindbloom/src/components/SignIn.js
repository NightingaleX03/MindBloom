import React, { useState } from 'react';
import { CpuChipIcon, SparklesIcon, HeartIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

// Brand Colors
const BRAND_COLORS = {
  primary: '#eb9bb4',    // Soft pink
  accent: '#3b2347',     // Deep purple
  primaryLight: '#f5c4d1', // Lighter pink
  accentLight: '#5a3a6b',  // Lighter purple
  white: '#ffffff',
  gray: '#f8f9fa'
};

// MINDBLOOM Logo Component
const MindbloomLogo = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Blooming flower icon with brand colors */}
      <div className="w-full h-full relative">
        {/* Petal 1 - Top */}
        <div 
          className="absolute w-1/2 h-1/2 rounded-full transform rotate-45 -translate-x-1/4 -translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)`,
            boxShadow: '0 2px 8px rgba(235, 155, 180, 0.3)'
          }}
        />
        {/* Petal 2 - Right */}
        <div 
          className="absolute w-1/2 h-1/2 rounded-full transform rotate-45 translate-x-1/4 -translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.accent} 0%, ${BRAND_COLORS.primary} 100%)`,
            boxShadow: '0 2px 8px rgba(59, 35, 71, 0.3)'
          }}
        />
        {/* Petal 3 - Bottom */}
        <div 
          className="absolute w-1/2 h-1/2 rounded-full transform rotate-45 -translate-x-1/4 translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)`,
            boxShadow: '0 2px 8px rgba(235, 155, 180, 0.3)'
          }}
        />
        {/* Petal 4 - Left */}
        <div 
          className="absolute w-1/2 h-1/2 rounded-full transform rotate-45 translate-x-1/4 translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.accent} 0%, ${BRAND_COLORS.primary} 100%)`,
            boxShadow: '0 2px 8px rgba(59, 35, 71, 0.3)'
          }}
        />
        {/* Center */}
        <div 
          className="absolute w-1/4 h-1/4 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        />
      </div>
    </div>
  );
};

const SignIn = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, create a simple user object
      const userData = {
        id: '1',
        name: formData.email.split('@')[0], // Use email prefix as name
        email: formData.email,
        role: 'caregiver',
        created_at: new Date().toISOString()
      };

      // Generate a simple token
      const token = `demo-token-${Date.now()}`;
      
      // Call the onLogin prop with the token
      onLogin(token);
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // For demo purposes, create a simple user object
      const userData = {
        id: '1',
        name: formData.name,
        email: formData.email,
        role: 'caregiver',
        created_at: new Date().toISOString()
      };

      // Generate a simple token
      const token = `demo-token-${Date.now()}`;
      
      // Call the onLogin prop with the token
      onLogin(token);
    } catch (error) {
      setError('Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestingAccount = () => {
    setLoading(true);
    
    // Create demo caregiver user data
    const demoUser = {
      id: 'demo-1',
      name: 'Demo Caregiver',
      email: 'caregiver@mindbloom.com',
      role: 'caregiver',
      created_at: new Date().toISOString()
    };

    // Generate a demo token
    const token = `demo-caregiver-token-${Date.now()}`;
    
    // Call the onLogin prop with the token
    onLogin(token);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{ 
        background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
      }}
    >
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div 
              className="p-4 rounded-full"
              style={{ backgroundColor: BRAND_COLORS.primaryLight }}
            >
              <MindbloomLogo size="lg" />
            </div>
          </div>
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ color: BRAND_COLORS.accent }}
          >
            Welcome to MINDBLOOM
          </h1>
          <p 
            className="text-lg"
            style={{ color: BRAND_COLORS.accent }}
          >
            Caregiver Portal - Manage Your Loved Ones
          </p>
        </div>

        {/* Tab Navigation */}
        <div 
          className="rounded-2xl shadow-xl p-8 mb-8"
          style={{ backgroundColor: BRAND_COLORS.white }}
        >
          <div 
            className="flex space-x-1 mb-6 p-1 rounded-lg"
            style={{ backgroundColor: BRAND_COLORS.primaryLight }}
          >
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'shadow-sm'
                  : ''
              }`}
              style={{
                backgroundColor: activeTab === 'login' ? BRAND_COLORS.white : 'transparent',
                color: activeTab === 'login' ? BRAND_COLORS.primary : BRAND_COLORS.accent
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'signup'
                  ? 'shadow-sm'
                  : ''
              }`}
              style={{
                backgroundColor: activeTab === 'signup' ? BRAND_COLORS.white : 'transparent',
                color: activeTab === 'signup' ? BRAND_COLORS.primary : BRAND_COLORS.accent
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-4 p-3 border rounded-lg"
              style={{ 
                backgroundColor: BRAND_COLORS.primaryLight,
                borderColor: BRAND_COLORS.primary
              }}
            >
              <p style={{ color: BRAND_COLORS.accent }} className="text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: BRAND_COLORS.primary }}
                  />
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: BRAND_COLORS.primary,
                      outline: 'none'
                    }}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="login-password" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: BRAND_COLORS.primary }}
                  />
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: BRAND_COLORS.primary,
                      outline: 'none'
                    }}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.white
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm"
                  style={{ color: BRAND_COLORS.primary }}
                  onClick={() => setActiveTab('signup')}
                  disabled={loading}
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label 
                  htmlFor="signup-name" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: BRAND_COLORS.primary }}
                  />
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: BRAND_COLORS.primary,
                      outline: 'none'
                    }}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="signup-email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: BRAND_COLORS.primary }}
                  />
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: BRAND_COLORS.primary,
                      outline: 'none'
                    }}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="signup-password" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: BRAND_COLORS.primary }}
                  />
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: BRAND_COLORS.primary,
                      outline: 'none'
                    }}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="signup-confirm-password" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <LockClosedIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" 
                    style={{ color: BRAND_COLORS.primary }}
                  />
                  <input
                    type="password"
                    id="signup-confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{
                      borderColor: BRAND_COLORS.primary,
                      outline: 'none'
                    }}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.white
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm"
                  style={{ color: BRAND_COLORS.primary }}
                  onClick={() => setActiveTab('login')}
                  disabled={loading}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Demo Account Button */}
        <div className="text-center">
          <button
            onClick={handleTestingAccount}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: BRAND_COLORS.accent,
              color: BRAND_COLORS.white
            }}
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Try Demo Account</span>
          </button>
          <p 
            className="mt-2 text-sm"
            style={{ color: BRAND_COLORS.accent }}
          >
            Experience MINDBLOOM with sample data
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 