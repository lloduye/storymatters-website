import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandshake, faHeart, faGraduationCap, faUsers, 
  faCalendarAlt, faMapMarkerAlt, faEnvelope, faPhone 
} from '@fortawesome/free-solid-svg-icons';

const GetInvolved = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Get Involved
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white">
            Join us in empowering youth and creating positive change in our community. 
            There are many ways you can support our mission.
          </p>
        </div>
      </section>

      {/* Ways to Get Involved */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FontAwesomeIcon icon={faHandshake} />
              <span>Get Involved</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Make a Difference
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Whether you have time, skills, or resources to share, there's a perfect way for you to contribute to our mission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mb-6 mx-auto">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Volunteer</h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                Share your time and skills to directly impact youth development and community growth.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Teaching and mentoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Event organization</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Administrative support</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mb-6 mx-auto">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Donate</h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                Financial contributions help us expand programs and reach more youth in need.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">One-time donations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Monthly sponsorships</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Program-specific funding</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mb-6 mx-auto">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Partner</h3>
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                Collaborate with us to create innovative programs and expand our impact.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Educational institutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">NGOs and foundations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">Corporate partners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Volunteer Opportunities</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Find the perfect volunteer role that matches your skills and interests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Teaching & Mentoring</h3>
                <p className="text-gray-600 mb-4">
                  Share your knowledge and experience with youth in various subjects including arts, 
                  media production, and life skills.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Flexible schedule
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Kakuma Camp
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Event Coordination</h3>
                <p className="text-gray-600 mb-4">
                  Help organize workshops, performances, and community events that bring people together.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Event-based
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Various locations
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Media & Arts Support</h3>
                <p className="text-gray-600 mb-4">
                  Assist with photography, videography, and art workshops using your creative skills.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Weekly commitment
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Studio space
                  </span>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Administrative Support</h3>
                <p className="text-gray-600 mb-4">
                  Help with office tasks, data entry, and program coordination to keep operations running smoothly.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    Regular hours
                  </span>
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    Main office
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact of Involvement */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Impact</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              See how your involvement creates real change in the lives of refugee youth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Impact</h3>
              <p className="text-gray-600">
                Work directly with youth, see their growth, and build meaningful relationships.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Building</h3>
              <p className="text-gray-600">
                Help create stronger, more resilient communities through education and support.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                <FontAwesomeIcon icon={faGraduationCap} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skill Development</h3>
              <p className="text-gray-600">
                Gain valuable experience in community development and youth work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white mb-6 max-w-3xl mx-auto">
            Contact us to learn more about volunteer opportunities, partnership possibilities, 
            or how to make a donation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Email</h4>
                <p className="text-blue-100 text-sm">
                  <a href="mailto:info@storymattersentertainment.org" className="hover:text-white transition-colors duration-200">
                    info@storymattersentertainment.org
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Phone</h4>
                <p className="text-blue-100 text-sm">
                  <a href="tel:+254748586185" className="hover:text-white transition-colors duration-200">
                    +254 748 586185
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Us
            </Link>
            <Link to="/about" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
