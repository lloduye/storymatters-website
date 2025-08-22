import React from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faArrowRight, faHeart, faUsers, faLightbulb, faHandshake, faStar, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-white text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 text-white">
            <FontAwesomeIcon icon={faStar} />
            <span>Empowering Youth Through Creativity</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
            Transforming Lives Through
            <span className="block text-blue-800">Storytelling & Art</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8 text-white">
            Empowering refugee youth in Kakuma Refugee Camp through creative arts, education, 
            and the transformative power of storytelling. Every story matters, every voice counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/get-involved" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center gap-2"
            >
              Get Involved
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <button 
              onClick={() => {
                // This would typically open a video modal or redirect to a video
                alert('Video player would open here. This feature is coming soon!');
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPlay} />
              Watch Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Youth Empowered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-gray-600 font-medium">Workshops Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-gray-600 font-medium">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">4</div>
              <div className="text-gray-600 font-medium">Core Programs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Mission
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                To transform lives through the power of storytelling, creative arts, and educational support, 
                empowering refugee youth to become confident leaders and change-makers in their communities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <p className="text-gray-600">Foster creativity and self-expression among youth</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <p className="text-gray-600">Provide quality educational opportunities and support</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <p className="text-gray-600">Build strong, resilient communities through collaboration</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">
                A world where every refugee youth has access to creative expression, quality education, 
                and the tools to build a brighter future for themselves and their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and shape our approach to youth empowerment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Compassion</h3>
              <p className="text-gray-600">
                We approach every individual with empathy, understanding, and genuine care for their well-being.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously seek creative solutions and new approaches to address community challenges.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We believe in the power of partnerships and working together to achieve greater impact.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-6 mx-auto group-hover:bg-blue-200 transition-colors duration-300">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality in all our programs and services.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Programs Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Four core programs designed to empower youth through creativity, education, and community engagement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Creative Arts & Media</h3>
              <p className="text-gray-600 text-sm mb-4">
                Theater, visual arts, digital storytelling, and media production.
              </p>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">150+</div>
                <div className="text-sm text-gray-500">Youth Enrolled</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Educational Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Tutoring, study skills, and academic enrichment programs.
              </p>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">200+</div>
                <div className="text-sm text-gray-500">Students Served</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Community Engagement</h3>
              <p className="text-gray-600 text-sm mb-4">
                Leadership development, community service, and civic participation.
              </p>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">100+</div>
                <div className="text-sm text-gray-500">Leaders Trained</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Youth Leadership</h3>
              <p className="text-gray-600 text-sm mb-4">
                Mentorship, skill-building, and empowerment initiatives.
              </p>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">75+</div>
                <div className="text-sm text-gray-500">Mentees</div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/programs" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Explore All Programs
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Be Part of the Change</h2>
              <p className="text-lg text-white mb-6">
                Your support empowers us to continue transforming lives through the power of storytelling. 
                Every contribution makes a difference in the lives of refugee youth.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 text-white">$50</div>
                  <div className="text-xs text-white">Empower 1 student</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 text-white">$100</div>
                  <div className="text-xs text-white">Support 1 workshop</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 text-white">$250</div>
                  <div className="text-xs text-white">Fund 1 community project</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link 
                to="/donate" 
                className="block w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors duration-200"
              >
                Donate Now
              </Link>
              <Link 
                to="/get-involved" 
                className="block w-full border-2 border-white text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
