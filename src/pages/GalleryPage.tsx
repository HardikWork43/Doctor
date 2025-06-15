import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

type GalleryImage = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  beforeImageUrl?: string;
  isFeatured?: boolean;
};

const galleryData: GalleryImage[] = [
  {
    id: '1',
    title: 'Teeth Whitening Transformation',
    description: 'Professional teeth whitening results after just one session',
    category: 'Cosmetic Dentistry',
    imageUrl: '/src/images/White_Teeth.png',
    beforeImageUrl: '/src/images/Yellow_Teeth.png',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Dental Implant Procedure',
    description: 'Complete smile restoration with dental implants',
    category: 'Restorative Dentistry',
    imageUrl: '/src/images/White_Teeth.png',
    beforeImageUrl: '/src/images/before_implant.png'
  },
  {
    id: '3',
    title: 'Modern Dental Clinic',
    description: 'Our state-of-the-art treatment room with the latest technology',
    category: 'Our Facility',
    imageUrl: '/src/images/Modern _Dental_Clinic.png'
  },
  {
    id: '4',
    title: 'Porcelain Veneers',
    description: 'Smile makeover with custom porcelain veneers',
    category: 'Cosmetic Dentistry',
    imageUrl: '/src/images/happy.png',
    beforeImageUrl: '/images/gallery/veneers-before.jpg'
  },
  {
    id: '5',
    title: 'Comfortable Waiting Area',
    description: 'Our relaxing patient waiting lounge',
    category: 'Our Facility',
    imageUrl: '/src/images/comfort.png'
  },
  {
    id: '6',
    title: 'Invisalign Treatment',
    description: 'Discreet teeth straightening with clear aligners',
    category: 'Orthodontics',
    imageUrl: '/src/images/invisble.png',
    beforeImageUrl: '/src/images/invisble.png'
  },
  {
    id: '7',
    title: 'Friendly Dental Team',
    description: 'Our experienced and caring dental professionals',
    category: 'Our Team',
    imageUrl: '/src/images/family.png'
  },
  {
    id: '8',
    title: 'Dental Crown Restoration',
    description: 'Damaged tooth restored with a custom ceramic crown',
    category: 'Restorative Dentistry',
    imageUrl: '/src/images/crown.png',
    beforeImageUrl: '/src/images/crown.png'
  },
];

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(false);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(galleryData.map(item => item.category)))];

  // Filter images based on selected category
  const filteredImages = selectedCategory === 'All' 
    ? galleryData 
    : galleryData.filter(image => image.category === selectedCategory);

  // Featured images (for a separate section)
  const featuredImages = galleryData.filter(image => image.isFeatured);

  // Open lightbox with specific image
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    setShowBeforeAfter(false);
  };

  // Navigate through lightbox images
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? filteredImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === filteredImages.length - 1 ? 0 : prev + 1
      );
    }
    setShowBeforeAfter(false);
  };

  // Toggle before/after view for current image
  const toggleBeforeAfter = () => {
    setShowBeforeAfter(!showBeforeAfter);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900">Our Dental Gallery</h1>
          <p className="mt-4 text-xl text-gray-500">
            See the results of our treatments and explore our modern facility
          </p>
        </div>

        {/* Featured Before/After Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">Featured Transformations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredImages.map((image, index) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="relative h-64 cursor-pointer"
                  onClick={() => {
                    const mainIndex = galleryData.findIndex(img => img.id === image.id);
                    openLightbox(mainIndex);
                  }}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/gallery/placeholder.jpg';
                    }}
                  />
                  {image.beforeImageUrl && (
                    <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Before/After
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800">{image.title}</h3>
                  <p className="text-gray-600 mt-2">{image.description}</p>
                  <span className="inline-block mt-3 text-sm font-medium text-blue-600">
                    {image.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={image.id} 
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div 
                className="relative h-60 cursor-pointer overflow-hidden"
                onClick={() => {
                  const mainIndex = galleryData.findIndex(img => img.id === image.id);
                  openLightbox(mainIndex);
                }}
              >
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/gallery/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                {image.beforeImageUrl && (
                  <div className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Before/After
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{image.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{image.category}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No images found</h3>
            <p className="mt-2 text-gray-500">Try selecting a different category</p>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
            <button 
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setLightboxOpen(false)}
            >
              <FaTimes />
            </button>

            <button 
              className="absolute left-4 text-white text-3xl md:left-10"
              onClick={() => navigateLightbox('prev')}
            >
              <FaChevronLeft size={32} />
            </button>

            <div className="relative max-w-4xl w-full">
              <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={showBeforeAfter && filteredImages[currentImageIndex].beforeImageUrl 
                    ? filteredImages[currentImageIndex].beforeImageUrl 
                    : filteredImages[currentImageIndex].imageUrl}
                  alt={filteredImages[currentImageIndex].title}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              </div>

              {filteredImages[currentImageIndex].beforeImageUrl && (
                <button
                  onClick={toggleBeforeAfter}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  {showBeforeAfter ? 'View After' : 'View Before'}
                </button>
              )}
            </div>

            <button 
              className="absolute right-4 text-white text-3xl md:right-10"
              onClick={() => navigateLightbox('next')}
            >
              <FaChevronRight size={32} />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-lg font-medium">
                {filteredImages[currentImageIndex].title} - {filteredImages[currentImageIndex].category}
              </p>
              <p className="text-sm opacity-80 mt-1">
                {currentImageIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 bg-blue-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Smile?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Schedule a consultation with our dental experts to discuss your personalized treatment plan.
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-colors">
            Book an Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;