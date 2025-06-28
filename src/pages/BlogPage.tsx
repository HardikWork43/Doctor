import React, { useState, useEffect } from 'react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    firstName: string;
    lastName: string;
  };
  publishedAt: string;
  category: string;
  views: number;
};

const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blog?published=true');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.data.posts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.data.posts.map((post: BlogPost) => post.category)));
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter blog posts based on search term and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          `${post.author.firstName} ${post.author.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

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
                  src={`https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold uppercase px-2 py-1 rounded-md">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-4">
                  By {post.author.firstName} {post.author.lastName} | {new Date(post.publishedAt).toLocaleDateString()} | {post.views} views
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