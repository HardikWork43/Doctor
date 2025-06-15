import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Type definitions
type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  balance: number;
};

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  treatment: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
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

type Prescription = {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
  createdBy: string;
  status: 'active' | 'completed' | 'cancelled';
};

type PaymentType = 'cash' | 'credit_card' | 'debit_card' | 'online' | 'insurance' | 'other';

type Payment = {
  id: string;
  date: string;
  amount: number;
  type: PaymentType;
  reference: string;
  notes: string;
};

type BillingItem = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  service: string;
  amount: number;
  status: 'unpaid' | 'paid' | 'partially_paid';
  paidAmount: number;
  payments: Payment[];
};

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string;
};

// Mock data
const mockPatients: Patient[] = [
  { id: 'P001', name: 'John Smith', email: 'john@example.com', phone: '555-1234', lastVisit: '2025-04-10', balance: 150.00 },
  { id: 'P002', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-5678', lastVisit: '2025-04-15', balance: 75.50 },
  { id: 'P003', name: 'Michael Brown', email: 'michael@example.com', phone: '555-9012', lastVisit: '2025-04-18', balance: 0 },
];

const mockAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'John Smith', date: '2025-04-25', time: '09:00', treatment: 'Cleaning', status: 'scheduled', notes: '' },
  { id: 'A002', patientId: 'P002', patientName: 'Sarah Johnson', date: '2025-04-26', time: '10:30', treatment: 'Root Canal', status: 'scheduled', notes: 'Patient reported sensitivity to cold' },
  { id: 'A003', patientId: 'P003', patientName: 'Michael Brown', date: '2025-04-24', time: '14:00', treatment: 'Consultation', status: 'completed', notes: 'Discussed treatment options for wisdom teeth' },
];

const mockDocuments: Document[] = [
  { id: 'D001', patientId: 'P001', patientName: 'John Smith', title: 'X-Ray Results', uploadDate: '2025-04-10', fileType: 'PDF', fileUrl: '/documents/x-ray-p001.pdf' },
  { id: 'D002', patientId: 'P002', patientName: 'Sarah Johnson', title: 'Treatment Plan', uploadDate: '2025-04-15', fileType: 'PDF', fileUrl: '/documents/treatment-p002.pdf' },
];

