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
  UserIcon
} from '@heroicons/react/24/outline';
import MemoryVisualization from './MemoryVisualization';

const MemoryJournal = ({ selectedPatient }) => {
  const [memories, setMemories] = useState([]);
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

  const moods = [
    { value: 'happy', label: 'Happy', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'sad', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
    { value: 'excited', label: 'Excited', color: 'bg-red-100 text-red-800' },
    { value: 'calm', label: 'Calm', color: 'bg-green-100 text-green-800' },
    { value: 'anxious', label: 'Anxious', color: 'bg-orange-100 text-orange-800' },
    { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800' }
  ];

  const memoryTypes = [
    { value: 'memory', label: 'Memory', icon: BookOpenIcon },
    { value: 'reflection', label: 'Reflection', icon: SparklesIcon },
    { value: 'story', label: 'Story', icon: HeartIcon }
  ];

  // Mock data based on selected patient
  useEffect(() => {
    if (!selectedPatient) {
      setMemories([]);
      return;
    }

    // Different memories for different patients
    const patientMemories = {
      '1': [ // Sarah Johnson
        {
          id: 1,
          title: "Family Dinner at Grandma's",
          content: "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous apple pie filled the whole house. Everyone was laughing and sharing stories. It was such a warm, loving atmosphere that made me feel so grateful for my family.",
          mood: "happy",
          type: "memory",
          tags: ["family", "grandma", "dinner", "apple pie"],
          date: "2024-01-15",
          isPinned: true,
          patientId: "1"
        },
        {
          id: 2,
          title: "Walking in the Park",
          content: "The beautiful spring day when we walked through the park and saw all the flowers blooming. The air was fresh and the birds were singing. It reminded me of simpler times when life was less complicated.",
          mood: "calm",
          type: "reflection",
          tags: ["nature", "spring", "walking", "peaceful"],
          date: "2024-01-14",
          patientId: "1"
        }
      ],
      '2': [ // Robert Smith
        {
          id: 3,
          title: "Morning Coffee Ritual",
          content: "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
          mood: "calm",
          type: "memory",
          tags: ["coffee", "morning", "porch", "father"],
          date: "2024-01-15",
          isPinned: true,
          patientId: "2"
        },
        {
          id: 4,
          title: "Old Photographs Found",
          content: "Found some old photographs in the attic today. Looking at pictures from my wedding day brought back so many wonderful memories. My wife looked so beautiful in her white dress.",
          mood: "nostalgic",
          type: "reflection",
          tags: ["photographs", "wedding", "wife", "nostalgic"],
          date: "2024-01-14",
          patientId: "2"
        }
      ],
      '3': [ // Margaret Davis
        {
          id: 5,
          title: "Feeling Lonely Today",
          content: "Today was a difficult day. I miss my husband so much. The house feels so empty without him. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
          mood: "sad",
          type: "reflection",
          tags: ["husband", "lonely", "missing", "grief"],
          date: "2024-01-15",
          patientId: "3"
        }
      ]
    };

    setMemories(patientMemories[selectedPatient] || []);
  }, [selectedPatient]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const memory = {
      id: Date.now(),
      ...newMemory,
      date: new Date().toISOString().split('T')[0],
      isPinned: false,
      patientId: selectedPatient
    };
    setMemories([memory, ...memories]);
    setNewMemory({ title: '', content: '', mood: 'neutral', tags: [], type: 'memory' });
    setShowNewMemory(false);
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

  if (!selectedPatient) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select a Patient
          </h2>
          <p className="text-gray-600">
            Please select a patient from the sidebar to view and manage their memory journal.
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
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Memory Journal
              </h1>
              <p className="text-lg text-gray-600">
                Record and cherish precious memories for {selectedPatient === '1' ? 'Sarah Johnson' : 
                selectedPatient === '2' ? 'Robert Smith' : 'Margaret Davis'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewMemory(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 text-lg"
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

      {/* Memories List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedPatient === '1' ? 'Sarah' : 
           selectedPatient === '2' ? 'Robert' : 'Margaret'}'s Memories
        </h2>
        
        <div className="space-y-6">
          {memories.map((memory) => (
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