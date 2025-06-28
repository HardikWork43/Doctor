import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

type AppointmentForm = {
  name: string;
  email: string;
  phone: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  reason: string;
};

const AppointmentPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentForm>();

  useEffect(() => {
    loadDoctorsAndServices();
  }, []);

  const loadDoctorsAndServices = async () => {
    try {
      // Load doctors
      const doctorsResponse = await fetch('http://localhost:5000/api/doctors');
      if (doctorsResponse.ok) {
        const doctorsData = await doctorsResponse.json();
        setDoctors(doctorsData.data.doctors);
      }

      // Load services
      const servicesResponse = await fetch('http://localhost:5000/api/services');
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.data.services);
      }
    } catch (error) {
      console.error('Failed to load doctors and services:', error);
    }
  };

  const onSubmit = async (data: AppointmentForm) => {
    setLoading(true);
    try {
      // Check if user is logged in
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // User is logged in, create appointment directly
        const response = await fetch('http://localhost:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            doctorId: data.doctorId,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            service: data.service,
            reason: data.reason
          })
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to schedule appointment');
        }
      } else {
        // User is not logged in, submit contact form
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: 'Appointment Request',
            message: `Appointment request for ${data.service} on ${data.appointmentDate} at ${data.appointmentTime}. Doctor preference: ${doctors.find(d => d.id === data.doctorId)?.user?.firstName} ${doctors.find(d => d.id === data.doctorId)?.user?.lastName}. Reason: ${data.reason}`
          })
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          alert('Failed to submit appointment request');
        }
      }
    } catch (error) {
      console.error('Failed to submit appointment:', error);
      alert('Failed to submit appointment request');
    } finally {
      setLoading(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem('authToken');

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-xl text-blue-100">
              Schedule your visit with our experienced dental team. We'll ensure you receive 
              the best care for your dental needs.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-2">Thank You!</h2>
                <p className="text-green-700 mb-4">
                  {isLoggedIn 
                    ? 'Your appointment has been scheduled successfully. We\'ll contact you shortly to confirm your appointment.'
                    : 'Your appointment request has been submitted successfully. We\'ll contact you shortly to confirm your appointment.'
                  }
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all"
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Appointment Details</h2>
                {!isLoggedIn && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800">
                      <strong>Note:</strong> You're not logged in. Your appointment request will be submitted for review. 
                      <a href="/login" className="text-blue-600 hover:underline ml-1">Login</a> for instant booking.
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name - only show if not logged in */}
                    {!isLoggedIn && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            {...register('name', { required: !isLoggedIn ? 'Name is required' : false })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>
                    )}

                    {/* Email - only show if not logged in */}
                    {!isLoggedIn && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            {...register('email', { 
                              required: !isLoggedIn ? 'Email is required' : false,
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="john@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    )}

                    {/* Phone - only show if not logged in */}
                    {!isLoggedIn && (
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            {...register('phone', { required: !isLoggedIn ? 'Phone number is required' : false })}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>
                    )}

                    {/* Doctor */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Preferred Doctor
                      </label>
                      <select
                        {...register('doctorId', { required: 'Please select a doctor' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.id} value={doctor.id}>
                            Dr. {doctor.user.firstName} {doctor.user.lastName} - {doctor.specialization}
                          </option>
                        ))}
                      </select>
                      {errors.doctorId && (
                        <p className="mt-1 text-sm text-red-600">{errors.doctorId.message}</p>
                      )}
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Service Required
                      </label>
                      <select
                        {...register('service', { required: 'Please select a service' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.name}>
                            {service.name} - ${service.price}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          {...register('appointmentDate', { required: 'Please select a date' })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {errors.appointmentDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
                      )}
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Preferred Time
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock size={18} className="text-gray-400" />
                        </div>
                        <select
                          {...register('appointmentTime', { required: 'Please select a time' })}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a time</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                        </select>
                      </div>
                      {errors.appointmentTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Reason for Visit / Additional Notes
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MessageSquare size={18} className="text-gray-400" />
                      </div>
                      <textarea
                        {...register('reason')}
                        rows={4}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please share any specific concerns or requirements..."
                      ></textarea>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-full font-medium transition-all"
                  >
                    {loading ? 'Submitting...' : (isLoggedIn ? 'Book Appointment' : 'Submit Request')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Important Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Appointment Policy</h3>
                  <p className="text-gray-600">
                    Please arrive 15 minutes before your scheduled appointment time. If you need 
                    to reschedule, kindly give us at least 24 hours notice.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">What to Bring</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Photo ID</li>
                    <li>Insurance card (if applicable)</li>
                    <li>List of current medications</li>
                    <li>Previous dental records (for new patients)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-2">Emergency Cases</h3>
                  <p className="text-gray-600">
                    For dental emergencies, please call our emergency hotline at{' '}
                    <span className="text-blue-600 font-bold">(555) 987-6543</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;