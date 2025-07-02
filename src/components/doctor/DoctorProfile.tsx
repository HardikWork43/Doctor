import React from 'react';

type DoctorProfileProps = {
  doctorInfo: any;
};

const DoctorProfile: React.FC<DoctorProfileProps> = ({ doctorInfo }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Profile Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={doctorInfo?.firstName || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={doctorInfo?.lastName || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={doctorInfo?.email || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={doctorInfo?.phone || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-4">Professional Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <input
                type="text"
                value={doctorInfo?.doctorProfile?.specialization || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">License Number</label>
              <input
                type="text"
                value={doctorInfo?.doctorProfile?.licenseNumber || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
              <input
                type="number"
                value={doctorInfo?.doctorProfile?.experience || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Consultation Fee</label>
              <input
                type="text"
                value={`$${doctorInfo?.doctorProfile?.consultationFee || '0'}`}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;