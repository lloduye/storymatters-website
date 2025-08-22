import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faNewspaper, 
  faDollarSign, 
  faChartLine, 
  faUsers, 
  faSignOutAlt,
  faBars,
  faTimes,
  faChevronDown,
  faEnvelope,
  faFileAlt,
  faShieldAlt,
  faDatabase,
  faClipboardList,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, resetActivity } = useAuth();

  // Get user role from localStorage with proper error handling
  const [userRole, setUserRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserRole = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          console.log('AdminLayout: User data loaded:', parsed);
          setUserRole(parsed.role || 'admin');
          setUserData(parsed);
        } else {
          console.log('AdminLayout: No user data found, defaulting to admin');
          setUserRole('admin');
          setUserData(null);
        }
      } catch (error) {
        console.error('AdminLayout: Error parsing user data:', error);
        setUserRole('admin');
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUserRole();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'userData') {
        getUserRole();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Listen for inactivity warnings
  useEffect(() => {
    const handleInactivityWarning = () => {
      setShowInactivityWarning(true);
    };

    const handleActivity = () => {
      setShowInactivityWarning(false);
      resetActivity();
    };

    // Listen for custom events from AuthContext
    window.addEventListener('inactivity-warning', handleInactivityWarning);
    window.addEventListener('user-activity', handleActivity);

    return () => {
      window.removeEventListener('inactivity-warning', handleInactivityWarning);
      window.removeEventListener('user-activity', handleActivity);
    };
  }, [resetActivity]);

  // STRICT ROLE VALIDATION - NO CROSSING BETWEEN PANELS
  if (!isLoading && userRole !== 'admin' && userRole !== 'manager') {
    console.error('AdminLayout: Unauthorized access attempt. User role:', userRole);
    logout();
    navigate('/login');
    return null;
  }

  // Show loading state while determining user role
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-based navigation
  const getNavigation = () => {
    if (userRole === 'admin') {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: faTachometerAlt },
        { name: 'Stories', href: '/admin/stories', icon: faNewspaper },
        { name: 'Donations', href: '/admin/donations', icon: faDollarSign },
        { name: 'Analytics', href: '/admin/analytics', icon: faChartLine },
        { name: 'Users', href: '/admin/users', icon: faUsers },
        { name: 'Reports', href: '/admin/reports', icon: faFileAlt },
        { name: 'System Health', href: '/admin/system-health', icon: faShieldAlt },
        { name: 'Backup', href: '/admin/backup', icon: faDatabase },
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: faClipboardList },
        { name: 'Alerts', href: '/admin/alerts', icon: faExclamationTriangle },
      ];
    } else if (userRole === 'manager') {
      return [
        { name: 'Dashboard', href: '/manager/dashboard', icon: faTachometerAlt },
        { name: 'Stories', href: '/admin/stories', icon: faNewspaper },
        { name: 'Donations', href: '/admin/donations', icon: faDollarSign },
        { name: 'Analytics', href: '/admin/analytics', icon: faChartLine },
        { name: 'Reports', href: '/admin/reports', icon: faFileAlt },
      ];
    }
    return [];
  };

  const navigation = getNavigation();

  const isActive = (href) => {
    if (href === '/admin/dashboard' || href === '/manager/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Inactivity Warning Banner */}
      {showInactivityWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-3 text-center font-medium shadow-lg">
          <div className="flex items-center justify-center space-x-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="animate-pulse" />
            <span>You will be logged out in 30 seconds due to inactivity. Click anywhere to stay logged in.</span>
          </div>
        </div>
      )}
      
      {/* Professional Navigation Bar - Matching Main Website */}
       <nav className="bg-white shadow-lg sticky top-0 z-50">
         <div className="w-full px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-20">
             {/* Logo and Brand */}
             <div className="flex items-center">
               <Link to={userRole === 'admin' ? '/admin/dashboard' : '/manager/dashboard'} className="flex items-center hover:opacity-80 transition-opacity duration-200">
                 <img 
                   src="/logo.jpg" 
                   alt="Story Matters Entertainment" 
                   className="h-14 w-auto"
                 />
                 <span className="ml-4 text-xl font-semibold text-gray-900">
                   {userRole === 'admin' ? 'Admin Panel' : 'Manager Panel'}
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
                                        <span className="text-white font-semibold text-xs">
                     {(userData?.fullName || userData?.full_name) ? (userData.fullName || userData.full_name).charAt(0).toUpperCase() : 'A'}
                   </span>
                 </div>
                 <span className="hidden sm:block text-sm font-medium">
                   {userData?.fullName || userData?.full_name || 'Admin'}
                 </span>
                   <FontAwesomeIcon icon={faChevronDown} className="text-xs text-gray-400" />
                 </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.fullName || userData?.full_name || 'Admin User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userData?.email || 'admin@storymatters.org'}
                      </p>
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
