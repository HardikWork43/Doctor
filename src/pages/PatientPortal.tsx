import React, { useState } from 'react';
import { FaUserCircle, FaTooth, FaCalendarAlt, FaFileMedical, FaCreditCard, FaSignOutAlt, FaLock, FaEnvelope } from 'react-icons/fa';

type Appointment = {
  id: string;
  date: string;
  time: string;
  procedure: string;
  dentist: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

type MedicalRecord = {
  id: string;
  date: string;
  procedure: string;
  dentist: string;
  notes: string;
  attachments: string[];
};

type Prescription = {
  id: string;
  date: string;
  medication: string;
  dosage: string;
  refills: number;
  dentist: string;
};

type Bill = {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  procedure: string;
};

const PatientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'records' | 'prescriptions' | 'billing'>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showAppointmentForm, setShowAppointmentForm] = useState<boolean>(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    procedure: '',
    reason: ''
  });

  // Mock data
  const patientInfo = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    dob: '1985-06-15',
    insurance: 'Delta Dental PPO',
    memberId: 'DD123456789'
  };

  const appointments: Appointment[] = [
    {
      id: '1',
      date: '2023-06-15',
      time: '10:00 AM',
      procedure: 'Dental Cleaning',
      dentist: 'Dr. Emily Chen',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2023-07-20',
      time: '2:30 PM',
      procedure: 'Tooth Filling',
      dentist: 'Dr. Michael Rodriguez',
      status: 'pending'
    }
  ];

  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      date: '2023-05-10',
      procedure: 'Dental Checkup',
      dentist: 'Dr. Emily Chen',
      notes: 'No cavities detected. Recommended regular flossing.',
      attachments: ['xray-20230510.pdf']
    },
    {
      id: '2',
      date: '2023-01-15',
      procedure: 'Root Canal',
      dentist: 'Dr. Michael Rodriguez',
      notes: 'Completed root canal on tooth #19. Patient tolerated procedure well.',
      attachments: ['xray-20230115.pdf', 'treatment-plan-20230115.pdf']
    }
  ];

  const prescriptions: Prescription[] = [
    {
      id: '1',
      date: '2023-05-10',
      medication: 'Amoxicillin',
      dosage: '500mg 3 times daily',
      refills: 0,
      dentist: 'Dr. Emily Chen'
    },
    {
      id: '2',
      date: '2023-01-15',
      medication: 'Ibuprofen',
      dosage: '400mg every 6 hours as needed',
      refills: 2,
      dentist: 'Dr. Michael Rodriguez'
    }
  ];

  const bills: Bill[] = [
    {
      id: '1',
      date: '2023-05-15',
      amount: 150,
      status: 'paid',
      procedure: 'Dental Checkup'
    },
    {
      id: '2',
      date: '2023-01-20',
      amount: 1200,
      status: 'paid',
      procedure: 'Root Canal'
    },
    {
      id: '3',
      date: '2023-07-01',
      amount: 85,
      status: 'pending',
      procedure: 'Teeth Cleaning'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication logic would go here
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Appointment submission logic would go here
    setShowAppointmentForm(false);
    setNewAppointment({ date: '', time: '', procedure: '', reason: '' });
  };

  const cancelAppointment = (id: string) => {
    // Cancellation logic would go here
    alert(`Appointment ${id} cancellation requested`);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <FaTooth className="text-blue-600 text-5xl" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Patient Portal Login
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New patient?{' '}
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Register here
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h2 className="font-bold">{patientInfo.name}</h2>
                <p className="text-sm text-gray-500">Patient ID: DC{Math.floor(Math.random() * 1000000)}</p>
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
                onClick={() => setActiveTab('prescriptions')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${activeTab === 'prescriptions' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <FaFileMedical className="mr-3" />
                Prescriptions
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
                <h2 className="text-xl font-bold mb-6">Welcome back, {patientInfo.name.split(' ')[0]}!</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Upcoming Appointment</h3>
                    {appointments.length > 0 ? (
                      <div>
                        <p className="text-lg font-semibold">{appointments[0].procedure}</p>
                        <p className="text-gray-600">{appointments[0].date} at {appointments[0].time}</p>
                        <p className="text-gray-600">With {appointments[0].dentist}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          appointments[0].status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          appointments[0].status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointments[0].status}
                        </span>
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
                        <p className="text-gray-600">{bills[0].procedure}</p>
                        <p className="text-gray-600">Due: {bills[0].date}</p>
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
                      <p className="font-medium">{patientInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{patientInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{patientInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{patientInfo.dob}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Insurance Provider</p>
                      <p className="font-medium">{patientInfo.insurance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member ID</p>
                      <p className="font-medium">{patientInfo.memberId}</p>
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
                      Pay Bill
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            value={newAppointment.date}
                            onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                          <input
                            type="time"
                            value={newAppointment.time}
                            onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Procedure</label>
                        <select
                          value={newAppointment.procedure}
                          onChange={(e) => setNewAppointment({...newAppointment, procedure: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select a procedure</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Checkup">Checkup</option>
                          <option value="Filling">Filling</option>
                          <option value="Extraction">Extraction</option>
                          <option value="Whitening">Whitening</option>
                        </select>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dentist</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.procedure}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.dentist}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => cancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-900"
                              disabled={appointment.status === 'cancelled'}
                            >
                              Cancel
                            </button>
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
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{record.procedure}</h3>
                          <p className="text-sm text-gray-500">{record.date} • {record.dentist}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{record.notes}</p>
                      {record.attachments.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Attachments:</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.attachments.map((file, index) => (
                              <a 
                                key={index} 
                                href="#" 
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                              >
                                <FaFileMedical className="mr-1" />
                                {file}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Prescriptions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refills</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescribed By</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {prescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">{prescription.medication}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.dosage}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.refills}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{prescription.dentist}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bills.map((bill) => (
                        <tr key={bill.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{bill.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{bill.procedure}</td>
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