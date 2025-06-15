import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const ServicesPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Our Dental Services</h1>
            <p className="text-xl text-blue-100">
              Comprehensive dental care solutions tailored to your needs, using the latest technology and techniques.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Comprehensive Dental Care</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              At DentalCare Clinic, we offer a wide range of dental services to meet all your oral health needs. 
              From preventive care to complex restorative procedures, our team is equipped to provide exceptional 
              treatment in a comfortable environment.
            </p>
          </div>
        </div>
      </section>

      {/* General Dentistry */}
      <section id="general" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3779701/pexels-photo-3779701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="General Dentistry" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">General Dentistry</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our general dentistry services focus on preventive care and maintaining your oral health. 
                Regular check-ups and cleanings help prevent dental issues before they become serious problems.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ServiceItem text="Comprehensive Dental Exams" />
                  <ServiceItem text="Professional Teeth Cleaning" />
                  <ServiceItem text="Digital X-Rays" />
                  <ServiceItem text="Oral Cancer Screenings" />
                  <ServiceItem text="Dental Fillings" />
                  <ServiceItem text="Fluoride Treatments" />
                  <ServiceItem text="Dental Sealants" />
                  <ServiceItem text="Oral Hygiene Education" />
                </ul>
              </div>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cosmetic Dentistry */}
      <section id="cosmetic" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Cosmetic Dentistry" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Cosmetic Dentistry</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our cosmetic dentistry services are designed to enhance the appearance of your smile. 
                From teeth whitening to complete smile makeovers, we can help you achieve the beautiful, 
                confident smile you deserve.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ServiceItem text="Professional Teeth Whitening" />
                  <ServiceItem text="Porcelain Veneers" />
                  <ServiceItem text="Dental Bonding" />
                  <ServiceItem text="Tooth-Colored Fillings" />
                  <ServiceItem text="Ceramic Crowns" />
                  <ServiceItem text="Smile Makeovers" />
                  <ServiceItem text="Gum Contouring" />
                  <ServiceItem text="Enamel Shaping" />
                </ul>
              </div>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dental Implants */}
      <section id="implants" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Dental Implants" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Dental Implants</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dental implants provide a permanent solution for missing teeth. These titanium posts 
                act as artificial tooth roots, providing a strong foundation for fixed or removable 
                replacement teeth that look, feel, and function like natural teeth.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ServiceItem text="Single Tooth Implants" />
                  <ServiceItem text="Multiple Tooth Implants" />
                  <ServiceItem text="Full Arch Replacements" />
                  <ServiceItem text="Implant-Supported Dentures" />
                  <ServiceItem text="All-on-4® Implants" />
                  <ServiceItem text="Bone Grafting" />
                  <ServiceItem text="Sinus Lifts" />
                  <ServiceItem text="Implant Maintenance" />
                </ul>
              </div>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orthodontics */}
      <section id="orthodontics" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/3985209/pexels-photo-3985209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Orthodontics" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Orthodontics</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our orthodontic treatments help straighten teeth and correct bite issues, enhancing 
                both the function and appearance of your smile. We offer a variety of options suitable 
                for children, teens, and adults.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ServiceItem text="Traditional Metal Braces" />
                  <ServiceItem text="Ceramic (Clear) Braces" />
                  <ServiceItem text="Invisalign® Clear Aligners" />
                  <ServiceItem text="Early Orthodontic Treatment" />
                  <ServiceItem text="Retainers" />
                  <ServiceItem text="Space Maintainers" />
                  <ServiceItem text="Palatal Expanders" />
                  <ServiceItem text="Post-Treatment Care" />
                </ul>
              </div>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pediatric Dentistry */}
      <section id="pediatric" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/4398381/pexels-photo-4398381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Pediatric Dentistry" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Pediatric Dentistry</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our pediatric dental services are specially designed to make dental visits fun and 
                comfortable for children. We focus on preventive care and teaching good oral hygiene 
                habits that will last a lifetime.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ServiceItem text="Child-Friendly Dental Exams" />
                  <ServiceItem text="Gentle Cleanings" />
                  <ServiceItem text="Fluoride Treatments" />
                  <ServiceItem text="Dental Sealants" />
                  <ServiceItem text="Sports Mouthguards" />
                  <ServiceItem text="Space Maintainers" />
                  <ServiceItem text="Early Orthodontic Assessment" />
                  <ServiceItem text="Dental Education & Prevention" />
                </ul>
              </div>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Care */}
      <section id="emergency" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.pexels.com/photos/6627600/pexels-photo-6627600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Emergency Dental Care" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Emergency Dental Care</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dental emergencies can happen at any time. Our team is equipped to handle urgent 
                dental issues promptly to alleviate pain and prevent further damage. We make 
                every effort to see emergency patients as quickly as possible.
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">Emergency Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ServiceItem text="Severe Tooth Pain Relief" />
                  <ServiceItem text="Treatment for Chipped/Broken Teeth" />
                  <ServiceItem text="Lost Fillings or Crowns" />
                  <ServiceItem text="Knocked-Out Teeth" />
                  <ServiceItem text="Dental Infections & Abscesses" />
                  <ServiceItem text="Broken Dentures or Appliances" />
                  <ServiceItem text="Soft Tissue Injuries" />
                  <ServiceItem text="Emergency Root Canals" />
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-gray-800 font-medium">
                  For dental emergencies, please call our emergency line: 
                  <span className="text-red-600 font-bold"> (555) 987-6543</span>
                </p>
              </div>
              <Link 
                to="/appointment" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all inline-flex items-center gap-2"
              >
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Schedule Your Dental Visit?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact us today to book an appointment with our experienced dental team. 
            We look forward to helping you achieve optimal oral health and a beautiful smile.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/appointment" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-all"
            >
              Book an Appointment
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const ServiceItem = ({ text }: { text: string }) => (
  <div className="flex items-center">
    <CheckCircle2 className="text-blue-600 mr-2 flex-shrink-0" size={18} />
    <span className="text-gray-600">{text}</span>
  </div>
);

export default ServicesPage;