const mockPrescriptions: Prescription[] = [
  { id: 'PR001', patientId: 'P001', patientName: 'John Smith', medication: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', startDate: '2025-04-10', endDate: '2025-04-17', notes: 'Take with food', createdBy: 'Dr. Smith', status: 'active' },
  { id: 'PR002', patientId: 'P002', patientName: 'Sarah Johnson', medication: 'Ibuprofen', dosage: '400mg', frequency: 'Every 6 hours as needed', startDate: '2025-04-15', endDate: '2025-04-22', notes: 'For pain relief', createdBy: 'Dr. Smith', status: 'active' },
];

const mockBilling: BillingItem[] = [
  { 
    id: 'B001', 
    patientId: 'P001', 
    patientName: 'John Smith', 
    date: '2025-04-10', 
    service: 'Dental Examination', 
    amount: 75.00, 
    status: 'paid', 
    paidAmount: 75.00,
    payments: [
      { id: 'P001', date: '2025-04-10', amount: 75.00, type: 'credit_card', reference: 'TRX-12345', notes: 'Paid at reception' }
    ] 
  },
  { 
    id: 'B002', 
    patientId: 'P001', 
    patientName: 'John Smith', 
    date: '2025-04-10', 
    service: 'X-Ray', 
    amount: 150.00, 
    status: 'unpaid', 
    paidAmount: 0,
    payments: []
  },
  { 
    id: 'B003', 
    patientId: 'P002', 
    patientName: 'Sarah Johnson', 
    date: '2025-04-15', 
    service: 'Root Canal Consultation', 
    amount: 75.50, 
    status: 'paid', 
    paidAmount: 75.50,
    payments: [
      { id: 'P002', date: '2025-04-15', amount: 75.50, type: 'online', reference: 'PAY-67890', notes: 'Online payment' }
    ]
  },
];

const mockDoctorInfo: Doctor = {
  id: 'D001',
  name: 'Dr. Smith',
  specialization: 'Dentist',
  email: 'drsmith@example.com',
  phone: '555-0000',
  bio: 'Dr. Smith is a highly qualified dentist with over 10 years of experience specializing in restorative dentistry and oral surgery.',
  profileImage: '/images/dr-smith.jpg'
};

const DoctorPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('appointments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [billing, setBilling] = useState<BillingItem[]>(mockBilling);
  const [doctorInfo, setDoctorInfo] = useState<Doctor>(mockDoctorInfo);
  
  // Modal states
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);
  const [showBillingModal, setShowBillingModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showEditBillingModal, setShowEditBillingModal] = useState<boolean>(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState<boolean>(false);
  
  // Form states
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentBill, setCurrentBill] = useState<BillingItem | null>(null);
  const [newNotes, setNewNotes] = useState<string>('');
  const [newPrescription, setNewPrescription] = useState<Partial<Prescription>>({
    medication: '',
    dosage: '',
    frequency: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: '',
    status: 'active'
  });
  const [newBilling, setNewBilling] = useState<Partial<BillingItem>>({
    service: '',
    amount: 0,
    status: 'unpaid',
    paidAmount: 0,
    date: new Date().toISOString().split('T')[0],
    payments: []
  });
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    amount: 0,
    type: 'cash',
    reference: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Check authentication
  useEffect(() => {
    const doctorAuthenticated = localStorage.getItem('doctorAuthenticated');
    
    if (doctorAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('doctorAuthenticated');
    navigate('/login');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // Filtered data based on search query
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

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBilling = billing.filter(bill =>
    bill.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dashboard data
  const todayDate = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(appointment => appointment.date === todayDate);
  const upcomingAppointments = appointments.filter(appointment => appointment.date > todayDate);
  const unpaidBillings = billing.filter(bill => bill.status !== 'paid');
  const totalUnpaidAmount = unpaidBillings.reduce((total, bill) => total + (bill.amount - bill.paidAmount), 0);

  // Function to handle status changes for appointments
  const updateAppointmentStatus = (id: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? {...appointment, status: newStatus} : appointment
    ));
  };

  // Function to open notes modal for an appointment
  const openNotesModal = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setNewNotes(appointment.notes);
    setShowNotesModal(true);
  };

  // Function to save notes for an appointment
  const saveNotes = () => {
    if (currentAppointment) {
      setAppointments(appointments.map(appointment => 
        appointment.id === currentAppointment.id ? {...appointment, notes: newNotes} : appointment
      ));
      setShowNotesModal(false);
    }
  };

  // Function to open prescription modal for a patient
  const openPrescriptionModal = (patient: Patient) => {
    setCurrentPatient(patient);
    setNewPrescription({
      medication: '',
      dosage: '',
      frequency: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: '',
      status: 'active'
    });
    setShowPrescriptionModal(true);
  };

  // Function to save a new prescription
  const savePrescription = () => {
    if (currentPatient && newPrescription.medication && newPrescription.dosage) {
      const prescription: Prescription = {
        id: `PR${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        medication: newPrescription.medication || '',
        dosage: newPrescription.dosage || '',
        frequency: newPrescription.frequency || '',
        startDate: newPrescription.startDate || new Date().toISOString().split('T')[0],
        endDate: newPrescription.endDate || '',
        notes: newPrescription.notes || '',
        createdBy: doctorInfo.name,
        status: newPrescription.status as 'active' | 'completed' | 'cancelled' || 'active'
      };
      
      setPrescriptions([...prescriptions, prescription]);
      setShowPrescriptionModal(false);
    }
  };

  // Function to open billing modal for a patient
  const openBillingModal = (patient: Patient) => {
    setCurrentPatient(patient);
    setNewBilling({
      service: '',
      amount: 0,
      status: 'unpaid',
      paidAmount: 0,
      date: new Date().toISOString().split('T')[0],
      payments: []
    });
    setShowBillingModal(true);
  };

  // Function to save a new billing item
  const saveBilling = () => {
    if (currentPatient && newBilling.service && newBilling.amount) {
      const billingItem: BillingItem = {
        id: `B${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        date: newBilling.date || new Date().toISOString().split('T')[0],
        service: newBilling.service || '',
        amount: newBilling.amount || 0,
        status: newBilling.status as 'unpaid' | 'paid' | 'partially_paid' || 'unpaid',
        paidAmount: newBilling.paidAmount || 0,
        payments: newBilling.payments || []
      };
      
      setBilling([...billing, billingItem]);
      
      // Update patient balance
      setPatients(patients.map(patient => 
        patient.id === currentPatient.id ? 
          {...patient, balance: patient.balance + (billingItem.amount - billingItem.paidAmount)} : 
          patient
      ));
      
      setShowBillingModal(false);
    }
  };

  // Function to open payment modal for a bill
  const openPaymentModal = (bill: BillingItem) => {
    setCurrentBill(bill);
    setNewPayment({
      amount: bill.amount - bill.paidAmount,
      type: 'cash',
      reference: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(true);
  };

  // Function to open edit billing modal
  const openEditBillingModal = (bill: BillingItem) => {
    setCurrentBill(bill);
    setNewBilling({
      service: bill.service,
      amount: bill.amount,
      status: bill.status,
      paidAmount: bill.paidAmount,
      date: bill.date,
      payments: bill.payments
    });
    setShowEditBillingModal(true);
  };

  // Function to save updated billing item
  const saveUpdatedBilling = () => {
    if (currentBill && newBilling.service && newBilling.amount) {
      const updatedBilling = billing.map(bill => {
        if (bill.id === currentBill.id) {
          // Calculate the difference in amount to update patient balance
          const amountDifference = (newBilling.amount || 0) - bill.amount;
          
          return {
            ...bill,
            service: newBilling.service || '',
            amount: newBilling.amount || 0,
            status: newBilling.status as 'unpaid' | 'paid' | 'partially_paid' || 'unpaid',
            paidAmount: newBilling.paidAmount || 0,
            date: newBilling.date || bill.date,
            payments: newBilling.payments || bill.payments
          };
        }
        return bill;
      });
      
      setBilling(updatedBilling);
      
      // Update patient balance if amount changed
      if (currentBill) {
        const amountDifference = (newBilling.amount || 0) - currentBill.amount;
        if (amountDifference !== 0) {
          setPatients(patients.map(patient => 
            patient.id === currentBill.patientId ? 
              {...patient, balance: patient.balance + amountDifference} : 
              patient
          ));
        }
      }
      
      setShowEditBillingModal(false);
    }
  };

  // Function to save a new payment
  const savePayment = () => {
    if (currentBill && newPayment.amount && newPayment.amount > 0) {
      const payment: Payment = {
        id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        amount: newPayment.amount || 0,
        type: newPayment.type as PaymentType || 'cash',
        reference: newPayment.reference || '',
        notes: newPayment.notes || '',
        date: newPayment.date || new Date().toISOString().split('T')[0]
      };
      
      const updatedBilling = billing.map(bill => {
        if (bill.id === currentBill.id) {
          const newPaidAmount = bill.paidAmount + payment.amount;
          const newStatus = newPaidAmount >= bill.amount ? 'paid' : newPaidAmount > 0 ? 'partially_paid' : 'unpaid';
          
          return {
            ...bill,
            paidAmount: newPaidAmount,
            status: newStatus,
            payments: [...bill.payments, payment]
          };
        }
        return bill;
      });
      
      setBilling(updatedBilling);
      
      // Update patient balance
      setPatients(patients.map(patient => 
        patient.id === currentBill.patientId ? 
          {...patient, balance: patient.balance - payment.amount} : 
          patient
      ));
      
      setShowPaymentModal(false);
    }
  };

  // Function to open payment history modal
  const openPaymentHistoryModal = (bill: BillingItem) => {
    setCurrentBill(bill);
    setShowPaymentHistoryModal(true);
  };

  // Function to open doctor profile modal
  const openProfileModal = () => {
    setShowProfileModal(true);
  };

  // Function to save doctor profile changes
  const saveDoctorProfile = (updatedProfile: Doctor) => {
    setDoctorInfo(updatedProfile);
    setShowProfileModal(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Doctor Portal</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                className="mr-4 text-gray-700 hover:text-blue-600"
                onClick={openProfileModal}
              >
                <span className="mr-2">{doctorInfo.name}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Profile</span>
              </button>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard Overview */}
        <div className="px-4 py-6 sm:px-0 mb-6">
          <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-500">Today's Appointments</h3>
              <p className="text-2xl font-bold">{todaysAppointments.length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-500">Upcoming Appointments</h3>
              <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-500">Total Patients</h3>
              <p className="text-2xl font-bold">{patients.length}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-500">Unpaid Billings</h3>
              <p className="text-2xl font-bold">${totalUnpaidAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'appointments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('appointments')}
              >
                Appointments
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'patients' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('patients')}
              >
                Patients
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'prescriptions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('prescriptions')}
              >
                Prescriptions
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'billing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('billing')}
              >
                Billing
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('documents')}
              >
                Documents
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${activeTab === 'profile' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleTabChange('profile')}
              >
                My Profile
              </button>
            </div>
          </div>

          {/* Search and Content Area */}
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

            {/* Appointments Tab */}
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
                          <div className="flex items-center">
                            <select 
                              className="border rounded p-1 text-sm mr-2"
                              value={appointment.status}
                              onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as 'scheduled' | 'completed' | 'cancelled')}
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button 
                              className="text-blue-600 hover:text-blue-900 text-sm"
                              onClick={() => openNotesModal(appointment)}
                            >
                              {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Patients Tab */}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${patient.balance.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button 
                              className="text-blue-600 hover:text-blue-900 text-sm"
                              onClick={() => openPrescriptionModal(patient)}
                            >
                              Add Prescription
                            </button>
                            <button 
                              className="text-green-600 hover:text-green-900 text-sm"
                              onClick={() => openBillingModal(patient)}
                            >
                              Add Billing
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPrescriptions.map((prescription) => (
                      <tr key={prescription.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prescription.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.medication}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.medication}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.dosage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.startDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prescription.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 
                            prescription.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {prescription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select 
                            className="border rounded p-1 text-sm"
                            value={prescription.status}
                            onChange={(e) => {
                              setPrescriptions(prescriptions.map(p => 
                                p.id === prescription.id ? 
                                {...p, status: e.target.value as 'active' | 'completed' | 'cancelled'} : p
                              ));
                            }}
                          >
                            <option value="active">Active</option>
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

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBilling.map((bill) => (
                      <tr key={bill.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bill.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.patientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${bill.paidAmount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(bill.amount - bill.paidAmount).toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${bill.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            bill.status === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                            {bill.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-1">
                            {bill.status !== 'paid' && (
                              <button 
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                                onClick={() => openPaymentModal(bill)}
                              >
                                Record Payment
                              </button>
                            )}
                            <button 
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                              onClick={() => openEditBillingModal(bill)}
                            >
                              Edit
                            </button>
                            <button 
                              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                              onClick={() => openPaymentHistoryModal(bill)}
                            >
                              Payment History
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Documents Tab */}
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
                          <div className="flex space-x-2">
                            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">View</a>
                            <a href={document.fileUrl} download className="text-green-600 hover:text-green-900">Download</a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Upload document button */}
                <div className="p-4 border-t">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => alert("Document upload functionality would be integrated here")}
                  >
                    Upload New Document
                  </button>
                </div>
              </div>
            )}

            {/* Doctor Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Doctor Profile</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Your personal and professional information.</p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Full name</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorInfo.name}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Specialization</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorInfo.specialization}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Email address</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorInfo.email}</dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorInfo.phone}</dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Bio</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctorInfo.bio}</dd>
                    </div>
                  </dl>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                    onClick={openProfileModal}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && currentAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-md mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Appointment Notes</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-2">
                  Patient: {currentAppointment.patientName} - {currentAppointment.date} at {currentAppointment.time}
                </p>
                <textarea
                  className="w-full border rounded p-2 h-32"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Enter appointment notes here..."
                ></textarea>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  onClick={saveNotes}
                >
                  Save Notes
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowNotesModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && currentPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-lg mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Add Prescription</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Patient: {currentPatient.name} (ID: {currentPatient.id})
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({...newPrescription, medication: e.target.value})}
                      placeholder="Medication name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({...newPrescription, dosage: e.target.value})}
                      placeholder="e.g. 500mg"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({...newPrescription, frequency: e.target.value})}
                      placeholder="e.g. Twice daily"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full border rounded p-2"
                      value={newPrescription.status}
                      onChange={(e) => setNewPrescription({...newPrescription, status: e.target.value as 'active' | 'completed' | 'cancelled'})}
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={newPrescription.startDate}
                      onChange={(e) => setNewPrescription({...newPrescription, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={newPrescription.endDate}
                      onChange={(e) => setNewPrescription({...newPrescription, endDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    className="w-full border rounded p-2 h-20"
                    value={newPrescription.notes}
                    onChange={(e) => setNewPrescription({...newPrescription, notes: e.target.value})}
                    placeholder="Additional instructions or notes"
                  ></textarea>
                </div>
              </div>
              <div className="items-center px-4 py-3 flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  onClick={savePrescription}
                >
                  Save Prescription
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowPrescriptionModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing Modal */}
      {showBillingModal && currentPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-md mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Add Billing Item</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Patient: {currentPatient.name} (ID: {currentPatient.id})
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={newBilling.service}
                    onChange={(e) => setNewBilling({...newBilling, service: e.target.value})}
                    placeholder="Service description"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full border rounded p-2"
                      value={newBilling.amount || ''}
                      onChange={(e) => setNewBilling({...newBilling, amount: parseFloat(e.target.value)})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={newBilling.date}
                      onChange={(e) => setNewBilling({...newBilling, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="items-center px-4 py-3 flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  onClick={saveBilling}
                >
                  Save Billing
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowBillingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Billing Modal */}
      {showEditBillingModal && currentBill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-md mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Edit Billing Item</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Patient: {currentBill.patientName} (ID: {currentBill.patientId})
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={newBilling.service}
                    onChange={(e) => setNewBilling({...newBilling, service: e.target.value})}
                    placeholder="Service description"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full border rounded p-2"
                      value={newBilling.amount || ''}
                      onChange={(e) => setNewBilling({...newBilling, amount: parseFloat(e.target.value)})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={newBilling.date}
                      onChange={(e) => setNewBilling({...newBilling, date: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="items-center px-4 py-3 flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  onClick={saveUpdatedBilling}
                >
                  Save Changes
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowEditBillingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && currentBill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-md mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Record Payment</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Patient: {currentBill.patientName} (ID: {currentBill.patientId})
                </p>
                <p className="text-sm font-medium mb-2">
                  Service: {currentBill.service} (Bill ID: {currentBill.id})
                </p>
                <p className="text-sm mb-4">
                  Total Amount: ${currentBill.amount.toFixed(2)} | 
                  Paid: ${currentBill.paidAmount.toFixed(2)} | 
                  Balance: ${(currentBill.amount - currentBill.paidAmount).toFixed(2)}
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={currentBill.amount - currentBill.paidAmount}
                    className="w-full border rounded p-2"
                    value={newPayment.amount || ''}
                    onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <select
                    className="w-full border rounded p-2"
                    value={newPayment.type}
                    onChange={(e) => setNewPayment({...newPayment, type: e.target.value as PaymentType})}
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="online">Online Payment</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference/Transaction ID</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={newPayment.reference}
                    onChange={(e) => setNewPayment({...newPayment, reference: e.target.value})}
                    placeholder="Optional reference number"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    className="w-full border rounded p-2"
                    value={newPayment.date}
                    onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    className="w-full border rounded p-2 h-20"
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    placeholder="Any additional notes about this payment"
                  ></textarea>
                </div>
              </div>
              <div className="items-center px-4 py-3 flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  onClick={savePayment}
                >
                  Record Payment
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistoryModal && currentBill && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-2xl mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Payment History</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Patient: {currentBill.patientName} (ID: {currentBill.patientId})
                </p>
                <p className="text-sm font-medium mb-2">
                  Service: {currentBill.service} (Bill ID: {currentBill.id})
                </p>
                <p className="text-sm mb-4">
                  Total Amount: ${currentBill.amount.toFixed(2)} | 
                  Paid: ${currentBill.paidAmount.toFixed(2)} | 
                  Balance: ${(currentBill.amount - currentBill.paidAmount).toFixed(2)}
                </p>
                
                {currentBill.payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentBill.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${payment.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{payment.type.replace('_', ' ')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.reference}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No payment history found for this bill.</p>
                )}
              </div>
              <div className="items-center px-4 py-3 flex justify-center">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowPaymentHistoryModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative p-5 border w-full max-w-lg mx-auto rounded-md shadow-lg bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Edit Doctor Profile</h3>
              <div className="mt-2 px-7 py-3">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={doctorInfo.name}
                    onChange={(e) => setDoctorInfo({...doctorInfo, name: e.target.value})}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    value={doctorInfo.specialization}
                    onChange={(e) => setDoctorInfo({...doctorInfo, specialization: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded p-2"
                      value={doctorInfo.email}
                      onChange={(e) => setDoctorInfo({...doctorInfo, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={doctorInfo.phone}
                      onChange={(e) => setDoctorInfo({...doctorInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    className="w-full border rounded p-2 h-32"
                    value={doctorInfo.bio}
                    onChange={(e) => setDoctorInfo({...doctorInfo, bio: e.target.value})}
                  ></textarea>
                </div>
              </div>
              <div className="items-center px-4 py-3 flex justify-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
                  onClick={() => saveDoctorProfile(doctorInfo)}
                >
                  Save Profile
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => setShowProfileModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPortal;