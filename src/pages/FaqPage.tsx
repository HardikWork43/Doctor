import React, { useState } from 'react';

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

// Mock data for FAQs
const faqData: FAQ[] = [
  {
    id: '1',
    question: 'How often should I visit the dentist?',
    answer: 'For most patients, we recommend dental check-ups and cleanings every six months. However, some patients with specific dental concerns or health conditions may need more frequent visits. Your dentist will advise on the optimal schedule for your individual needs.',
    category: 'General Dental Care'
  },
  {
    id: '2',
    question: 'What should I do in case of a dental emergency?',
    answer: 'In case of a dental emergency, contact our office immediately at (555) 987-6543. For after-hours emergencies, follow the instructions on our voicemail. For severe trauma or bleeding that cannot be controlled, visit the nearest emergency room. Common dental emergencies include knocked-out teeth (keep the tooth moist), severe toothache, broken or cracked teeth, lost fillings, and injuries to soft tissues.',
    category: 'Emergency Dental Care'
  },
  {
    id: '3',
    question: 'Do you accept dental insurance?',
    answer: 'Yes, we accept most major dental insurance plans. We recommend contacting our office before your appointment to verify your specific coverage. Our administrative team can help explain your benefits and potential out-of-pocket expenses. We also offer flexible payment options for those without insurance coverage.',
    category: 'Billing & Insurance'
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, personal checks, most major credit cards (Visa, MasterCard, American Express, Discover), and qualified healthcare financing options through CareCredit. We also offer in-house payment plans for certain treatments. Please speak with our financial coordinator for more information about payment options.',
    category: 'Billing & Insurance'
  },
  {
    id: '5',
    question: 'How can I schedule an appointment?',
    answer: 'You can schedule an appointment in several ways: through our online booking system on our website, by calling our office at (555) 123-4567 during business hours, or by visiting our clinic in person. New patients may need to provide some basic information and dental history when scheduling their first appointment.',
    category: 'Appointments'
  },
  {
    id: '6',
    question: 'What should I expect during my first dental visit?',
    answer: 'During your first visit, we\'ll review your medical and dental history, perform a comprehensive examination of your teeth, gums, and mouth, take necessary X-rays to detect any underlying issues, clean your teeth professionally, and discuss any findings and recommended treatment plans. The appointment typically takes 60-90 minutes.',
    category: 'Appointments'
  },
  {
    id: '7',
    question: 'Do you treat children?',
    answer: 'Yes, our practice provides dental care for patients of all ages, including children. We recommend bringing children for their first dental visit around their first birthday or when their first tooth erupts. Our team is experienced in making young patients feel comfortable and creating positive dental experiences.',
    category: 'General Dental Care'
  },
  {
    id: '8',
    question: 'How long does teeth whitening last?',
    answer: 'The results of professional teeth whitening can last from several months to a few years, depending on your oral hygiene practices, lifestyle habits, and consumption of staining foods and beverages. Regular brushing, flossing, dental check-ups, and avoiding tobacco can help maintain your results. We also offer touch-up treatments to help maintain your bright smile.',
    category: 'Cosmetic Dentistry'
  },
  {
    id: '9',
    question: 'What are the benefits of dental implants?',
    answer: 'Dental implants offer numerous benefits: they look and function like natural teeth, preserve bone structure, prevent facial sagging, restore full chewing ability, don\'t require altering adjacent teeth (unlike bridges), are highly durable (can last a lifetime with proper care), and help maintain proper speech. While initially more expensive than other tooth replacement options, their longevity and benefits often make them the most cost-effective solution over time.',
    category: 'Restorative Dentistry'
  },
  {
    id: '10',
    question: 'Is it normal to feel anxiety about dental visits?',
    answer: 'Yes, dental anxiety is very common. Many patients experience some level of nervousness about dental appointments. Our team is trained to help anxious patients feel more comfortable. We offer options like explaining procedures step by step, signal systems so you can communicate during treatment, calming environments, and various sedation options for those with more severe anxiety. Please share your concerns with us so we can help make your experience as comfortable as possible.',
    category: 'Patient Comfort'
  },
];

const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  
  // Get unique categories from FAQ data
  const categories = Array.from(new Set(faqData.map(faq => faq.category)));
  
  // Filter FAQs based on search query and selected category
  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === '' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Toggle FAQ expansion
  const toggleFaq = (id: string): void => {
    setExpandedFaqs(prevExpanded => 
      prevExpanded.includes(id)
        ? prevExpanded.filter(faqId => faqId !== id)
        : [...prevExpanded, id]
    );
  };
  
  // Check if FAQ is expanded
  const isFaqExpanded = (id: string): boolean => {
    return expandedFaqs.includes(id);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-4 text-xl text-gray-500">
            Find answers to common questions about our dental services and procedures
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-10">
          <div className="w-full mb-6">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveCategory('')}
            >
              All Categories
            </button>
            
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full text-left p-6 focus:outline-none"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <span className={`ml-2 transition-transform ${isFaqExpanded(faq.id) ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {faq.category}
                  </span>
                </div>
              </button>
              
              {isFaqExpanded(faq.id) && (
                <div className="px-6 pb-6 pt-2">
                  <hr className="mb-4" />
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No matching questions found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search terms or browse all categories.</p>
              <div className="mt-6">
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('');}}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900">Still have questions?</h3>
          <p className="mt-2 text-gray-600">
            Our team is happy to answer any additional questions you may have.
          </p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;