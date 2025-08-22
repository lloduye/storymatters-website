import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  // Remove unused lastActivity state variable

  // Function to refresh user data from database in real-time
  const refreshUserData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;

    try {
      const freshUserData = await userService.refreshUserSession(token);
      if (freshUserData) {
        setUser(freshUserData);
        return freshUserData;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  }, []);

  // Function to check if user has specific permission
  const checkPermission = useCallback(async (requiredPermission) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    try {
      return await userService.checkUserPermission(token, requiredPermission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  useEffect(() => {
    // Check authentication status on mount with real-time database fetch
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      const loginStatus = localStorage.getItem('isLoggedIn');
      
      console.log('AuthContext.checkAuthStatus:', { 
        token: !!token, 
        loginStatus
      });
      
      const isAuthenticated = !!(token && loginStatus === 'true');
      console.log('Setting isLoggedIn to:', isAuthenticated);
      setIsLoggedIn(isAuthenticated);
      
      if (isAuthenticated && token) {
        try {
          // Fetch fresh user data from database
          const freshUserData = await userService.getCurrentUser(token);
          console.log('Fresh user data from database:', freshUserData);
          setUser(freshUserData);
          
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(freshUserData));
        } catch (error) {
          console.error('Error fetching fresh user data:', error);
          // If we can't fetch fresh data, user might be invalid
          logout();
          return;
        }
      } else {
        console.log('No valid authentication');
        setUser(null);
      }
      
      setIsLoading(false);
      console.log('AuthContext initialization complete. Final state:', {
        isLoggedIn: isAuthenticated,
        user: isAuthenticated ? 'Fresh data loaded' : null,
        isLoading: false
      });
    };

    checkAuthStatus();
  }, [logout]);

  // Auto-logout after 5 minutes of inactivity
  useEffect(() => {
    if (!isLoggedIn) return;

    const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
    const WARNING_TIME = 4.5 * 60 * 1000; // 4.5 minutes - show warning 30 seconds before logout
    let inactivityTimer;
    let warningTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
      
      // Set warning timer (4.5 minutes)
      warningTimer = setTimeout(() => {
        toast.warning('You will be logged out in 30 seconds due to inactivity. Click anywhere to stay logged in.');
        // Dispatch custom event for layout components
        window.dispatchEvent(new CustomEvent('inactivity-warning'));
      }, WARNING_TIME);
      
      // Set logout timer (5 minutes)
      inactivityTimer = setTimeout(() => {
        console.log('User inactive for 5 minutes, logging out...');
        toast.error('You have been logged out due to inactivity.');
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    // Reset timer on user activity
    const handleUserActivity = () => {
      resetInactivityTimer();
      // Dispatch custom event for layout components
      window.dispatchEvent(new CustomEvent('user-activity'));
    };

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      if (warningTimer) {
        clearTimeout(warningTimer);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isLoggedIn, logout, refreshUserData, checkPermission]);

  // Real-time user data refresh every second
  useEffect(() => {
    if (!isLoggedIn) return;

    const refreshInterval = setInterval(async () => {
      await refreshUserData();
    }, 1000); // Refresh every second

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isLoggedIn, refreshUserData, logout]);

  const login = (token, userData = null) => {
    console.log('AuthContext.login called with:', { token, userData });
    
    // Ensure token is not null or undefined
    if (!token) {
      console.error('AuthContext.login: Token is null or undefined');
      return;
    }
    
    // Store authentication data
    localStorage.setItem('adminToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    
    if (userData) {
      const userDataString = JSON.stringify(userData);
      localStorage.setItem('userData', userDataString);
      console.log('User data stored in localStorage:', userDataString);
      setUser(userData);
      console.log('User data set in AuthContext state:', userData);
    } else {
      console.log('No user data provided to login function');
    }
    
    setIsLoggedIn(true);
    console.log('Login state updated in AuthContext. Final state:', {
      token: !!localStorage.getItem('adminToken'),
      isLoggedIn: localStorage.getItem('isLoggedIn'),
      userData: localStorage.getItem('userData'),
      stateUser: userData,
      stateIsLoggedIn: true
    });
  };

  const resetActivity = () => {
    // Function to manually reset activity - placeholder for future use
  };

  const value = {
    isLoggedIn,
    isLoading,
    user,
    login,
    logout,
    resetActivity,
    refreshUserData,
    checkPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
