import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTooth, FaCalendarAlt, FaFileMedical, FaCreditCard, FaSignOutAlt, FaLock, FaEnvelope } from 'react-icons/fa';

type Appointment = {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  status: 'confirmed' | 'scheduled' | 'completed' | 'cancelled';
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  fee: number;
};

type MedicalRecord = {
  id: string;
  visitDate: string;
  procedure: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  prescriptions: any[];
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
};

type Bill = {
  id: string;
  appointmentDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  service: string;
};

const PatientPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'records' | 'prescriptions' | 'billing'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState<boolean>(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    service: '',
    reason: ''
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data.user.role === 'patient') {
            setPatientInfo(data.data.user);
            setIsAuthenticated(true);
            await loadPatientData();
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const loadPatientData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      // Load appointments
      const appointmentsResponse = await fetch('http://localhost:5000/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.data.appointments);
      }

      // Load doctors
      const doctorsResponse = await fetch('http://localhost:5000/api/doctors');
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData.data.doctors);
      }

      // Load services
      const servicesResponse = await fetch('http://localhost:5000/api/services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.data.services);
      }

      // Load medical records (if patient has access)
      try {
        const recordsResponse = await fetch(`http://localhost:5000/api/patients/${patientInfo?.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (recordsResponse.ok) {
          const recordsData = await recordsResponse.json();
          setMedicalRecords(recordsData.data.patient.medicalRecords || []);
        }
      } catch (error) {
        console.log('Medical records not available');
      }

    } catch (error) {
      console.error('Failed to load patient data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('patientAuthenticated');
    navigate('/login');
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAppointment)
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments([...appointments, data.data.appointment]);
        setShowAppointmentForm(false);
        setNewAppointment({ doctorId: '', appointmentDate: '', appointmentTime: '', service: '', reason: '' });
        alert('Appointment scheduled successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to schedule appointment');
      }
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      alert('Failed to schedule appointment');
    }
  };

  const cancelAppointment = async (id: string) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, status: 'cancelled' } : apt
        ));
        alert('Appointment cancelled successfully');
      }
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Calculate bills from appointments
  const bills: Bill[] = appointments.map(apt => ({
    id: apt.id,
    appointmentDate: apt.appointmentDate,
    amount: apt.fee || 0,
    status: apt.status === 'completed' ? 'paid' : 'pending',
    service: apt.service
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <FaTooth className="text-blue-600 text-3xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">DentalCare Patient Portal</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
            <div className="flex items-center mb-6">
              <FaUserCircle className="text-4xl text-gray-400 mr-3" />
              <div>
                <h2 className="font-bold">{patientInfo?.firstName} {patientInfo?.lastName}</h2>
                <p className="text-sm text-gray-500">Patient ID: {patientInfo?.id}</p>
              </div>
            </div>

            <nav>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaUserCircle className="mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${activeTab === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaCalendarAlt className="mr-3" />
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${activeTab === 'records' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaFileMedical className="mr-3" />
                Medical Records
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${activeTab === 'billing' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaCreditCard className="mr-3" />
                Billing
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Welcome back, {patientInfo?.firstName}!</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Upcoming Appointment</h3>
                    {appointments.filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled').length > 0 ? (
                      <div>
                        {(() => {
                          const upcomingApt = appointments.filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled')[0];
                          return (
                            <div>
                              <p className="text-lg font-semibold">{upcomingApt.service}</p>
                              <p className="text-gray-600">{upcomingApt.appointmentDate} at {upcomingApt.appointmentTime}</p>
                              <p className="text-gray-600">With Dr. {upcomingApt.doctor.user.firstName} {upcomingApt.doctor.user.lastName}</p>
                              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                upcomingApt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                upcomingApt.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {upcomingApt.status}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <p>No upcoming appointments</p>
                    )}
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Recent Bill</h3>
                    {bills.length > 0 ? (
                      <div>
                        <p className="text-lg font-semibold">${bills[0].amount.toFixed(2)}</p>
                        <p className="text-gray-600">{bills[0].service}</p>
                        <p className="text-gray-600">Date: {bills[0].appointmentDate}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          bills[0].status === 'paid' ? 'bg-green-100 text-green-800' :
                          bills[0].status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bills[0].status}
                        </span>
                      </div>
                    ) : (
                      <p>No recent bills</p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-bold mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{patientInfo?.firstName} {patientInfo?.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{patientInfo?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{patientInfo?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{patientInfo?.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Insurance Provider</p>
                      <p className="font-medium">{patientInfo?.insuranceProvider || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member ID</p>
                      <p className="font-medium">{patientInfo?.insuranceMemberId || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <FaCalendarAlt className="mr-2" />
                      Schedule Appointment
                    </button>
                    <button 
                      onClick={() => setActiveTab('billing')}
                      className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      <FaCreditCard className="mr-2" />
                      View Bills
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Appointments</h2>
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    + New Appointment
                  </button>
                </div>

                {showAppointmentForm && (
                  <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-4">Schedule New Appointment</h3>
                    <form onSubmit={handleAppointmentSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                          <select
                            value={newAppointment.doctorId}
                            onChange={(e) => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select a doctor</option>
                            {doctors.map((doctor) => (
                              <option key={doctor.id} value={doctor.id}>
                                Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                          <select
                            value={newAppointment.service}
                            onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select a service</option>
                            {services.map((service) => (
                              <option key={service.id} value={service.name}>
                                {service.name} - ${service.price}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={newAppointment.appointmentDate}
                            onChange={(e) => setNewAppointment({...newAppointment, appointmentDate: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <select
                            value={newAppointment.appointmentTime}
                            onChange={(e) => setNewAppointment({...newAppointment, appointmentTime: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select a time</option>
                            <option value="09:00">9:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="17:00">5:00 PM</option>
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
                        <textarea
                          value={newAppointment.reason}
                          onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAppointmentForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Schedule
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.service}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                              <button
                                onClick={() => cancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Medical Records</h2>
                <div className="space-y-4">
                  {medicalRecords.length > 0 ? medicalRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{record.procedure}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(record.visitDate).toLocaleDateString()} • 
                            Dr. {record.doctor.user.firstName} {record.doctor.user.lastName}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Diagnosis</h4>
                          <p className="text-gray-600">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700">Treatment</h4>
                          <p className="text-gray-600">{record.treatment}</p>
                        </div>
                      </div>
                      {record.notes && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700">Notes</h4>
                          <p className="text-gray-600">{record.notes}</p>
                        </div>
                      )}
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700">Prescriptions</h4>
                          <div className="space-y-2">
                            {record.prescriptions.map((prescription, index) => (
                              <div key={index} className="bg-gray-50 p-2 rounded">
                                <p className="font-medium">{prescription.medication}</p>
                                <p className="text-sm text-gray-600">{prescription.dosage}</p>
                                <p className="text-sm text-gray-600">Duration: {prescription.duration}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <FaFileMedical className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No medical records</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Your medical records will appear here after your appointments.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Billing</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bills.map((bill) => (
                        <tr key={bill.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{bill.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{bill.service}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${bill.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                              bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {bill.status === 'pending' && (
                              <button className="text-blue-600 hover:text-blue-900">
                                Pay Now
                              </button>
                            )}
                            {bill.status === 'paid' && (
                              <button className="text-gray-600 hover:text-gray-900">
                                View Receipt
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientPortal;