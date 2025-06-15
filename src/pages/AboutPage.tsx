import { CheckCircle2 } from 'lucide-react';
import DoctorCard from '../components/team/DoctorCard';



const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">About DentalCare Clinic</h1>
            <p className="text-xl text-blue-100">
              Get to know our clinic, our mission, and the team dedicated to your dental health.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Our Story</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2008 by Dr. James Wilson, DentalCare Clinic began with a simple vision: 
                to provide exceptional dental care in a comfortable and welcoming environment. 
                What started as a small practice has grown into a comprehensive dental center 
                serving thousands of patients across the region.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our growth over the years has been driven by our commitment to patient satisfaction, 
                investment in advanced technology, and our team's dedication to continuing education 
                and staying at the forefront of dental innovations.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to offer a wide range of dental services for patients of all ages, 
                from routine cleanings to complex restorative and cosmetic procedures, all delivered with 
                the same care and attention to detail that has been our hallmark since day one.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/3845983/pexels-photo-3845983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Dental clinic reception" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/3845997/pexels-photo-3845997.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Dental treatment room" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/3845980/pexels-photo-3845980.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Dental equipment" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="https://images.pexels.com/photos/305566/pexels-photo-305566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Dental professionals" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Our Mission & Vision</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To provide exceptional, personalized dental care that improves our patients' oral 
                health and enhances their quality of life. We are committed to making each visit 
                comfortable, informative, and effective through compassionate service and clinical excellence.
              </p>
              <ul className="space-y-2">
                <MissionPoint text="Deliver high-quality, comprehensive dental care" />
                <MissionPoint text="Create a comfortable, stress-free environment" />
                <MissionPoint text="Educate patients on maintaining optimal oral health" />
                <MissionPoint text="Maintain the highest standards of safety and sterilization" />
              </ul>
            </div>
            <div className="md:w-1/2 bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To be the leading dental care provider in our community, recognized for clinical 
                excellence, exceptional patient experience, and innovative dental solutions. We aspire 
                to transform lives through healthy smiles and set new standards in dental care.
              </p>
              <ul className="space-y-2">
                <MissionPoint text="Be at the forefront of dental technology and techniques" />
                <MissionPoint text="Create lasting relationships built on trust and results" />
                <MissionPoint text="Contribute positively to our community's overall health" />
                <MissionPoint text="Inspire a new generation of dental professionals" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Our Core Values</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              These principles guide everything we do at DentalCare Clinic, from patient care to team interactions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ValueCard 
              title="Excellence" 
              description="We strive for excellence in every aspect of our practice, constantly improving our skills and services."
            />
            <ValueCard 
              title="Compassion" 
              description="We treat each patient with kindness, empathy, and respect, recognizing their unique needs and concerns."
            />
            <ValueCard 
              title="Integrity" 
              description="We adhere to the highest ethical standards and are honest and transparent in all our interactions."
            />
            <ValueCard 
              title="Innovation" 
              description="We embrace new technologies and techniques that enhance patient care and treatment outcomes."
            />
            <ValueCard 
              title="Education" 
              description="We believe in continuous learning and sharing knowledge with our patients and community."
            />
            <ValueCard 
              title="Community" 
              description="We are committed to making a positive impact in our community through service and outreach."
            />
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Meet Our Team</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our team of experienced dental professionals is dedicated to providing you with the highest quality care in a comfortable environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DoctorCard 
              name="Dr. Sarah Johnson"
              role="General Dentist"
              image="https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="Dr. Johnson has over 10 years of experience in general dentistry with a focus on preventive care and patient education."
            />
            <DoctorCard 
              name="Dr. Michael Chen"
              role="Orthodontist"
              image="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="Specializing in orthodontics, Dr. Chen helps patients achieve perfectly aligned smiles using the latest techniques."
            />
            <DoctorCard 
              name="Dr. Emily Rodriguez"
              role="Cosmetic Dentist"
              image="https://images.pexels.com/photos/5214949/pexels-photo-5214949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="With expertise in cosmetic procedures, Dr. Rodriguez is dedicated to creating beautiful, natural-looking smiles."
            />
            <DoctorCard 
              name="Dr. James Wilson"
              role="Founder & Dental Surgeon"
              image="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="As our founder, Dr. Wilson brings 25 years of experience in dental surgery and leads our clinic with passion."
            />
            <DoctorCard 
              name="Dr. Lisa Taylor"
              role="Pediatric Specialist"
              image="https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="Dr. Taylor specializes in pediatric dentistry, making dental visits fun and comfortable for our youngest patients."
            />
            <DoctorCard 
              name="Dr. Robert Kim"
              role="Periodontal Specialist"
              image="https://images.pexels.com/photos/5407186/pexels-photo-5407186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              description="As our periodontal expert, Dr. Kim specializes in the prevention, diagnosis, and treatment of gum disease."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const MissionPoint = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <CheckCircle2 className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={18} />
    <span className="text-gray-600">{text}</span>
  </li>
);

const ValueCard = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transition-all hover:shadow-lg">
    <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default AboutPage;