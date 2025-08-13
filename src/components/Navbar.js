import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    // Close mobile menu if open
    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    // Close mobile menu if open
    setIsOpen(false);
  };

  const handleAdminAccess = () => {
    navigate('/admin/dashboard');
    // Close mobile menu if open
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0" onClick={closeMenu}>
            <img src="/logo.jpg" alt="Story Matters Entertainment" className="h-14 w-auto" />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link 
              to="/" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Home
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            <Link 
              to="/about" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/about') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Our Story
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/about') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            <Link 
              to="/programs" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/programs') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Programs
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/programs') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            <Link 
              to="/impact" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/impact') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Impact
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/impact') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            <Link 
              to="/get-involved" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/get-involved') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Get Involved
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/get-involved') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            <Link 
              to="/stories" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/stories') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Stories
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/stories') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            <Link 
              to="/contact" 
              className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                isActive('/contact') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600 hover:scale-105'
              }`}
              onClick={closeMenu}
            >
              Contact
              <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                isActive('/contact') ? 'w-auto' : 'w-0 group-hover:w-auto'
              }`}></span>
            </Link>
            
            <Link 
              to="/donate" 
              className={`bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                isActive('/donate') ? 'bg-blue-700' : ''
              }`}
              onClick={closeMenu}
            >
              Donate
            </Link>
            
            {/* Authentication Buttons - Far Right */}
            <div className="ml-8">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAdminAccess}
                    className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Admin Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 p-3 rounded-md transition-colors duration-200"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link 
                to="/" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/about') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Our Story
              </Link>
              <Link 
                to="/programs" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/programs') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Programs
              </Link>
              <Link 
                to="/impact" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/impact') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Impact
              </Link>
              <Link 
                to="/get-involved" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/get-involved') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Get Involved
              </Link>
              <Link 
                to="/stories" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/stories') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Stories
              </Link>
              <Link 
                to="/contact" 
                className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                  isActive('/contact') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={closeMenu}
              >
                Contact
              </Link>
              
              {/* Mobile Authentication Buttons */}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleAdminAccess}
                    className="block w-full text-left px-4 py-3 text-base font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Admin Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-base font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="block w-full text-left px-4 py-3 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </button>
              )}
              
              <Link 
                to="/donate" 
                className={`block px-4 py-3 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200`}
                onClick={closeMenu}
              >
                Donate
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
