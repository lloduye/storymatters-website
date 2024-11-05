import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import SessionService from '../../services/sessionService';
import apiService from '../../services/apiService';

const SecureRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();

  if (!SessionService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const user = SessionService.getCurrentUser();
    if (user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if token needs refresh
  if (SessionService.needsRefresh()) {
    apiService.refreshToken().catch(() => {
      SessionService.clearSession();
      return <Navigate to="/login" state={{ from: location }} replace />;
    });
  }

  return children;
};

export default SecureRoute; 