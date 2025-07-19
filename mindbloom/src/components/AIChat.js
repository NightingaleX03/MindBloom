import React, { useState, useEffect, useRef } from 'react';
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon,
  SparklesIcon,
  CpuChipIcon,
  HeartIcon,
  BookOpenIcon
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

const AIChat = ({ selectedPatient }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI companion, here to help you explore and cherish your memories. How are you feeling today? Would you like to share a memory or shall I ask you a gentle question to help you remember something special?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const suggestedPrompts = [
    "Tell me about your family",
    "What's your favorite childhood memory?",
    "Do you remember any special holidays?",
    "Tell me about a place you love",
    "What makes you happy?",
    "Share a story about your friends"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: generateAIResponse(inputMessage),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage) => {
    const responses = [
      "That's such a beautiful memory! I can feel the warmth and love in your story. What else do you remember about that time?",
      "Thank you for sharing that with me. It sounds like it was a very special moment. How did it make you feel?",
      "I love hearing about your memories. They're so precious and important. Would you like to tell me more about that?",
      "That's wonderful! Memories like these are what make life so meaningful. What other happy times do you remember?",
      "You have such lovely memories. Each one is like a treasure. Is there anything else you'd like to share about that experience?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Here you would integrate with speech recognition API
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setInputMessage("I remember when we used to go to the park every Sunday morning...");
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSuggestedPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  if (!selectedPatient) {
    return (
      <div className="space-y-8">
        <div 
          className="rounded-2xl shadow-lg p-8 text-center"
          style={{ backgroundColor: BRAND_COLORS.white }}
        >
          <CpuChipIcon 
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
            Please select a patient from the sidebar to start chatting with their AI companion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div 
        className="rounded-2xl shadow-lg p-8 mb-8"
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
              AI Memory Companion
            </h1>
            <p 
              className="text-lg"
              style={{ color: BRAND_COLORS.accent }}
            >
              Your gentle AI friend, here to help you explore and cherish your memories
            </p>
          </div>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="rounded-xl p-6"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
            }}
          >
            <SparklesIcon 
              className="h-8 w-8 mb-4" 
              style={{ color: BRAND_COLORS.accent }}
            />
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: BRAND_COLORS.accent }}
            >
              Memory Prompts
            </h3>
            <p style={{ color: BRAND_COLORS.accent }}>
              Gentle questions to help you recall precious moments
            </p>
          </div>
          <div 
            className="rounded-xl p-6"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND_COLORS.accentLight} 0%, ${BRAND_COLORS.primaryLight} 100%)`
            }}
          >
            <HeartIcon 
              className="h-8 w-8 mb-4" 
              style={{ color: BRAND_COLORS.primary }}
            />
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: BRAND_COLORS.accent }}
            >
              Compassionate Support
            </h3>
            <p style={{ color: BRAND_COLORS.accent }}>
              Understanding and caring responses to your stories
            </p>
          </div>
          <div 
            className="rounded-xl p-6"
            style={{ 
              background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
            }}
          >
            <BookOpenIcon 
              className="h-8 w-8 mb-4" 
              style={{ color: BRAND_COLORS.accent }}
            />
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: BRAND_COLORS.accent }}
            >
              Story Creation
            </h3>
            <p style={{ color: BRAND_COLORS.accent }}>
              Help you create beautiful stories from your memories
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div 
        className="rounded-2xl shadow-lg overflow-hidden"
        style={{ backgroundColor: BRAND_COLORS.white }}
      >
        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'text-white'
                    : 'text-gray-900'
                }`}
                style={{
                  backgroundColor: message.type === 'user' ? BRAND_COLORS.primary : BRAND_COLORS.gray
                }}
              >
                <p className="text-lg leading-relaxed">{message.content}</p>
                <p 
                  className={`text-xs mt-2 ${
                    message.type === 'user' ? 'opacity-80' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div 
                className="text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl"
                style={{ backgroundColor: BRAND_COLORS.gray }}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="animate-spin rounded-full h-4 w-4 border-b-2"
                    style={{ borderColor: BRAND_COLORS.primary }}
                  ></div>
                  <span style={{ color: BRAND_COLORS.accent }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div 
          className="border-t p-4"
          style={{ borderColor: BRAND_COLORS.primaryLight }}
        >
          <h3 
            className="text-sm font-semibold mb-3"
            style={{ color: BRAND_COLORS.accent }}
          >
            Suggested prompts:
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div 
          className="border-t p-4"
          style={{ borderColor: BRAND_COLORS.primaryLight }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message or memory here..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleVoiceInput}
              className={`p-4 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          How to use your AI companion:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="mb-2"><strong>• Share memories:</strong> Tell me about special moments in your life</p>
            <p className="mb-2"><strong>• Ask questions:</strong> I can help you remember things you might have forgotten</p>
          </div>
          <div>
            <p className="mb-2"><strong>• Use voice:</strong> Click the microphone to speak instead of typing</p>
            <p className="mb-2"><strong>• Try prompts:</strong> Use the suggested questions to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat; 