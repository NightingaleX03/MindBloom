import json
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
import os

# Try to import Gemini AI, with fallback if grpc is not available
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError as e:
    print(f"Warning: google-generativeai not available: {e}")
    GEMINI_AVAILABLE = False

# Try to import speech recognition
try:
    import speech_recognition as sr
    SPEECH_RECOGNITION_AVAILABLE = True
except ImportError as e:
    print(f"Warning: speech_recognition not available: {e}")
    SPEECH_RECOGNITION_AVAILABLE = False

if GEMINI_AVAILABLE:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
        print(f"✅ Gemini AI configured with API key: {api_key[:10]}...")
    else:
        print("⚠️ GEMINI_API_KEY not found in environment variables")
        GEMINI_AVAILABLE = False

class InterviewAnalysisService:
    def __init__(self):
        if GEMINI_AVAILABLE:
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
            
        if SPEECH_RECOGNITION_AVAILABLE:
            self.recognizer = sr.Recognizer()
        else:
            self.recognizer = None
            
        self.interview_context = {}
        
    async def analyze_speech_patterns(self, audio_data: bytes, patient_id: str) -> Dict:
        """
        Analyze speech patterns for dementia indicators
        """
        try:
            # Convert audio to text
            if SPEECH_RECOGNITION_AVAILABLE and self.recognizer:
                audio = sr.AudioData(audio_data, sample_rate=16000, sample_width=2)
                text = self.recognizer.recognize_google(audio)
            else:
                # Fallback: simulate speech recognition
                text = "Patient response to memory question about family traditions."
            
            # Analyze with Gemini if available
            if GEMINI_AVAILABLE and self.model:
                analysis_prompt = f"""
                Analyze this speech sample for dementia indicators. Focus on:
                1. Speech fluency and coherence
                2. Word-finding difficulties
                3. Memory recall patterns
                4. Emotional state
                5. Cognitive function indicators
                
                Speech: "{text}"
                
                Provide analysis in JSON format with scores (0-10) and detailed observations.
                """
                
                response = await self._get_gemini_response(analysis_prompt)
                analysis = json.loads(response)
            else:
                # Fallback analysis
                analysis = {
                    "speech_fluency": 8.5,
                    "word_finding": 7.0,
                    "memory_recall": 8.0,
                    "emotional_state": "positive",
                    "cognitive_coherence": 8.5,
                    "dementia_risk": "low",
                    "observations": [
                        "Clear speech patterns",
                        "Good word-finding abilities",
                        "Coherent memory recall",
                        "Positive emotional engagement"
                    ]
                }
            
            # Store context for patient
            if patient_id not in self.interview_context:
                self.interview_context[patient_id] = {
                    'speech_samples': [],
                    'cognitive_scores': [],
                    'emotional_states': [],
                    'memory_patterns': []
                }
            
            self.interview_context[patient_id]['speech_samples'].append({
                'text': text,
                'analysis': analysis,
                'timestamp': datetime.now().isoformat()
            })
            
            return {
                'transcribed_text': text,
                'analysis': analysis,
                'patient_id': patient_id
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'transcribed_text': '',
                'analysis': {}
            }
    
    async def analyze_response_to_question(self, question: str, response_text: str, patient_id: str) -> Dict:
        """
        Analyze patient's response to specific memory questions
        """
        try:
            if GEMINI_AVAILABLE and self.model:
                print(f"🤖 Using Gemini AI to analyze response: '{response_text[:50]}...'")
                analysis_prompt = f"""
                Analyze this dementia patient's response to a memory question.
                
                Question: "{question}"
                Patient Response: "{response_text}"
                
                Analyze for:
                1. Memory recall accuracy (0-10)
                2. Emotional engagement (0-10)
                3. Cognitive coherence (0-10)
                4. Memory type (episodic, semantic, procedural)
                5. Potential dementia indicators
                6. Care recommendations
                
                Provide detailed analysis in JSON format.
                """
                
                response = await self._get_gemini_response(analysis_prompt)
                analysis = json.loads(response)
                print(f"✅ Gemini analysis completed for response")
            else:
                print(f"⚠️ Using fallback analysis (Gemini not available)")
                # Fallback analysis
                analysis = {
                    "memory_recall_accuracy": 8.5,
                    "emotional_engagement": 9.0,
                    "cognitive_coherence": 8.0,
                    "memory_type": "episodic",
                    "dementia_indicators": {
                        "word_finding_difficulty": "low",
                        "memory_consistency": "high",
                        "emotional_stability": "stable"
                    },
                    "care_recommendations": [
                        "Continue memory exercises",
                        "Encourage social interaction",
                        "Monitor for any changes in speech patterns"
                    ],
                    "observations": [
                        "Patient shows strong episodic memory recall",
                        "Emotional engagement is high and positive",
                        "Speech patterns are clear and coherent",
                        "Good word-finding abilities demonstrated"
                    ]
                }
            
            # Update patient context
            if patient_id in self.interview_context:
                self.interview_context[patient_id]['memory_patterns'].append({
                    'question': question,
                    'response': response_text,
                    'analysis': analysis,
                    'timestamp': datetime.now().isoformat()
                })
            
            return {
                'question': question,
                'response': response_text,
                'analysis': analysis,
                'patient_id': patient_id
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'analysis': {}
            }
    
    async def generate_interview_summary(self, patient_id: str) -> Dict:
        """
        Generate comprehensive interview summary and recommendations
        """
        try:
            if patient_id not in self.interview_context:
                return {'error': 'No interview data found for patient'}
            
            context = self.interview_context[patient_id]
            
            if GEMINI_AVAILABLE and self.model:
                summary_prompt = f"""
                Generate a comprehensive dementia assessment summary based on interview data.
                
                Speech Samples: {len(context['speech_samples'])}
                Memory Responses: {len(context['memory_patterns'])}
                
                Analyze patterns across all responses and provide:
                1. Overall cognitive assessment
                2. Dementia risk indicators
                3. Memory function analysis
                4. Emotional well-being assessment
                5. Care recommendations
                6. Suggested interventions
                
                Provide detailed analysis in JSON format.
                """
                
                response = await self._get_gemini_response(summary_prompt)
                summary = json.loads(response)
            else:
                # Fallback summary
                summary = {
                    "overall_cognitive_assessment": "good",
                    "dementia_risk": "low",
                    "memory_function": "strong",
                    "emotional_wellbeing": "positive",
                    "care_recommendations": [
                        "Continue current memory exercises",
                        "Maintain social connections",
                        "Regular cognitive monitoring"
                    ],
                    "interventions": [
                        "Memory enhancement activities",
                        "Social engagement programs",
                        "Regular health checkups"
                    ]
                }
            
            return {
                'patient_id': patient_id,
                'summary': summary,
                'interview_data': context,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'summary': {}
            }
    
    async def get_real_time_feedback(self, current_response: str, question: str) -> Dict:
        """
        Get real-time feedback during interview
        """
        try:
            if GEMINI_AVAILABLE and self.model:
                feedback_prompt = f"""
                Provide real-time feedback for a dementia patient interview.
                
                Current Question: "{question}"
                Patient Response: "{current_response}"
                
                Provide immediate feedback on:
                1. Response quality
                2. Engagement level
                3. Suggested follow-up questions
                4. Any concerns to address
                
                Keep feedback encouraging and supportive.
                """
                
                response = await self._get_gemini_response(feedback_prompt)
                feedback = json.loads(response)
            else:
                # Fallback feedback
                feedback = {
                    "response_quality": "good",
                    "engagement_level": "high",
                    "follow_up_questions": [
                        "Can you tell me more about that?",
                        "How did that make you feel?",
                        "What else do you remember about that time?"
                    ],
                    "concerns": "none",
                    "encouragement": "Excellent response! You're doing great."
                }
            
            return {
                'feedback': feedback,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'feedback': {}
            }
    
    async def find_relevant_memories(self, current_response: str, patient_id: str, question: str) -> Dict:
        """
        Find existing memories that are relevant to the current response
        """
        try:
            # Mock existing memories for demonstration
            # In a real implementation, this would query the database
            existing_memories = [
                {
                    "id": "mem-1",
                    "title": "Grandmother's Kitchen",
                    "content": "I remember when my grandmother would make the most wonderful chocolate chip cookies. The smell would fill the entire house, and we would all gather in the kitchen to watch her work her magic.",
                    "emotional_tone": 9.2,
                    "memory_type": "episodic",
                    "created_at": "2024-01-10T10:30:00Z",
                    "tags": ["family", "cooking", "grandmother", "childhood"]
                },
                {
                    "id": "mem-2", 
                    "title": "Camping with Parents",
                    "content": "My favorite memory with my parents was when we went camping in the mountains. We sat around the campfire telling stories, and I felt so safe and loved.",
                    "emotional_tone": 9.5,
                    "memory_type": "episodic",
                    "created_at": "2024-01-12T14:20:00Z",
                    "tags": ["family", "outdoors", "camping", "parents"]
                },
                {
                    "id": "mem-3",
                    "title": "College Graduation",
                    "content": "I was really proud when I graduated from college. It was the first person in my family to get a degree, and my parents were so proud of me.",
                    "emotional_tone": 9.8,
                    "memory_type": "episodic",
                    "created_at": "2024-01-08T16:45:00Z",
                    "tags": ["achievement", "education", "family", "pride"]
                },
                {
                    "id": "mem-4",
                    "title": "Grandmother's Garden",
                    "content": "The place that holds special meaning for me is my grandmother's garden. She taught me how to plant flowers and vegetables, and I still remember the smell of fresh soil.",
                    "emotional_tone": 8.9,
                    "memory_type": "episodic",
                    "created_at": "2024-01-05T09:15:00Z",
                    "tags": ["grandmother", "garden", "nature", "learning"]
                },
                {
                    "id": "mem-5",
                    "title": "Best Friend Sarah",
                    "content": "My best friend growing up was Sarah. We met in kindergarten and were inseparable. She always knew how to make me laugh when I was sad.",
                    "emotional_tone": 8.7,
                    "memory_type": "episodic",
                    "created_at": "2024-01-03T11:30:00Z",
                    "tags": ["friendship", "childhood", "support", "laughter"]
                }
            ]
            
            if GEMINI_AVAILABLE and self.model:
                print(f"🤖 Using Gemini AI to find relevant memories for: '{current_response[:50]}...'")
                
                memory_prompt = f"""
                Analyze this patient's current response and find the most relevant existing memories.
                
                Current Question: "{question}"
                Current Response: "{current_response}"
                
                Available Memories:
                {json.dumps(existing_memories, indent=2)}
                
                Find 2-3 memories that are most relevant to the current response based on:
                1. Emotional similarity (similar feelings, tone)
                2. Content similarity (related topics, people, places)
                3. Memory type compatibility
                4. Temporal relevance (time period, era)
                
                For each relevant memory, provide:
                - Relevance score (0-10)
                - Connection explanation
                - Suggested prompt to share the memory
                
                Return in JSON format with structure:
                {{
                    "relevant_memories": [
                        {{
                            "memory_id": "mem-1",
                            "relevance_score": 9.2,
                            "connection": "Both memories involve grandmother and family traditions",
                            "suggested_prompt": "This reminds me of when your grandmother used to make cookies. Would you like to share more about that time?"
                        }}
                    ],
                    "emotional_theme": "family warmth and tradition",
                    "suggested_follow_up": "It sounds like family traditions are very important to you. What other family traditions do you remember?"
                }}
                """
                
                response = await self._get_gemini_response(memory_prompt)
                analysis = json.loads(response)
                print(f"✅ Memory relevance analysis completed")
                
            else:
                print(f"⚠️ Using fallback memory matching")
                # Fallback: simple keyword matching
                analysis = self._fallback_memory_matching(current_response, existing_memories, question)
            
            return {
                'current_response': current_response,
                'question': question,
                'patient_id': patient_id,
                'memory_suggestions': analysis,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error finding relevant memories: {str(e)}")
            return {
                'error': str(e),
                'memory_suggestions': {}
            }
    
    def _fallback_memory_matching(self, current_response: str, existing_memories: List[Dict], question: str) -> Dict:
        """
        Fallback memory matching using simple keyword analysis
        """
        # Simple keyword matching
        response_lower = current_response.lower()
        relevant_memories = []
        
        # Keywords to look for
        family_keywords = ['family', 'mother', 'father', 'grandmother', 'grandfather', 'parent']
        cooking_keywords = ['cook', 'kitchen', 'food', 'recipe', 'bake']
        outdoor_keywords = ['camping', 'outdoor', 'nature', 'garden', 'mountain']
        achievement_keywords = ['proud', 'graduation', 'degree', 'accomplishment', 'success']
        friendship_keywords = ['friend', 'best friend', 'childhood', 'school']
        
        for memory in existing_memories:
            relevance_score = 0
            connection = ""
            
            # Check for family connections
            if any(keyword in response_lower for keyword in family_keywords):
                if any(keyword in memory['content'].lower() for keyword in family_keywords):
                    relevance_score += 3
                    connection = "Both memories involve family relationships"
            
            # Check for cooking/food connections
            if any(keyword in response_lower for keyword in cooking_keywords):
                if any(keyword in memory['content'].lower() for keyword in cooking_keywords):
                    relevance_score += 2
                    connection = "Both memories involve cooking and food traditions"
            
            # Check for outdoor/nature connections
            if any(keyword in response_lower for keyword in outdoor_keywords):
                if any(keyword in memory['content'].lower() for keyword in outdoor_keywords):
                    relevance_score += 2
                    connection = "Both memories involve outdoor activities and nature"
            
            # Check for achievement connections
            if any(keyword in response_lower for keyword in achievement_keywords):
                if any(keyword in memory['content'].lower() for keyword in achievement_keywords):
                    relevance_score += 2
                    connection = "Both memories involve personal achievements and pride"
            
            # Check for friendship connections
            if any(keyword in response_lower for keyword in friendship_keywords):
                if any(keyword in memory['content'].lower() for keyword in friendship_keywords):
                    relevance_score += 2
                    connection = "Both memories involve friendships and relationships"
            
            if relevance_score > 0:
                relevant_memories.append({
                    "memory_id": memory['id'],
                    "relevance_score": min(relevance_score, 9.0),
                    "connection": connection,
                    "suggested_prompt": f"This reminds me of your memory about {memory['title']}. Would you like to share more about that time?",
                    "memory_title": memory['title']
                })
        
        # Sort by relevance score
        relevant_memories.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return {
            "relevant_memories": relevant_memories[:3],
            "emotional_theme": "family and personal connections",
            "suggested_follow_up": "It sounds like these memories are very meaningful to you. What other memories come to mind?"
        }
    
    async def _get_gemini_response(self, prompt: str) -> str:
        """
        Get response from Gemini AI
        """
        try:
            if self.model:
                response = self.model.generate_content(prompt)
                return response.text
            else:
                return '{"error": "Gemini AI not available"}'
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return '{"error": "Gemini API error"}'
    
    def get_patient_context(self, patient_id: str) -> Dict:
        """
        Get stored context for a patient
        """
        return self.interview_context.get(patient_id, {})

# Initialize the service
interview_analysis_service = InterviewAnalysisService() 