import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaUsers, FaCreditCard, FaFileMedical, FaUserCircle, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

type Appointment = {
  id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
};

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalVisits: number;
};

type MedicalRecord = {
  id: string;
  patientName: string;
  date: string;
  procedure: string;
  diagnosis: string;
  treatment: string;
  notes: string;
};

type DashboardStats = {
  todayAppointments: number;
  upcomingAppointments: number;
  totalPatients: number;
  unpaidBillings: number;
};

const DoctorPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients' | 'records' | 'profile'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    todayAppointments: 0,
    upcomingAppointments: 0,
    totalPatients: 0,
    unpaidBillings: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

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
          if (data.data.user.role === 'doctor') {
            setDoctorInfo(data.data.user);
            setIsAuthenticated(true);
            await loadDashboardData();
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

  const loadDashboardData = async () => {
    const token = localStorage.getItem('authToken');
    try {
      // Load appointments
      const appointmentsResponse = await fetch('http://localhost:5000/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData.data.appointments);
        
        // Calculate dashboard stats
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointmentsData.data.appointments.filter(
          (apt: any) => apt.appointmentDate === today
        ).length;
        
        const upcomingAppointments = appointmentsData.data.appointments.filter(
          (apt: any) => new Date(apt.appointmentDate) > new Date() && apt.status !== 'cancelled'
        ).length;

        setDashboardStats(prev => ({
          ...prev,
          todayAppointments,
          upcomingAppointments
        }));
      }

      // Load patients
      const patientsResponse = await fetch('http://localhost:5000/api/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData.data.patients);
        setDashboardStats(prev => ({
          ...prev,
          totalPatients: patientsData.data.patients.length
        }));
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('doctorAuthenticated');
    navigate('/login');
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setAppointments(appointments.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus as any } : apt
        ));
      }
    } catch (error) {
      console.error('Failed to update appointment status:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <FaUserMd className="text-blue-600 text-3xl mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </div>
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
                <h2 className="font-bold">Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}</h2>
                <p className="text-sm text-gray-500">{doctorInfo?.doctorProfile?.specialization}</p>
              </div>
            </div>

            <nav>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaChartLine className="mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  activeTab === 'appointments' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaCalendarAlt className="mr-3" />
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('patients')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  activeTab === 'patients' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaUsers className="mr-3" />
                Patients
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  activeTab === 'records' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaFileMedical className="mr-3" />
                Medical Records
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaUserCircle className="mr-3" />
                Profile
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-600 text-2xl mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Today's Appointments</p>
                        <p className="text-2xl font-bold text-blue-600">{dashboardStats.todayAppointments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-green-600 text-2xl mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Upcoming Appointments</p>
                        <p className="text-2xl font-bold text-green-600">{dashboardStats.upcomingAppointments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaUsers className="text-purple-600 text-2xl mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Total Patients</p>
                        <p className="text-2xl font-bold text-purple-600">{dashboardStats.totalPatients}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FaCreditCard className="text-orange-600 text-2xl mr-4" />
                      <div>
                        <p className="text-sm text-gray-600">Unpaid Billings</p>
                        <p className="text-2xl font-bold text-orange-600">{dashboardStats.unpaidBillings}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Appointments */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Today's Appointments</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appointments
                          .filter(apt => apt.date === new Date().toISOString().split('T')[0])
                          .slice(0, 5)
                          .map((appointment) => (
                          <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                                <div className="text-sm text-gray-500">{appointment.patient?.phone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.service}</td>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Appointments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                              <div className="text-sm text-gray-500">{appointment.patient?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.service}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <select
                              value={appointment.status}
                              onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value)}
                              className="border rounded p-1 text-sm"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'patients' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Patients</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.lastVisit || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-900 mr-2">View Records</button>
                            <button className="text-green-600 hover:text-green-900">Schedule</button>
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
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{record.patientName}</h3>
                          <p className="text-sm text-gray-500">{record.date} • {record.procedure}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Completed
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          value={doctorInfo?.firstName || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          value={doctorInfo?.lastName || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={doctorInfo?.email || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={doctorInfo?.phone || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Specialization</label>
                        <input
                          type="text"
                          value={doctorInfo?.doctorProfile?.specialization || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">License Number</label>
                        <input
                          type="text"
                          value={doctorInfo?.doctorProfile?.licenseNumber || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                        <input
                          type="number"
                          value={doctorInfo?.doctorProfile?.experience || ''}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
                        <input
                          type="text"
                          value={`$${doctorInfo?.doctorProfile?.consultationFee || '0'}`}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorPortal;