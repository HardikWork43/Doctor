import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token
        localStorage.setItem('authToken', data.data.token);
        
        // Check user role and redirect accordingly
        const userRole = data.data.user.role;
        
        if (activeTab === 'patient' && userRole === 'patient') {
          localStorage.setItem('patientAuthenticated', 'true');
          navigate('/patient-portal');
        } else if (activeTab === 'doctor' && userRole === 'doctor') {
          localStorage.setItem('doctorAuthenticated', 'true');
          navigate('/doctor-portal');
        } else if (activeTab === 'admin' && userRole === 'admin') {
          localStorage.setItem('adminAuthenticated', 'true');
          navigate('/admin-dashboard');
        } else {
          setError('Invalid credentials for selected user type');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-[80vh] py-12 flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Log in to Your Account</h1>
          <p className="text-gray-600 mt-2">Access your personal portal</p>
        </div>
        
        <div className="flex rounded-md overflow-hidden mb-6">
          <button
            className={`flex-1 py-3 font-medium transition-colors text-sm ${
              activeTab === 'patient'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('patient')}
          >
            Patient
          </button>
          <button
            className={`flex-1 py-3 font-medium transition-colors text-sm ${
              activeTab === 'doctor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('doctor')}
          >
            Doctor
          </button>
          <button
            className={`flex-1 py-3 font-medium transition-colors text-sm ${
              activeTab === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  activeTab === 'doctor' ? "doctor@hospital.com" : 
                  activeTab === 'admin' ? "admin@dentalcare.com" :
                  "your@email.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {activeTab === 'doctor' && (
              <p className="mt-1 text-xs text-gray-500">
                Use: sarah.johnson@hospital.com, michael.chen@hospital.com, or emily.rodriguez@hospital.com
              </p>
            )}
            {activeTab === 'admin' && (
              <p className="mt-1 text-xs text-gray-500">
                Use: admin@dentalcare.com
              </p>
            )}
            {activeTab === 'patient' && (
              <p className="mt-1 text-xs text-gray-500">
                Use: john.smith@example.com, jane.doe@example.com, or sarah.johnson@example.com
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password: {activeTab === 'admin' ? 'admin123' : activeTab === 'doctor' ? 'doctor123' : 'patient123'}
            </p>
            <div className="mt-1 text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={18} />
          </button>
        </form>
        
        {activeTab === 'patient' && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register now
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;