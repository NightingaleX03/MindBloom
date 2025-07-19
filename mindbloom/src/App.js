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
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">MindBloom</h1>
        
        {/* Patient Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient
          </label>
          <select
            value={selectedPatient}
            onChange={(e) => onPatientChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
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
      <div className="flex h-screen bg-gray-50">
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
                <h1 className="text-3xl font-bold text-gray-900">
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
                <p className="text-gray-600 mt-1">
                  {selectedPatient ? 
                    `Managing: ${patients.find(p => p.id === selectedPatient)?.name}` : 
                    'Select a patient to get started'
                  }
                </p>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Patient Selection Warning */}
            {!selectedPatient && activeTab !== 'caregiver' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <div className="flex items-center space-x-3">
                  <UserGroupIcon className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-900">
                      Select a Patient
                    </h3>
                    <p className="text-yellow-700">
                      Please select a patient from the sidebar to view and manage their data.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content based on active tab */}
            {activeTab === 'dashboard' && <Dashboard selectedPatient={selectedPatient} />}
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
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Select a Patient
                </h2>
                <p className="text-gray-600">
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
