import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  HomeIcon, 
  HeartIcon, 
  StarIcon, 
  CameraIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon,
  UserGroupIcon,
  CalendarIcon,
  MicrophoneIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import MemoryJournal from './components/MemoryJournal';
import MemoryGarden from './components/MemoryGarden';
import CaregiverDashboard from './components/CaregiverDashboard';
import Calendar from './components/Calendar';
import AIChat from './components/AIChat';
import Profile from './components/Profile';
import VoiceInterviews from './components/VoiceInterviews';
import Settings from './components/Settings';

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

// Sidebar Component
const Sidebar = ({ activeTab, onTabChange, selectedPatient, onPatientChange, patients }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
    { id: 'caregiver', name: 'Caregiver View', icon: UserGroupIcon },
    { id: 'journal', name: 'Memory Journal', icon: BookOpenIcon },
    { id: 'garden', name: 'Memory Garden', icon: StarIcon },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
    { id: 'interviews', name: 'Voice Interviews', icon: MicrophoneIcon },
    { id: 'chat', name: 'AI Chat', icon: ChatBubbleLeftIcon },
    { id: 'profile', name: 'Profile', icon: HeartIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  return (
    <div 
      className="fixed left-0 top-0 h-full w-64 shadow-lg z-50"
      style={{ backgroundColor: BRAND_COLORS.white }}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <MindbloomLogo size="md" />
          <h1 
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.accent }}
          >
            MINDBLOOM
          </h1>
        </div>
        
        {/* Patient Selector */}
        <div className="mb-6">
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: BRAND_COLORS.accent }}
          >
            Select Patient
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => onPatientChange(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent"
            style={{
              borderColor: BRAND_COLORS.primary,
              outline: 'none'
            }}
          >
            <option value="">Choose a patient...</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? BRAND_COLORS.primary : 'transparent',
                color: activeTab === tab.id ? BRAND_COLORS.white : BRAND_COLORS.accent
              }}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState([]);

  // Mock patients data
  useEffect(() => {
    setPatients([
      { id: '1', name: 'Sarah Johnson', age: 78 },
      { id: '2', name: 'Robert Smith', age: 82 },
      { id: '3', name: 'Margaret Davis', age: 75 }
    ]);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    setSelectedPatient('');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handlePatientChange = (patientId) => {
    setSelectedPatient(patientId);
  };

  // If not authenticated, show sign-in page
  if (!isAuthenticated) {
    return <SignIn onLogin={handleLogin} />;
  }

  // Main app layout
  return (
    <Router>
      <div 
        className="flex h-screen"
        style={{ backgroundColor: BRAND_COLORS.gray }}
      >
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedPatient={selectedPatient}
          onPatientChange={handlePatientChange}
          patients={patients}
        />

        {/* Main Content */}
        <div className="flex-1 ml-64 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 
                  className="text-3xl font-bold"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'caregiver' && 'Caregiver Dashboard'}
                  {activeTab === 'journal' && 'Memory Journal'}
                  {activeTab === 'garden' && 'Memory Garden'}
                  {activeTab === 'calendar' && 'Calendar'}
                  {activeTab === 'interviews' && 'Voice Interviews'}
                  {activeTab === 'chat' && 'AI Chat'}
                  {activeTab === 'profile' && 'Profile'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p 
                  className="mt-1"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  {selectedPatient ? 
                    `Managing: ${patients.find(p => p.id === selectedPatient)?.name}` : 
                    'Select a patient to get started'
                  }
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 transition-colors"
                style={{ color: BRAND_COLORS.accent }}
              >
                Logout
              </button>
            </div>

            {/* Patient Selection Warning */}
            {!selectedPatient && activeTab !== 'caregiver' && (
              <div 
                className="border rounded-xl p-6 mb-8"
                style={{ 
                  backgroundColor: BRAND_COLORS.primaryLight,
                  borderColor: BRAND_COLORS.primary
                }}
              >
                <div className="flex items-center space-x-3">
                  <UserGroupIcon 
                    className="h-6 w-6" 
                    style={{ color: BRAND_COLORS.accent }}
                  />
                  <div>
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Select a Patient
                    </h3>
                    <p style={{ color: BRAND_COLORS.accent }}>
                      Please select a patient from the sidebar to view and manage their data.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'dashboard' && <Dashboard selectedPatient={selectedPatient} onTabChange={handleTabChange} />}
            {activeTab === 'caregiver' && <CaregiverDashboard />}
            {activeTab === 'journal' && selectedPatient && <MemoryJournal selectedPatient={selectedPatient} />}
            {activeTab === 'garden' && selectedPatient && <MemoryGarden selectedPatient={selectedPatient} />}
            {activeTab === 'calendar' && selectedPatient && <Calendar selectedPatient={selectedPatient} />}
            {activeTab === 'interviews' && selectedPatient && <VoiceInterviews selectedPatient={selectedPatient} />}
            {activeTab === 'chat' && selectedPatient && <AIChat selectedPatient={selectedPatient} />}
            {activeTab === 'profile' && <Profile selectedPatient={selectedPatient} />}
            {activeTab === 'settings' && <Settings selectedPatient={selectedPatient} />}

            {/* No patient selected message */}
            {!selectedPatient && activeTab !== 'caregiver' && activeTab !== 'dashboard' && activeTab !== 'interviews' && (
              <div 
                className="rounded-2xl shadow-lg p-8 text-center"
                style={{ backgroundColor: BRAND_COLORS.white }}
              >
                <UserGroupIcon 
                  className="h-16 w-16 mx-auto mb-4" 
                  style={{ color: BRAND_COLORS.primary }}
                />
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Select a Patient
                </h2>
                <p style={{ color: BRAND_COLORS.accent }}>
                  Choose a patient from the sidebar to access their {activeTab} data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
