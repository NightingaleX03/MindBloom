import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HeartIcon,
  BeakerIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Calendar = () => {
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

  // Mock data
  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: "Morning Medication",
        description: "Take blood pressure medication",
        type: "medication",
        startTime: "09:00",
        endTime: "09:15",
        priority: "high",
        completed: false,
        date: "2024-01-15"
      },
      {
        id: 2,
        title: "Doctor Appointment",
        description: "Annual checkup with Dr. Smith",
        type: "appointment",
        startTime: "14:00",
        endTime: "15:00",
        priority: "high",
        completed: false,
        date: "2024-01-15"
      },
      {
        id: 3,
        title: "Afternoon Walk",
        description: "Gentle walk in the park",
        type: "activity",
        startTime: "16:00",
        endTime: "17:00",
        priority: "medium",
        completed: false,
        date: "2024-01-15"
      },
      {
        id: 4,
        title: "Evening Medication",
        description: "Take evening medication",
        type: "medication",
        startTime: "20:00",
        endTime: "20:15",
        priority: "high",
        completed: false,
        date: "2024-01-15"
      }
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const event = {
      id: Date.now(),
      ...newEvent,
      date: selectedDate.toISOString().split('T')[0],
      completed: false
    };
    setEvents([...events, event]);
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
  };

  const handleCompleteEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));
  };

  const getTodayEvents = () => {
    const today = selectedDate.toISOString().split('T')[0];
    return events.filter(event => event.date === today);
  };

  const getOverdueEvents = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return events.filter(event => {
      const eventTime = parseInt(event.startTime.split(':')[0]) * 60 + parseInt(event.startTime.split(':')[1]);
      return !event.completed && eventTime < currentTime;
    });
  };

  const todayEvents = getTodayEvents();
  const overdueEvents = getOverdueEvents();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Daily Calendar
              </h1>
              <p className="text-lg text-gray-600">
                Manage your daily routines and activities
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowNewEvent(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 text-lg"
          >
            <PlusIcon className="h-6 w-6" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h3>
              <p className="text-gray-600">
                {todayEvents.length} events scheduled for today
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Previous Day
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Next Day
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Events Alert */}
      {overdueEvents.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <h3 className="text-xl font-semibold text-red-900">
              Overdue Events
            </h3>
          </div>
          <div className="space-y-3">
            {overdueEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-red-100 rounded-lg">
                <div>
                  <h4 className="font-semibold text-red-900">{event.title}</h4>
                  <p className="text-red-700">{event.startTime}</p>
                </div>
                <button
                  onClick={() => handleCompleteEvent(event.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Mark Complete
                </button>
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
            <p className="text-lg text-gray-600">No events scheduled for today</p>
            <button
              onClick={() => setShowNewEvent(true)}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Your First Event
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {todayEvents
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((event) => (
                <div
                  key={event.id}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    event.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${
                        eventTypes.find(t => t.value === event.type)?.color || 'bg-gray-100'
                      }`}>
                        {React.createElement(eventTypes.find(t => t.value === event.type)?.icon || ClockIcon, {
                          className: "h-6 w-6"
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-xl font-semibold ${
                            event.completed ? 'text-green-800 line-through' : 'text-gray-900'
                          }`}>
                            {event.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            priorities.find(p => p.value === event.priority)?.color || 'bg-gray-100'
                          }`}>
                            {event.priority}
                          </span>
                        </div>
                        <p className={`text-lg ${
                          event.completed ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {event.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCompleteEvent(event.id)}
                      className={`p-3 rounded-lg transition-colors ${
                        event.completed
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                      }`}
                    >
                      <CheckCircleIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* New Event Form */}
      {showNewEvent && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Event
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Type */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Event Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                placeholder="Add details about this event..."
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
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Priority
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors text-lg font-semibold"
              >
                Add Event
              </button>
              <button
                type="button"
                onClick={() => setShowNewEvent(false)}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Calendar; 