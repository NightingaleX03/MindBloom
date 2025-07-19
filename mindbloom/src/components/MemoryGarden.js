import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, useGLTF, Html, Environment, Sky, useLoader } from '@react-three/drei';
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
  UserIcon,
  SpeakerWaveIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import MemoryVisualization from './MemoryVisualization';

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
          className="absolute w-1/2 h-1/2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full transform rotate-45 -translate-x-1/4 -translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)`,
            boxShadow: '0 2px 8px rgba(235, 155, 180, 0.3)'
          }}
        />
        {/* Petal 2 - Right */}
        <div 
          className="absolute w-1/2 h-1/2 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full transform rotate-45 translate-x-1/4 -translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.accent} 0%, ${BRAND_COLORS.primary} 100%)`,
            boxShadow: '0 2px 8px rgba(59, 35, 71, 0.3)'
          }}
        />
        {/* Petal 3 - Bottom */}
        <div 
          className="absolute w-1/2 h-1/2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full transform rotate-45 -translate-x-1/4 translate-y-1/4"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.accent} 100%)`,
            boxShadow: '0 2px 8px rgba(235, 155, 180, 0.3)'
          }}
        />
        {/* Petal 4 - Left */}
        <div 
          className="absolute w-1/2 h-1/2 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full transform rotate-45 translate-x-1/4 translate-y-1/4"
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

// Poly.pizza Model Configuration
// Replace these URLs with actual Poly.pizza model URLs
const POLY_MODELS = {
  // Park Furniture
  bench: "https://poly.pizza/m/38m6Q1H12DU", // User's selected model
  lantern: "https://poly.pizza/m/2k1Nn3YQ4XZ", // Vintage lantern model
  birdbath: "https://poly.pizza/m/5m7Pp8Rr9Ss", // Garden bird bath
  
  // Nature
  tree: "https://poly.pizza/m/1n2Oo3Pp4Qq", // Large oak tree
  flower: "https://poly.pizza/m/6t8Uu9Vv0Ww", // Rose flower
  bush: "https://poly.pizza/m/7v9Ww0Xx1Yy", // Hedge bush
  
  // Park Elements
  fountain: "https://poly.pizza/m/8w0Xx1Yy2Zz", // Park fountain
  statue: "https://poly.pizza/m/9x1Yy2Zz3Aa", // Garden statue
  gazebo: "https://poly.pizza/m/0y2Zz3Aa4Bb", // Park gazebo
  
  // Alternative models if the above don't work
  fallback: {
    bench: "https://poly.pizza/m/1z3Aa4Bb5Cc",
    tree: "https://poly.pizza/m/2a4Bb5Cc6Dd",
    lantern: "https://poly.pizza/m/3b5Cc6Dd7Ee"
  }
};

// 3D Model Loading from Poly.pizza
const usePolyModel = (modelUrl) => {
  try {
    return useGLTF(modelUrl);
  } catch (error) {
    console.warn(`Failed to load model from ${modelUrl}:`, error);
    return null;
  }
};

// Enhanced Park Bench with Poly.pizza model
const ParkBench = ({ position, rotation = [0, 0, 0], scale = 1 }) => {
  const gltf = usePolyModel(POLY_MODELS.bench);
  
  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        rotation={rotation} 
        scale={scale}
      />
    );
  }
  
  // Fallback to basic geometry if model fails to load
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Bench seat */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Bench back */}
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[2, 0.8, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Bench legs */}
      <mesh position={[-0.8, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.5]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0.8, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.3, 0.5]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
};

// Enhanced Park Tree with Poly.pizza model
const ParkTree = ({ position, scale = 1 }) => {
  const meshRef = useRef();
  const gltf = usePolyModel(POLY_MODELS.tree);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        scale={scale}
        ref={meshRef}
      />
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position} scale={scale} ref={meshRef}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Tree foliage */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
};

// Enhanced Lantern with Poly.pizza model
const Lantern = ({ position, isLit = true }) => {
  const gltf = usePolyModel(POLY_MODELS.lantern);
  
  if (gltf) {
    return (
      <group position={position}>
        <primitive object={gltf.scene} />
        {/* Add emissive material for lighting effect */}
        {isLit && (
          <pointLight position={[0, 1.5, 0]} intensity={0.5} color="#ffd700" />
        )}
      </group>
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position}>
      {/* Lantern post */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.5]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Lantern globe */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial 
          color={isLit ? "#ffd700" : "#666666"} 
          emissive={isLit ? "#ffd700" : "#000000"} 
          emissiveIntensity={isLit ? 0.3 : 0} 
        />
      </mesh>
    </group>
  );
};

// Enhanced Flower Bed with Poly.pizza models
const FlowerBed = ({ position, scale = 1 }) => {
  const flowerGltf = usePolyModel(POLY_MODELS.flower);
  
  if (flowerGltf) {
    return (
      <group position={position} scale={scale}>
        {/* Flower bed base */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2, 0.2, 1]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        {/* Flowers using Poly.pizza model */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 0.6;
          const z = Math.sin(angle) * 0.6;
          return (
            <primitive
              key={i}
              object={flowerGltf.scene.clone()}
              position={[x, 0.3, z]}
              scale={0.3}
            />
          );
        })}
      </group>
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position} scale={scale}>
      {/* Flower bed base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2, 0.2, 1]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Flowers */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.6;
        const z = Math.sin(angle) * 0.6;
        return (
          <group key={i} position={[x, 0.3, z]}>
            {/* Flower stem */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.4]} />
              <meshStandardMaterial color="#228b22" />
            </mesh>
            {/* Flower head */}
            <mesh position={[0, 0.4, 0]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#ff69b4" : "#ffd700"} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Enhanced Bird Bath with Poly.pizza model
const BirdBath = ({ position, scale = 1 }) => {
  const gltf = usePolyModel(POLY_MODELS.birdbath);
  
  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        scale={scale}
      />
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position} scale={scale}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.4]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      {/* Bowl */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.2]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Park Fountain with Poly.pizza model
const ParkFountain = ({ position, scale = 1 }) => {
  const gltf = usePolyModel(POLY_MODELS.fountain);
  
  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        scale={scale}
      />
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position} scale={scale}>
      {/* Fountain base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      {/* Water spout */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshStandardMaterial color="#87ceeb" />
      </mesh>
      {/* Water pool */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Garden Statue with Poly.pizza model
const GardenStatue = ({ position, scale = 1 }) => {
  const gltf = usePolyModel(POLY_MODELS.statue);
  
  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        scale={scale}
      />
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position} scale={scale}>
      {/* Statue base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Statue figure */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#d2b48c" />
      </mesh>
    </group>
  );
};

// Park Gazebo with Poly.pizza model
const ParkGazebo = ({ position, scale = 1 }) => {
  const gltf = usePolyModel(POLY_MODELS.gazebo);
  
  if (gltf) {
    return (
      <primitive 
        object={gltf.scene} 
        position={position} 
        scale={scale}
      />
    );
  }
  
  // Fallback to basic geometry
  return (
    <group position={position} scale={scale}>
      {/* Gazebo roof */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Gazebo posts */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        return (
          <mesh key={i} position={[x, 1.5, z]}>
            <cylinderGeometry args={[0.1, 0.1, 3]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
        );
      })}
    </group>
  );
};

// Memory Lane Path Component with enhanced park elements
const MemoryLane = () => {
  return (
    <group>
      {/* Curved gravel path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[8, 100]} />
        <meshStandardMaterial color="#8b7355" />
      </mesh>
      
      {/* Path borders with lanterns */}
      {Array.from({ length: 20 }, (_, i) => {
        const z = -i * 5;
        return (
          <Lantern key={i} position={[4, 0, z]} isLit={true} />
        );
      })}
      
      {/* Right side lanterns */}
      {Array.from({ length: 20 }, (_, i) => {
        const z = -i * 5;
        return (
          <Lantern key={`right-${i}`} position={[-4, 0, z]} isLit={true} />
        );
      })}

      {/* Park benches along the path */}
      {Array.from({ length: 8 }, (_, i) => {
        const z = -i * 12 - 5;
        const side = i % 2 === 0 ? 6 : -6;
        return (
          <ParkBench 
            key={`bench-${i}`} 
            position={[side, 0, z]} 
            rotation={[0, side > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
          />
        );
      })}

      {/* Flower beds */}
      {Array.from({ length: 6 }, (_, i) => {
        const z = -i * 15 - 8;
        const side = i % 2 === 0 ? 7 : -7;
        return (
          <FlowerBed 
            key={`flowers-${i}`} 
            position={[side, 0, z]} 
          />
        );
      })}

      {/* Bird baths */}
      {Array.from({ length: 4 }, (_, i) => {
        const z = -i * 20 - 10;
        const side = i % 2 === 0 ? 5 : -5;
        return (
          <BirdBath 
            key={`birdbath-${i}`} 
            position={[side, 0, z]} 
          />
        );
      })}

      {/* Park fountains */}
      {Array.from({ length: 2 }, (_, i) => {
        const z = -i * 30 - 15;
        return (
          <ParkFountain 
            key={`fountain-${i}`} 
            position={[0, 0, z]} 
            scale={1.5}
          />
        );
      })}

      {/* Garden statues */}
      {Array.from({ length: 3 }, (_, i) => {
        const z = -i * 25 - 12;
        const side = i % 2 === 0 ? 8 : -8;
        return (
          <GardenStatue 
            key={`statue-${i}`} 
            position={[side, 0, z]} 
            scale={0.8}
          />
        );
      })}

      {/* Park gazebos */}
      {Array.from({ length: 2 }, (_, i) => {
        const z = -i * 35 - 18;
        const side = i % 2 === 0 ? 10 : -10;
        return (
          <ParkGazebo 
            key={`gazebo-${i}`} 
            position={[side, 0, z]} 
            scale={1.2}
          />
        );
      })}
    </group>
  );
};

// Enhanced Tree Component with better 3D models
const Tree = ({ position, scale = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying animation
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position} scale={scale} ref={meshRef}>
      {/* Tree trunk */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* Tree foliage */}
      <mesh position={[0, 3, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#228b22" />
      </mesh>
    </group>
  );
};

// Floating Picture Frame Memory Marker
const PictureFrameMemory = ({ position, memory, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group 
        position={position} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Glowing orb background */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial 
            color={hovered || isHighlighted ? "#ff6b6b" : "#4a90e2"} 
            emissive={hovered || isHighlighted ? "#ff6b6b" : "#4a90e2"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Picture frame */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[1.2, 1.2, 0.1]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
        
        {/* Picture content */}
        <mesh position={[0, 0, 0.15]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        
        {/* Memory description */}
        {(hovered || isHighlighted) && (
          <Html position={[0, 1.5, 0]} center>
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              {memory.title}
            </div>
          </Html>
        )}
        
        {/* Play button for audio/video */}
        {memory.type === 'audio' || memory.type === 'video' ? (
          <Html position={[0, 0, 0.2]} center>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="h-4 w-4 text-gray-700" />
              ) : (
                <PlayIcon className="h-4 w-4 text-gray-700" />
              )}
            </button>
          </Html>
        ) : (
          <Html position={[0, 0, 0.2]} center>
            <PhotoIcon className="h-6 w-6 text-white" />
          </Html>
        )}
      </group>
    </Float>
  );
};

// Voice Bubble Memory Marker
const VoiceBubbleMemory = ({ position, memory, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <group 
        position={position} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Voice bubble shape */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial 
            color={hovered || isHighlighted ? "#ff6b6b" : "#9b59b6"} 
            emissive={hovered || isHighlighted ? "#ff6b6b" : "#9b59b6"}
            emissiveIntensity={0.4}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Sound waves */}
        <mesh position={[0.8, 0, 0]}>
          <ringGeometry args={[0.2, 0.4, 8]} />
          <meshStandardMaterial color="#9b59b6" transparent opacity={0.6} />
        </mesh>
        <mesh position={[1.2, 0, 0]}>
          <ringGeometry args={[0.4, 0.6, 8]} />
          <meshStandardMaterial color="#9b59b6" transparent opacity={0.4} />
        </mesh>
        
        {/* Memory description */}
        {(hovered || isHighlighted) && (
          <Html position={[0, 1.2, 0]} center>
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              {memory.title}
            </div>
          </Html>
        )}
        
        {/* Play button */}
        <Html position={[0, 0, 0.1]} center>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="h-4 w-4 text-gray-700" />
            ) : (
              <SpeakerWaveIcon className="h-4 w-4 text-gray-700" />
            )}
          </button>
        </Html>
      </group>
    </Float>
  );
};

// Glowing Orb Memory Marker
const GlowingOrbMemory = ({ position, memory, onClick, isHighlighted }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        position={position} 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Outer glow */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial 
            color={hovered || isHighlighted ? "#ff6b6b" : "#f39c12"} 
            emissive={hovered || isHighlighted ? "#ff6b6b" : "#f39c12"}
            emissiveIntensity={0.6}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Core orb */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial 
            color={hovered || isHighlighted ? "#ff6b6b" : "#f39c12"} 
            emissive={hovered || isHighlighted ? "#ff6b6b" : "#f39c12"}
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Memory description */}
        {(hovered || isHighlighted) && (
          <Html position={[0, 1.5, 0]} center>
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              {memory.title}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

// Enhanced Player Character with smooth movement
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

// Particle System for ambient effects
const ParticleSystem = () => {
  const particles = useRef();
  
  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={particles}>
      {Array.from({ length: 50 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 100,
            Math.random() * 20,
            (Math.random() - 0.5) * 100
          ]}
        >
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshStandardMaterial 
            color="#f39c12" 
            emissive="#f39c12"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Forest Scene with Memory Lane and Park Elements
const ForestScene = ({ memories, onMemoryClick, playerPosition, playerRotation, highlightedMemory }) => {
  // Position memories along Memory Lane
  const memoryPositions = memories.map((memory, index) => {
    const laneOffset = (index % 2 === 0) ? 3 : -3; // Alternate sides of the path
    const z = -index * 8 - 10; // Space memories along the path
    return { x: laneOffset, z, memory };
  });

  return (
    <>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[0, 10, 0]} intensity={0.3} />
      
      {/* Sunset Sky */}
      <Sky 
        distance={450000} 
        sunPosition={[0, 1, 0]} 
        inclination={0.3} 
        azimuth={0.25} 
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 200]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Memory Lane with Park Elements */}
      <MemoryLane />

      {/* Trees along the path */}
      {Array.from({ length: 40 }, (_, i) => {
        const z = -i * 5;
        const x = (i % 2 === 0) ? 8 : -8;
        return (
          <Tree 
            key={i}
            position={[x, 0, z]}
            scale={0.8 + Math.random() * 0.4}
          />
        );
      })}

      {/* Memory Markers along Memory Lane */}
      {memoryPositions.map(({ x, z, memory }, index) => {
        const isHighlighted = highlightedMemory && highlightedMemory.id === memory.id;
        const markerType = index % 3; // Rotate between different marker types
        
        if (markerType === 0) {
          return (
            <PictureFrameMemory
              key={memory.id}
              position={[x, 1, z]}
              memory={memory}
              onClick={() => onMemoryClick(memory)}
              isHighlighted={isHighlighted}
            />
          );
        } else if (markerType === 1) {
          return (
            <VoiceBubbleMemory
              key={memory.id}
              position={[x, 1.5, z]}
              memory={memory}
              onClick={() => onMemoryClick(memory)}
              isHighlighted={isHighlighted}
            />
          );
        } else {
          return (
            <GlowingOrbMemory
              key={memory.id}
              position={[x, 1, z]}
              memory={memory}
              onClick={() => onMemoryClick(memory)}
              isHighlighted={isHighlighted}
            />
          );
        }
      })}

      {/* Ambient Particles */}
      <ParticleSystem />

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
  const [cameraPosition, setCameraPosition] = useState([0, 8, 15]);
  const [keys, setKeys] = useState({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [highlightedMemory, setHighlightedMemory] = useState(null);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Enhanced memories data with media types
  useEffect(() => {
    if (!selectedPatient) {
      setMemories([]);
      return;
    }

    const patientMemories = {
      '1': [ // Sarah Johnson
        {
          id: 1,
          title: "Family Dinner",
          content: "Remember the wonderful dinner we had at grandma's house last Sunday? The smell of her famous lasagna filled the house, and everyone was laughing and sharing stories. It was one of those perfect moments where you feel completely surrounded by love.",
          mood: "happy",
          date: "2024-01-15",
          patientId: "1",
          type: "photo",
          mediaSrc: "images/family_dinner.jpg",
          audioSrc: "audio/family_dinner_audio.mp3"
        },
        {
          id: 2,
          title: "Park Walk",
          content: "The beautiful spring day when we walked through the park and saw all the flowers blooming. The cherry blossoms were falling like pink snow, and we sat on a bench watching children play. The air was filled with the sweet scent of spring.",
          mood: "calm",
          date: "2024-01-14",
          patientId: "1",
          type: "video",
          mediaSrc: "videos/park_walk.mp4",
          audioSrc: "audio/park_walk_audio.mp3"
        },
        {
          id: 3,
          title: "Birthday Party",
          content: "The surprise birthday party that made me feel so loved and special. When I walked into the room and everyone shouted 'Surprise!', I was completely overwhelmed with joy. The cake was chocolate with vanilla frosting, just like I always wanted.",
          mood: "excited",
          date: "2024-01-13",
          patientId: "1",
          type: "photo",
          mediaSrc: "images/birthday_party.jpg",
          audioSrc: "audio/birthday_audio.mp3"
        },
        {
          id: 4,
          title: "Beach Day",
          content: "That perfect day at the beach when the waves were gentle and the sun was warm but not too hot. We built sandcastles and collected seashells. The sound of the ocean was so peaceful, it felt like time stood still.",
          mood: "peaceful",
          date: "2024-01-12",
          patientId: "1",
          type: "audio",
          mediaSrc: "images/beach_day.jpg",
          audioSrc: "audio/ocean_waves.mp3"
        },
        {
          id: 5,
          title: "First Snow",
          content: "The first snowfall of the year when everything was covered in white. We went outside and made snow angels, then came back inside for hot chocolate with marshmallows. The world looked so magical and new.",
          mood: "wonder",
          date: "2024-01-11",
          patientId: "1",
          type: "photo",
          mediaSrc: "images/first_snow.jpg",
          audioSrc: "audio/snow_audio.mp3"
        },
        {
          id: 6,
          title: "Garden Harvest",
          content: "The day we harvested vegetables from our garden. The tomatoes were so red and juicy, and the carrots were sweet and crisp. We made a fresh salad with everything we picked, and it tasted better than anything from the store.",
          mood: "satisfied",
          date: "2024-01-10",
          patientId: "1",
          type: "video",
          mediaSrc: "videos/garden_harvest.mp4",
          audioSrc: "audio/garden_audio.mp3"
        }
      ],
      '2': [ // Robert Smith
        {
          id: 7,
          title: "Wedding Day",
          content: "The most beautiful day of my life. My wife looked absolutely stunning in her white dress. The church was filled with flowers and our families were all there to celebrate with us.",
          mood: "happy",
          date: "2024-01-15",
          patientId: "2",
          type: "photo",
          mediaSrc: "images/wedding_day.jpg",
          audioSrc: "audio/wedding_audio.mp3"
        },
        {
          id: 8,
          title: "Fishing Trip",
          content: "Remember that fishing trip with my son when he was just a boy? We spent the whole day by the lake, and he caught his first fish. The pride in his eyes was unforgettable.",
          mood: "proud",
          date: "2024-01-14",
          patientId: "2",
          type: "video",
          mediaSrc: "videos/fishing_trip.mp4",
          audioSrc: "audio/fishing_audio.mp3"
        },
        {
          id: 9,
          title: "Morning Coffee",
          content: "Started the day with my usual cup of coffee on the porch. The birds were singing and the air was crisp. It reminded me of when I used to have coffee with my father every morning before work.",
          mood: "calm",
          date: "2024-01-13",
          patientId: "2",
          type: "audio",
          mediaSrc: "images/morning_coffee.jpg",
          audioSrc: "audio/morning_birds.mp3"
        },
        {
          id: 10,
          title: "Old Photographs",
          content: "Found some old photographs in the attic today. Looking at pictures from my wedding day brought back so many wonderful memories. My wife looked so beautiful in her white dress.",
          mood: "nostalgic",
          date: "2024-01-12",
          patientId: "2",
          type: "photo",
          mediaSrc: "images/old_photos.jpg",
          audioSrc: "audio/photo_audio.mp3"
        }
      ],
      '3': [ // Margaret Davis
        {
          id: 11,
          title: "Husband's Laugh",
          content: "I can still hear his laugh echoing through the house. He had the most wonderful sense of humor and could always make me smile, even on my worst days.",
          mood: "nostalgic",
          date: "2024-01-15",
          patientId: "3",
          type: "audio",
          mediaSrc: "images/husband_laugh.jpg",
          audioSrc: "audio/husband_laugh.mp3"
        },
        {
          id: 12,
          title: "Feeling Lonely",
          content: "Today was a difficult day. I miss my husband so much. The house feels so empty without him. I tried to distract myself by reading, but my mind kept wandering back to our happy times together.",
          mood: "sad",
          date: "2024-01-14",
          patientId: "3",
          type: "photo",
          mediaSrc: "images/empty_house.jpg",
          audioSrc: "audio/lonely_audio.mp3"
        },
        {
          id: 13,
          title: "Quiet Evening",
          content: "Sitting by the window watching the sunset. The sky was painted in beautiful shades of orange and pink. It reminded me of all the evenings we spent together watching the sun go down.",
          mood: "peaceful",
          date: "2024-01-13",
          patientId: "3",
          type: "video",
          mediaSrc: "videos/sunset_evening.mp4",
          audioSrc: "audio/sunset_audio.mp3"
        }
      ]
    };

    setMemories(patientMemories[selectedPatient] || []);
  }, [selectedPatient]);

  // Handle keyboard controls with slower, more meditative movement
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

  // Slower, more meditative movement
  useEffect(() => {
    const moveSpeed = 0.03; // Even slower for meditative feel
    const forwardSpeed = 0.015; // Very slow forward movement

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

    // Update camera to follow player with smooth following
    setCameraPosition([
      playerPosition[0],
      playerPosition[1] + 8,
      playerPosition[2] + 15
    ]);
  }, [keys, playerPosition]);

  // Enhanced autoplay functionality
  useEffect(() => {
    if (!isAutoPlaying || autoPlayPaused) return;

    const interval = setInterval(() => {
      setCurrentMemoryIndex(prev => {
        const nextIndex = (prev + 1) % memories.length;
        const laneOffset = (nextIndex % 2 === 0) ? 3 : -3;
        const z = -nextIndex * 8 - 10;
        
        // Move player to next memory position
        setPlayerPosition([laneOffset, 0, z]);
        
        // Highlight current memory
        setHighlightedMemory(memories[nextIndex]);
        
        // Pause for 5 seconds at each memory for more contemplative experience
        setAutoPlayPaused(true);
        setTimeout(() => {
          setAutoPlayPaused(false);
        }, 5000);
        
        return nextIndex;
      });
    }, 6000); // Move to next memory every 6 seconds

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

  const getMediaIcon = (type) => {
    switch (type) {
      case 'photo':
        return <PhotoIcon className="h-4 w-4" />;
      case 'video':
        return <VideoCameraIcon className="h-4 w-4" />;
      case 'audio':
        return <SpeakerWaveIcon className="h-4 w-4" />;
      default:
        return <PhotoIcon className="h-4 w-4" />;
    }
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
          <div 
            className="p-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: BRAND_COLORS.primaryLight }}
          >
            <MindbloomLogo size="md" />
          </div>
          <div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: BRAND_COLORS.accent }}
            >
              Memory Lane
            </h1>
            <p className="text-lg text-gray-600">
              Take a peaceful walk down {selectedPatient === '1' ? 'Sarah' : 
              selectedPatient === '2' ? 'Robert' : 'Margaret'}'s Memory Lane, where memories come to life as glowing markers
            </p>
          </div>
        </div>

        {/* Enhanced Controls Instructions */}
        <div 
          className="rounded-xl p-6"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
          }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <StarIcon 
              className="h-6 w-6" 
              style={{ color: BRAND_COLORS.accent }}
            />
            <h3 
              className="text-xl font-semibold"
              style={{ color: BRAND_COLORS.accent }}
            >
              How to explore Memory Lane:
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ color: BRAND_COLORS.accent }}>
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              ></div>
              <span>Use WASD or arrow keys for meditative walking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BRAND_COLORS.accent }}
              ></div>
              <span>Click on glowing markers to view memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BRAND_COLORS.primary }}
              ></div>
              <span>Follow the lantern-lit path to discover all memories</span>
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: BRAND_COLORS.accent }}
              ></div>
              <span>Try autoplay for a guided memory journey</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced 3D Memory Lane */}
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
              maxDistance={25}
              minDistance={8}
            />
          </Canvas>
          
          {/* Enhanced Overlay Controls */}
          <div className="absolute bottom-4 left-4 space-y-2">
            <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Meditative Controls:</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div>W/↑ - Walk Forward (Slow)</div>
                <div>S/↓ - Walk Backward</div>
                <div>A/← - Walk Left</div>
                <div>D/→ - Walk Right</div>
              </div>
            </div>
          </div>

          {/* Player Position Display */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="text-sm font-medium text-gray-700">
              Position: ({playerPosition[0].toFixed(1)}, {playerPosition[2].toFixed(1)})
            </div>
          </div>

          {/* Enhanced Autoplay Controls */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <button
              onClick={toggleAutoPlay}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: isAutoPlaying ? BRAND_COLORS.accent : BRAND_COLORS.primary,
                color: BRAND_COLORS.white
              }}
            >
              {isAutoPlaying ? (
                <>
                  <PauseIcon className="h-4 w-4" />
                  <span>Stop Journey</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  <span>Start Journey</span>
                </>
              )}
            </button>
            {isAutoPlaying && (
              <div className="mt-2 text-xs text-gray-600">
                {autoPlayPaused ? 'Pausing at memory...' : 'Moving to next memory...'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Memory List */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BookOpenIcon 
            className="h-6 w-6" 
            style={{ color: BRAND_COLORS.primary }}
          />
          <h2 
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.accent }}
          >
            {selectedPatient === '1' ? 'Sarah' : 
             selectedPatient === '2' ? 'Robert' : 'Margaret'}'s Memory Collection
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className={`border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer ${
                highlightedMemory && highlightedMemory.id === memory.id 
                  ? 'border-2' 
                  : 'border-gray-200'
              }`}
              style={{
                borderColor: highlightedMemory && highlightedMemory.id === memory.id 
                  ? BRAND_COLORS.primary 
                  : '#e5e7eb',
                backgroundColor: highlightedMemory && highlightedMemory.id === memory.id 
                  ? BRAND_COLORS.primaryLight 
                  : BRAND_COLORS.white
              }}
              onClick={() => handleMemoryClick(memory)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {memory.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(memory.mood)}`}>
                    {memory.mood}
                  </span>
                  {getMediaIcon(memory.type)}
                </div>
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
                    className="font-medium text-sm"
                    style={{ color: BRAND_COLORS.primary }}
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

      {/* Enhanced Memory Modal with Media Support */}
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
              {/* Media Display */}
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                {selectedMemory.type === 'photo' && (
                  <div className="flex items-center justify-center space-x-2">
                    <PhotoIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-600">Photo: {selectedMemory.mediaSrc}</span>
                  </div>
                )}
                {selectedMemory.type === 'video' && (
                  <div className="flex items-center justify-center space-x-2">
                    <VideoCameraIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-600">Video: {selectedMemory.mediaSrc}</span>
                  </div>
                )}
                {selectedMemory.type === 'audio' && (
                  <div className="flex items-center justify-center space-x-2">
                    <SpeakerWaveIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-gray-600">Audio: {selectedMemory.audioSrc}</span>
                  </div>
                )}
              </div>
              
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
                  className="px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  style={{
                    backgroundColor: BRAND_COLORS.primary,
                    color: BRAND_COLORS.white
                  }}
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