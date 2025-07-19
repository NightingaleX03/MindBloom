import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CalendarIcon,
  BookOpenIcon,
  MicrophoneIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const Profile = ({ selectedPatient }) => {
  const [patientProfile, setPatientProfile] = useState({
    id: '',
    name: '',
    age: '',
    diagnosis: '',
    caregiver: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    medicalInfo: {
      conditions: [],
      medications: [],
      allergies: []
    },
    stats: {
      totalMemories: 0,
      totalInterviews: 0,
      totalJournalEntries: 0,
      lastActive: ''
    }
  });

  // Mock patient data
  const patientData = {
    "1": {
      id: "1",
      name: "Sarah Johnson",
      age: "78",
      diagnosis: "Early-stage Alzheimer's",
      caregiver: "Michael Johnson (Son)",
      emergencyContact: {
        name: "Michael Johnson",
        phone: "(555) 123-4567",
        relationship: "Son"
      },
      medicalInfo: {
        conditions: ["Alzheimer's Disease", "Hypertension", "Diabetes"],
        medications: ["Donepezil", "Metformin", "Lisinopril"],
        allergies: ["Penicillin", "Latex"]
      },
      stats: {
        totalMemories: 24,
        totalInterviews: 3,
        totalJournalEntries: 18,
        lastActive: "2024-01-15T10:30:00Z"
      }
    },
    "2": {
      id: "2", 
      name: "Robert Smith",
      age: "82",
      diagnosis: "Vascular Dementia",
      caregiver: "Jennifer Smith (Daughter)",
      emergencyContact: {
        name: "Jennifer Smith",
        phone: "(555) 234-5678",
        relationship: "Daughter"
      },
      medicalInfo: {
        conditions: ["Vascular Dementia", "Heart Disease", "Arthritis"],
        medications: ["Aspirin", "Warfarin", "Ibuprofen"],
        allergies: ["Sulfa Drugs"]
      },
      stats: {
        totalMemories: 31,
        totalInterviews: 5,
        totalJournalEntries: 25,
        lastActive: "2024-01-14T14:20:00Z"
      }
    },
    "3": {
      id: "3",
      name: "Margaret Davis", 
      age: "75",
      diagnosis: "Lewy Body Dementia",
      caregiver: "David Davis (Husband)",
      emergencyContact: {
        name: "David Davis",
        phone: "(555) 345-6789",
        relationship: "Husband"
      },
      medicalInfo: {
        conditions: ["Lewy Body Dementia", "Parkinson's Symptoms", "Depression"],
        medications: ["Rivastigmine", "Levodopa", "Sertraline"],
        allergies: ["Codeine"]
      },
      stats: {
        totalMemories: 19,
        totalInterviews: 2,
        totalJournalEntries: 12,
        lastActive: "2024-01-13T09:15:00Z"
      }
    }
  };

  useEffect(() => {
    if (selectedPatient && patientData[selectedPatient]) {
      setPatientProfile(patientData[selectedPatient]);
    }
  }, [selectedPatient]);

  const handleSave = () => {
    // Here you would save to backend
    alert('Patient profile saved successfully!');
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
            Please select a patient from the sidebar to view their profile information.
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
            <UserIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patientProfile.name}'s Profile
            </h1>
            <p className="text-lg text-gray-600">
              Patient information and medical details
            </p>
          </div>
        </div>

        {/* Patient Picture and Basic Info */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-12 w-12 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patientProfile.name}</h2>
            <p className="text-gray-600">Age: {patientProfile.age} years old</p>
            <p className="text-gray-600">Diagnosis: {patientProfile.diagnosis}</p>
            <p className="text-sm text-gray-500">Caregiver: {patientProfile.caregiver}</p>
          </div>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Activity Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Memories</p>
                <p className="text-2xl font-bold text-gray-900">{patientProfile.stats.totalMemories}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <MicrophoneIcon className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Voice Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{patientProfile.stats.totalInterviews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftIcon className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Journal Entries</p>
                <p className="text-2xl font-bold text-gray-900">{patientProfile.stats.totalJournalEntries}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Last Active</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(patientProfile.stats.lastActive).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Full Name
            </label>
            <input
              type="text"
              value={patientProfile.name}
              onChange={(e) => setPatientProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Age
            </label>
            <input
              type="number"
              value={patientProfile.age}
              onChange={(e) => setPatientProfile(prev => ({ ...prev, age: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Diagnosis
            </label>
            <input
              type="text"
              value={patientProfile.diagnosis}
              onChange={(e) => setPatientProfile(prev => ({ ...prev, diagnosis: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Primary Caregiver
            </label>
            <input
              type="text"
              value={patientProfile.caregiver}
              onChange={(e) => setPatientProfile(prev => ({ ...prev, caregiver: e.target.value }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <HeartIcon className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Emergency Contact
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Contact Name
            </label>
            <input
              type="text"
              value={patientProfile.emergencyContact.name}
              onChange={(e) => setPatientProfile(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, name: e.target.value }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              placeholder="e.g., John Smith"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              value={patientProfile.emergencyContact.phone}
              onChange={(e) => setPatientProfile(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              placeholder="e.g., (555) 123-4567"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Relationship
            </label>
            <input
              type="text"
              value={patientProfile.emergencyContact.relationship}
              onChange={(e) => setPatientProfile(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              placeholder="e.g., Son, Daughter, Spouse"
            />
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Medical Information
          </h2>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Medical Conditions
            </label>
            <textarea
              value={patientProfile.medicalInfo.conditions.join(', ')}
              onChange={(e) => setPatientProfile(prev => ({
                ...prev,
                medicalInfo: {
                  ...prev.medicalInfo,
                  conditions: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter conditions separated by commas"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Medications
            </label>
            <textarea
              value={patientProfile.medicalInfo.medications.join(', ')}
              onChange={(e) => setPatientProfile(prev => ({
                ...prev,
                medicalInfo: {
                  ...prev.medicalInfo,
                  medications: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter medications separated by commas"
            />
          </div>
          
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Allergies
            </label>
            <textarea
              value={patientProfile.medicalInfo.allergies.join(', ')}
              onChange={(e) => setPatientProfile(prev => ({
                ...prev,
                medicalInfo: {
                  ...prev.medicalInfo,
                  allergies: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                }
              }))}
              className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:border-purple-600 focus:outline-none"
              rows="3"
              placeholder="Enter allergies separated by commas"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Save Patient Information
            </h3>
            <p className="text-gray-600">
              Patient profile settings will be updated
            </p>
          </div>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors text-lg font-semibold flex items-center space-x-2"
          >
            <SparklesIcon className="h-5 w-5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 