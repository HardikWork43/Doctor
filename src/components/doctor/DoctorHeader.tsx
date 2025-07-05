import React from 'react';
import { FaUserMd, FaSignOutAlt } from 'react-icons/fa';
import NotificationBell from '../notifications/NotificationBell';

type DoctorHeaderProps = {
  doctorInfo: any;
  onLogout: () => void;
};

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ doctorInfo, onLogout }) => {
  return (
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
          <NotificationBell userRole="doctor" />
          <button
            onClick={onLogout}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <FaSignOutAlt className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader;