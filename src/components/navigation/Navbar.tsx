import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Clock, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Clock size={16} />
              <span className="text-sm">Mon-Fri: 8am-7pm, Sat: 9am-5pm</span>
            </div>
          </div>
          <div>
            <Link 
              to="/login" 
              className="text-sm font-medium hover:underline transition-all"
            >
              Patient Login
            </Link>
          </div>
        </div>
      </div>
      
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-blue-600 font-bold text-2xl">DentalCare</span>
            <span className="ml-1 text-blue-400 font-medium">Clinic</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" active={isActive('/')}>Home</NavLink>
            <NavLink to="/about" active={isActive('/about')}>About</NavLink>
            <NavLink to="/services" active={isActive('/services')}>Services</NavLink>
            <NavLink to="/gallery" active={isActive('/gallery')}>Gallery</NavLink>
            <NavLink to="/blog" active={isActive('/blog')}>Blog</NavLink>
            <NavLink to="/contact" active={isActive('/contact')}>Contact</NavLink>
            <Link 
              to="/appointment" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all"
            >
              Book Appointment
            </Link>
          </div>
          
          <button 
            className="md:hidden text-blue-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              <MobileNavLink to="/" active={isActive('/')}>Home</MobileNavLink>
              <MobileNavLink to="/about" active={isActive('/about')}>About</MobileNavLink>
              <MobileNavLink to="/services" active={isActive('/services')}>Services</MobileNavLink>
              <MobileNavLink to="/gallery" active={isActive('/gallery')}>Gallery</MobileNavLink>
              <MobileNavLink to="/blog" active={isActive('/blog')}>Blog</MobileNavLink>
              <MobileNavLink to="/contact" active={isActive('/contact')}>Contact</MobileNavLink>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all text-center"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

type NavLinkProps = {
  to: string;
  active: boolean;
  children: React.ReactNode;
};

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className={`font-medium transition-all ${
      active 
        ? 'text-blue-600' 
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link 
    to={to} 
    className={`font-medium transition-all ${
      active 
        ? 'text-blue-600' 
        : 'text-gray-700 hover:text-blue-600'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;