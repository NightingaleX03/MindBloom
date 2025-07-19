import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { 
  CpuChipIcon, 
  SparklesIcon, 
  LightBulbIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  HomeIcon,
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  UserIcon
} from '@heroicons/react/24/outline';

// Import components (we'll create these next)
import Dashboard from './components/Dashboard';
import MemoryJournal from './components/MemoryJournal';
import AIChat from './components/AIChat';
import MemoryGarden from './components/MemoryGarden';
import Calendar from './components/Calendar';
import CaregiverDashboard from './components/CaregiverDashboard';
import Profile from './components/Profile';
import Login from './components/Login';

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600">Loading MindBloom...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main navigation component
const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth0();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Memory Journal', href: '/journal', icon: BookOpenIcon },
    { name: 'AI Assistant', href: '/ai-chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Memory Garden', href: '/garden', icon: CubeIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Caregiver View', href: '/caregiver', icon: UserGroupIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <CpuChipIcon className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">MindBloom</span>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-purple-600 transition-colors flex items-center space-x-1"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Main App component
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<MemoryJournal />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/garden" element={<MemoryGarden />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/caregiver" element={<CaregiverDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
};

// Main App wrapper with Auth0
const App = () => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || 'your-domain.auth0.com'}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id'}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'your-audience'
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </Auth0Provider>
  );
};

export default App;
