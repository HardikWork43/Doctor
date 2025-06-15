import { Link } from 'react-router-dom';
import { Shield, Stethoscope, Award, Clock } from 'lucide-react';
import ServiceCard from '../components/services/ServiceCard';
import DoctorCard from '../components/team/DoctorCard';
import TestimonialCard from '../components/testimonials/TestimonialCard';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3845803/pexels-photo-3845803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your Smile Deserves The Best Care
            </h1>
            <p className="text-xl mb-8 leading-relaxed">
              We provide high-quality dental care with a gentle touch, using the latest 
              technology for comprehensive treatment in a comfortable environment.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/appointment" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all"
              >
                Book Appointment
              </Link>
              <Link 
                to="/services" 
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-all"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Shield className="text-blue-600" size={36} />}
              title="Quality Care"
              description="We provide the highest standard of dental care using the latest technology."
            />
            <FeatureCard 
              icon={<Stethoscope className="text-blue-600" size={36} />}
              title="Expert Dentists"
              description="Our team consists of experienced and highly qualified dental professionals."
            />
            <FeatureCard 
              icon={<Award className="text-blue-600" size={36} />}
              title="Certified Services"
              description="All our procedures and equipment meet the highest industry standards."
            />
            <FeatureCard 
              icon={<Clock className="text-blue-600" size={36} />}
              title="24/7 Support"
              description="Emergency dental care available when you need it most."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Modern Dental Clinic" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="text-lg font-bold">15+ Years</p>
                <p>of Experience</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome to DentalCare Clinic</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since 2008, DentalCare Clinic has been providing exceptional dental services to 
                our community. Our mission is to deliver high-quality, personalized dental care 
                that focuses on your comfort and long-term oral health.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We believe in preventive care and patient education as the keys to optimal 
                dental health. We're committed to using the latest techniques and technology 
                to ensure comfortable, precise, and long-lasting results.
              </p>
              <Link 
                to="/about" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all inline-block"
              >
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Our Dental Services</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              We offer a wide range of dental services to keep your smile healthy and beautiful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard 
              title="General Dentistry"
              description="Comprehensive preventive care including check-ups, cleanings, and education."
              icon="Tooth"
              link="/services#general"
            />
            <ServiceCard 
              title="Cosmetic Dentistry"
              description="Enhance your smile with whitening, veneers, and aesthetic procedures."
              icon="Smile"
              link="/services#cosmetic"
            />
            <ServiceCard 
              title="Dental Implants"
              description="Permanent replacement solutions for missing teeth that look and feel natural."
              icon="Wrench"
              link="/services#implants"
            />
            <ServiceCard 
              title="Orthodontics"
              description="Straighten and align teeth for improved appearance and function."
              icon="AlignLeft"
              link="/services#orthodontics"
            />
            <ServiceCard 
              title="Pediatric Dentistry"
              description="Specialized care for children in a friendly and comfortable environment."
              icon="Baby"
              link="/services#pediatric"
            />
            <ServiceCard 
              title="Emergency Care"
              description="Prompt attention for dental emergencies to alleviate pain and prevent damage."
              icon="AlertCircle"
              link="/services#emergency"
            />
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all inline-block"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
              <p className="text-blue-100 text-lg">
                Book an appointment today and take the first step towards a healthier smile.
              </p>
            </div>
            <Link 
              to="/appointment" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all whitespace-nowrap"
            >
              Book Your Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Meet Our Dentists</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our highly skilled team of dental professionals is dedicated to providing you with the best care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DoctorCard 
              name="Dr. Sarah Johnson"
              role="General Dentist"
              image="https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="Dr. Johnson has over 10 years of experience in general dentistry with a focus on preventive care."
            />
            <DoctorCard 
              name="Dr. Michael Chen"
              role="Orthodontist"
              image="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="Specializing in orthodontics, Dr. Chen helps patients achieve perfectly aligned smiles."
            />
            <DoctorCard 
              name="Dr. Emily Rodriguez"
              role="Cosmetic Dentist"
              image="https://images.pexels.com/photos/5214949/pexels-photo-5214949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="With expertise in cosmetic procedures, Dr. Rodriguez is dedicated to creating beautiful smiles."
            />
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/about#team" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all inline-block"
            >
              Meet Our Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">What Our Patients Say</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Don't just take our word for it. Here's what our patients have to say about their experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="Jennifer Smith"
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              rating={5}
              text="The team at DentalCare Clinic made my dental visit so comfortable. Dr. Johnson explained everything clearly and the results are amazing!"
            />
            <TestimonialCard 
              name="Robert Taylor"
              image="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              rating={5}
              text="I've been coming here for years and have always received excellent care. The staff is friendly and professional, and the office is state-of-the-art."
            />
            <TestimonialCard 
              name="Maria Gonzalez"
              image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              rating={4}
              text="My children love coming to DentalCare Clinic. The pediatric dental team knows exactly how to make them comfortable and actually enjoy their visit!"
            />
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Latest from Our Blog</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Stay informed with our latest dental health tips and clinic updates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlogPreview 
              title="5 Tips for Maintaining Good Oral Hygiene"
              image="https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              date="June 12, 2025"
              excerpt="Learn the essential daily habits that will keep your teeth and gums healthy for years to come."
            />
            <BlogPreview 
              title="The Benefits of Regular Dental Check-ups"
              image="https://images.pexels.com/photos/4269697/pexels-photo-4269697.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              date="May 28, 2025"
              excerpt="Regular dental visits aren't just about clean teeth—discover how they benefit your overall health."
            />
            <BlogPreview 
              title="Understanding Dental Implants: Are They Right for You?"
              image="https://images.pexels.com/photos/8830279/pexels-photo-8830279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              date="May 15, 2025"
              excerpt="Explore the pros and cons of dental implants and learn if they might be the right solution for your missing teeth."
            />
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/blog" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all inline-block"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:transform hover:-translate-y-1">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const BlogPreview = ({ title, image, date, excerpt }: { title: string, image: string, date: string, excerpt: string }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:-translate-y-1">
    <div className="h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform hover:scale-105" />
    </div>
    <div className="p-6">
      <p className="text-sm text-blue-600 mb-2">{date}</p>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <Link to="/blog" className="text-blue-600 font-medium hover:underline">Read More</Link>
    </div>
  </div>
);

export default HomePage;