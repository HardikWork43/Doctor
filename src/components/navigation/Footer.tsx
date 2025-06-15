import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">DentalCare Clinic</h3>
            <p className="text-gray-400 mb-4">
              Providing quality dental care for you and your family with the latest 
              technology and a gentle touch.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/services">Our Services</FooterLink>
              <FooterLink to="/appointment">Book Appointment</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <FooterLink to="/services#general">General Dentistry</FooterLink>
              <FooterLink to="/services#cosmetic">Cosmetic Dentistry</FooterLink>
              <FooterLink to="/services#implants">Dental Implants</FooterLink>
              <FooterLink to="/services#orthodontics">Orthodontics</FooterLink>
              <FooterLink to="/services#emergency">Emergency Care</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 text-blue-400" size={18} />
                <span>123 Dental Street, Medical District, City, State 12345</span>
              </li>
              <li className="flex items-center">
                <PhoneCall className="mr-2 text-blue-400" size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 text-blue-400" size={18} />
                <span>contact@dentalcare.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mr-2 mt-1 text-blue-400" size={18} />
                <div>
                  <p>Mon-Fri: 8am-7pm</p>
                  <p>Sat: 9am-5pm</p>
                  <p>Sun: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} DentalCare Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

type FooterLinkProps = {
  to: string;
  children: React.ReactNode;
};

const FooterLink = ({ to, children }: FooterLinkProps) => (
  <li>
    <Link 
      to={to}
      className="text-gray-400 hover:text-blue-400 transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a 
    href="#" 
    className="bg-gray-800 hover:bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
  >
    {icon}
  </a>
);

export default Footer;