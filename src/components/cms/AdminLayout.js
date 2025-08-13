import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faNewspaper, 
  faDollarSign, 
  faGlobe, 
  faChartLine, 
  faUsers, 
  faCog, 
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user role from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userRole = userData.role || 'admin';

  // Role-based navigation
  const getNavigation = () => {
    if (userRole === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: faTachometerAlt },
        { name: 'Stories', href: '/admin/stories', icon: faNewspaper },
        { name: 'Donations', href: '/admin/donations', icon: faDollarSign },
        { name: 'Content', href: '/admin/content', icon: faGlobe },
        { name: 'Analytics', href: '/admin/analytics', icon: faChartLine },
        { name: 'Users', href: '/admin/users', icon: faUsers },
        { name: 'Settings', href: '/admin/settings', icon: faCog },
      ];
    } else if (userRole === 'manager') {
      return [
        { name: 'Dashboard', href: '/manager/dashboard', icon: faTachometerAlt },
        { name: 'Stories', href: '/admin/stories', icon: faNewspaper },
        { name: 'Donations', href: '/admin/donations', icon: faDollarSign },
        { name: 'Analytics', href: '/admin/analytics', icon: faChartLine },
      ];
    } else if (userRole === 'editor') {
      return [
        { name: 'Dashboard', href: '/editor/dashboard', icon: faTachometerAlt },
        { name: 'Stories', href: '/admin/stories', icon: faNewspaper },
      ];
    }
    return [];
  };

  const navigation = getNavigation();

  const isActive = (href) => {
    if (href === '/admin/dashboard' || href === '/manager/dashboard' || href === '/editor/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
             {/* Professional Navigation Bar - Matching Main Website */}
       <nav className="bg-white shadow-lg sticky top-0 z-50">
         <div className="w-full px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-20">
             {/* Logo and Brand */}
             <div className="flex items-center">
               <Link to={userRole === 'admin' ? '/admin/dashboard' : userRole === 'manager' ? '/manager/dashboard' : '/editor/dashboard'} className="flex items-center hover:opacity-80 transition-opacity duration-200">
                 <img 
                   src="/logo.jpg" 
                   alt="Story Matters Entertainment" 
                   className="h-14 w-auto"
                 />
                 <span className="ml-4 text-xl font-semibold text-gray-900">
                   {userRole === 'admin' ? 'Admin Panel' : userRole === 'manager' ? 'Manager Panel' : 'Editor Panel'}
                 </span>
               </Link>
             </div>

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
                   {item.name}
                   <span className={`absolute bottom-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                     isActive(item.href) ? 'w-auto' : 'w-0 group-hover:w-auto'
                   }`}></span>
                 </Link>
               ))}
             </div>

                         {/* Right Side - User Menu Only */}
             <div className="flex items-center space-x-4">
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
                     <span className="text-white font-semibold text-xs">A</span>
                   </div>
                   <span className="hidden sm:block text-sm font-medium">Admin</span>
                   <FontAwesomeIcon icon={faChevronDown} className="text-xs text-gray-400" />
                 </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-500">admin@storymatters.org</p>
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
                   {item.name}
                 </Link>
               ))}
             </div>
           </div>
         )}
      </nav>

      

      {/* Main content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
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

export default AdminLayout;
