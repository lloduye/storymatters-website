import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faClock, faShare, faBookmark, faComment, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedStories, setRelatedStories] = useState([]);

  const fetchStory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/stories/${id}`);
      setStory(response.data);
      
      // Fetch related stories (excluding current story)
      const allStoriesResponse = await axios.get('http://localhost:5000/api/stories');
      const allStories = allStoriesResponse.data;
      const related = allStories.filter(s => s.id !== parseInt(id)).slice(0, 3);
      setRelatedStories(related);
    } catch (error) {
      console.error('Error fetching story:', error);
      setError('Failed to load story. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/Images/2025-01-06-community-dialogues.jpg';
    
    // If the image path starts with /uploads/, it's from the CMS, so prepend the backend URL
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Otherwise, it's a local image, so use as is
    return imagePath;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Story not found'}</p>
          <Link 
            to="/stories"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/stories" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>

      {/* Featured Image - Full Screen Width */}
      <div className="w-full">
        <img 
          src={getImageUrl(story.image)} 
          alt={story.title}
          className="w-full h-64 md:h-80 object-cover"
          style={{ objectPosition: 'center 30%' }}
        />
      </div>

      {/* Story Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Details */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {story.category}
            </span>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              {formatDate(story.publishDate)}
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
              {story.location}
            </div>
            <div className="text-gray-500">
              {story.readTime}
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {story.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {story.excerpt}
        </p>

        {/* Author */}
        <div className="mb-6">
          <div className="flex items-center text-gray-700">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            <span className="font-medium">By {story.author}</span>
          </div>
        </div>

        {/* Tags */}
        {story.tags && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {story.tags.split(', ').map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-700 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: story.title,
                    text: story.excerpt,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Story link copied to clipboard!');
                }
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faShare} className="mr-2" />
              Share Story
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Story link copied to clipboard!');
              }}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faBookmark} className="mr-2" />
              Bookmark
            </button>
            <button 
              onClick={() => {
                alert('Comment feature coming soon! This would open a comment form.');
              }}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faComment} className="mr-2" />
              Comment
            </button>
          </div>
        </div>
      </div>

      {/* Related Stories Section */}
      {relatedStories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">
              More Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedStories.map(otherStory => (
                <Link 
                  key={otherStory.id} 
                  to={`/stories/${otherStory.id}`}
                  className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer h-full"
                >
                  <div className="relative">
                    <img 
                      src={getImageUrl(otherStory.image)} 
                      alt={otherStory.title}
                      className="w-full h-48 object-cover"
                      style={{ objectPosition: 'center 30%' }}
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {otherStory.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(otherStory.publishDate)}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {otherStory.location}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                      {otherStory.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {otherStory.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-sm text-gray-600">
                        By {otherStory.author}
                      </div>
                      <span className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link 
                to="/stories"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                View All Stories
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default StoryDetail;
