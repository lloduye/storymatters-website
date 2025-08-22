import axios from 'axios';
import { useState, useEffect } from 'react';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// User service for real-time database operations
export const userService = {
  // Get fresh user data from database by token
  async getCurrentUser(token) {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  // Get user by ID from database
  async getUserById(userId, token) {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Get all users from database (admin only)
  async getAllUsers(token) {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  // Update user in database
  async updateUser(userId, userData, token) {
    try {
      if (!token) {
        throw new Error('No authentication token provided');
      }

      const response = await axios.put(`${API_BASE_URL}/api/users/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Check if user has specific permission
  async checkUserPermission(token, requiredPermission) {
    try {
      const user = await this.getCurrentUser(token);
      
      if (!user) {
        return false;
      }

      // Check role-based permissions
      switch (requiredPermission) {
        case 'create_story':
          return ['admin', 'editor', 'manager'].includes(user.role);
        case 'edit_story':
          return ['admin', 'editor', 'manager'].includes(user.role);
        case 'delete_story':
          return ['admin', 'manager'].includes(user.role);
        case 'publish_story':
          return ['admin', 'editor', 'manager'].includes(user.role);
        case 'manage_users':
          return ['admin'].includes(user.role);
        case 'view_analytics':
          return ['admin', 'manager'].includes(user.role);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking user permission:', error);
      return false;
    }
  },

    // Refresh user session with fresh data
  async refreshUserSession(token) {
    try {
      const freshUserData = await this.getCurrentUser(token);

      // Update localStorage with fresh data
      if (freshUserData) {
        // Ensure consistent naming: always use full_name from database
        const userDataForStorage = {
          ...freshUserData,
          fullName: freshUserData.full_name // Add fullName for frontend compatibility
        };
        localStorage.setItem('userData', JSON.stringify(userDataForStorage));
        return userDataForStorage;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing user session:', error);
      return null;
    }
  }
};

// Hook for real-time user data updates
export const useRealTimeUserData = (token, updateInterval = 1000) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let intervalId;

    const fetchUserData = async () => {
      try {
        const freshData = await userService.getCurrentUser(token);
        setUserData(freshData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchUserData();

    // Set up interval for real-time updates
    intervalId = setInterval(fetchUserData, updateInterval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, updateInterval]);

  return { userData, isLoading, error };
};
