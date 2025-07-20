import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  CameraIcon, 
  MicrophoneIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  HeartIcon,
  BookOpenIcon,
  TagIcon,
  EyeIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import MemoryVisualization from './MemoryVisualization';
import { API_BASE_URL } from '../config';

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

const MemoryJournal = ({ selectedPatient }) => {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [showNewMemory, setShowNewMemory] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    type: 'memory'
  });
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  const moods = [
    { value: 'happy', label: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'sad', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
    { value: 'excited', label: 'Excited', color: 'bg-red-100 text-red-800' },
    { value: 'calm', label: 'Calm', color: 'bg-green-100 text-green-800' },
    { value: 'anxious', label: 'Anxious', color: 'bg-orange-100 text-orange-800' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
    { value: 'nostalgic', label: 'Nostalgic', color: 'bg-pink-100 text-pink-800' }
  ];

  const memoryTypes = [
    { value: 'memory', label: 'Memory', icon: BookOpenIcon },
    { value: 'reflection', label: 'Reflection', icon: SparklesIcon },
    { value: 'story', label: 'Story', icon: HeartIcon }
  ];



  // Fetch memories from MongoDB database
  const fetchMemories = async () => {
    if (!selectedPatient) {
      setMemories([]);
      setFilteredMemories([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching memories for patient: ${selectedPatient}`);
      const response = await fetch(`${API_BASE_URL}/api/memories?patient_id=${selectedPatient}`);
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      // Transform the data to match the frontend structure
      const transformedMemories = data.map(memory => ({
        id: memory._id || memory.id,
        title: memory.title || 'Untitled Memory',
        content: memory.description || memory.content || '',
        mood: memory.mood || 'neutral',
        type: memory.category || 'memory',
        tags: memory.tags || [],
        date: memory.created_at ? new Date(memory.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        isPinned: memory.is_pinned || false,
        patientId: memory.patient_id || selectedPatient
      }));

      setMemories(transformedMemories);
      setFilteredMemories(transformedMemories);
    } catch (error) {
      console.error('Error fetching memories:', error);
      setError(`Failed to load memories: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter memories based on search term and filters
  useEffect(() => {
    let filtered = memories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(memory =>
        memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by mood
    if (selectedMoodFilter !== 'all') {
      filtered = filtered.filter(memory => memory.mood === selectedMoodFilter);
    }

    // Filter by type
    if (selectedTypeFilter !== 'all') {
      filtered = filtered.filter(memory => memory.type === selectedTypeFilter);
    }

    setFilteredMemories(filtered);
  }, [memories, searchTerm, selectedMoodFilter, selectedTypeFilter]);

  // Create new memory in MongoDB
  const createMemory = async (memoryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: memoryData.title,
          description: memoryData.content,
          mood: memoryData.mood,
          category: memoryData.type,
          tags: memoryData.tags,
          patient_id: selectedPatient,
          user_id: selectedPatient
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newMemory = await response.json();
      
      // Add the new memory to the list
      const transformedMemory = {
        id: newMemory._id || newMemory.id,
        title: newMemory.title || 'Untitled Memory',
        content: newMemory.description || newMemory.content || '',
        mood: newMemory.mood || 'neutral',
        type: newMemory.category || 'memory',
        tags: newMemory.tags || [],
        date: newMemory.created_at ? new Date(newMemory.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        isPinned: newMemory.is_pinned || false,
        patientId: newMemory.patient_id || selectedPatient
      };

      setMemories([transformedMemory, ...memories]);
      return true;
    } catch (error) {
      console.error('Error creating memory:', error);
      setError('Failed to create memory. Please try again.');
      return false;
    }
  };

  // Load memories when patient changes
  useEffect(() => {
    fetchMemories();
  }, [selectedPatient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await createMemory(newMemory);
    
    if (success) {
      setNewMemory({ title: '', content: '', mood: 'neutral', tags: [], type: 'memory' });
      setShowNewMemory(false);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Here you would integrate with speech recognition API
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setNewMemory(prev => ({
          ...prev,
          content: prev.content + " I remember when we used to go to the park every Sunday morning..."
        }));
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleImageUpload = () => {
    // Here you would integrate with file upload and AI analysis
    alert('Image upload and AI analysis feature coming soon!');
  };

  const handleViewVisualization = (memory) => {
    setSelectedMemory(memory);
    setShowVisualization(true);
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'text-yellow-600',
      sad: 'text-blue-600',
      excited: 'text-red-600',
      calm: 'text-green-600',
      anxious: 'text-orange-600',
      neutral: 'text-gray-600',
      nostalgic: 'text-pink-600'
    };
    return colors[mood] || colors.neutral;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMoodFilter('all');
    setSelectedTypeFilter('all');
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
            Please select a patient from the sidebar to view and manage their memory journal.
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
                Memory Journal
              </h1>
              <p 
                className="text-lg"
                style={{ color: BRAND_COLORS.accent }}
              >
                Record and cherish precious memories for {selectedPatient === '1' ? 'Sarah Johnson' : 
                selectedPatient === '2' ? 'Robert Smith' : 'Margaret Davis'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewMemory(true)}
            className="px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 text-lg"
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: BRAND_COLORS.white
            }}
          >
            <PlusIcon className="h-6 w-6" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* AI Prompt */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              Today's Memory Prompt
            </h3>
          </div>
          <p className="text-lg text-gray-700 mb-4">
            "Think about a time when you felt truly happy. What made that moment special? Who was there with you?"
          </p>
          <button
            onClick={() => setShowNewMemory(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-lg"
          >
            Share This Memory
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* New Memory Form */}
      {showNewMemory && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Record Memory for {selectedPatient === '1' ? 'Sarah' : 
            selectedPatient === '2' ? 'Robert' : 'Margaret'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Memory Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                What type of memory is this?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {memoryTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setNewMemory(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      newMemory.type === type.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <type.icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <span className="text-lg font-medium text-gray-900">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Give your memory a title
              </label>
              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                placeholder="e.g., Family Dinner at Grandma's"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Tell us about your memory
              </label>
              <textarea
                value={newMemory.content}
                onChange={(e) => setNewMemory(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                rows="6"
                placeholder="Describe your memory in detail..."
                required
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                How did this memory make you feel?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setNewMemory(prev => ({ ...prev, mood: mood.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      newMemory.mood === mood.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${mood.color}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Methods */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                  isRecording
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-purple-300'
                }`}
              >
                <MicrophoneIcon className="h-5 w-5" />
                <span>{isRecording ? 'Recording...' : 'Voice Input'}</span>
              </button>

              <button
                type="button"
                onClick={handleImageUpload}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-purple-300 transition-colors"
              >
                <CameraIcon className="h-5 w-5" />
                <span>Upload Photo</span>
              </button>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowNewMemory(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                <span>Save Memory</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedPatient === '1' ? 'Sarah' : 
             selectedPatient === '2' ? 'Robert' : 'Margaret'}'s Memories
          </h2>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredMemories.length} of {memories.length} memories
            </span>
            {(searchTerm || selectedMoodFilter !== 'all' || selectedTypeFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search memories by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none"
          />
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Mood Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedMoodFilter}
              onChange={(e) => setSelectedMoodFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Moods</option>
              {moods.map((mood) => (
                <option key={mood.value} value={mood.value}>
                  {mood.label}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="h-5 w-5 text-gray-400" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
            >
              <option value="all">All Types</option>
              {memoryTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading memories...</p>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center py-8">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm || selectedMoodFilter !== 'all' || selectedTypeFilter !== 'all'
                ? 'No memories match your search criteria.'
                : 'No memories yet. Create your first memory!'}
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {memory.title}
                      </h3>
                      {memory.isPinned && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {memory.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(memory.date).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(memory.mood)}`}>
                        {memory.mood}
                      </span>
                      <span className="capitalize">{memory.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewVisualization(memory)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      title="View AI Visualization"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {memory.tags.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-wrap gap-2">
                      {memory.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Visualization Modal */}
      {showVisualization && selectedMemory && (
        <MemoryVisualization
          memory={selectedMemory}
          onClose={() => {
            setShowVisualization(false);
            setSelectedMemory(null);
          }}
        />
      )}
    </div>
  );
};

export default MemoryJournal; 