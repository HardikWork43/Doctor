import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
};

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  treatment: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

type Document = {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  uploadDate: string;
  fileType: string;
  fileUrl: string;
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  date: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
};

// Mock data - in real application, this would come from an API
const mockPatients: Patient[] = [
  { id: 'P001', name: 'John Smith', email: 'john@example.com', phone: '555-1234', lastVisit: '2025-04-10' },
  { id: 'P002', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-5678', lastVisit: '2025-04-15' },
  { id: 'P003', name: 'Michael Brown', email: 'michael@example.com', phone: '555-9012', lastVisit: '2025-04-18' },
];

const mockAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'John Smith', date: '2025-04-25', time: '09:00', treatment: 'Cleaning', status: 'scheduled' },
  { id: 'A002', patientId: 'P002', patientName: 'Sarah Johnson', date: '2025-04-26', time: '10:30', treatment: 'Root Canal', status: 'scheduled' },
  { id: 'A003', patientId: 'P003', patientName: 'Michael Brown', date: '2025-04-24', time: '14:00', treatment: 'Consultation', status: 'completed' },
];

const mockDocuments: Document[] = [
  { id: 'D001', patientId: 'P001', patientName: 'John Smith', title: 'X-Ray Results', uploadDate: '2025-04-10', fileType: 'PDF', fileUrl: '/documents/x-ray-p001.pdf' },
  { id: 'D002', patientId: 'P002', patientName: 'Sarah Johnson', title: 'Treatment Plan', uploadDate: '2025-04-15', fileType: 'PDF', fileUrl: '/documents/treatment-p002.pdf' },
];

const mockInquiries: Inquiry[] = [
  { id: 'I001', name: 'Alex Wilson', email: 'alex@example.com', date: '2025-04-22', subject: 'Insurance Question', message: 'Do you accept XYZ insurance?', status: 'new' },
  { id: 'I002', name: 'Emma Davis', email: 'emma@example.com', date: '2025-04-21', subject: 'Pain After Procedure', message: 'I\'m experiencing some discomfort after my cleaning.', status: 'read' },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('patients');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries);

  // Check authentication status (in a real app, this would verify JWT or session)
  useEffect(() => {
    // Simulating auth check
    const checkAuth = async () => {
      // For demo purposes, we'll just set to true - in real app, verify token
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  const filteredPatients = patients.filter(patient => 
    patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.treatment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = documents.filter(document =>
    document.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    document.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    document.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(inquiry =>
    inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle status changes for appointments
  const updateAppointmentStatus = (id: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? {...appointment, status: newStatus} : appointment
    ));
  };

  // Function to handle status changes for inquiries
  const updateInquiryStatus = (id: string, newStatus: 'new' | 'read' | 'responded') => {
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === id ? {...inquiry, status: newStatus} : inquiry
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Dental Clinic Admin</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'patients' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('patients')}
              >
                Patients
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('appointments')}
              >
                Appointments
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('documents')}
              >
                Documents
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'inquiries' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('inquiries')}
              >
                Inquiries
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border rounded p-2 w-64"
                />
              </div>
            </div>

            {/* Patient Records */}
            {activeTab === 'patients' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                          <button className="text-green-600 hover:text-green-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Appointments */}
            {activeTab === 'appointments' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Treatment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.treatment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                            appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select 
                            className="border rounded p-1 text-sm"
                            value={appointment.status}
                            onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as 'scheduled' | 'completed' | 'cancelled')}
                          >
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Documents */}
            {activeTab === 'documents' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDocuments.map((document) => (
                      <tr key={document.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{document.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.uploadDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.fileType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-2">View</a>
                          <a href={document.fileUrl} download className="text-green-600 hover:text-green-900">Download</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inquiry.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inquiry.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${inquiry.status === 'new' ? 'bg-red-100 text-red-800' : 
                            inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'}`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => updateInquiryStatus(inquiry.id, 'read')}>View</button>
                          <button className="text-green-600 hover:text-green-900" onClick={() => updateInquiryStatus(inquiry.id, 'responded')}>Respond</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;