import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

type DoctorCardProps = {
  name: string;
  role: string;
  image: string;
  description: string;
};

const DoctorCard = ({ name, role, image, description }: DoctorCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1">
      <div className="h-60 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 text-gray-800">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex space-x-3">
          <SocialIcon icon={<Facebook size={16} />} />
          <SocialIcon icon={<Twitter size={16} />} />
          <SocialIcon icon={<Linkedin size={16} />} />
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <Link 
    to="#" 
    className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
  >
    {icon}
  </Link>
);

export default DoctorCard;