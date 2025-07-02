import React from 'react';
import { FaFileMedical } from 'react-icons/fa';

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

type PatientMedicalRecordsProps = {
  medicalRecords: MedicalRecord[];
};

const PatientMedicalRecords: React.FC<PatientMedicalRecordsProps> = ({ medicalRecords }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Medical Records</h2>
      <div className="space-y-4">
        {medicalRecords.length > 0 ? medicalRecords.map((record) => (
          <div key={record.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{record.procedure}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(record.visitDate).toLocaleDateString()} • 
                  Dr. {record.doctor.user.firstName} {record.doctor.user.lastName}
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                Completed
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Diagnosis</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{record.diagnosis}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Treatment</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{record.treatment}</p>
              </div>
            </div>
            
            {record.notes && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Doctor's Notes</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">{record.notes}</p>
              </div>
            )}
            
            {record.prescriptions && record.prescriptions.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Prescriptions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {record.prescriptions.map((prescription, index) => (
                    <div key={index} className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                      <p className="font-medium text-blue-900">{prescription.medication}</p>
                      <p className="text-sm text-blue-700 mt-1">
                        <span className="font-medium">Dosage:</span> {prescription.dosage}
                      </p>
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">Duration:</span> {prescription.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-12">
            <FaFileMedical className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Your medical records will appear here after your appointments. This includes 
              diagnoses, treatments, prescriptions, and doctor's notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;