import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const Stories = () => {
  const stories = [
    {
      id: 1,
      title: "Community Dialogues Forum in Kakuma and Kalobeyei Seeks Solutions to Local Conflicts",
      excerpt: "The Kenya Community Media Network, in collaboration with REF-FM and Atanayeche, hosted a crucial forum this month in Kakuma and Kalobeyei to address the underlying causes of conflicts in the area.",
      author: "Kakuma Media",
      location: "Kakuma Refugee Camp and Kalobeyei Integrated Settlement",
      publishDate: "2024-10-04",
      image: "/Images/2025-01-06-community-dialogues.jpg",
      category: "Community Peacebuilding",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Project Design Team Forum in Kakuma and Kalobayei",
      excerpt: "This November, Kenya Community Media Network, in collaboration with Atanayece and REM-FM, hosted an important forum in Kakuma and Kalobayei settlements. The forum focused on critical issues impacting the community, including water-related conflicts, sexual and gender-based violence (GBV), and land disputes.",
      author: "Kakuma Media",
      location: "Kakuma Refugee Camp and Kalobeyei Integrated Settlement",
      publishDate: "2024-11-22",
      image: "/Images/2025-01-06-project-design.jpg",
      category: "Community Development",
      readTime: "4 min read",
      featured: false
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <Link 
                key={story.id} 
                to={`/stories/${story.id}`}
                className={`block bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer ${
                  story.featured ? 'shadow-xl ring-2 ring-blue-500' : 'shadow-md'
                }`}
              >
                <div className="relative">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-48 object-cover"
                    style={{ objectPosition: 'center 30%' }}
                  />
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {story.category}
                  </div>
                  {story.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mb-3">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                      {formatDate(story.publishDate)}
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
          
          {/* Coming Soon Message */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-xl p-8 shadow-md max-w-2xl mx-auto">
              <FontAwesomeIcon icon={faQuoteLeft} className="text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                More Stories Coming Soon
              </h3>
              <p className="text-gray-600 mb-4">
                We're working on bringing you more inspiring stories from our community. 
                Check back regularly for new content about transformation, impact, and change.
              </p>
              <div className="text-sm text-gray-500">
                Have a story to share? Contact us to contribute!
              </div>
            </div>
          </div>
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
