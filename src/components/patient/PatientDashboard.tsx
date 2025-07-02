import React from 'react';
import { FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

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

type Bill = {
  id: string;
  appointmentDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  service: string;
};

type PatientDashboardProps = {
  patientInfo: any;
  appointments: Appointment[];
  bills: Bill[];
  onTabChange: (tab: string) => void;
};

const PatientDashboard: React.FC<PatientDashboardProps> = ({ 
  patientInfo, 
  appointments, 
  bills, 
  onTabChange 
}) => {
  const upcomingAppointments = appointments.filter(
    apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled'
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Welcome back, {patientInfo?.firstName}!</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Upcoming Appointment</h3>
          {upcomingAppointments.length > 0 ? (
            <div>
              {(() => {
                const upcomingApt = upcomingAppointments[0];
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
            onClick={() => onTabChange('appointments')}
            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <FaCalendarAlt className="mr-2" />
            Schedule Appointment
          </button>
          <button 
            onClick={() => onTabChange('billing')}
            className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <FaCreditCard className="mr-2" />
            View Bills
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;