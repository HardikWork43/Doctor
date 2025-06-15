const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: userData,
  }),
  
  getCurrentUser: () => apiRequest('/auth/me'),
  
  updateProfile: (profileData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: profileData,
  }),
  
  changePassword: (passwordData) => apiRequest('/auth/change-password', {
    method: 'PUT',
    body: passwordData,
  }),
};

// Appointments API
export const appointmentsAPI = {
  getAppointments: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/appointments${queryString ? `?${queryString}` : ''}`);
  },
  
  createAppointment: (appointmentData) => apiRequest('/appointments', {
    method: 'POST',
    body: appointmentData,
  }),
  
  updateAppointment: (id, appointmentData) => apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: appointmentData,
  }),
  
  cancelAppointment: (id) => apiRequest(`/appointments/${id}`, {
    method: 'DELETE',
  }),
};

// Doctors API
export const doctorsAPI = {
  getDoctors: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/doctors${queryString ? `?${queryString}` : ''}`);
  },
  
  getDoctor: (id) => apiRequest(`/doctors/${id}`),
  
  createDoctor: (doctorData) => apiRequest('/doctors', {
    method: 'POST',
    body: doctorData,
  }),
  
  updateDoctor: (id, doctorData) => apiRequest(`/doctors/${id}`, {
    method: 'PUT',
    body: doctorData,
  }),
};

// Services API
export const servicesAPI = {
  getServices: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/services${queryString ? `?${queryString}` : ''}`);
  },
  
  createService: (serviceData) => apiRequest('/services', {
    method: 'POST',
    body: serviceData,
  }),
  
  updateService: (id, serviceData) => apiRequest(`/services/${id}`, {
    method: 'PUT',
    body: serviceData,
  }),
  
  deleteService: (id) => apiRequest(`/services/${id}`, {
    method: 'DELETE',
  }),
};

// Blog API
export const blogAPI = {
  getPosts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/blog${queryString ? `?${queryString}` : ''}`);
  },
  
  getPost: (slug) => apiRequest(`/blog/${slug}`),
  
  createPost: (postData) => apiRequest('/blog', {
    method: 'POST',
    body: postData,
  }),
};

// Contact API
export const contactAPI = {
  submitContact: (contactData) => apiRequest('/contact', {
    method: 'POST',
    body: contactData,
  }),
  
  getContacts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/contact${queryString ? `?${queryString}` : ''}`);
  },
  
  updateContact: (id, contactData) => apiRequest(`/contact/${id}`, {
    method: 'PUT',
    body: contactData,
  }),
};

// Patients API
export const patientsAPI = {
  getPatients: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/patients${queryString ? `?${queryString}` : ''}`);
  },
  
  getPatient: (id) => apiRequest(`/patients/${id}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },
  
  updateUserStatus: (id, statusData) => apiRequest(`/admin/users/${id}/status`, {
    method: 'PUT',
    body: statusData,
  }),
};