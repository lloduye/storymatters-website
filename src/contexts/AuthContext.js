import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = () => {
      const token = localStorage.getItem('adminToken');
      const loginStatus = localStorage.getItem('isLoggedIn');
      const userData = localStorage.getItem('userData');
      
      console.log('AuthContext.checkAuthStatus:', { 
        token: !!token, 
        loginStatus, 
        userData: !!userData,
        userDataContent: userData ? JSON.parse(userData) : null
      });
      
      const isAuthenticated = !!(token && loginStatus === 'true');
      console.log('Setting isLoggedIn to:', isAuthenticated);
      setIsLoggedIn(isAuthenticated);
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Setting user data:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      } else {
        console.log('No user data in localStorage');
        setUser(null);
      }
      
      setIsLoading(false);
      console.log('AuthContext initialization complete. Final state:', {
        isLoggedIn: isAuthenticated,
        user: userData ? JSON.parse(userData) : null,
        isLoading: false
      });
    };

    checkAuthStatus();
  }, []);

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

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    isLoading,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
