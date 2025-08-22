import React from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faHeart, faLightbulb, faHandshake, faMapMarkerAlt, faCalendarAlt, faGraduationCap, faPalette, faMicrophone, faTheaterMasks, faCamera, faStar } from '@fortawesome/free-solid-svg-icons';

const About = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Compact */}
      <section className="bg-blue-600 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            About Us
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-white mb-6">
            Transforming Lives Through Storytelling
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100 text-base">
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-lg" />
              <span>Kakuma Refugee Camp, Kenya</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-lg" />
              <span>Founded 2019</span>
            </div>
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUsers} className="text-lg" />
              <span>Youth-Led Organization</span>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are - Compact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                Who We Are
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Founded by Young Refugees, for Young Refugees
              </h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                Story Matters Entertainment is a community-based organization founded by young refugees in Kakuma Refugee Camp 
                (Turkana County, Kenya). We officially launched in 2020 after beginning as an informal youth-led arts initiative in 2019.
              </p>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                We empower youth through creative expression and media arts, proving that every story has the power to transform 
                lives and communities.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-1">Organization Type</h3>
                <p className="text-blue-800">Community-Based Organization (CBO)</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Youth-Led & Driven</h3>
                <p className="text-gray-600 mb-4">
                  Every program, decision, and initiative is co-designed and led by young people from the community.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-semibold text-gray-900 text-sm">Founded</p>
                    <p className="text-gray-600">2019</p>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <p className="font-semibold text-gray-900 text-sm">Official Launch</p>
                    <p className="text-gray-600">2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Compact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-base text-gray-600 leading-relaxed mb-4">
                To empower and showcase the talents of youth in our community through creativity, innovation, and the home-grown 
                potential of young people—making a positive impact through arts, education, and awareness.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs mt-0.5">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <p className="text-gray-600">Empower youth through creative expression</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs mt-0.5">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <p className="text-gray-600">Build skills and knowledge for the future</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs mt-0.5">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <p className="text-gray-600">Create positive community impact</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  A community where refugee youth lead change through creative arts, media, and education—serving as a model 
                  for youth-driven initiatives in refugee contexts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story & Approach - Combined */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Story & Approach</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              From grassroots movement to registered organization - the journey of young refugees creating change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <p className="text-base text-gray-600 leading-relaxed">
                Story Matters Entertainment grew from a grassroots movement of young refugees who saw the need for safe, 
                meaningful spaces for expression and skill-building. Early storytelling circles and art sessions in 2019 
                quickly drew youth from across Kakuma's diverse communities.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                In 2020, we formalized as a registered CBO to expand programs, build partnerships, and reach more young people. 
                What started as informal gatherings has grown into a comprehensive youth development organization.
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Where We Work</h3>
                <p className="text-blue-800">
                  Kakuma Refugee Camp is one of the world's largest refugee settlements, home to people from South Sudan, 
                  Somalia, DRC, Ethiopia, Burundi, and more.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Our Approach</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <p className="text-gray-700"><strong>Youth-Led:</strong> Young people co-design, lead, and evaluate programs.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <p className="text-gray-700"><strong>Strengths-Based:</strong> We nurture talents and potential.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <p className="text-gray-700"><strong>Community-Owned:</strong> Local solutions guide every decision.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mt-0.5 flex-shrink-0">
                    <FontAwesomeIcon icon={faPalette} />
                  </div>
                  <p className="text-gray-700"><strong>Creative Healing:</strong> Arts bridge cultures and support wellbeing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Programs - Combined */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Values */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faGraduationCap} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Education First</h3>
                    <p className="text-gray-600 text-sm">Empower through knowledge and skills</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Community Impact</h3>
                    <p className="text-gray-600 text-sm">Create positive, measurable change</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faPalette} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Creative Expression</h3>
                    <p className="text-gray-600 text-sm">Foster talent and artistic growth</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <FontAwesomeIcon icon={faHandshake} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Inclusivity & Respect</h3>
                    <p className="text-gray-600 text-sm">Celebrate diversity and every voice</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Programs Preview */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={faMicrophone} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Refugee Teens Talk</h3>
                    <p className="text-gray-600 text-sm">200+ beneficiaries reached</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={faTheaterMasks} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Kakuma Theatre</h3>
                    <p className="text-gray-600 text-sm">24 workshops conducted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Media Production</h3>
                    <p className="text-gray-600 text-sm">12 communities served</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organization Structure - Compact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How We're Organized</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              We operate with a flat, youth-centered structure that puts young people at the heart of decision-making.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mb-3 mx-auto">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Board of Directors</h3>
              <p className="text-gray-600">
                Community members, youth representatives, and local stakeholders provide strategic guidance.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mb-3 mx-auto">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Core Youth Leadership</h3>
              <p className="text-gray-600">
                Young people manage day-to-day operations and coordinate programs.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mb-3 mx-auto">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Program Teams</h3>
              <p className="text-gray-600">
                Specialized groups run initiatives while aligning to shared goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Recognition - White Background */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Impact & Recognition</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Since 2019, Story Matters Entertainment has become a leading youth development organization in Kakuma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-blue-600">Leading</div>
              <div className="text-gray-600">Youth Development Organization</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-blue-600">Recognized</div>
              <div className="text-gray-600">By Local Authorities & NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-1 text-blue-600">Model</div>
              <div className="text-gray-600">For Youth-Led Initiatives</div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our impact is seen in individual transformation, stronger community bonds, and sustainable systems for 
              youth development and creative expression.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action - Compact */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Join Our Mission
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Every story matters, and every young person has the power to create change. 
            Support our work in empowering refugee youth.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/get-involved" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Get Involved
            </Link>
            <Link to="/donate" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Make a Donation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
