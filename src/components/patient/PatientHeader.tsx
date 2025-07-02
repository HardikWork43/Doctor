import React from 'react';
import { FaTooth, FaSignOutAlt } from 'react-icons/fa';

type PatientHeaderProps = {
  onLogout: () => void;
};

const PatientHeader: React.FC<PatientHeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <FaTooth className="text-blue-600 text-3xl mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">DentalCare Patient Portal</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <FaSignOutAlt className="mr-2" />
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default PatientHeader;