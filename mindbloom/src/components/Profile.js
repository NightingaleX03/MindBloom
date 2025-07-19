import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  UserIcon, 
  CogIcon,
  HeartIcon,
  EyeIcon,
  BellIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth0();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      fontSize: 'large',
      notifications: true,
      accessibility: {
        highContrast: false,
        screenReader: false,
        voiceInput: true
      }
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalInfo: {
      conditions: [],
      medications: [],
      allergies: []
    }
  });

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const themes = [
    { value: 'light', label: 'Light', description: 'Standard light theme' },
    { value: 'dark', label: 'Dark', description: 'Dark theme for low light' },
    { value: 'high-contrast', label: 'High Contrast', description: 'Maximum contrast for visibility' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Standard text size' },
    { value: 'medium', label: 'Medium', description: 'Larger text for easier reading' },
    { value: 'large', label: 'Large', description: 'Extra large text for maximum readability' }
  ];

  const handleSave = () => {
    // Here you would save to backend
    alert('Profile saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-full">
            <UserIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Profile Picture and Basic Info */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <EyeIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Accessibility Settings
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: theme.value }
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    profile.preferences.theme === theme.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{theme.label}</h3>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Text Size
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setProfile(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, fontSize: size.value }
                  }))}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    profile.preferences.fontSize === size.value
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{size.label}</h3>
                  <p className="text-sm text-gray-600">{size.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Options */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Additional Accessibility Options
            </label>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={profile.preferences.accessibility.highContrast}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      accessibility: {
                        ...prev.preferences.accessibility,
                        highContrast: e.target.checked
                      }
                    }
                  }))}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-lg text-gray-900">High Contrast Mode</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={profile.preferences.accessibility.screenReader}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      accessibility: {
                        ...prev.preferences.accessibility,
                        screenReader: e.target.checked
                      }
                    }
                  }))}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-lg text-gray-900">Screen Reader Support</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={profile.preferences.accessibility.voiceInput}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      accessibility: {
                        ...prev.preferences.accessibility,
                        voiceInput: e.target.checked
                      }
                    }
                  }))}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-lg text-gray-900">Voice Input Support</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <HeartIcon className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Emergency Contact
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Contact Name
            </label>
            <input
              type="text"
              value={profile.emergencyContact.name}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, name: e.target.value }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              placeholder="e.g., John Smith"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.emergencyContact.phone}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              placeholder="e.g., (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Relationship
            </label>
            <input
              type="text"
              value={profile.emergencyContact.relationship}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              placeholder="e.g., Son, Daughter, Spouse"
            />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Medical Information
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Medical Conditions
            </label>
            <textarea
              value={profile.medicalInfo.conditions.join(', ')}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                medicalInfo: {
                  ...prev.medicalInfo,
                  conditions: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter conditions separated by commas"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Medications
            </label>
            <textarea
              value={profile.medicalInfo.medications.join(', ')}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                medicalInfo: {
                  ...prev.medicalInfo,
                  medications: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter medications separated by commas"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Allergies
            </label>
            <textarea
              value={profile.medicalInfo.allergies.join(', ')}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                medicalInfo: {
                  ...prev.medicalInfo,
                  allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter allergies separated by commas"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BellIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Notifications
          </h2>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={profile.preferences.notifications}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                preferences: { ...prev.preferences, notifications: e.target.checked }
              }))}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-lg text-gray-900">Enable notifications</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Save Your Changes
            </h3>
            <p className="text-gray-600">
              Your profile settings will be updated across all devices
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors text-lg font-semibold flex items-center space-x-2"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 