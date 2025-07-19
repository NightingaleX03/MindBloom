import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  ChartBarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  BookOpenIcon,
  EyeIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const CaregiverDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'patient'
  const [insights, setInsights] = useState({});

  // Mock data with detailed patient information
  useEffect(() => {
    setPatients([
      {
        id: 1,
        name: "Sarah Johnson",
        age: 78,
        lastActive: "2024-01-15",
        moodTrend: "positive",
        memoryCount: 12,
        completedTasks: 8,
        totalTasks: 10,
        alerts: ["Missed medication yesterday", "Low mood detected"],
        journals: [
          {
            id: 1,
            title: "Family Dinner Memory",
            content: "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous lasagna filled the house, and everyone was laughing and sharing stories. It was one of those perfect moments where you feel completely surrounded by love.",
            mood: "happy",
            date: "2024-01-15",
            time: "2:30 PM"
          },
          {
            id: 2,
            title: "Park Walk Today",
            content: "The beautiful spring day when we walked through the park and saw all the flowers blooming. The cherry blossoms were falling like pink snow, and we sat on a bench watching children play. The air was filled with the sweet scent of spring.",
            mood: "calm",
            date: "2024-01-14",
            time: "10:15 AM"
          },
          {
            id: 3,
            title: "Birthday Surprise",
            content: "The surprise birthday party that made me feel so loved and special. When I walked into the room and everyone shouted 'Surprise!', I was completely overwhelmed with joy. The cake was chocolate with vanilla frosting, just like I always wanted.",
            mood: "excited",
            date: "2024-01-13",
            time: "7:45 PM"
          }
        ],
        memories: [
          {
            id: 1,
            title: "Beach Day",
            content: "That perfect day at the beach when the waves were gentle and the sun was warm but not too hot. We built sandcastles and collected seashells. The sound of the ocean was so peaceful, it felt like time stood still.",
            mood: "peaceful",
            date: "2024-01-12",
            category: "family"
          },
          {
            id: 2,
            title: "First Snow",
            content: "The first snowfall of the year when everything was covered in white. We went outside and made snow angels, then came back inside for hot chocolate with marshmallows. The world looked so magical and new.",
            mood: "wonder",
            date: "2024-01-11",
            category: "childhood"
          },
          {
            id: 3,
            title: "Garden Harvest",
            content: "The day we harvested vegetables from our garden. The tomatoes were so red and juicy, and the carrots were sweet and crisp. We made a fresh salad with everything we picked, and it tasted better than anything from the store.",
            mood: "satisfied",
            date: "2024-01-10",
            category: "daily"
          }
        ]
      },
      {
        id: 2,
        name: "Robert Smith",
        age: 82,
        lastActive: "2024-01-15",
        moodTrend: "stable",
        memoryCount: 8,
        completedTasks: 5,
        totalTasks: 7,
        alerts: [],
        journals: [
          {
            id: 1,
            title: "Morning Coffee",
            content: "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
            mood: "calm",
            date: "2024-01-15",
            time: "8:00 AM"
          },
          {
            id: 2,
            title: "Old Photographs",
            content: "Found some old photographs in the attic today. Looking at pictures from my wedding day brought back so many wonderful memories. My wife looked so beautiful in her white dress.",
            mood: "nostalgic",
            date: "2024-01-14",
            time: "3:20 PM"
          }
        ],
        memories: [
          {
            id: 1,
            title: "Wedding Day",
            content: "The most beautiful day of my life. My wife looked absolutely stunning in her white dress. The church was filled with flowers and our families were all there to celebrate with us.",
            mood: "happy",
            date: "2024-01-13",
            category: "family"
          },
          {
            id: 2,
            title: "Fishing Trip",
            content: "Remember that fishing trip with my son when he was just a boy? We spent the whole day by the lake, and he caught his first fish. The pride in his eyes was unforgettable.",
            mood: "proud",
            date: "2024-01-12",
            category: "family"
          }
        ]
      },
      {
        id: 3,
        name: "Margaret Davis",
        age: 75,
        lastActive: "2024-01-14",
        moodTrend: "negative",
        memoryCount: 5,
        completedTasks: 3,
        totalTasks: 8,
        alerts: ["Hasn't logged in for 2 days", "Expressed feeling lonely"],
        journals: [
          {
            id: 1,
            title: "Feeling Lonely",
            content: "Today was a difficult day. I miss my husband so much. The house feels so empty without him. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
            mood: "sad",
            date: "2024-01-14",
            time: "4:15 PM"
          }
        ],
        memories: [
          {
            id: 1,
            title: "Husband's Laugh",
            content: "I can still hear his laugh echoing through the house. He had the most wonderful sense of humor and could always make me smile, even on my worst days.",
            mood: "nostalgic",
            date: "2024-01-13",
            category: "family"
          }
        ]
      }
    ]);

    setInsights({
      totalPatients: 3,
      activeToday: 2,
      needsAttention: 1,
      averageMood: "stable",
      recentMemories: 25,
      completedTasks: 16,
      totalTasks: 25
    });
  }, []);

  const getMoodColor = (trend) => {
    const colors = {
      positive: 'text-green-600',
      stable: 'text-blue-600',
      negative: 'text-red-600'
    };
    return colors[trend] || colors.stable;
  };

  const getCompletionRate = (completed, total) => {
    return Math.round((completed / total) * 100);
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setViewMode('patient');
  };

  const handleBackToOverview = () => {
    setViewMode('overview');
    setSelectedPatient(null);
  };

  // Patient Detail View
  if (viewMode === 'patient' && selectedPatient) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={handleBackToOverview}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="p-3 bg-purple-100 rounded-full">
              <HeartIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedPatient.name}
              </h1>
              <p className="text-lg text-gray-600">
                {selectedPatient.age} years old • Last active: {new Date(selectedPatient.lastActive).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Patient Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{selectedPatient.memoryCount}</div>
                <div className="text-gray-600">Total Memories</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {getCompletionRate(selectedPatient.completedTasks, selectedPatient.totalTasks)}%
                </div>
                <div className="text-gray-600">Task Completion</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{selectedPatient.journals.length}</div>
                <div className="text-gray-600">Journal Entries</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{selectedPatient.alerts.length}</div>
                <div className="text-gray-600">Active Alerts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {selectedPatient.alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-900">Alerts</h2>
            </div>
            <ul className="space-y-2">
              {selectedPatient.alerts.map((alert, index) => (
                <li key={index} className="text-red-700 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Journal Entries */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpenIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Journal Entries
            </h2>
          </div>
          
          <div className="space-y-6">
            {selectedPatient.journals.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {entry.title}
                  </h3>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(entry.mood)}`}>
                      {entry.mood}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(entry.date).toLocaleDateString()} at {entry.time}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Memories */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center space-x-3 mb-6">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Shared Memories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedPatient.memories.map((memory) => (
              <div key={memory.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {memory.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(memory.mood)}`}>
                    {memory.mood}
                  </span>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {memory.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(memory.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-purple-600 font-medium">
                    {memory.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Overview Dashboard
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-full">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Caregiver Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Monitor and support your loved ones with compassion
            </p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{insights.totalPatients}</h3>
                <p className="text-gray-600">Total Patients</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{insights.completedTasks}</h3>
                <p className="text-gray-600">Completed Tasks</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <SparklesIcon className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{insights.recentMemories}</h3>
                <p className="text-gray-600">Recent Memories</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{insights.needsAttention}</h3>
                <p className="text-gray-600">Need Attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Your Patients
        </h2>
        
        <div className="space-y-6">
          {patients.map((patient) => (
            <div
              key={patient.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handlePatientClick(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <HeartIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {patient.name}
                    </h3>
                    <p className="text-gray-600">{patient.age} years old</p>
                    <p className="text-sm text-gray-500">
                      Last active: {new Date(patient.lastActive).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(patient.moodTrend)}`}>
                    {patient.moodTrend}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{patient.memoryCount}</div>
                  <div className="text-sm text-gray-600">Memories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {getCompletionRate(patient.completedTasks, patient.totalTasks)}%
                  </div>
                  <div className="text-sm text-gray-600">Task Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{patient.journals.length}</div>
                  <div className="text-sm text-gray-600">Journal Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{patient.alerts.length}</div>
                  <div className="text-sm text-gray-600">Alerts</div>
                </div>
              </div>

              {patient.alerts.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Alerts</h4>
                  </div>
                  <ul className="space-y-1">
                    {patient.alerts.map((alert, index) => (
                      <li key={index} className="text-sm text-red-700">• {alert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Click to view detailed profile
                </div>
                <EyeIcon className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <SparklesIcon className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            AI Insights
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mood Trends
            </h3>
            <p className="text-gray-600 mb-4">
              Overall patient mood is stable this week. Sarah has been sharing more happy memories, 
              while Robert's mood has remained consistent. Margaret may need additional support.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sarah Johnson</span>
                <span className="text-green-600 font-medium">↑ Improving</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Robert Smith</span>
                <span className="text-blue-600 font-medium">→ Stable</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Margaret Davis</span>
                <span className="text-red-600 font-medium">↓ Needs Support</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Patterns
            </h3>
            <p className="text-gray-600 mb-4">
              Patients are most active in the morning hours. Family-related memories are the most 
              frequently shared, followed by childhood experiences.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Family Memories</span>
                <span className="text-purple-600 font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Childhood Stories</span>
                <span className="text-purple-600 font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recent Events</span>
                <span className="text-purple-600 font-medium">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="p-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-center">
            <HeartIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Send Encouragement</h3>
            <p className="text-purple-100 text-sm">Send a supportive message</p>
          </button>

          <button className="p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-center">
            <ClockIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Schedule Check-in</h3>
            <p className="text-blue-100 text-sm">Set up a video call</p>
          </button>

          <button className="p-6 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-center">
            <SparklesIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Generate Prompts</h3>
            <p className="text-green-100 text-sm">Create memory prompts</p>
          </button>

          <button className="p-6 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-center">
            <ChartBarIcon className="h-8 w-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">View Reports</h3>
            <p className="text-orange-100 text-sm">Detailed analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaregiverDashboard; 