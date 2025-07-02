import React from 'react';
import { FaUserCircle, FaChartLine, FaCalendarAlt, FaUsers, FaFileMedical } from 'react-icons/fa';

type DoctorSidebarProps = {
  doctorInfo: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ doctorInfo, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
    { id: 'patients', label: 'Patients', icon: FaUsers },
    { id: 'records', label: 'Medical Records', icon: FaFileMedical },
    { id: 'profile', label: 'Profile', icon: FaUserCircle },
  ];

  return (
    <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center mb-6">
        <FaUserCircle className="text-4xl text-gray-400 mr-3" />
        <div>
          <h2 className="font-bold">Dr. {doctorInfo?.firstName} {doctorInfo?.lastName}</h2>
          <p className="text-sm text-gray-500">{doctorInfo?.doctorProfile?.specialization}</p>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 ${
                activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <IconComponent className="mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DoctorSidebar;