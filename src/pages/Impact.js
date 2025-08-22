import React from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHeart, faLightbulb, faHandshake, faGraduationCap, faStar, faAward, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Impact = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Our Impact
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white">
            Transforming lives and communities through creative expression and education
          </p>
        </div>
      </section>

      {/* Impact Overview */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FontAwesomeIcon icon={faStar} />
              <span>Our Impact</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Measurable Change in Action
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              See the real numbers and stories behind our mission to empower refugee youth and transform communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-lg text-gray-700">Youth Empowered</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-lg text-gray-700">Workshops Conducted</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-lg text-gray-700">Communities Served</div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faAward} />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-lg text-gray-700">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Achievements</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Milestones that demonstrate our commitment to creating lasting positive change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Youth Leadership Development</h3>
                    <p className="text-base text-gray-600 mb-4">
                      Successfully trained 50+ youth leaders who now mentor younger participants and lead community initiatives.
                    </p>
                    <div className="text-sm text-blue-600 font-semibold">2023 Achievement</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Educational Program Expansion</h3>
                    <p className="text-base text-gray-600 mb-4">
                      Expanded our programs from 3 to 4 core initiatives, reaching 200 additional youth annually.
                    </p>
                    <div className="text-sm text-blue-600 font-semibold">2022-2023 Growth</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <FontAwesomeIcon icon={faHandshake} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Community Partnerships</h3>
                    <p className="text-base text-gray-600 mb-4">
                      Established partnerships with 8 local organizations, creating a network of support for refugee youth.
                    </p>
                    <div className="text-sm text-blue-600 font-semibold">Ongoing Success</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation in Education</h3>
                    <p className="text-base text-gray-600 mb-4">
                      Introduced digital storytelling and media production programs, preparing youth for modern careers.
                    </p>
                    <div className="text-sm text-blue-600 font-semibold">2023 Innovation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Real stories of transformation and hope from our program participants.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah's Journey</h4>
                  <p className="text-sm text-gray-600">Refugee Teens Talk</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "Through the program, I found my voice and now help other girls in my community understand their rights and health."
              </p>
              <div className="text-xs text-blue-600 font-medium">Age 18 • 2 years in program</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">David's Story</h4>
                  <p className="text-sm text-gray-600">Kakuma Theatre</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "Theatre gave me confidence and a way to express my experiences. I'm now a youth leader in my community."
              </p>
              <div className="text-xs text-blue-600 font-medium">Age 20 • 3 years in program</div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <FontAwesomeIcon icon={faHeart} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Amina's Success</h4>
                  <p className="text-sm text-gray-600">Media Production</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "I learned to tell stories through video and now teach others. This skill has opened new opportunities for me."
              </p>
              <div className="text-xs text-blue-600 font-medium">Age 19 • 1.5 years in program</div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Community Transformation</h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Our work extends beyond individual youth to create lasting positive change in entire communities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-white">Social Impact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Reduced Gender-Based Violence</h4>
                    <p className="text-blue-100">40% decrease in reported incidents through education and awareness programs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Improved Health Awareness</h4>
                    <p className="text-blue-100">85% of youth now have access to reproductive health information</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Enhanced Community Cohesion</h4>
                    <p className="text-blue-100">Cross-cultural understanding and collaboration among different refugee groups</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6 text-white">Economic Impact</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Skill Development</h4>
                    <p className="text-blue-100">200+ youth trained in marketable skills like media production and arts</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Income Generation</h4>
                    <p className="text-blue-100">30% of program graduates now earn income from their creative skills</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm mt-1">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Local Economy</h4>
                    <p className="text-blue-100">Supporting local businesses through program purchases and partnerships</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Be Part of Our Impact
          </h2>
          <p className="text-lg text-white mb-6 max-w-3xl mx-auto">
            Join us in creating more success stories and expanding our positive impact on refugee communities.
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

export default Impact;
