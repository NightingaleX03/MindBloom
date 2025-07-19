import React, { useState } from 'react';
import { CpuChipIcon, SparklesIcon, HeartIcon, UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-100 rounded-full">
              <CpuChipIcon className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to MindBloom
          </h1>
          <p className="text-lg text-gray-600">
            Caregiver Portal - Manage Your Loved Ones
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 text-sm"
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
                <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="signup-confirm-password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-purple-600 hover:text-purple-700 text-sm"
                  onClick={() => setActiveTab('login')}
                  disabled={loading}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}

          {/* Testing Account Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleTestingAccount}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Testing Account - Caregiver Login'}
            </button>
            <p className="text-center text-sm text-gray-500 mt-2">
              Quick access as a caregiver with demo credentials
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Multi-Patient Management
                </h3>
                <p className="text-gray-600 text-base">
                  Manage multiple patients and their memories from one dashboard
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Memory Support
                </h3>
                <p className="text-gray-600 text-base">
                  Help your loved ones preserve and cherish precious memories
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-600 text-base">
                  Get insights and support for better care management
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>MindBloom - Empowering caregivers, preserving memories</p>
          <p className="mt-2">© 2024 MindBloom. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 