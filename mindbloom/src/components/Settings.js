import React, { useState, useEffect } from 'react';
import { 
  CogIcon,
  EyeIcon,
  BellIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

const Settings = ({ selectedPatient }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    notifications: true,
    accessibility: {
      highContrast: false,
      screenReader: false,
      voiceInput: true
    }
  });

  const themes = [
    { value: 'light', label: 'Light', description: 'Standard light theme', icon: SunIcon },
    { value: 'dark', label: 'Dark', description: 'Dark theme for low light', icon: MoonIcon },
    { value: 'high-contrast', label: 'High Contrast', description: 'Maximum contrast for visibility', icon: AdjustmentsHorizontalIcon }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Standard text size' },
    { value: 'medium', label: 'Medium', description: 'Larger text for easier reading' },
    { value: 'large', label: 'Large', description: 'Extra large text for maximum readability' }
  ];

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('mindbloom-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('mindbloom-settings', JSON.stringify(settings));
    
    // Apply theme to document
    document.documentElement.className = settings.theme;
    
    // Apply font size
    document.documentElement.style.fontSize = 
      settings.fontSize === 'small' ? '14px' : 
      settings.fontSize === 'medium' ? '16px' : '18px';
    
    alert('Settings saved successfully!');
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  const handleFontSizeChange = (fontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const handleAccessibilityChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-full">
            <CogIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-lg text-gray-600">
              Customize your experience and accessibility preferences
            </p>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SunIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Theme & Appearance
          </h2>
        </div>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      settings.theme === theme.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <IconComponent className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">{theme.label}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{theme.description}</p>
                  </button>
                );
              })}
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
                  onClick={() => handleFontSizeChange(size.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    settings.fontSize === size.value
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
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <EyeIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Accessibility
          </h2>
        </div>
        
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.accessibility.highContrast}
              onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-lg text-gray-900">High Contrast Mode</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.accessibility.screenReader}
              onChange={(e) => handleAccessibilityChange('screenReader', e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-lg text-gray-900">Screen Reader Support</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.accessibility.voiceInput}
              onChange={(e) => handleAccessibilityChange('voiceInput', e.target.checked)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-lg text-gray-900">Voice Input Support</span>
          </label>
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
              checked={settings.notifications}
              onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
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
              Save Settings
            </h3>
            <p className="text-gray-600">
              Your settings will be applied immediately
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors text-lg font-semibold flex items-center space-x-2"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 