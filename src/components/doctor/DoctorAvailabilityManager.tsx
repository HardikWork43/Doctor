import React, { useState, useEffect } from 'react';
import { Calendar, X, AlertTriangle, Clock } from 'lucide-react';

type AvailabilityRecord = {
  id: string;
  date: string;
  isAvailable: boolean;
  reason: string;
  emergencyOnly: boolean;
};

const DoctorAvailabilityManager: React.FC = () => {
  const [availabilityRecords, setAvailabilityRecords] = useState<AvailabilityRecord[]>([]);
  const [showUnavailableForm, setShowUnavailableForm] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const doctorId = userData.data.user.doctorProfile?.id;
        
        if (doctorId) {
          const startDate = new Date().toISOString().split('T')[0];
          const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
          
          const response = await fetch(`http://localhost:5000/api/doctor-availability/${doctorId}?startDate=${startDate}&endDate=${endDate}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            setAvailabilityRecords(data.data.availability);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load availability:', error);
    }
  };

  const handleSetUnavailable = async () => {
    if (selectedDates.length === 0 || !reason.trim()) {
      alert('Please select dates and provide a reason');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/doctor-availability/unavailable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          dates: selectedDates,
          reason,
          emergencyOnly
        })
      });

      if (response.ok) {
        alert('Availability updated successfully');
        setShowUnavailableForm(false);
        setSelectedDates([]);
        setReason('');
        setEmergencyOnly(false);
        loadAvailability();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Failed to set unavailable:', error);
      alert('Failed to update availability');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUnavailability = async (recordId: string) => {
    if (!confirm('Are you sure you want to make yourself available again for this date?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/doctor-availability/unavailable/${recordId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Availability restored');
        loadAvailability();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to restore availability');
      }
    } catch (error) {
      console.error('Failed to restore availability:', error);
      alert('Failed to restore availability');
    }
  };

  const addDateToSelection = () => {
    const dateInput = document.getElementById('dateInput') as HTMLInputElement;
    const date = dateInput.value;
    
    if (date && !selectedDates.includes(date)) {
      setSelectedDates([...selectedDates, date]);
      dateInput.value = '';
    }
  };

  const removeDateFromSelection = (date: string) => {
    setSelectedDates(selectedDates.filter(d => d !== date));
  };

  const unavailableRecords = availabilityRecords.filter(record => !record.isAvailable);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Availability</h2>
        <button
          onClick={() => setShowUnavailableForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <AlertTriangle size={16} />
          Set Unavailable
        </button>
      </div>

      {/* Current Unavailable Dates */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Current Unavailable Dates</h3>
        {unavailableRecords.length === 0 ? (
          <p className="text-gray-500">No unavailable dates set</p>
        ) : (
          <div className="space-y-3">
            {unavailableRecords.map((record) => (
              <div key={record.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-red-600" />
                      <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                      {record.emergencyOnly && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Emergency Only
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Reason:</strong> {record.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveUnavailability(record.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Set Unavailable Form */}
      {showUnavailableForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Set Unavailable Dates</h3>
              <button
                onClick={() => setShowUnavailableForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Dates
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="date"
                    id="dateInput"
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={addDateToSelection}
                    className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {selectedDates.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Selected dates:</p>
                    {selectedDates.map((date) => (
                      <div key={date} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                        <button
                          onClick={() => removeDateFromSelection(date)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Unavailability
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="e.g., Medical conference, Personal emergency, etc."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emergencyOnly"
                  checked={emergencyOnly}
                  onChange={(e) => setEmergencyOnly(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="emergencyOnly" className="text-sm text-gray-700">
                  Available for emergencies only
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowUnavailableForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetUnavailable}
                  disabled={loading || selectedDates.length === 0 || !reason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Setting...' : 'Set Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailabilityManager;