import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, useGLTF } from '@react-three/drei';
import { 
  HomeIcon, 
  HeartIcon, 
  StarIcon, 
  CameraIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import MemoryVisualization from './MemoryVisualization';

// Forest Ground Component
const ForestGround = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#2d5016" />
    </mesh>
  );
};

// Tree Component
const Tree = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
};

// Deer Memory Component
const DeerMemory = ({ position, memory, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        position={position} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Deer body */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 1]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#8b4513" : "#a0522d"} />
        </mesh>
        {/* Deer head */}
        <mesh position={[0, 1.2, 0.3]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#8b4513" : "#a0522d"} />
        </mesh>
        {/* Antlers */}
        <mesh position={[0, 1.5, 0.3]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        {/* Memory text */}
        {(hovered || isHighlighted) && (
          <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            backgroundColor={isHighlighted ? "#ff6b6b" : "#000000"}
            padding={0.1}
          >
            {memory.title}
          </Text>
        )}
      </group>
    </Float>
  );
};

// Bird Memory Component
const BirdMemory = ({ position, memory, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        position={position} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Bird body */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#4169e1" : "#1e90ff"} />
        </mesh>
        {/* Wings */}
        <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.05, 0.1]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#4169e1" : "#1e90ff"} />
        </mesh>
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.05, 0.1]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#4169e1" : "#1e90ff"} />
        </mesh>
        {/* Memory text */}
        {(hovered || isHighlighted) && (
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            backgroundColor={isHighlighted ? "#ff6b6b" : "#000000"}
            padding={0.1}
          >
            {memory.title}
          </Text>
        )}
      </group>
    </Float>
  );
};

