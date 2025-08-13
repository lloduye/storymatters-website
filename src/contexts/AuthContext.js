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

  useEffect(() => {
    // Check authentication status on mount
    const checkAuthStatus = () => {
      const token = localStorage.getItem('adminToken');
      const loginStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(!!(token && loginStatus === 'true'));
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
