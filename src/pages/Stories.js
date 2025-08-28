import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Stories = () => {
  useScrollToTop();
  
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/.netlify/functions/stories?published=true');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Failed to load stories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getImageUrl = (imagePath) => {
    // If no image path is provided, return null to show no image
    if (!imagePath || imagePath.trim() === '') {
      return null;
    }
    
    // If the image path is already a full URL, use it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If the image path starts with /uploads/, it's from the CMS
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    
    // If it's a local image in the Images folder, prepend the path
    if (imagePath.includes('Images/') || imagePath.includes('2025-')) {
      return `/${imagePath}`;
    }
    
    // For placeholder images or other cases
    if (imagePath.includes('placeholder')) {
      return imagePath;
    }
    
    // If we have some image path but it doesn't match any pattern, try to use it as is
    if (imagePath.trim()) {
      return imagePath;
    }
    
    // Only use default image as last resort
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStories}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Stories
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white">
            Discover inspiring stories of transformation and impact from our community.
          </p>
        </div>
      </section>

      {/* Stories Layout */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            All Stories
          </h2>
          
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                No Stories Available
              </h3>
              <p className="text-gray-600 mb-4">
                We're working on bringing you inspiring stories from our community. 
                Check back soon for new content about transformation, impact, and change.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map(story => (
                <Link 
                  key={story.id} 
                  to={`/stories/${story.id}`}
                  onClick={async () => {
                    // Only increment view count for non-admin users
                    if (!user || user.role !== 'admin') {
                      try {
                        await axios.patch('/.netlify/functions/stories', {
                          storyId: story.id,
                          action: 'increment_view'
                        });
                      } catch (error) {
                        console.error('Error incrementing view count:', error);
                      }
                    }
                  }}
                  className={`block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                    (story.featured === true || story.featured === 'true') ? 'shadow-xl ring-2 ring-blue-500' : 'shadow-md'
                  }`}
                >
                  <div className="relative">
                    {getImageUrl(story.image) ? (
                      <img 
                        src={getImageUrl(story.image)} 
                        alt={story.title}
                        className="w-full h-48 object-cover"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <div className="text-center text-blue-600">
                          <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl mb-2" />
                          <p className="text-sm font-medium">No Image</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {story.category}
                    </div>
                    {(story.featured === true || story.featured === 'true') && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(story.publish_date || story.publishDate)}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {story.location}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                      {story.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        By {story.author}
                      </div>
                      <span className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Share Your Story
          </h2>
          <p className="text-lg text-white mb-6 max-w-3xl mx-auto">
            Every voice matters. Share your story of transformation, impact, or community change. 
            Your experiences can inspire others and create positive change in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              to="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Share Your Story
            </Link>
            <Link 
              to="/get-involved"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
