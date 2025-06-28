import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import AppointmentPage from './pages/AppointmentPage';
import ContactPage from './pages/Contactpage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import FaqPage from './pages/FaqPage';
import PatientPortal from './pages/PatientPortal';
import DoctorPortal from './pages/DoctorPortal';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component to handle authentication
const ProtectedRoute = ({ element, requiredRole }: { element: React.ReactElement, requiredRole?: string }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // For role-based protection, you could decode the JWT token here
  // For now, we'll use the simple localStorage approach
  if (requiredRole === 'doctor') {
    const isDoctorAuth = localStorage.getItem('doctorAuthenticated') === 'true';
    return isDoctorAuth ? element : <Navigate to="/login" />;
  }
  
  if (requiredRole === 'patient') {
    const isPatientAuth = localStorage.getItem('patientAuthenticated') === 'true';
    return isPatientAuth ? element : <Navigate to="/login" />;
  }
  
  if (requiredRole === 'admin') {
    const isAdminAuth = localStorage.getItem('adminAuthenticated') === 'true';
    return isAdminAuth ? element : <Navigate to="/login" />;
  }
  
  return element;
};

function App() {
  return (  
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="appointment" element={<AppointmentPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route 
              path="patient-portal" 
              element={<ProtectedRoute element={<PatientPortal />} requiredRole="patient" />} 
            />
            <Route 
              path="doctor-portal" 
              element={<ProtectedRoute element={<DoctorPortal />} requiredRole="doctor" />} 
            />
            <Route 
              path="admin-dashboard" 
              element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} 
            />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;