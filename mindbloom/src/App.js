import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

// Import components
import Dashboard from './components/Dashboard';
import MemoryJournal from './components/MemoryJournal';
import AIChat from './components/AIChat';
import MemoryGarden from './components/MemoryGarden';
import Calendar from './components/Calendar';
import CaregiverDashboard from './components/CaregiverDashboard';
import Profile from './components/Profile';
import SignIn from './components/SignIn';

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600">Loading MindBloom...</p>
    </div>
  </div>
);

// Simple authentication state (in a real app, you'd use a proper auth context)
const useAuth = () => {
  // For demo purposes, check if user is logged in via localStorage
  const isAuthenticated = localStorage.getItem('mindbloom_user') !== null;
  const user = isAuthenticated ? JSON.parse(localStorage.getItem('mindbloom_user')) : null;
  
  const login = (userData) => {
    localStorage.setItem('mindbloom_user', JSON.stringify(userData));
    window.location.href = '/';
  };
  
  const logout = () => {
    localStorage.removeItem('mindbloom_user');
    window.location.href = '/signin';
  };
  
  return { isAuthenticated, user, login, logout };
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" />;
};

// Sidebar Navigation component
const Sidebar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Memory Journal', href: '/journal', icon: BookOpenIcon },
    { name: 'AI Assistant', href: '/ai-chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Memory Garden', href: '/garden', icon: CubeIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Caregiver View', href: '/caregiver', icon: UserGroupIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
            <CpuChipIcon className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">MindBloom</span>
          </div>
          
          {/* Sign In Button */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => window.location.href = '/signin'}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl">
      <div className="flex flex-col h-full">
        {/* Logo and User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <CpuChipIcon className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">MindBloom</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">Welcome back,</p>
            <p className="text-purple-600">{user?.name || 'User'}</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-all group"
                >
                  <item.icon className="h-5 w-5 group-hover:text-purple-600" />
                  <span className="font-medium">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all group"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:text-red-600" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App component
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Sidebar />
      <main className={`transition-all duration-300 ${isAuthenticated ? 'ml-64' : 'ml-64'}`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/journal" element={<ProtectedRoute><MemoryJournal /></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
            <Route path="/garden" element={<ProtectedRoute><MemoryGarden /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/caregiver" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<Navigate to="/signin" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

// Main App wrapper
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
