import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import { 
  HomeIcon, 
  HeartIcon, 
  StarIcon, 
  CameraIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

// Simple 3D Tree Component
const Tree = ({ position, scale = 1, color = '#4ade80' }) => {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        {/* Trunk */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        {/* Leaves */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </Float>
  );
};

// Simple 3D Flower Component
const Flower = ({ position, color = '#ec4899' }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
      <group position={position}>
        {/* Stem */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        {/* Petals */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    </Float>
  );
};

// Memory Stone Component
const MemoryStone = ({ position, memory, onClick }) => {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <group position={position} onClick={onClick}>
        <mesh>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {memory.title}
        </Text>
      </group>
    </Float>
  );
};

// Main Garden Scene
const GardenScene = ({ memories, onMemoryClick }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Trees */}
      <Tree position={[-3, 0, -3]} color="#4ade80" />
      <Tree position={[3, 0, -2]} color="#22c55e" />
      <Tree position={[-2, 0, 3]} color="#16a34a" />
      <Tree position={[4, 0, 4]} color="#15803d" />

      {/* Flowers */}
      <Flower position={[-1, 0, -1]} color="#ec4899" />
      <Flower position={[1, 0, -1]} color="#f59e0b" />
      <Flower position={[-1, 0, 1]} color="#8b5cf6" />
      <Flower position={[1, 0, 1]} color="#ef4444" />

      {/* Memory Stones */}
      {memories.map((memory, index) => (
        <MemoryStone
          key={memory.id}
          position={[
            Math.sin(index * 0.5) * 2,
            0,
            Math.cos(index * 0.5) * 2
          ]}
          memory={memory}
          onClick={() => onMemoryClick(memory)}
        />
      ))}
    </>
  );
};

const MemoryGarden = () => {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  // Mock memories data
  useEffect(() => {
    setMemories([
      {
        id: 1,
        title: "Family Dinner",
        content: "Remember the wonderful dinner we had at grandma's house last Sunday?",
        mood: "happy",
        date: "2024-01-15"
      },
      {
        id: 2,
        title: "Park Walk",
        content: "The beautiful spring day when we walked through the park and saw all the flowers blooming.",
        mood: "calm",
        date: "2024-01-14"
      },
      {
        id: 3,
        title: "Birthday Party",
        content: "The surprise birthday party that made me feel so loved and special.",
        mood: "excited",
        date: "2024-01-13"
      }
    ]);
  }, []);

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
    setShowMemoryModal(true);
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'text-yellow-600',
      sad: 'text-blue-600',
      excited: 'text-red-600',
      calm: 'text-green-600',
      anxious: 'text-orange-600',
      neutral: 'text-gray-600'
    };
    return colors[mood] || colors.neutral;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-full">
            <HomeIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              3D Memory Garden
            </h1>
            <p className="text-lg text-gray-600">
              Explore your memories in a beautiful interactive garden
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <StarIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              How to explore your garden:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Click on memory stones to view your memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Drag to rotate and explore the garden</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Scroll to zoom in and out</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Garden */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-96 relative">
          <Canvas camera={{ position: [0, 5, 5], fov: 75 }}>
            <GardenScene 
              memories={memories} 
              onMemoryClick={handleMemoryClick}
            />
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxDistance={10}
              minDistance={2}
            />
          </Canvas>
          
          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg hover:bg-white transition-colors">
              <StarIcon className="h-6 w-6 text-purple-600" />
            </button>
            <button className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg hover:bg-white transition-colors">
              <HeartIcon className="h-6 w-6 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Memory List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpenIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Your Garden Memories
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleMemoryClick(memory)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {memory.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(memory.mood)}`}>
                  {memory.mood}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {memory.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(memory.date).toLocaleDateString()}
                </span>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View in Garden →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Modal */}
      {showMemoryModal && selectedMemory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedMemory.title}
              </h2>
              <button
                onClick={() => setShowMemoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                {selectedMemory.content}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(selectedMemory.mood)}`}>
                  {selectedMemory.mood}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedMemory.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGarden; 