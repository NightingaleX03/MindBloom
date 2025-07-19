import React, { useState, useEffect, useRef } from 'react';
import { 
  CalendarIcon, 
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  BeakerIcon,
  UserGroupIcon,
  UserIcon,
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

const Calendar = ({ selectedPatient }) => {
  const [events, setEvents] = useState([]);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'activity',
    startTime: '',
    endTime: '',
    priority: 'medium',
    reminders: []
  });
  const formRef = useRef(null);

  const eventTypes = [
    { value: 'medication', label: 'Medication', icon: BeakerIcon, color: 'bg-red-100 text-red-800' },
    { value: 'appointment', label: 'Appointment', icon: UserGroupIcon, color: 'bg-blue-100 text-blue-800' },
    { value: 'activity', label: 'Activity', icon: HeartIcon, color: 'bg-green-100 text-green-800' },
    { value: 'reminder', label: 'Reminder', icon: ClockIcon, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  // Load events from localStorage and backend
  useEffect(() => {
    if (!selectedPatient) {
      setEvents([]);
      return;
    }

    const loadEvents = async () => {
      try {
        // Try to load from backend first
        const response = await fetch(`/api/calendar?user_id=${selectedPatient}`);
        if (response.ok) {
          const backendEvents = await response.json();
          setEvents(backendEvents);
          // Save to localStorage as backup
          localStorage.setItem(`calendar-events-${selectedPatient}`, JSON.stringify(backendEvents));
        } else {
          // Fallback to localStorage
          const savedEvents = JSON.parse(localStorage.getItem(`calendar-events-${selectedPatient}`) || '[]');
          setEvents(savedEvents);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        // Fallback to localStorage
        const savedEvents = JSON.parse(localStorage.getItem(`calendar-events-${selectedPatient}`) || '[]');
        setEvents(savedEvents);
      }
    };

    loadEvents();
  }, [selectedPatient]);

  // Ensure events exist for the selected date
  useEffect(() => {
    if (!selectedPatient) return;
    
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const currentEvents = events.filter(event => event.date === selectedDateStr);
    
    // If no events exist for the selected date, generate daily recurring events
    if (currentEvents.length === 0) {
      const dailyEvents = generateDailyRecurringEvents(selectedDateStr);
      const dailyPatientEvents = dailyEvents[selectedPatient] || [];
      
      // Add the new events to existing events
      const updatedEvents = [...events, ...dailyPatientEvents];
      setEvents(updatedEvents);
      
      // Save to localStorage
      localStorage.setItem(`calendar-events-${selectedPatient}`, JSON.stringify(updatedEvents));
    }
  }, [selectedDate, selectedPatient, events]);

  // Helper function to generate daily recurring events
  const generateDailyRecurringEvents = (dateStr) => {
    const baseId = parseInt(dateStr.replace(/-/g, '')) * 1000; // Unique ID based on date
    
    return {
      '1': [ // Sarah Johnson - Daily recurring events
        {
          id: baseId + 1,
          title: "Morning Blood Pressure Check",
          description: "Check blood pressure and record readings",
          type: "medication",
          startTime: "07:00",
          endTime: "07:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1",
          recurring: true
        },
        {
          id: baseId + 2,
          title: "Morning Medication",
          description: "Take heart medication with water",
          type: "medication",
          startTime: "07:30",
          endTime: "07:45",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1",
          recurring: true
        },
        {
          id: baseId + 3,
          title: "Breakfast",
          description: "Light breakfast with family",
          type: "activity",
          startTime: "08:00",
          endTime: "08:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1",
          recurring: true
        },
        {
          id: baseId + 4,
          title: "Evening Medication",
          description: "Take evening heart medication",
          type: "medication",
          startTime: "19:00",
          endTime: "19:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1",
          recurring: true
        },
        {
          id: baseId + 5,
          title: "Blood Pressure Check",
          description: "Evening blood pressure monitoring",
          type: "medication",
          startTime: "20:00",
          endTime: "20:10",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1",
          recurring: true
        }
      ],
      '2': [ // Robert Smith - Daily recurring events
        {
          id: baseId + 6,
          title: "Morning Routine",
          description: "Get dressed and prepare for the day",
          type: "activity",
          startTime: "07:00",
          endTime: "07:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2",
          recurring: true
        },
        {
          id: baseId + 7,
          title: "Breakfast & Coffee",
          description: "Daily coffee on the porch with newspaper",
          type: "activity",
          startTime: "07:30",
          endTime: "08:15",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2",
          recurring: true
        },
        {
          id: baseId + 8,
          title: "Memory Therapy Session",
          description: "Cognitive exercises with therapist Sarah",
          type: "appointment",
          startTime: "10:00",
          endTime: "11:00",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "2",
          recurring: true
        },
        {
          id: baseId + 9,
          title: "Dinner",
          description: "Evening meal with family",
          type: "activity",
          startTime: "18:00",
          endTime: "18:45",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2",
          recurring: true
        }
      ],
      '3': [ // Margaret Davis - Daily recurring events
        {
          id: baseId + 10,
          title: "Morning Meditation",
          description: "Quiet meditation in the garden",
          type: "activity",
          startTime: "06:30",
          endTime: "07:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3",
          recurring: true
        },
        {
          id: baseId + 11,
          title: "Breakfast",
          description: "Light breakfast and tea",
          type: "activity",
          startTime: "07:00",
          endTime: "07:30",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "3",
          recurring: true
        },
        {
          id: baseId + 12,
          title: "Morning Medication",
          description: "Take morning anti-depressant",
          type: "medication",
          startTime: "10:00",
          endTime: "10:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "3",
          recurring: true
        },
        {
          id: baseId + 13,
          title: "Evening Medication",
          description: "Take anti-depressant medication",
          type: "medication",
          startTime: "19:00",
          endTime: "19:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "3",
          recurring: true
        }
      ]
    };
  };

  // Helper function to generate default events for any date
  const generateDefaultEvents = (dateStr) => {
    return {
      '1': [ // Sarah Johnson - Heart patient with daily routine
        {
          id: 1,
          title: "Morning Blood Pressure Check",
          description: "Check blood pressure and record readings",
          type: "medication",
          startTime: "07:00",
          endTime: "07:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 2,
          title: "Morning Medication",
          description: "Take heart medication with water",
          type: "medication",
          startTime: "07:30",
          endTime: "07:45",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 3,
          title: "Breakfast",
          description: "Light breakfast with family",
          type: "activity",
          startTime: "08:00",
          endTime: "08:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 4,
          title: "Morning Walk",
          description: "Gentle walking in the garden",
          type: "activity",
          startTime: "09:00",
          endTime: "09:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 5,
          title: "Reading Time",
          description: "Quiet reading with tea",
          type: "activity",
          startTime: "10:00",
          endTime: "10:45",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 6,
          title: "Lunch",
          description: "Lunch with family",
          type: "activity",
          startTime: "12:00",
          endTime: "12:45",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 7,
          title: "Afternoon Rest",
          description: "Quiet time with reading",
          type: "activity",
          startTime: "13:00",
          endTime: "13:45",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 8,
          title: "Cardiologist Appointment",
          description: "Monthly checkup with Dr. Johnson",
          type: "appointment",
          startTime: "14:00",
          endTime: "15:00",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 9,
          title: "Afternoon Tea",
          description: "Tea time with friends",
          type: "activity",
          startTime: "15:30",
          endTime: "16:15",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 10,
          title: "Evening Walk",
          description: "Short evening walk",
          type: "activity",
          startTime: "17:00",
          endTime: "17:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 11,
          title: "Dinner",
          description: "Evening meal with family",
          type: "activity",
          startTime: "18:00",
          endTime: "18:45",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 12,
          title: "Evening Medication",
          description: "Take evening heart medication",
          type: "medication",
          startTime: "19:00",
          endTime: "19:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 13,
          title: "Blood Pressure Check",
          description: "Evening blood pressure monitoring",
          type: "medication",
          startTime: "20:00",
          endTime: "20:10",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "1"
        },
        {
          id: 14,
          title: "Evening Reading",
          description: "Quiet reading before bed",
          type: "activity",
          startTime: "20:30",
          endTime: "21:15",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "1"
        }
      ],
      '2': [ // Robert Smith - Memory care patient
        {
          id: 15,
          title: "Morning Routine",
          description: "Get dressed and prepare for the day",
          type: "activity",
          startTime: "07:00",
          endTime: "07:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 16,
          title: "Breakfast & Coffee",
          description: "Daily coffee on the porch with newspaper",
          type: "activity",
          startTime: "07:30",
          endTime: "08:15",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 17,
          title: "Morning Walk",
          description: "Short walk in the garden",
          type: "activity",
          startTime: "08:30",
          endTime: "09:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 18,
          title: "Memory Therapy Session",
          description: "Cognitive exercises with therapist Sarah",
          type: "appointment",
          startTime: "10:00",
          endTime: "11:00",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 19,
          title: "Puzzle Time",
          description: "Work on crossword puzzles",
          type: "activity",
          startTime: "11:15",
          endTime: "12:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 20,
          title: "Lunch",
          description: "Lunch with family",
          type: "activity",
          startTime: "12:00",
          endTime: "12:45",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 21,
          title: "Afternoon Rest",
          description: "Quiet time in the garden",
          type: "reminder",
          startTime: "13:00",
          endTime: "13:45",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 22,
          title: "Afternoon Nap",
          description: "Rest period in the garden",
          type: "reminder",
          startTime: "14:00",
          endTime: "15:00",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 23,
          title: "Tea Time",
          description: "Afternoon tea with family",
          type: "activity",
          startTime: "15:30",
          endTime: "16:15",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 24,
          title: "Evening Walk",
          description: "Short walk around the neighborhood",
          type: "activity",
          startTime: "17:00",
          endTime: "17:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 25,
          title: "Dinner",
          description: "Evening meal with family",
          type: "activity",
          startTime: "18:00",
          endTime: "18:45",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 26,
          title: "Evening Activities",
          description: "Watch TV or read with family",
          type: "activity",
          startTime: "19:00",
          endTime: "20:00",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "2"
        },
        {
          id: 27,
          title: "Bedtime Routine",
          description: "Prepare for bed",
          type: "activity",
          startTime: "20:30",
          endTime: "21:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "2"
        }
      ],
      '3': [ // Margaret Davis - Grief counseling patient
        {
          id: 28,
          title: "Morning Meditation",
          description: "Quiet meditation in the garden",
          type: "activity",
          startTime: "06:30",
          endTime: "07:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 29,
          title: "Breakfast",
          description: "Light breakfast and tea",
          type: "activity",
          startTime: "07:00",
          endTime: "07:30",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 30,
          title: "Morning Walk",
          description: "Gentle walk in the garden",
          type: "activity",
          startTime: "08:00",
          endTime: "08:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 31,
          title: "Reading Time",
          description: "Quiet reading with tea",
          type: "activity",
          startTime: "09:00",
          endTime: "09:45",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 32,
          title: "Morning Medication",
          description: "Take morning anti-depressant",
          type: "medication",
          startTime: "10:00",
          endTime: "10:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 33,
          title: "Grief Counseling Session",
          description: "Weekly session with Dr. Williams",
          type: "appointment",
          startTime: "11:00",
          endTime: "12:00",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 34,
          title: "Lunch with Friend",
          description: "Meet with friend Mary for lunch",
          type: "activity",
          startTime: "12:30",
          endTime: "13:30",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 35,
          title: "Afternoon Rest",
          description: "Quiet time for reflection",
          type: "activity",
          startTime: "13:45",
          endTime: "14:30",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 36,
          title: "Reading Time",
          description: "Quiet reading in the garden",
          type: "activity",
          startTime: "15:00",
          endTime: "16:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 37,
          title: "Afternoon Tea",
          description: "Tea time with family",
          type: "activity",
          startTime: "16:30",
          endTime: "17:15",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 38,
          title: "Evening Walk",
          description: "Gentle evening walk",
          type: "activity",
          startTime: "17:30",
          endTime: "18:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 39,
          title: "Dinner",
          description: "Evening meal with family",
          type: "activity",
          startTime: "18:00",
          endTime: "18:45",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 40,
          title: "Evening Medication",
          description: "Take anti-depressant medication",
          type: "medication",
          startTime: "19:00",
          endTime: "19:15",
          priority: "high",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 41,
          title: "Evening Reflection",
          description: "Journal writing and reflection",
          type: "activity",
          startTime: "20:00",
          endTime: "21:00",
          priority: "medium",
          completed: false,
          date: dateStr,
          patientId: "3"
        },
        {
          id: 42,
          title: "Bedtime Routine",
          description: "Prepare for bed and relaxation",
          type: "activity",
          startTime: "21:30",
          endTime: "22:00",
          priority: "low",
          completed: false,
          date: dateStr,
          patientId: "3"
        }
      ]
    };
  };

    // Function to reset events to defaults
  const resetToDefaultEvents = () => {
    // Clear localStorage for this patient to force reload of default events
    localStorage.removeItem(`calendar-events-${selectedPatient}`);
    
    // Force reload the component with default events
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    const dailyEvents = generateDailyRecurringEvents(selectedDateStr);
    
    const dailyPatientEvents = dailyEvents[selectedPatient] || [];
    setEvents(dailyPatientEvents);
    localStorage.setItem(`calendar-events-${selectedPatient}`, JSON.stringify(dailyPatientEvents));
    
    // Show success message
    alert(`Default events loaded for ${selectedPatient === '1' ? 'Sarah' : 
    selectedPatient === '2' ? 'Robert' : 'Margaret'}!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const event = {
      id: Date.now(),
      ...newEvent,
      date: selectedDate.toISOString().split('T')[0],
      completed: false,
      patientId: selectedPatient
    };

    try {
      // Save to backend API
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (response.ok) {
        // Add to local state
    setEvents([...events, event]);
        
        // Save to localStorage as backup
        const savedEvents = JSON.parse(localStorage.getItem(`calendar-events-${selectedPatient}`) || '[]');
        savedEvents.push(event);
        localStorage.setItem(`calendar-events-${selectedPatient}`, JSON.stringify(savedEvents));
        
        // Reset form
    setNewEvent({
      title: '',
      description: '',
      type: 'activity',
      startTime: '',
      endTime: '',
      priority: 'medium',
      reminders: []
    });
    setShowNewEvent(false);
        
        // Show success message
        alert('Event saved successfully!');
      } else {
        throw new Error('Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      
      // Fallback: save to localStorage only
      setEvents([...events, event]);
      const savedEvents = JSON.parse(localStorage.getItem(`calendar-events-${selectedPatient}`) || '[]');
      savedEvents.push(event);
      localStorage.setItem(`calendar-events-${selectedPatient}`, JSON.stringify(savedEvents));
      
      // Reset form
      setNewEvent({
        title: '',
        description: '',
        type: 'activity',
        startTime: '',
        endTime: '',
        priority: 'medium',
        reminders: []
      });
      setShowNewEvent(false);
      
      alert('Event saved locally (backend unavailable)');
    }
  };

  const handleCompleteEvent = async (eventId) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    );
    
    setEvents(updatedEvents);
    
    // Save updated events to localStorage
    localStorage.setItem(`calendar-events-${selectedPatient}`, JSON.stringify(updatedEvents));
    
    // Try to update on backend
    try {
      const eventToUpdate = updatedEvents.find(event => event.id === eventId);
      await fetch(`/api/calendar/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventToUpdate)
      });
    } catch (error) {
      console.error('Error updating event on backend:', error);
      // Event is already saved locally, so no user notification needed
    }
  };

  const handleAddEventClick = () => {
    setShowNewEvent(true);
    // Scroll to the form after a short delay to ensure it's rendered
    setTimeout(() => {
      formRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const getTodayEvents = () => {
    const today = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };

  const getOverdueEvents = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentTimeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return events.filter(event => {
      // Only check events that are not completed
      if (event.completed) return false;
      
      // Parse event time to minutes since midnight
      const [eventHour, eventMinute] = event.startTime.split(':').map(Number);
      const eventTime = eventHour * 60 + eventMinute;
      
      // Event is overdue ONLY if:
      // 1. It's from today AND the current time is past the event time
      // 2. Past days and future days are NEVER overdue
      if (event.date === today) {
        // For today's events, check if current time is past the event time
        const isOverdue = eventTime < currentTime;
        if (isOverdue) {
          console.log(`Overdue: ${event.title} (${event.startTime}) - Current time: ${currentTimeString}`);
        }
        return isOverdue;
      } else {
        // Events from past days and future days are never overdue
        return false;
      }
    });
  };

  // Add real-time updates for overdue events
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute to refresh overdue status
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const todayEvents = getTodayEvents();
  const overdueEvents = getOverdueEvents();

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
            Please select a patient from the sidebar to view and manage their calendar.
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
              <CalendarIcon 
                className="h-8 w-8" 
                style={{ color: BRAND_COLORS.accent }}
              />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: BRAND_COLORS.accent }}
              >
                Daily Calendar
              </h1>
              <p 
                className="text-lg"
                style={{ color: BRAND_COLORS.accent }}
              >
                Manage {selectedPatient === '1' ? 'Sarah' : 
                selectedPatient === '2' ? 'Robert' : 'Margaret'}'s daily routines and activities
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
          <button
              onClick={resetToDefaultEvents}
              className="px-4 py-3 rounded-xl transition-colors flex items-center space-x-2 text-sm"
              style={{
                backgroundColor: BRAND_COLORS.accent,
                color: BRAND_COLORS.white
              }}
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Reset Events</span>
            </button>
            <button
              onClick={handleAddEventClick}
            className="px-6 py-3 rounded-xl transition-colors flex items-center space-x-2 text-lg"
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: BRAND_COLORS.white
            }}
          >
            <PlusIcon className="h-6 w-6" />
            <span>Add Event</span>
          </button>
          </div>
        </div>

        {/* Date Selector */}
        <div 
          className="rounded-xl p-6"
          style={{ 
            background: `linear-gradient(135deg, ${BRAND_COLORS.primaryLight} 0%, ${BRAND_COLORS.accentLight} 100%)`
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: BRAND_COLORS.accent }}
              >
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p style={{ color: BRAND_COLORS.accent }}>
                {todayEvents.length} events scheduled for today
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: BRAND_COLORS.white,
                  color: BRAND_COLORS.primary
                }}
              >
                Previous Day
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: BRAND_COLORS.primary,
                  color: BRAND_COLORS.white
                }}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: BRAND_COLORS.white,
                  color: BRAND_COLORS.primary
                }}
              >
                Next Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Events */}
      {overdueEvents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-red-900">
              Overdue Events
            </h2>
            </div>
            <div className="text-sm text-red-700 bg-red-100 px-3 py-1 rounded-full">
              Current Time: {currentTime.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          <div className="space-y-4">
            {overdueEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <p className="text-red-600 text-sm">Was scheduled for {event.startTime}</p>
                  </div>
                  <button
                    onClick={() => handleCompleteEvent(event.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Events */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Today's Schedule
        </h2>
        
        {todayEvents.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events scheduled</h3>
            <p className="text-gray-600">Add some events to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayEvents.map((event) => (
              <div
                key={event.id}
                className={`border rounded-xl p-6 transition-all ${
                  event.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        event.completed ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorities.find(p => p.value === event.priority)?.color
                      }`}>
                        {event.priority}
                      </span>
                    </div>
                    <p className={`mb-2 ${
                      event.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        eventTypes.find(t => t.value === event.type)?.color
                      }`}>
                        {eventTypes.find(t => t.value === event.type)?.label}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteEvent(event.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      event.completed
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Event Form */}
      {showNewEvent && (
        <div ref={formRef} className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Event for {selectedPatient === '1' ? 'Sarah' : 
            selectedPatient === '2' ? 'Robert' : 'Margaret'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Event Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setNewEvent(prev => ({ ...prev, type: type.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      newEvent.type === type.value
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
                Event Title
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                placeholder="e.g., Morning Medication"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                rows="3"
                placeholder="Describe the event..."
                required
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  End Time
                </label>
                <input
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Priority
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {priorities.map((priority) => (
                  <button
                    key={priority.value}
                    type="button"
                    onClick={() => setNewEvent(prev => ({ ...prev, priority: priority.value }))}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      newEvent.priority === priority.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priority.color}`}>
                      {priority.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowNewEvent(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Event</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar; 