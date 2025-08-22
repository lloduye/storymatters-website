import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faEnvelope,
  faPlus,
  faNewspaper,
  faBookOpen,
  faDraftingCompass
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const EditorLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Editor-specific navigation with essential tools
  const navigation = [
    { name: 'Dashboard', href: '/editor/dashboard', icon: faTachometerAlt },
    { name: 'Create Story', href: '/editor/stories/new', icon: faPlus },
    { name: 'My Stories', href: '/editor/stories', icon: faNewspaper },
    { name: 'Content Library', href: '/editor/library', icon: faBookOpen },
    { name: 'Drafts', href: '/editor/drafts', icon: faDraftingCompass },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Navigation Bar - Editor Specific */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/editor/dashboard" className="flex items-center hover:opacity-80 transition-opacity duration-200">
                <img 
                  src="/logo.jpg" 
                  alt="Story Matters Entertainment" 
                  className="h-14 w-auto"
                />
                <span className="ml-4 text-xl font-semibold text-gray-900">
                  Editor Panel
                </span>
              </Link>
            </div>

            {/* Right Side - Navigation and Tools */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-4 py-3 text-base font-medium transition-all duration-300 group ${
                      isActive(item.href)
                        ? 'text-blue-600' 
                        : 'text-gray-700 hover:text-blue-600 hover:scale-105'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2 text-sm" />
                    {item.name}
                    <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                      isActive(item.href) ? 'w-auto' : 'w-0 group-hover:w-auto'
                    }`}></span>
                  </Link>
                ))}
              </div>

              {/* Mailbox - Zoho Mail */}
              <a
                href="https://mail.zoho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
                title="Check Zoho Mail"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-base" />
                <span className="hidden sm:block text-sm font-medium">Mail</span>
              </a>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'E'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.fullName || 'Editor'}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} className="text-xs text-gray-400" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.fullName || 'Editor'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'Role: Editor'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700 hover:text-blue-600 p-3 rounded-md transition-colors duration-200"
              >
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 text-base font-medium rounded-md transition-all duration-200 ${
                    isActive(item.href) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3 text-sm" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/editor/dashboard"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTachometerAlt} className="mr-2 text-blue-600" />
                  Dashboard
                </Link>
              </li>
              {location.pathname !== '/editor/dashboard' && (
                <>
                  <li>
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 rotate-[-90deg] mx-2" />
                    </div>
                  </li>
                  <li className="inline-flex items-center">
                    <span className="text-sm font-medium text-gray-500 capitalize">
                      {location.pathname.split('/').pop().replace(/-/g, ' ')}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
        
        {children}
      </main>

      {/* Click outside to close dropdowns */}
      {(userDropdownOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setUserDropdownOpen(false);
            setMobileMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default EditorLayout;
