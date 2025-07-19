import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CpuChipIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.origin }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
            Your compassionate memory companion
          </p>
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
                  AI-Powered Memory Support
                </h3>
                <p className="text-gray-600 text-base">
                  Gentle prompts and conversations to help recall precious memories
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <HeartIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Compassionate Design
                </h3>
                <p className="text-gray-600 text-base">
                  Large, clear text and simple navigation for easy use
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Interactive Memory Garden
                </h3>
                <p className="text-gray-600 text-base">
                  Explore your memories in a beautiful 3D environment
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="text-center">
          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 text-white py-4 px-8 rounded-xl text-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
            style={{ fontSize: '1.25rem' }} // Large text for accessibility
          >
            Sign In to MindBloom
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            Secure login powered by Auth0
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              For Caregivers
            </h4>
            <p className="text-blue-700 text-sm">
              Create an account to monitor and support your loved ones with compassion and care.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>MindBloom - Empowering memories, one moment at a time</p>
          <p className="mt-2">© 2024 MindBloom. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 