import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Mobile: Compact single column, Desktop: Full 4-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Company Info - Always visible */}
          <div className="space-y-2 lg:space-y-3">
            <h3 className="text-base lg:text-lg font-bold text-white">Story Matters Entertainment</h3>
            <p className="text-blue-200 font-medium text-xs lg:text-sm">Transforming Lives Through Storytelling</p>
            {/* Hide description on mobile to save space */}
            <p className="text-gray-300 text-xs leading-relaxed hidden lg:block">
              Empowering youth in Kakuma Refugee Camp through creativity, innovation, and community impact.
            </p>
          </div>
          
          {/* Quick Links - Always visible but compact on mobile */}
          <div className="space-y-2 lg:space-y-3">
            <h4 className="text-sm lg:text-base font-semibold text-white">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-xs lg:text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-xs lg:text-sm">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-xs lg:text-sm">Programs</Link></li>
              <li><Link to="/get-involved" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-xs lg:text-sm">Get Involved</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-xs lg:text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Our Programs - Hide on mobile to save space */}
          <div className="space-y-2 lg:space-y-3 hidden lg:block">
            <h4 className="text-base font-semibold text-white">Our Programs</h4>
            <ul className="space-y-1">
              <li className="text-gray-300 text-sm">Refugee Teens Talk</li>
              <li className="text-gray-300 text-sm">Kakuma Theatre</li>
              <li className="text-gray-300 text-sm">Media Production</li>
              <li className="text-gray-300 text-sm">Art & Craft Initiatives</li>
            </ul>
          </div>
          
          {/* Contact Info & Social - Always visible but compact */}
          <div className="space-y-2 lg:space-y-3">
            <h4 className="text-sm lg:text-base font-semibold text-white">Contact Info</h4>
            <div className="space-y-1 text-xs text-gray-300">
              <p>📧 <a href="mailto:info@storymattersentertainment.org" className="hover:text-blue-300 transition-colors duration-200">info@storymattersentertainment.org</a></p>
              <p>📞 <a href="tel:+254748586185" className="hover:text-blue-300 transition-colors duration-200">+254 748 586185</a></p>
              {/* Hide location on mobile to save space */}
              <p className="hidden lg:block">📍 Kakuma Refugee Camp, Turkana County, Kenya</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm lg:text-base font-semibold text-white">Follow Us</h4>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/storymattersentertainment" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faFacebook} className="text-base lg:text-lg" />
                </a>
                <a 
                  href="https://twitter.com/storymattersent" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Twitter" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTwitter} className="text-base lg:text-lg" />
                </a>
                <a 
                  href="https://instagram.com/storymattersentertainment" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faInstagram} className="text-base lg:text-lg" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer bottom - Compact on mobile */}
        <div className="border-t border-gray-700 mt-4 lg:mt-8 pt-4 lg:pt-6 text-center space-y-1">
          <p className="text-gray-300 text-xs lg:text-sm">&copy; 2024 Story Matters Entertainment. All rights reserved.</p>
          {/* Hide tagline on mobile to save space */}
          <p className="text-gray-400 text-xs hidden lg:block">Empowering youth through storytelling and creative expression.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
