import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic validation for demo purposes
    if (activeTab === 'doctor' && !email.endsWith('@hospital.com')) {
      setError('Doctors must use a hospital email (@hospital.com)');
      return;
    }
    
    console.log('Login attempted:', { email, password, userType: activeTab });
    
    // Store authentication state in localStorage for demo purposes
    // In a real app, you would use proper authentication with tokens
    if (activeTab === 'patient') {
      localStorage.setItem('patientAuthenticated', 'true');
      localStorage.removeItem('doctorAuthenticated'); // Clear other auth states
      localStorage.removeItem('adminAuthenticated');
      navigate('/patient-portal');
    } else if (activeTab === 'doctor') {
      localStorage.setItem('doctorAuthenticated', 'true');
      localStorage.removeItem('patientAuthenticated'); // Clear other auth states
      localStorage.removeItem('adminAuthenticated');
      console.log('Doctor authenticated, redirecting to doctor portal');
      navigate('/doctor-portal');
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
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'patient'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('patient')}
          >
            Patient Login
          </button>
          <button
            className={`flex-1 py-3 font-medium transition-colors ${
              activeTab === 'doctor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('doctor')}
          >
            Doctor Login
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
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
                placeholder={activeTab === 'doctor' ? "doctor@hospital.com" : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {activeTab === 'doctor' && (
              <p className="mt-1 text-xs text-gray-500">
                Note: Doctor accounts must use @hospital.com email
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
            <div className="mt-1 text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
          >
            Log In <ArrowRight size={18} />
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