import React from 'react';

type MedicalRecord = {
  id: string;
  patientName: string;
  date: string;
  procedure: string;
  diagnosis: string;
  treatment: string;
  notes: string;
};

type DoctorMedicalRecordsProps = {
  medicalRecords: MedicalRecord[];
};

const DoctorMedicalRecords: React.FC<DoctorMedicalRecordsProps> = ({ medicalRecords }) => {
  return (
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
  );
};

export default DoctorMedicalRecords;