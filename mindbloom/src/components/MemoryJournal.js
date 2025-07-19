import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  CameraIcon, 
  MicrophoneIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  HeartIcon,
  BookOpenIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const MemoryJournal = () => {
  const [memories, setMemories] = useState([]);
  const [showNewMemory, setShowNewMemory] = useState(false);
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

  // Mock data
  useEffect(() => {
    setMemories([
      {
        id: 1,
        title: "Family Dinner at Grandma's",
        content: "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous apple pie filled the whole house. Everyone was laughing and sharing stories. It was such a warm, loving atmosphere that made me feel so grateful for my family.",
        mood: "happy",
        type: "memory",
        tags: ["family", "grandma", "dinner", "apple pie"],
        date: "2024-01-15",
        isPinned: true
      },
      {
        id: 2,
        title: "Walking in the Park",
        content: "The beautiful spring day when we walked through the park and saw all the flowers blooming. The air was fresh and the birds were singing. It reminded me of simpler times when life was less complicated.",
        mood: "calm",
        type: "reflection",
        tags: ["nature", "spring", "walking", "peaceful"],
        date: "2024-01-14"
      }
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const memory = {
      id: Date.now(),
      ...newMemory,
      date: new Date().toISOString().split('T')[0],
      isPinned: false
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
                Record and cherish your precious memories
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
            Record Your Memory
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
                placeholder="Describe what happened, how you felt, who was there..."
                required
              />
            </div>

            {/* Voice and Image Input */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  isRecording
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <MicrophoneIcon className="h-5 w-5" />
                <span>{isRecording ? 'Recording...' : 'Voice Input'}</span>
              </button>
              <button
                type="button"
                onClick={handleImageUpload}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CameraIcon className="h-5 w-5" />
                <span>Add Photo</span>
              </button>
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                How did this memory make you feel?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setNewMemory(prev => ({ ...prev, mood: mood.value }))}
                    className={`p-3 rounded-lg transition-all ${
                      newMemory.mood === mood.value
                        ? 'ring-2 ring-purple-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${mood.color}`}>
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Add tags to help remember this memory
              </label>
              <div className="flex flex-wrap gap-2">
                {['family', 'friends', 'travel', 'food', 'nature', 'music'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!newMemory.tags.includes(tag)) {
                        setNewMemory(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      newMemory.tags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors text-lg font-semibold flex items-center space-x-2"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
                <span>Save Memory</span>
              </button>
              <button
                type="button"
                onClick={() => setShowNewMemory(false)}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Memories List */}
      <div className="space-y-6">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpenIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {memory.title}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(memory.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {memory.isPinned && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pinned
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  moods.find(m => m.value === memory.mood)?.color || 'bg-gray-100 text-gray-800'
                }`}>
                  {memory.mood}
                </span>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {memory.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Edit
                </button>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Share
                </button>
                <button className="text-green-600 hover:text-green-700 font-medium">
                  Pin Memory
                </button>
              </div>
              <button className="text-gray-500 hover:text-gray-700">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryJournal; 