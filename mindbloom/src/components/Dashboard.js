import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  CpuChipIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon,
  CubeIcon,
  CalendarIcon,
  UserGroupIcon,
  PlusIcon,
  SparklesIcon,
  HeartIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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

const Dashboard = ({ selectedPatient }) => {
  const { user } = useAuth0();
  const [recentMemories, setRecentMemories] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    setRecentMemories([
      {
        id: 1,
        title: "Family Dinner at Grandma's",
        content: "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous apple pie filled the whole house...",
        mood: "happy",
        date: "2024-01-15"
      },
      {
        id: 2,
        title: "Walking in the Park",
        content: "The beautiful spring day when we walked through the park and saw all the flowers blooming...",
        mood: "calm",
        date: "2024-01-14"
      }
    ]);

    setTodayEvents([
      {
        id: 1,
        title: "Morning Medication",
        time: "9:00 AM",
        type: "medication",
        completed: false
      },
      {
        id: 2,
        title: "Afternoon Walk",
        time: "2:00 PM",
        type: "activity",
        completed: false
      },
      {
        id: 3,
        title: "Evening Medication",
        time: "8:00 PM",
        type: "medication",
        completed: false
      }
    ]);
  }, []);

  const quickActions = [
    {
      name: 'Add Memory',
      icon: PlusIcon,
      href: '/journal',
      description: 'Record a new memory or experience'
    },
    {
      name: 'Chat with AI',
      icon: ChatBubbleLeftRightIcon,
      href: '/ai-chat',
      description: 'Talk to your AI companion'
    },
    {
      name: 'Visit Garden',
      icon: CubeIcon,
      href: '/garden',
      description: 'Explore your 3D memory garden'
    },
    {
      name: 'View Calendar',
      icon: CalendarIcon,
      href: '/calendar',
      description: 'Check your daily schedule'
    }
  ];

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800',
      sad: 'bg-blue-100 text-blue-800',
      excited: 'bg-red-100 text-red-800',
      calm: 'bg-green-100 text-green-800',
      anxious: 'bg-orange-100 text-orange-800',
      neutral: 'bg-gray-100 text-gray-800'
    };
    return colors[mood] || colors.neutral;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div 
        className="rounded-2xl shadow-lg p-8"
        style={{ backgroundColor: BRAND_COLORS.white }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div 
            className="p-3 rounded-full"
            style={{ backgroundColor: BRAND_COLORS.primaryLight }}
          >
            <MindbloomLogo size="md" />
          </div>
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: BRAND_COLORS.accent }}
            >
              Welcome back, {user?.name || 'Friend'}!
            </h1>
            <p 
              className="text-lg"
              style={{ color: BRAND_COLORS.accent }}
            >
              How are you feeling today? Let's explore your memories together.
            </p>
          </div>
        </div>

        {/* AI Prompt Section */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon 
              className="h-6 w-6" 
              style={{ color: BRAND_COLORS.accent }}
            />
            <h3 
              className="text-xl font-semibold"
              style={{ color: BRAND_COLORS.accent }}
            >
              Today's Memory Prompt
            </h3>
          </div>
          <p 
            className="text-lg mb-4"
            style={{ color: BRAND_COLORS.accent }}
          >
            "Do you remember a special moment with your family? Maybe a holiday celebration or a simple dinner together?"
          </p>
          <button 
            className="px-6 py-3 rounded-lg transition-colors text-lg"
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: BRAND_COLORS.white
            }}
          >
            Share Your Memory
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div 
        className="rounded-2xl shadow-lg p-8"
        style={{ backgroundColor: BRAND_COLORS.white }}
      >
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: BRAND_COLORS.accent }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <a
              key={action.name}
              href={action.href}
              className="group block"
            >
              <div 
                className="rounded-xl p-6 text-white transition-all transform group-hover:scale-105"
                style={{
                  backgroundColor: index % 2 === 0 ? BRAND_COLORS.primary : BRAND_COLORS.accent
                }}
              >
                <action.icon className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{action.name}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div 
        className="rounded-2xl shadow-lg p-8"
        style={{ backgroundColor: BRAND_COLORS.white }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <ClockIcon 
            className="h-6 w-6" 
            style={{ color: BRAND_COLORS.primary }}
          />
          <h2 
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.accent }}
          >
            Today's Schedule
          </h2>
        </div>
        <div className="space-y-4">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: BRAND_COLORS.gray }}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: event.type === 'medication' ? BRAND_COLORS.primary : BRAND_COLORS.accent 
                  }}
                ></div>
                <div>
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: BRAND_COLORS.accent }}
                  >
                    {event.title}
                  </h3>
                  <p style={{ color: BRAND_COLORS.accent }}>{event.time}</p>
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: event.completed ? BRAND_COLORS.primaryLight : BRAND_COLORS.accentLight,
                  color: event.completed ? BRAND_COLORS.accent : BRAND_COLORS.white
                }}
              >
                {event.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Memories */}
      <div 
        className="rounded-2xl shadow-lg p-8"
        style={{ backgroundColor: BRAND_COLORS.white }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpenIcon 
              className="h-6 w-6" 
              style={{ color: BRAND_COLORS.primary }}
            />
            <h2 
              className="text-2xl font-bold"
              style={{ color: BRAND_COLORS.accent }}
            >
              Recent Memories
            </h2>
          </div>
          <a
            href="/journal"
            className="font-medium"
            style={{ color: BRAND_COLORS.primary }}
          >
            View All →
          </a>
        </div>
        <div className="space-y-6">
          {recentMemories.map((memory) => (
            <div
              key={memory.id}
              className="border rounded-xl p-6 hover:shadow-md transition-shadow"
              style={{ borderColor: BRAND_COLORS.primaryLight }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 
                  className="text-xl font-semibold"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  {memory.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(memory.mood)}`}>
                  {memory.mood}
                </span>
              </div>
              <p 
                className="text-lg mb-4"
                style={{ color: BRAND_COLORS.accent }}
              >
                {memory.content}
              </p>
              <div className="flex items-center justify-between">
                <span 
                  className="text-sm"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  {new Date(memory.date).toLocaleDateString()}
                </span>
                <button 
                  className="font-medium"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 