// Rabbit Memory Component
const RabbitMemory = ({ position, memory, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group 
        position={position} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Rabbit body */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#8b7355" : "#a0522d"} />
        </mesh>
        {/* Ears */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#8b7355" : "#a0522d"} />
        </mesh>
        <mesh position={[0.05, 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color={hovered || isHighlighted ? "#8b7355" : "#a0522d"} />
        </mesh>
        {/* Memory text */}
        {(hovered || isHighlighted) && (
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            backgroundColor={isHighlighted ? "#ff6b6b" : "#000000"}
            padding={0.1}
          >
            {memory.title}
          </Text>
        )}
      </group>
    </Float>
  );
};

// Player Character Component
const Player = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Player body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      {/* Player head */}
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#fbd38d" />
      </mesh>
      {/* Player arms */}
      <mesh position={[0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
      <mesh position={[-0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    </group>
  );
};

// Forest Scene Component
const ForestScene = ({ memories, onMemoryClick, playerPosition, playerRotation, highlightedMemory }) => {
  // Create a circular path for memories
  const pathRadius = 15;
  const memoryPositions = memories.map((memory, index) => {
    const angle = (index / memories.length) * Math.PI * 2;
    const x = Math.cos(angle) * pathRadius;
    const z = Math.sin(angle) * pathRadius;
    return { x, z, memory };
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.3} />
      
      {/* Ground */}
      <ForestGround />

      {/* Trees - positioned along the path */}
      {Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const treeRadius = pathRadius + (Math.random() - 0.5) * 10;
        const x = Math.cos(angle) * treeRadius;
        const z = Math.sin(angle) * treeRadius;
        
        return (
          <Tree 
            key={i}
            position={[x, 0, z]}
            scale={0.8 + Math.random() * 0.4}
          />
        );
      })}

      {/* Memory Animals - positioned along the circular path */}
      {memoryPositions.map(({ x, z, memory }, index) => {
        const animalType = index % 3;
        const isHighlighted = highlightedMemory && highlightedMemory.id === memory.id;
        
        if (animalType === 0) {
          return (
            <DeerMemory
              key={memory.id}
              position={[x, 0.5, z]}
              memory={memory}
              onClick={() => onMemoryClick(memory)}
              isHighlighted={isHighlighted}
            />
          );
        } else if (animalType === 1) {
          return (
            <BirdMemory
              key={memory.id}
              position={[x, 2.5, z]}
              memory={memory}
              onClick={() => onMemoryClick(memory)}
              isHighlighted={isHighlighted}
            />
          );
        } else {
          return (
            <RabbitMemory
              key={memory.id}
              position={[x, 0.5, z]}
              memory={memory}
              onClick={() => onMemoryClick(memory)}
              isHighlighted={isHighlighted}
            />
          );
        }
      })}

      {/* Player */}
      <Player position={playerPosition} rotation={playerRotation} />
    </>
  );
};

const MemoryGarden = ({ selectedPatient }) => {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0]);
  const [playerRotation, setPlayerRotation] = useState([0, 0, 0]);
  const [cameraPosition, setCameraPosition] = useState([0, 5, 10]);
  const [keys, setKeys] = useState({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [highlightedMemory, setHighlightedMemory] = useState(null);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);

  // Mock memories data based on selected patient
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
          title: "Family Dinner",
          content: "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous lasagna filled the house, and everyone was laughing and sharing stories. It was one of those perfect moments where you feel completely surrounded by love.",
          mood: "happy",
          date: "2024-01-15",
          patientId: "1"
        },
        {
          id: 2,
          title: "Park Walk",
          content: "The beautiful spring day when we walked through the park and saw all the flowers blooming. The cherry blossoms were falling like pink snow, and we sat on a bench watching children play. The air was filled with the sweet scent of spring.",
          mood: "calm",
          date: "2024-01-14",
          patientId: "1"
        },
        {
          id: 3,
          title: "Birthday Party",
          content: "The surprise birthday party that made me feel so loved and special. When I walked into the room and everyone shouted 'Surprise!', I was completely overwhelmed with joy. The cake was chocolate with vanilla frosting, just like I always wanted.",
          mood: "excited",
          date: "2024-01-13",
          patientId: "1"
        },
        {
          id: 4,
          title: "Beach Day",
          content: "That perfect day at the beach when the waves were gentle and the sun was warm but not too hot. We built sandcastles and collected seashells. The sound of the ocean was so peaceful, it felt like time stood still.",
          mood: "peaceful",
          date: "2024-01-12",
          patientId: "1"
        },
        {
          id: 5,
          title: "First Snow",
          content: "The first snowfall of the year when everything was covered in white. We went outside and made snow angels, then came back inside for hot chocolate with marshmallows. The world looked so magical and new.",
          mood: "wonder",
          date: "2024-01-11",
          patientId: "1"
        },
        {
          id: 6,
          title: "Garden Harvest",
          content: "The day we harvested vegetables from our garden. The tomatoes were so red and juicy, and the carrots were sweet and crisp. We made a fresh salad with everything we picked, and it tasted better than anything from the store.",
          mood: "satisfied",
          date: "2024-01-10",
          patientId: "1"
        }
      ],
      '2': [ // Robert Smith
        {
          id: 7,
          title: "Wedding Day",
          content: "The most beautiful day of my life. My wife looked absolutely stunning in her white dress. The church was filled with flowers and our families were all there to celebrate with us.",
          mood: "happy",
          date: "2024-01-15",
          patientId: "2"
        },
        {
          id: 8,
          title: "Fishing Trip",
          content: "Remember that fishing trip with my son when he was just a boy? We spent the whole day by the lake, and he caught his first fish. The pride in his eyes was unforgettable.",
          mood: "proud",
          date: "2024-01-14",
          patientId: "2"
        },
        {
          id: 9,
          title: "Morning Coffee",
          content: "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
          mood: "calm",
          date: "2024-01-13",
          patientId: "2"
        },
        {
          id: 10,
          title: "Old Photographs",
          content: "Found some old photographs in the attic today. Looking at pictures from my wedding day brought back so many wonderful memories. My wife looked so beautiful in her white dress.",
          mood: "nostalgic",
          date: "2024-01-12",
          patientId: "2"
        }
      ],
      '3': [ // Margaret Davis
        {
          id: 11,
          title: "Husband's Laugh",
          content: "I can still hear his laugh echoing through the house. He had the most wonderful sense of humor and could always make me smile, even on my worst days.",
          mood: "nostalgic",
          date: "2024-01-15",
          patientId: "3"
        },
        {
          id: 12,
          title: "Feeling Lonely",
          content: "Today was a difficult day. I miss my husband so much. The house feels so empty without him. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
          mood: "sad",
          date: "2024-01-14",
          patientId: "3"
        },
        {
          id: 13,
          title: "Quiet Evening",
          content: "Sitting by the window watching the sunset. The sky was painted in beautiful shades of orange and pink. It reminded me of all the evenings we spent together watching the sun go down.",
          mood: "peaceful",
          date: "2024-01-13",
          patientId: "3"
        }
      ]
    };

    setMemories(patientMemories[selectedPatient] || []);
  }, [selectedPatient]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Smooth movement with slower forward motion
  useEffect(() => {
    const moveSpeed = 0.05; // Slower movement
    const forwardSpeed = 0.02; // Even slower for forward movement

    if (keys['w'] || keys['ArrowUp']) {
      setPlayerPosition(prev => [prev[0], prev[1], prev[2] - forwardSpeed]);
    }
    if (keys['s'] || keys['ArrowDown']) {
      setPlayerPosition(prev => [prev[0], prev[1], prev[2] + moveSpeed]);
    }
    if (keys['a'] || keys['ArrowLeft']) {
      setPlayerPosition(prev => [prev[0] - moveSpeed, prev[1], prev[2]]);
    }
    if (keys['d'] || keys['ArrowRight']) {
      setPlayerPosition(prev => [prev[0] + moveSpeed, prev[1], prev[2]]);
    }

    // Update camera to follow player
    setCameraPosition([
      playerPosition[0],
      playerPosition[1] + 5,
      playerPosition[2] + 10
    ]);
  }, [keys, playerPosition]);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying || autoPlayPaused) return;

    const pathRadius = 15;
    const interval = setInterval(() => {
      setCurrentMemoryIndex(prev => {
        const nextIndex = (prev + 1) % memories.length;
        const angle = (nextIndex / memories.length) * Math.PI * 2;
        const x = Math.cos(angle) * pathRadius;
        const z = Math.sin(angle) * pathRadius;
        
        // Move player to next memory position
        setPlayerPosition([x, 0, z]);
        
        // Highlight current memory
        setHighlightedMemory(memories[nextIndex]);
        
        // Pause for 3 seconds at each memory
        setAutoPlayPaused(true);
        setTimeout(() => {
          setAutoPlayPaused(false);
        }, 3000);
        
        return nextIndex;
      });
    }, 4000); // Move to next memory every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayPaused, memories]);

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
    setShowMemoryModal(true);
  };

  const handleViewVisualization = (memory) => {
    setSelectedMemory(memory);
    setShowVisualization(true);
    setShowMemoryModal(false);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      setHighlightedMemory(null);
      setAutoPlayPaused(false);
    } else {
      setIsAutoPlaying(true);
      setCurrentMemoryIndex(0);
      setAutoPlayPaused(false);
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: 'text-yellow-600',
      sad: 'text-blue-600',
      excited: 'text-red-600',
      calm: 'text-green-600',
      peaceful: 'text-blue-500',
      wonder: 'text-purple-600',
      satisfied: 'text-orange-600',
      anxious: 'text-orange-600',
      neutral: 'text-gray-600',
      nostalgic: 'text-pink-600',
      proud: 'text-green-600'
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
            Please select a patient from the sidebar to view their memory garden.
          </p>
        </div>
      </div>
    );
  }

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
              Memory Forest Walk
            </h1>
            <p className="text-lg text-gray-600">
              Walk through {selectedPatient === '1' ? 'Sarah' : 
              selectedPatient === '2' ? 'Robert' : 'Margaret'}'s magical forest where memories come to life as animals
            </p>
          </div>
        </div>

        {/* Controls Instructions */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <StarIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">
              How to explore {selectedPatient === '1' ? 'Sarah' : 
              selectedPatient === '2' ? 'Robert' : 'Margaret'}'s memory forest:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Use WASD or arrow keys to walk through the forest</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Click on animals to view memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Follow the circular path to find all memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <span>Try autoplay to automatically visit each memory</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Forest */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-96 relative">
          <Canvas camera={{ position: cameraPosition, fov: 75 }}>
            <ForestScene 
              memories={memories} 
              onMemoryClick={handleMemoryClick}
              playerPosition={playerPosition}
              playerRotation={playerRotation}
              highlightedMemory={highlightedMemory}
            />
            <OrbitControls 
              enablePan={false}
              enableZoom={true}
              enableRotate={false}
              maxDistance={20}
              minDistance={5}
            />
          </Canvas>
          
          {/* Overlay Controls */}
          <div className="absolute bottom-4 left-4 space-y-2">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Controls:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>W/↑ - Forward (Slow)</div>
                <div>S/↓ - Backward</div>
                <div>A/← - Left</div>
                <div>D/→ - Right</div>
              </div>
            </div>
          </div>

          {/* Player Position Display */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium text-gray-700">
              Position: ({playerPosition[0].toFixed(1)}, {playerPosition[2].toFixed(1)})
            </div>
          </div>

          {/* Autoplay Controls */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isAutoPlaying 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <PauseIcon className="h-4 w-4" />
                  <span>Stop Autoplay</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  <span>Start Autoplay</span>
                </>
              )}
            </button>
            {isAutoPlaying && (
              <div className="mt-2 text-xs text-gray-600">
                {autoPlayPaused ? 'Paused at memory...' : 'Moving to next memory...'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Memory List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpenIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedPatient === '1' ? 'Sarah' : 
             selectedPatient === '2' ? 'Robert' : 'Margaret'}'s Forest Memories
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className={`border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer ${
                highlightedMemory && highlightedMemory.id === memory.id 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200'
              }`}
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
              <p className="text-gray-600 mb-4 line-clamp-3">
                {memory.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(memory.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewVisualization(memory);
                    }}
                  >
                    <EyeIcon className="h-4 w-4 inline mr-1" />
                    AI View
                  </button>
                </div>
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

              <div className="flex items-center justify-center pt-4">
                <button
                  onClick={() => handleViewVisualization(selectedMemory)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <EyeIcon className="h-5 w-5" />
                  <span>View AI Visualization</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default MemoryGarden; 