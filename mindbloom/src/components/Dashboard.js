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

const Dashboard = () => {
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
      color: 'bg-purple-600 hover:bg-purple-700',
      description: 'Record a new memory or experience'
    },
    {
      name: 'Chat with AI',
      icon: ChatBubbleLeftRightIcon,
      href: '/ai-chat',
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Talk to your AI companion'
    },
    {
      name: 'Visit Garden',
      icon: CubeIcon,
      href: '/garden',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Explore your 3D memory garden'
    },
    {
      name: 'View Calendar',
      icon: CalendarIcon,
      href: '/calendar',
      color: 'bg-orange-600 hover:bg-orange-700',
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
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-full">
            <CpuChipIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Friend'}!
            </h1>
            <p className="text-lg text-gray-600">
              How are you feeling today? Let's explore your memories together.
            </p>
          </div>
        </div>

        {/* AI Prompt Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Today's Memory Prompt
            </h3>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            "Do you remember a special moment with your family? Maybe a holiday celebration or a simple dinner together?"
          </p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg">
            Share Your Memory
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="group block"
            >
              <div className={`${action.color} rounded-xl p-6 text-white transition-all transform group-hover:scale-105`}>
                <action.icon className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{action.name}</h3>
                <p className="text-purple-100 text-sm">{action.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <ClockIcon className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Today's Schedule
          </h2>
        </div>
        <div className="space-y-4">
          {todayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'medication' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-gray-600">{event.time}</p>
                </div>
              </div>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  event.completed
                    ? 'bg-green-100 text-green-800'
                    : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                }`}
              >
                {event.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Memories */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Memories
            </h2>
          </div>
          <a
            href="/journal"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View All →
          </a>
        </div>
        <div className="space-y-6">
          {recentMemories.map((memory) => (
            <div
              key={memory.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {memory.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(memory.mood)}`}>
                  {memory.mood}
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-4">
                {memory.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(memory.date).toLocaleDateString()}
                </span>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caregiver Support */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-4">
          <HeartIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Caregiver Support
          </h2>
        </div>
        <p className="text-lg text-gray-700 mb-6">
          Your caregivers can monitor your progress and provide support when needed. 
          They can see your memory patterns and help create new experiences together.
        </p>
        <div className="flex space-x-4">
          <a
            href="/caregiver"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Caregiver View
          </a>
          <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-lg">
            Contact Caregiver
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 