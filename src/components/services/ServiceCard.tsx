import { Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

type ServiceCardProps = {
  title: string;
  description: string;
  icon: keyof typeof LucideIcons;
  link: string;
};

const ServiceCard = ({ title, description, icon, link }: ServiceCardProps) => {
  const IconComponent = LucideIcons[icon];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
      <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        {IconComponent && <IconComponent className="text-blue-600" size={24} />}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link 
        to={link} 
        className="text-blue-600 font-medium hover:underline flex items-center gap-1"
      >
        Learn More
        <LucideIcons.ArrowRight size={16} />
      </Link>
    </div>
  );
};

export default ServiceCard;