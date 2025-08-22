import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTheaterMasks, faVideo, faPaintBrush, faStar, faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useScrollToTop } from '../utils/useScrollToTop';

const Programs = () => {
  useScrollToTop();
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      id: 1,
      title: "Refugee Teens Talk Program",
      icon: faHeart,
      shortDescription: "Addressing critical health and social issues affecting youth through education, awareness, and support.",
      fullDescription: "Our flagship program focused on addressing critical health and social issues affecting youth in our community through education, awareness, and peer support networks. We provide comprehensive workshops on sexual and reproductive health, GBV prevention, hygiene practices, and access to essential supplies and school materials.",
      stats: ["200+ beneficiaries", "24 workshops", "12 communities"],
      features: ["Health education workshops", "Peer counseling support", "Community outreach", "Access to sanitary supplies", "School materials support"],
      color: "from-blue-50 to-blue-100"
    },
    {
      id: 2,
      title: "Kakuma Theatre",
      icon: faTheaterMasks,
      shortDescription: "Combining theatre and media production to address social issues and showcase youth talent.",
      fullDescription: "A unique program that combines theatre and media production to address social issues and showcase youth talent through creative expression. We use drama, photography, and videography to tackle community challenges while developing artistic skills and promoting peaceful coexistence.",
      stats: ["Drama & performance", "Visual storytelling", "Community engagement"],
      features: ["Drama workshops", "Performance training", "Social issue plays", "Cultural expression", "Community dialogue"],
      color: "from-green-50 to-green-100"
    },
    {
      id: 3,
      title: "Kakuma Media Production",
      icon: faVideo,
      shortDescription: "Comprehensive training in photography, videography, and storytelling for youth development.",
      fullDescription: "Comprehensive training in photography, videography, and storytelling for youth development and creative expression. We equip young people with modern media skills to tell their stories and document community life, creating opportunities for creative careers and self-expression.",
      stats: ["Photography skills", "Video production", "Digital storytelling"],
      features: ["Photography training", "Video production", "Digital storytelling", "Equipment access", "Portfolio development"],
      color: "from-purple-50 to-purple-100"
    },
    {
      id: 4,
      title: "Art & Craft Initiatives",
      icon: faPaintBrush,
      shortDescription: "Drawing workshops and art-based awareness campaigns using creativity to address social issues.",
      fullDescription: "Drawing workshops for children and art-based awareness campaigns that use creativity to address social issues and develop artistic skills. We believe in the healing power of art and its ability to bring communities together while addressing critical social challenges.",
      stats: ["Drawing workshops", "Art therapy", "Social awareness"],
      features: ["Drawing workshops", "Art therapy sessions", "Social awareness campaigns", "Creative expression", "Community art projects"],
      color: "from-orange-50 to-orange-100"
    }
  ];

  const openProgram = (program) => {
    setSelectedProgram(program);
  };

  const closeProgram = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Our Programs
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white">
            Discover how we're empowering youth through creative expression, skills development, 
            and community impact initiatives.
          </p>
        </div>
      </section>

      {/* Programs Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FontAwesomeIcon icon={faStar} />
              <span>Core Programs</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Lives Through Creative Expression
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Click on any program to learn more about how we're making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <div 
                key={program.id}
                onClick={() => openProgram(program)}
                className={`bg-gradient-to-br ${program.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-100`}
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  <FontAwesomeIcon icon={program.icon} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {program.shortDescription}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {program.stats.slice(0, 2).map((stat, index) => (
                    <span key={index} className="bg-white bg-opacity-70 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {stat}
                    </span>
                  ))}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-blue-600 text-sm font-medium">
                  <span>Learn More</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                    <FontAwesomeIcon icon={selectedProgram.icon} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h2>
                    <p className="text-gray-600">Core Program</p>
                  </div>
                </div>
                <button
                  onClick={closeProgram}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Program</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProgram.fullDescription}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProgram.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact & Reach</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProgram.stats.map((stat, index) => (
                      <span key={index} className="bg-blue-50 text-blue-800 px-3 py-2 rounded-full text-sm font-medium">
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/get-involved" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                    Get Involved
                  </Link>
                  <Link to="/donate" className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200">
                    Support This Program
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Support Our Programs
          </h2>
          <p className="text-lg text-white mb-6 max-w-3xl mx-auto">
            Your support helps us continue providing these life-changing programs to refugee youth. 
            Join us in making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/get-involved" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Get Involved
            </Link>
            <Link to="/donate" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Donate Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
