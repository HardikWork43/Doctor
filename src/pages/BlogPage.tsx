import React, { useState } from 'react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
};

// Mock data for blog posts
const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Importance of Regular Dental Check-ups',
    excerpt: 'Learn why regular dental visits are crucial for maintaining optimal oral health and preventing serious issues.',
    content: 'Regular dental check-ups are essential for maintaining good oral health. During a check-up, your dentist will examine your teeth, gums, and mouth for any signs of problems. Early detection of issues such as cavities, gum disease, or oral cancer can lead to simpler and more effective treatments. Additionally, professional cleanings remove plaque and tartar buildup that regular brushing and flossing cannot eliminate. It is recommended to visit your dentist every six months, though some individuals with specific dental concerns may need more frequent visits. Remember, preventive care is always better and less expensive than treating advanced dental problems!',
    author: 'Dr. James Wilson',
    date: '2025-04-15',
    category: 'Preventive Care',
    imageUrl: '/images/blog/dental-checkup.jpg'
  },
  {
    id: '2',
    title: 'Understanding Tooth Sensitivity: Causes and Treatments',
    excerpt: 'Are your teeth sensitive to hot, cold, or sweet foods? Discover the causes behind tooth sensitivity and effective treatments.',
    content: 'Tooth sensitivity affects millions of people and can make eating, drinking, and even breathing uncomfortable. The most common cause is exposed dentin, which occurs when your tooth enamel wears down or your gums recede. Other causes include cavities, cracked teeth, worn fillings, and teeth grinding. Treatments range from using desensitizing toothpaste and fluoride treatments to dental bonding, crowns, inlays, or root canals for more severe cases. If you re experiencing tooth sensitivity, its important to consult with your dentist to identify the underlying cause and determine the most appropriate treatment plan for your specific situation.',
    author: 'Dr. Emily Chen',
    date: '2025-04-10',
    category: 'Dental Health',
    imageUrl: '/images/blog/tooth-sensitivity.jpg'
  },
  {
    id: '3',
    title: 'The Connection Between Oral Health and Overall Wellness',
    excerpt: 'Did you know your oral health can affect your general health? Learn about the mouth-body connection.',
    content: 'The health of your mouth, teeth, and gums can affect your overall health. Research has shown connections between poor oral health and various systemic conditions, including heart disease, diabetes, respiratory infections, and complications during pregnancy. The mouth is a gateway to the body, and bacteria from oral infections can enter the bloodstream and potentially affect other organs. Maintaining good oral hygiene through regular brushing, flossing, and dental check-ups not only preserves your smile but also contributes to your general well-being. This bidirectional relationship emphasizes the importance of integrating dental care into your overall healthcare routine.',
    author: 'Dr. Michael Rodriguez',
    date: '2025-04-05',
    category: 'Health Education',
    imageUrl: '/images/blog/oral-systemic-health.jpg'
  },
];

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Get unique categories from blog posts
  const categories = Array.from(new Set(mockBlogPosts.map(post => post.category)));
  
  // Filter blog posts based on search term and selected category
  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900">Dental Health Blog</h1>
          <p className="mt-4 text-xl text-gray-500">
            Expert insights, tips, and news about oral health and dental care
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white overflow-hidden shadow-lg rounded-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/blog/placeholder.jpg';
                  }}
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold uppercase px-2 py-1 rounded-md">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  By {post.author} | {new Date(post.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-6">{post.excerpt}</p>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900">No blog posts found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
        
        {/* Newsletter Sign-up */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Subscribe to Our Newsletter</h3>
            <p className="mt-2 text-gray-600">
              Get the latest dental health tips and clinic updates delivered directly to your inbox
            </p>
            
            <div className="mt-6 max-w-xl mx-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-3 border border-gray-300 rounded-md shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;