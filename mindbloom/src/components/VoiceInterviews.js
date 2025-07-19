import React, { useState, useEffect } from 'react';
import { 
  MicrophoneIcon, 
  PlayIcon, 
  PauseIcon, 
  EyeIcon,
  PlusIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const VoiceInterviews = ({ selectedPatient }) => {
  const [interviews, setInterviews] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateInterview, setShowCreateInterview] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewResults, setInterviewResults] = useState(null);

  // Mock data for demonstration
  const mockInterviews = [
    {
      id: '1',
      patient_name: selectedPatient === '1' ? 'Sarah' : selectedPatient === '2' ? 'Robert' : 'Margaret',
      status: 'completed',
      created_at: '2024-01-15T10:30:00Z',
      interview_url: 'https://ribbon.ai/interview/123',
      memory_id: 'mem-1'
    },
    {
      id: '2',
      patient_name: selectedPatient === '1' ? 'Sarah' : selectedPatient === '2' ? 'Robert' : 'Margaret',
      status: 'in_progress',
      created_at: '2024-01-14T14:20:00Z',
      interview_url: 'https://ribbon.ai/interview/456'
    },
    {
      id: '3',
      patient_name: selectedPatient === '1' ? 'Sarah' : selectedPatient === '2' ? 'Robert' : 'Margaret',
      status: 'created',
      created_at: '2024-01-13T09:15:00Z',
      interview_url: 'https://ribbon.ai/interview/789'
    }
  ];

  const mockFlows = [
    {
      id: 'flow-1',
      name: 'Memory Interview - Childhood Memories',
      patient_id: selectedPatient,
      created_at: '2024-01-10T10:00:00Z',
      type: 'memory_interview'
    },
    {
      id: 'flow-2',
      name: 'Memory Interview - Family Stories',
      patient_id: selectedPatient,
      created_at: '2024-01-08T14:30:00Z',
      type: 'memory_interview'
    }
  ];

  useEffect(() => {
    if (!selectedPatient) {
      setInterviews([]);
      setFlows([]);
      return;
    }

    // Load mock data
    setInterviews(mockInterviews);
    setFlows(mockFlows);
  }, [selectedPatient]);

  const createMemoryInterview = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Creating interview for patient:', selectedPatient);
      
      // Call the backend API directly
      const response = await fetch(`http://localhost:8000/api/ribbon/memory-interview/${selectedPatient}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setInterviews(prev => [data.interview, ...prev]);
        setShowCreateInterview(false);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create interview: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      setError(`Failed to create interview. Please try again. (${error.message})`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'created':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'in_progress':
        return <ClockIcon className="h-4 w-4" />;
      case 'created':
        return <PlusIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!selectedPatient) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select a Patient
          </h2>
          <p className="text-gray-600">
            Please select a patient from the sidebar to manage their voice interviews.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <MicrophoneIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Voice Memory Interviews
              </h1>
              <p className="text-lg text-gray-600">
                Create voice-based interviews to help {selectedPatient === '1' ? 'Sarah' : 
                selectedPatient === '2' ? 'Robert' : 'Margaret'} share their memories
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateInterview(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Interview</span>
          </button>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ChatBubbleLeftIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              How Voice Interviews Help
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <span>Natural conversation flow for easier memory sharing</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <span>AI-powered prompts guide meaningful conversations</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <span>Automatically converts voice to written memories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Interviews */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <MicrophoneIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Active Interviews
          </h2>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Creating interview...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(interview.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                    {interview.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(interview.created_at)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Memory Interview
              </h3>
              <p className="text-gray-600 mb-4">
                Voice interview for {interview.patient_name}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{interview.patient_name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {interview.status === 'completed' && (
                    <button
                      onClick={() => setSelectedInterview(interview)}
                      className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center space-x-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      <span>View Results</span>
                    </button>
                  )}
                  
                  {interview.status === 'created' && (
                    <a
                      href={interview.interview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                    >
                      Start Interview
                    </a>
                  )}
                  
                  {interview.status === 'in_progress' && (
                    <span className="text-blue-600 text-sm font-medium">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {interviews.length === 0 && (
          <div className="text-center py-8">
            <MicrophoneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Interviews Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first voice interview to help {selectedPatient === '1' ? 'Sarah' : 
              selectedPatient === '2' ? 'Robert' : 'Margaret'} share their memories.
            </p>
            <button
              onClick={() => setShowCreateInterview(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create First Interview
            </button>
          </div>
        )}
      </div>

      {/* Interview Flows */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <ChatBubbleLeftIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Interview Templates
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {flow.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Specialized questions for memory collection
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Created {formatDate(flow.created_at)}
                </span>
                <button
                  onClick={() => setShowCreateInterview(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Interview Modal */}
      {showCreateInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create Voice Interview
              </h2>
              <button
                onClick={() => setShowCreateInterview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Create a voice-based memory interview for {selectedPatient === '1' ? 'Sarah' : 
                selectedPatient === '2' ? 'Robert' : 'Margaret'}. The AI will ask gentle, 
                memory-focused questions and record their responses.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What happens next:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• A unique interview link will be generated</li>
                  <li>• Share the link with your patient</li>
                  <li>• AI will guide them through memory questions</li>
                  <li>• Responses are automatically saved as memories</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateInterview(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createMemoryInterview}
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Interview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Results Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Interview Results
              </h2>
              <button
                onClick={() => setSelectedInterview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Interview Completed</span>
                </div>
                <p className="text-green-800 text-sm">
                  The voice interview has been completed and converted to a memory entry.
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Generated Memory:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  "I remember when I was a child, my grandmother would always make the most wonderful 
                  chocolate chip cookies. The smell would fill the entire house, and we would all gather 
                  in the kitchen to watch her work her magic. She had this special wooden spoon that 
                  she used for everything, and she would let me help her mix the ingredients. The cookies 
                  were always perfectly golden brown and so warm when they came out of the oven..."
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm text-gray-500">
                  Completed {formatDate(selectedInterview.created_at)}
                </span>
                <button
                  onClick={() => {
                    setSelectedInterview(null);
                    // Navigate to memory journal to see the full entry
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View in Journal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterviews; 