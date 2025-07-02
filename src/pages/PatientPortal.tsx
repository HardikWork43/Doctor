import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientHeader from '../components/patient/PatientHeader';
import PatientSidebar from '../components/patient/PatientSidebar';
import PatientDashboard from '../components/patient/PatientDashboard';
import PatientAppointments from '../components/patient/PatientAppointments';
import PatientMedicalRecords from '../components/patient/PatientMedicalRecords';
import PatientBilling from '../components/patient/PatientBilling';

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'records' | 'billing'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

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

  const handleScheduleAppointment = async (appointmentData: any) => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch('http://localhost:5000/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(appointmentData)
    });

    if (response.ok) {
      const data = await response.json();
      setAppointments([...appointments, data.data.appointment]);
      alert('Appointment scheduled successfully!');
    } else {
      const errorData = await response.json();
      alert(errorData.message || 'Failed to schedule appointment');
      throw new Error(errorData.message);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    const token = localStorage.getItem('authToken');
    
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
    } else {
      throw new Error('Failed to cancel appointment');
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <PatientDashboard 
            patientInfo={patientInfo}
            appointments={appointments}
            bills={bills}
            onTabChange={setActiveTab}
          />
        );
      case 'appointments':
        return (
          <PatientAppointments 
            appointments={appointments}
            doctors={doctors}
            services={services}
            onScheduleAppointment={handleScheduleAppointment}
            onCancelAppointment={handleCancelAppointment}
          />
        );
      case 'records':
        return <PatientMedicalRecords medicalRecords={medicalRecords} />;
      case 'billing':
        return <PatientBilling bills={bills} />;
      default:
        return (
          <PatientDashboard 
            patientInfo={patientInfo}
            appointments={appointments}
            bills={bills}
            onTabChange={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <PatientSidebar 
            patientInfo={patientInfo}
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

export default PatientPortal;