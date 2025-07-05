import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorHeader from '../components/doctor/DoctorHeader';
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import DoctorAppointments from '../components/doctor/DoctorAppointments';
import DoctorPatients from '../components/doctor/DoctorPatients';
import DoctorMedicalRecords from '../components/doctor/DoctorMedicalRecords';
import DoctorProfile from '../components/doctor/DoctorProfile';
import DoctorAvailabilityManager from '../components/doctor/DoctorAvailabilityManager';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients' | 'records' | 'availability' | 'profile'>('dashboard');
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DoctorDashboard dashboardStats={dashboardStats} appointments={appointments} />;
      case 'appointments':
        return <DoctorAppointments appointments={appointments} onUpdateStatus={updateAppointmentStatus} />;
      case 'patients':
        return <DoctorPatients patients={patients} />;
      case 'records':
        return <DoctorMedicalRecords medicalRecords={medicalRecords} />;
      case 'availability':
        return <DoctorAvailabilityManager />;
      case 'profile':
        return <DoctorProfile doctorInfo={doctorInfo} />;
      default:
        return <DoctorDashboard dashboardStats={dashboardStats} appointments={appointments} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader doctorInfo={doctorInfo} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <DoctorSidebar 
            doctorInfo={doctorInfo} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            {renderActiveTab()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorPortal;