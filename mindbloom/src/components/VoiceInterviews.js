import React, { useState, useEffect, useRef } from 'react';
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
  XCircleIcon,
  StopIcon
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

const VoiceInterviews = ({ selectedPatient }) => {
  const [interviews, setInterviews] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateInterview, setShowCreateInterview] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviewResults, setInterviewResults] = useState(null);
  const [showInterviewDemo, setShowInterviewDemo] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [realTimeFeedback, setRealTimeFeedback] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [memorySuggestions, setMemorySuggestions] = useState(null);
  
  // Voice recording states
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recordingError, setRecordingError] = useState('');
  
  // Refs for recording
  const recordingIntervalRef = useRef(null);
  const streamRef = useRef(null);

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

  // Cleanup recording resources
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    try {
      setRecordingError('');
      setAudioChunks([]);
      setRecordingTime(0);
      setTranscription('');
      
      // Check if browser supports MediaRecorder
      if (!window.MediaRecorder) {
        setRecordingError('Your browser does not support audio recording. Please use a modern browser.');
        return;
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      // Create MediaRecorder with fallback mime types
      let recorder;
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ];
      
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          recorder = new MediaRecorder(stream, { mimeType });
          break;
        }
      }
      
      if (!recorder) {
        recorder = new MediaRecorder(stream);
      }
      
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setAudioChunks(chunks);
      };
      
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setRecordingError('Recording failed. Please try again.');
        setIsRecording(false);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error.name === 'NotAllowedError') {
        setRecordingError('Microphone access denied. Please allow microphone permissions and try again.');
      } else if (error.name === 'NotFoundError') {
        setRecordingError('No microphone found. Please connect a microphone and try again.');
      } else {
        setRecordingError('Unable to access microphone. Please check permissions and try again.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Process the recorded audio
      processRecordedAudio();
    }
  };

  const processRecordedAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessingAudio(true);
    
    try {
      // Convert audio to text using Web Speech API
      const text = await transcribeAudio(audioBlob);
      setTranscription(text);
      setCurrentResponse(text);
      
      // Also send audio file to backend for analysis
      await analyzeVoiceResponse(audioBlob, text);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setRecordingError('Failed to process audio. Please try again.');
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const analyzeVoiceResponse = async (audioBlob, transcription) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');
      formData.append('question', interviewQuestions[currentQuestion]);
      formData.append('patient_id', selectedPatient);

      const response = await fetch('http://localhost:8000/api/interview-analysis/analyze-voice-response', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const analysis = await response.json();
        setAnalysisResults(analysis.response_analysis);
        setMemorySuggestions(analysis.memory_suggestions);
        
        // Create memory from the response
        await createMemoryFromResponse(transcription, analysis);
        
        // Get real-time feedback
        const feedbackResponse = await fetch('http://localhost:8000/api/interview-analysis/real-time-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            current_response: transcription,
            question: interviewQuestions[currentQuestion]
          })
        });
        
        if (feedbackResponse.ok) {
          const feedback = await feedbackResponse.json();
          setRealTimeFeedback(feedback);
        }
      }
    } catch (error) {
      console.error('Voice analysis failed:', error);
      // Fallback to text analysis
      await analyzeResponse(transcription);
    }
  };

  const createMemoryFromResponse = async (transcription, analysis) => {
    try {
      const memoryData = {
        patient_id: selectedPatient,
        title: `Memory Interview - Question ${currentQuestion + 1}`,
        content: transcription,
        question: interviewQuestions[currentQuestion],
        analysis: analysis.response_analysis,
        memory_type: analysis.response_analysis?.memory_type || 'episodic',
        emotional_tone: analysis.response_analysis?.emotional_engagement || 8.0,
        cognitive_score: analysis.response_analysis?.cognitive_coherence || 8.0,
        dementia_indicators: analysis.response_analysis?.dementia_indicators || {},
        care_recommendations: analysis.response_analysis?.care_recommendations || [],
        created_at: new Date().toISOString(),
        source: 'voice_interview'
      };

      const response = await fetch('http://localhost:8000/api/memories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryData)
      });

      if (response.ok) {
        const memory = await response.json();
        console.log('Memory created:', memory);
        setCurrentResponse(transcription);
      }
    } catch (error) {
      console.error('Failed to create memory:', error);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    return new Promise((resolve, reject) => {
      // Create audio element to play the recording
      const audio = new Audio(URL.createObjectURL(audioBlob));
      
      // Use Web Speech API for transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          resolve(transcript);
        };
        
        recognition.onerror = (event) => {
          reject(new Error('Speech recognition failed'));
        };
        
        // Start recognition
        recognition.start();
        
        // Play the audio for recognition
        audio.play();
        
      } else {
        // Fallback: return a placeholder text
        resolve("Patient response to memory question about family traditions.");
      }
    });
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Interview questions for demo
  const interviewQuestions = [
    "Can you tell me about a special family tradition from your childhood?",
    "What's one of your favorite memories with your parents or grandparents?",
    "Do you remember a time when you felt really proud of something you accomplished?",
    "What's a place that holds special meaning for you and why?",
    "Can you share a story about a friend who was important to you growing up?"
  ];

  const [currentInterview, setCurrentInterview] = useState(null);

  const startInterview = (interview) => {
    setCurrentInterview(interview);
    setShowInterviewDemo(true);
    setCurrentQuestion(0);
    setInterviewProgress(0);
    setIsRecording(false);
    setCurrentResponse('');
    setAnalysisResults(null);
    setRealTimeFeedback(null);
    setMemorySuggestions(null);
    setTranscription('');
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setInterviewProgress(((currentQuestion + 1) / interviewQuestions.length) * 100);
      setCurrentResponse('');
      setAnalysisResults(null);
      setRealTimeFeedback(null);
      setMemorySuggestions(null);
      setTranscription('');
      setAudioBlob(null);
      setAudioUrl(null);
    } else {
      // Interview completed
      setShowInterviewDemo(false);
      // Update interview status to completed
      if (currentInterview) {
        setInterviews(prev => prev.map(int => 
          int.id === currentInterview.id 
            ? { ...int, status: 'completed' }
            : int
        ));
        setSelectedInterview({ ...currentInterview, status: 'completed' });
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const analyzeResponse = async (responseText) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('response_text', responseText);
      formData.append('question', interviewQuestions[currentQuestion]);
      formData.append('patient_id', selectedPatient);

      const response = await fetch('http://localhost:8000/api/interview-analysis/analyze-response', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const analysis = await response.json();
        setAnalysisResults(analysis);
        
        // Get real-time feedback
        const feedbackResponse = await fetch('http://localhost:8000/api/interview-analysis/real-time-feedback', {
          method: 'POST',
          body: formData
        });
        
        if (feedbackResponse.ok) {
          const feedback = await feedbackResponse.json();
          setRealTimeFeedback(feedback);
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Fallback to mock analysis
      setAnalysisResults({
        analysis: {
          memory_recall_accuracy: 8.5,
          emotional_engagement: 9.0,
          cognitive_coherence: 8.0,
          memory_type: "episodic",
          dementia_indicators: {
            word_finding_difficulty: "low",
            memory_consistency: "high",
            emotional_stability: "stable"
          },
          care_recommendations: [
            "Continue memory exercises",
            "Encourage social interaction",
            "Monitor for any changes in speech patterns"
          ],
          observations: [
            "Patient shows strong episodic memory recall",
            "Emotional engagement is high and positive",
            "Speech patterns are clear and coherent",
            "Good word-finding abilities demonstrated"
          ]
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!selectedPatient) {
    return (
      <div className="space-y-8">
        <div 
          className="rounded-2xl shadow-lg p-8 text-center"
          style={{ backgroundColor: BRAND_COLORS.white }}
        >
          <UserIcon 
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
            Please select a patient from the sidebar to manage their voice interviews.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div 
        className="rounded-2xl shadow-lg p-8"
        style={{ backgroundColor: BRAND_COLORS.white }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
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
                Voice Memory Interviews
              </h1>
              <p 
                className="text-lg"
                style={{ color: BRAND_COLORS.accent }}
              >
                Create voice-based interviews to help {selectedPatient === '1' ? 'Sarah' : 
                selectedPatient === '2' ? 'Robert' : 'Margaret'} share their memories
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateInterview(true)}
            className="px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: BRAND_COLORS.white
            }}
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Interview</span>
          </button>
        </div>

        {/* Benefits */}
        <div 
          className="rounded-xl p-6"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <ChatBubbleLeftIcon 
              className="h-6 w-6" 
              style={{ color: BRAND_COLORS.accent }}
            />
            <h3 
              className="text-xl font-semibold"
              style={{ color: BRAND_COLORS.accent }}
            >
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
                    <button
                      onClick={() => startInterview(interview)}
                      className="px-3 py-1 rounded-lg text-sm transition-colors"
                      style={{
                        backgroundColor: BRAND_COLORS.primary,
                        color: BRAND_COLORS.white
                      }}
                    >
                      Start Interview
                    </button>
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
              className="px-6 py-3 rounded-lg transition-colors"
              style={{
                backgroundColor: BRAND_COLORS.primary,
                color: BRAND_COLORS.white
              }}
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
                  {currentResponse || transcription || "Memory will be generated from your voice responses..."}
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

      {/* Interview Demo Modal */}
      {showInterviewDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div 
            className="rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
            style={{ backgroundColor: BRAND_COLORS.white }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 
                className="text-2xl font-bold"
                style={{ color: BRAND_COLORS.accent }}
              >
                Voice Memory Interview
              </h2>
              <button
                onClick={() => setShowInterviewDemo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span 
                  className="text-sm font-medium"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Question {currentQuestion + 1} of {interviewQuestions.length}
                </span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: BRAND_COLORS.primary }}
                >
                  {Math.round(interviewProgress)}% Complete
                </span>
              </div>
              <div 
                className="w-full bg-gray-200 rounded-full h-2"
                style={{ backgroundColor: BRAND_COLORS.primaryLight }}
              >
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${interviewProgress}%`,
                    backgroundColor: BRAND_COLORS.primary
                  }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 
                className="text-xl font-semibold mb-4"
                style={{ color: BRAND_COLORS.accent }}
              >
                {interviewQuestions[currentQuestion]}
              </h3>
              
              {/* Instructions */}
              <div 
                className="rounded-lg p-3 mb-4"
                style={{ backgroundColor: BRAND_COLORS.primaryLight }}
              >
                <p 
                  className="text-sm"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  <strong>Instructions:</strong> Click the microphone button to start recording your response. 
                  Speak clearly and naturally about your memory. Click the stop button when you're finished.
                </p>
              </div>
              
              {/* Recording Interface */}
              <div className="space-y-4 mb-6">
                {/* Recording Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={toggleRecording}
                    disabled={isProcessingAudio}
                    className={`p-4 rounded-full transition-all duration-200 ${
                      isRecording ? 'animate-pulse' : ''
                    } ${isProcessingAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      backgroundColor: isRecording ? BRAND_COLORS.accent : BRAND_COLORS.primary,
                      color: BRAND_COLORS.white
                    }}
                  >
                    {isRecording ? (
                      <StopIcon className="h-8 w-8" />
                    ) : isProcessingAudio ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <MicrophoneIcon className="h-8 w-8" />
                    )}
                  </button>
                  
                  <div className="text-center">
                    <p 
                      className="text-lg font-medium"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      {isRecording ? `Recording... ${formatRecordingTime(recordingTime)}` : 
                       isProcessingAudio ? 'Processing Audio...' : 'Click to Record'}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      {isRecording ? 'Click to stop recording' : 
                       isProcessingAudio ? 'Converting speech to text...' : 'Speak naturally about your memory'}
                    </p>
                  </div>
                </div>

                {/* Recording Error */}
                {recordingError && (
                  <div 
                    className="rounded-lg p-3 text-center"
                    style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                  >
                    <p className="text-sm text-red-600">{recordingError}</p>
                  </div>
                )}

                {/* Audio Playback */}
                {audioUrl && !isRecording && (
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Your Recording:
                    </h4>
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/webm" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {/* Transcription Display */}
                {transcription && (
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: BRAND_COLORS.accentLight }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Transcribed Response:
                    </h4>
                    <p 
                      className="text-sm italic"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      "{transcription}"
                    </p>
                  </div>
                )}
              </div>

              {/* AI Analysis Results */}
              {analysisResults && !isRecording && (
                <div className="space-y-4 mb-6">
                  {/* Response Display */}
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Patient Response:
                    </h4>
                    <p 
                      className="text-sm italic"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      "{transcription || currentResponse}"
                    </p>
                  </div>

                  {/* Analysis Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div 
                      className="rounded-lg p-4 text-center"
                      style={{ backgroundColor: BRAND_COLORS.accentLight }}
                    >
                      <div 
                        className="text-2xl font-bold mb-1"
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        {analysisResults.analysis?.memory_recall_accuracy || 8.5}/10
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        Memory Recall
                      </div>
                    </div>
                    <div 
                      className="rounded-lg p-4 text-center"
                      style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                    >
                      <div 
                        className="text-2xl font-bold mb-1"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        {analysisResults.analysis?.emotional_engagement || 9.0}/10
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        Emotional Engagement
                      </div>
                    </div>
                    <div 
                      className="rounded-lg p-4 text-center"
                      style={{ backgroundColor: BRAND_COLORS.accentLight }}
                    >
                      <div 
                        className="text-2xl font-bold mb-1"
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        {analysisResults.analysis?.cognitive_coherence || 8.0}/10
                      </div>
                      <div 
                        className="text-sm"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        Cognitive Coherence
                      </div>
                    </div>
                  </div>

                  {/* Dementia Indicators */}
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Dementia Assessment:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span 
                          className="font-medium"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          Word Finding:
                        </span>
                        <span 
                          className="ml-2"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          {analysisResults.analysis?.dementia_indicators?.word_finding_difficulty || 'low'}
                        </span>
                      </div>
                      <div>
                        <span 
                          className="font-medium"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          Memory Consistency:
                        </span>
                        <span 
                          className="ml-2"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          {analysisResults.analysis?.dementia_indicators?.memory_consistency || 'high'}
                        </span>
                      </div>
                      <div>
                        <span 
                          className="font-medium"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          Emotional Stability:
                        </span>
                        <span 
                          className="ml-2"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          {analysisResults.analysis?.dementia_indicators?.emotional_stability || 'stable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Care Recommendations */}
                  <div 
                    className="rounded-lg p-4"
                    style={{ backgroundColor: BRAND_COLORS.accentLight }}
                  >
                    <h4 
                      className="font-semibold mb-2"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Care Recommendations:
                    </h4>
                    <ul className="text-sm space-y-1">
                      {analysisResults.analysis?.care_recommendations?.map((rec, index) => (
                        <li 
                          key={index}
                          className="flex items-start space-x-2"
                          style={{ color: BRAND_COLORS.accent }}
                        >
                          <span 
                            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: BRAND_COLORS.primary }}
                          ></span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Memory Suggestions */}
                  {memorySuggestions && memorySuggestions.memory_suggestions?.relevant_memories?.length > 0 && (
                    <div 
                      className="rounded-lg p-4"
                      style={{ backgroundColor: BRAND_COLORS.primaryLight }}
                    >
                      <h4 
                        className="font-semibold mb-2"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        📖 Related Memories:
                      </h4>
                      <div className="space-y-3">
                        {memorySuggestions.memory_suggestions.relevant_memories.map((memory, index) => (
                          <div 
                            key={index}
                            className="rounded-lg p-3"
                            style={{ backgroundColor: BRAND_COLORS.white }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h5 
                                className="font-medium text-sm"
                                style={{ color: BRAND_COLORS.accent }}
                              >
                                {memory.memory_title || `Memory ${memory.memory_id}`}
                              </h5>
                              <span 
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ 
                                  backgroundColor: BRAND_COLORS.primary,
                                  color: BRAND_COLORS.white
                                }}
                              >
                                {memory.relevance_score}/10 relevance
                              </span>
                            </div>
                            <p 
                              className="text-xs mb-2"
                              style={{ color: BRAND_COLORS.accent }}
                            >
                              {memory.connection}
                            </p>
                            <div 
                              className="text-xs p-2 rounded"
                              style={{ 
                                backgroundColor: BRAND_COLORS.accentLight,
                                color: BRAND_COLORS.accent
                              }}
                            >
                              <strong>💭 "Look back at this memory where...</strong><br/>
                              {memory.suggested_prompt}
                            </div>
                          </div>
                        ))}
                      </div>
                      {memorySuggestions.memory_suggestions.suggested_follow_up && (
                        <div 
                          className="mt-3 p-2 rounded"
                          style={{ 
                            backgroundColor: BRAND_COLORS.accentLight,
                            border: `1px solid ${BRAND_COLORS.primary}`
                          }}
                        >
                          <p 
                            className="text-xs"
                            style={{ color: BRAND_COLORS.accent }}
                          >
                            <strong>💡 Follow-up:</strong> {memorySuggestions.memory_suggestions.suggested_follow_up}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Loading State */}
              {isAnalyzing && (
                <div className="text-center py-4">
                  <div 
                    className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2"
                    style={{ borderColor: BRAND_COLORS.primary }}
                  ></div>
                  <p 
                    className="text-sm"
                    style={{ color: BRAND_COLORS.accent }}
                  >
                    Analyzing response with AI...
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setShowInterviewDemo(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                End Interview
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.white
                }}
              >
                {currentQuestion === interviewQuestions.length - 1 ? 'Complete Interview' : 'Next Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterviews; 