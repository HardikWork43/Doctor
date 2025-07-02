import React from 'react';
import { FaCalendarAlt, FaUsers, FaCreditCard } from 'react-icons/fa';

type DashboardStats = {
  todayAppointments: number;
  upcomingAppointments: number;
  totalPatients: number;
  unpaidBillings: number;
};

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

type DoctorDashboardProps = {
  dashboardStats: DashboardStats;
  appointments: Appointment[];
};

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ dashboardStats, appointments }) => {
  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);

  return (
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

      {/* Today's Appointments */}
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
              {todayAppointments.slice(0, 5).map((appointment) => (
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
  );
};

export default DoctorDashboard;