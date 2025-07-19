import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  CogIcon,
  EyeIcon,
  PlusIcon,
  ArrowPathIcon
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

const AITrainingDashboard = () => {
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [modelPerformance, setModelPerformance] = useState(null);
  const [trainingExamples, setTrainingExamples] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showTrainingExamples, setShowTrainingExamples] = useState(false);

  useEffect(() => {
    loadTrainingStatus();
    loadModelPerformance();
    loadTrainingExamples();
  }, []);

  const loadTrainingStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai-training/training-status');
      if (response.ok) {
        const status = await response.json();
        setTrainingStatus(status);
      }
    } catch (error) {
      console.error('Failed to load training status:', error);
    }
  };

  const loadModelPerformance = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai-training/model-performance');
      if (response.ok) {
        const performance = await response.json();
        setModelPerformance(performance);
      }
    } catch (error) {
      console.error('Failed to load model performance:', error);
    }
  };

  const loadTrainingExamples = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai-training/training-examples');
      if (response.ok) {
        const data = await response.json();
        setTrainingExamples(data.examples || []);
      }
    } catch (error) {
      console.error('Failed to load training examples:', error);
    }
  };

  const trainModel = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai-training/train-model', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Training completed:', result);
        await loadTrainingStatus();
        await loadModelPerformance();
      }
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const validateModel = async () => {
    setIsValidating(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai-training/validate-model', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Validation completed:', result);
        await loadModelPerformance();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const deployModel = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai-training/deploy-model', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Deployment completed:', result);
        await loadTrainingStatus();
      }
    } catch (error) {
      console.error('Deployment failed:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div 
        className="rounded-2xl shadow-lg p-8"
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
              AI Training Dashboard
            </h1>
            <p 
              className="text-lg"
              style={{ color: BRAND_COLORS.accent }}
            >
              Train and manage the dementia assessment AI model
            </p>
          </div>
        </div>

        {/* Model Status */}
        {trainingStatus && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: BRAND_COLORS.primaryLight }}
            >
              <CpuChipIcon 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: BRAND_COLORS.accent }}
              />
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: BRAND_COLORS.accent }}
              >
                {trainingStatus.model_status}
              </div>
              <div 
                className="text-sm"
                style={{ color: BRAND_COLORS.accent }}
              >
                Model Status
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: BRAND_COLORS.accentLight }}
            >
              <ChartBarIcon 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: BRAND_COLORS.primary }}
              />
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: BRAND_COLORS.accent }}
              >
                {trainingStatus.model_accuracy}
              </div>
              <div 
                className="text-sm"
                style={{ color: BRAND_COLORS.accent }}
              >
                Model Accuracy
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: BRAND_COLORS.primaryLight }}
            >
              <EyeIcon 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: BRAND_COLORS.accent }}
              />
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: BRAND_COLORS.accent }}
              >
                {trainingStatus.training_data_size}
              </div>
              <div 
                className="text-sm"
                style={{ color: BRAND_COLORS.accent }}
              >
                Training Examples
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: BRAND_COLORS.accentLight }}
            >
              <CheckCircleIcon 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: BRAND_COLORS.primary }}
              />
              <div 
                className="text-2xl font-bold mb-1"
                style={{ color: BRAND_COLORS.accent }}
              >
                {trainingStatus.ready_for_deployment ? 'Ready' : 'Not Ready'}
              </div>
              <div 
                className="text-sm"
                style={{ color: BRAND_COLORS.accent }}
              >
                Deployment Status
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={trainModel}
            disabled={isTraining}
            className="px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            style={{
              backgroundColor: isTraining ? BRAND_COLORS.accentLight : BRAND_COLORS.primary,
              color: BRAND_COLORS.white
            }}
          >
            {isTraining ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Training...</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5" />
                <span>Train Model</span>
              </>
            )}
          </button>
          
          <button
            onClick={validateModel}
            disabled={isValidating}
            className="px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            style={{
              backgroundColor: isValidating ? BRAND_COLORS.accentLight : BRAND_COLORS.accent,
              color: BRAND_COLORS.white
            }}
          >
            {isValidating ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Validating...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-5 w-5" />
                <span>Validate Model</span>
              </>
            )}
          </button>
          
          <button
            onClick={deployModel}
            disabled={isDeploying || !trainingStatus?.ready_for_deployment}
            className="px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            style={{
              backgroundColor: isDeploying ? BRAND_COLORS.accentLight : BRAND_COLORS.primary,
              color: BRAND_COLORS.white,
              opacity: !trainingStatus?.ready_for_deployment ? 0.5 : 1
            }}
          >
            {isDeploying ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <CogIcon className="h-5 w-5" />
                <span>Deploy Model</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowTrainingExamples(!showTrainingExamples)}
            className="px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            style={{
              backgroundColor: BRAND_COLORS.accent,
              color: BRAND_COLORS.white
            }}
          >
            <EyeIcon className="h-5 w-5" />
            <span>View Training Examples</span>
          </button>
        </div>
      </div>

      {/* Model Performance */}
      {modelPerformance && (
        <div 
          className="rounded-2xl shadow-lg p-8"
          style={{ backgroundColor: BRAND_COLORS.white }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: BRAND_COLORS.accent }}
          >
            Model Performance Metrics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: BRAND_COLORS.primaryLight }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                Overall Accuracy
              </h3>
              <div 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.primary }}
              >
                {modelPerformance.overall_accuracy}
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: BRAND_COLORS.accentLight }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                Memory Recall Accuracy
              </h3>
              <div 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.primary }}
              >
                {modelPerformance.memory_recall_accuracy}
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: BRAND_COLORS.primaryLight }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                Dementia Detection
              </h3>
              <div 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.primary }}
              >
                {modelPerformance.dementia_detection_accuracy}
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: BRAND_COLORS.accentLight }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                Response Time
              </h3>
              <div 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.primary }}
              >
                {modelPerformance.response_time}
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: BRAND_COLORS.primaryLight }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                Care Recommendations
              </h3>
              <div 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.primary }}
              >
                {modelPerformance.care_recommendation_accuracy}
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: BRAND_COLORS.accentLight }}
            >
              <h3 
                className="font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                Model Confidence
              </h3>
              <div 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.primary }}
              >
                {modelPerformance.model_confidence}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Examples */}
      {showTrainingExamples && (
        <div 
          className="rounded-2xl shadow-lg p-8"
          style={{ backgroundColor: BRAND_COLORS.white }}
        >
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: BRAND_COLORS.accent }}
          >
            Training Examples
          </h2>
          
          <div className="space-y-6">
            {trainingExamples.map((example, index) => (
              <div 
                key={index}
                className="border rounded-xl p-6"
                style={{ borderColor: BRAND_COLORS.primaryLight }}
              >
                <h3 
                  className="font-semibold mb-2"
                  style={{ color: BRAND_COLORS.accent }}
                >
                  Example {index + 1}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span 
                      className="font-medium"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Question:
                    </span>
                    <p 
                      className="mt-1"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      {example.question}
                    </p>
                  </div>
                  
                  <div>
                    <span 
                      className="font-medium"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      Patient Response:
                    </span>
                    <p 
                      className="mt-1 italic"
                      style={{ color: BRAND_COLORS.accent }}
                    >
                      "{example.patient_response}"
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span 
                        className="font-medium"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        Memory Recall:
                      </span>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        {example.expected_analysis.memory_recall_accuracy}/10
                      </div>
                    </div>
                    
                    <div>
                      <span 
                        className="font-medium"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        Emotional Engagement:
                      </span>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        {example.expected_analysis.emotional_engagement}/10
                      </div>
                    </div>
                    
                    <div>
                      <span 
                        className="font-medium"
                        style={{ color: BRAND_COLORS.accent }}
                      >
                        Cognitive Coherence:
                      </span>
                      <div 
                        className="text-lg font-bold"
                        style={{ color: BRAND_COLORS.primary }}
                      >
                        {example.expected_analysis.cognitive_coherence}/10
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITrainingDashboard; 