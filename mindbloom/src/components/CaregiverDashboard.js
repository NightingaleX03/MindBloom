import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  ChartBarIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const CaregiverDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [insights, setInsights] = useState({});

  // Mock data
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
        alerts: ["Missed medication yesterday", "Low mood detected"]
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
        alerts: []
      }
    ]);

    setInsights({
      totalPatients: 2,
      activeToday: 2,
      needsAttention: 1,
      averageMood: "positive",
      recentMemories: 20,
      completedTasks: 13,
      totalTasks: 17
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
              onClick={() => setSelectedPatient(patient)}
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

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="text-2xl font-bold text-blue-600">
                    {patient.completedTasks}/{patient.totalTasks}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Today</div>
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
              Overall patient mood is positive this week. Sarah has been sharing more happy memories, 
              while Robert's mood has remained stable.
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
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Memory Patterns
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

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPatient.name} - Details
              </h2>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Age</h3>
                  <p className="text-gray-600">{selectedPatient.age} years old</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mood Trend</h3>
                  <p className={`${getMoodColor(selectedPatient.moodTrend)}`}>
                    {selectedPatient.moodTrend}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Memories Shared</h3>
                  <p className="text-gray-600">{selectedPatient.memoryCount} this month</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Task Completion</h3>
                  <p className="text-gray-600">
                    {getCompletionRate(selectedPatient.completedTasks, selectedPatient.totalTasks)}%
                  </p>
                </div>
              </div>

              {selectedPatient.alerts.length > 0 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">Recent Alerts</h3>
                  <ul className="space-y-1">
                    {selectedPatient.alerts.map((alert, index) => (
                      <li key={index} className="text-sm text-red-700">• {alert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-4">
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Send Message
                </button>
                <button className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors">
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverDashboard; 