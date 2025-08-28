import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faQuoteLeft,
  faSearch,
  faFilter,
  faStar,
  faEye,
  faHeart,
  faShare,
  faBookmark,
  faLightbulb,
  faUsers,
  faGlobe,
  faRocket,
  faSparkles,
  faFire,
  faChartLine,
  faAward,
  faCompass,
  faMagicWandSparkles,
  faPalette,
  faMusic,
  faCamera,
  faVideo,
  faMicrophone
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Stories = () => {
  useScrollToTop();
  
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [likedStories, setLikedStories] = useState(new Set());
  const [bookmarkedStories, setBookmarkedStories] = useState(new Set());

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/.netlify/functions/stories?published=true');
      
      // Sort stories by publish date (latest first)
      const sortedStories = response.data.sort((a, b) => {
        const dateA = new Date(a.publish_date || a.publishDate || 0);
        const dateB = new Date(b.publish_date || b.publishDate || 0);
        return dateB - dateA; // Latest first
      });
      
      setStories(sortedStories);
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
    if (!imagePath || imagePath.trim() === '') {
      return null;
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    
    if (imagePath.includes('Images/') || imagePath.includes('2025-')) {
      return `/${imagePath}`;
    }
    
    if (imagePath.includes('placeholder')) {
      return imagePath;
    }
    
    if (imagePath.trim()) {
      return imagePath;
    }
    
    return null;
  };

  const handleLike = (storyId) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const handleBookmark = (storyId) => {
    setBookmarkedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const handleShare = async (story) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.excerpt,
          url: `${window.location.origin}/stories/${story.id}`
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/stories/${story.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Creative Arts & Expression': faPalette,
      'Media & Storytelling': faVideo,
      'Youth Leadership & Empowerment': faUsers,
      'Conflict Resolution & Peace Dialogues': faGlobe,
      'Cultural Heritage & Identity': faCompass,
      'Youth Talent & Innovation': faLightbulb,
      'Sports for Peace': faRocket,
      'Entrepreneurship & Innovation': faChartLine,
      'Public Health Campaigns': faHeart,
      'Youth & Disability Inclusion': faAward
    };
    return iconMap[category] || faStar;
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(stories.map(story => story.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading amazing stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faLightbulb} className="text-red-400 text-6xl mb-4" />
          <p className="text-red-600 mb-4 text-lg">{error}</p>
          <button 
            onClick={fetchStories}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Floating Elements */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16 overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faSparkles} className="text-yellow-300 text-2xl mr-3 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Stories That Matter
            </h1>
            <FontAwesomeIcon icon={faSparkles} className="text-yellow-300 text-2xl ml-3 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-blue-100 mb-8">
            Discover inspiring stories of transformation, impact, and community change from around the world.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search stories by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-0 rounded-full text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50"
              />
            </div>
            <div className="flex items-center justify-center mt-4 space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all duration-200"
              >
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Filters
              </button>
              {showFilters && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-full border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sidebar */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-80 p-6 space-y-6">
          {/* Featured Stories Widget */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faFire} className="text-orange-500 mr-2" />
              Trending Now
            </h3>
            <div className="space-y-3">
              {stories.filter(s => s.featured === true).slice(0, 3).map(story => (
                <div key={story.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {story.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{story.title}</p>
                    <p className="text-xs text-gray-500">{story.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Explorer */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faCompass} className="text-blue-500 mr-2" />
              Explore Categories
            </h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(categoryFilter === category ? 'all' : category)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center ${
                    categoryFilter === category 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FontAwesomeIcon icon={getCategoryIcon(category)} className="mr-3 text-blue-500" />
                  <span className="text-sm font-medium">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Community Impact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Stories</span>
                <span className="text-2xl font-bold">{stories.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Featured</span>
                <span className="text-2xl font-bold">{stories.filter(s => s.featured === true).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Categories</span>
                <span className="text-2xl font-bold">{categories.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {filteredStories.length === 0 ? (
            <div className="text-center py-20">
              <FontAwesomeIcon icon={faMagicWandSparkles} className="text-gray-400 text-6xl mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Stories Found
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Try adjusting your search or filters to discover amazing stories.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setCategoryFilter('all');}}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredStories.map(story => (
                <div 
                  key={story.id} 
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  {/* Story Image */}
                  <div className="relative h-48 overflow-hidden">
                    {getImageUrl(story.image) ? (
                      <img 
                        src={getImageUrl(story.image)} 
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        style={{ objectPosition: 'center 30%' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                        <div className="text-center text-blue-600">
                          <FontAwesomeIcon icon={getCategoryIcon(story.category)} className="text-5xl mb-2" />
                          <p className="text-sm font-medium">No Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      <FontAwesomeIcon icon={getCategoryIcon(story.category)} className="mr-1 text-blue-500" />
                      {story.category}
                    </div>
                    
                    {/* Featured Badge */}
                    {story.featured === true && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <FontAwesomeIcon icon={faStar} className="mr-1" />
                        Featured
                      </div>
                    )}
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <Link 
                          to={`/stories/${story.id}`}
                          onClick={async () => {
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
                          className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          Read Story
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="p-6">
                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(story.publish_date || story.publishDate)}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {story.location}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {story.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {story.excerpt}
                    </p>
                    
                    {/* Author and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 font-medium">
                        By {story.author}
                      </div>
                      
                      {/* Interactive Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => { e.preventDefault(); handleLike(story.id); }}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            likedStories.has(story.id) 
                              ? 'text-red-500 bg-red-50' 
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <FontAwesomeIcon icon={likedStories.has(story.id) ? faHeart : farHeart} />
                        </button>
                        
                        <button
                          onClick={(e) => { e.preventDefault(); handleBookmark(story.id); }}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            bookmarkedStories.has(story.id) 
                              ? 'text-blue-500 bg-blue-50' 
                              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          <FontAwesomeIcon icon={faBookmark} />
                        </button>
                        
                        <button
                          onClick={(e) => { e.preventDefault(); handleShare(story); }}
                          className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-all duration-200"
                        >
                          <FontAwesomeIcon icon={faShare} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 p-6 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faRocket} className="text-green-500 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                Share Your Story
              </button>
              <button className="w-full p-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-medium">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Join Community
              </button>
              <button className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 font-medium">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                Explore Programs
              </button>
            </div>
          </div>

          {/* Latest Updates */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FontAwesomeIcon icon={faChartLine} className="text-purple-500 mr-2" />
              Latest Updates
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm text-blue-800 font-medium">New stories added weekly</p>
                <p className="text-xs text-blue-600">Stay updated with fresh content</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800 font-medium">Community events</p>
                <p className="text-xs text-green-600">Join our upcoming workshops</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <p className="text-sm text-purple-800 font-medium">Featured stories</p>
                <p className="text-xs text-purple-600">Highlighting exceptional content</p>
              </div>
            </div>
          </div>

          {/* Inspiration Quote */}
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg p-6 text-white text-center">
            <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl mb-4 text-white text-opacity-80" />
            <p className="text-lg font-medium mb-2">
              "Every story has the power to change a life"
            </p>
            <p className="text-sm text-white text-opacity-80">
              - Story Matters Community
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Your voice matters. Share your story of transformation, impact, or community change. 
            Inspire others and create positive change in our world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
              Get in Touch
            </Link>
            <Link 
              to="/get-involved"
              className="px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Get Involved
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
