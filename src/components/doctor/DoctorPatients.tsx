import React from 'react';

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastVisit: string;
};

type DoctorPatientsProps = {
  patients: Patient[];
};

const DoctorPatients: React.FC<DoctorPatientsProps> = ({ patients }) => {
  return (
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
  );
};

export default DoctorPatients;