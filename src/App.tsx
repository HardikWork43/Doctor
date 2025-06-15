import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
const ProtectedRoute = ({ element }) => {
  // For doctor routes
  if (element.type === DoctorPortal) {
    const isAuthenticated = localStorage.getItem('doctorAuthenticated') === 'true';
    return isAuthenticated ? element : <Navigate to="/login" />;
  }
  
  // For patient routes
  if (element.type === PatientPortal) {
    const isAuthenticated = localStorage.getItem('patientAuthenticated') === 'true';
    return isAuthenticated ? element : <Navigate to="/login" />;
  }
  
  // For admin routes
  if (element.type === AdminDashboard) {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    return isAuthenticated ? element : <Navigate to="/login" />;
  }
  
  // Default - no protection
  return element;
};

function App() {
  return (  
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
          <Route path="patient-portal" element={<ProtectedRoute element={<PatientPortal />} />} />
          <Route path="doctor-portal" element={<ProtectedRoute element={<DoctorPortal />} />} />
          <Route path="admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
