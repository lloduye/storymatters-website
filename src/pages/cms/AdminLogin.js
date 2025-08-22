import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Remove the useEffect that was causing conflicts
  // useEffect(() => {
  //   // Only redirect if user is already logged in and we have their data
  //   const userData = localStorage.getItem('userData');
  //   const token = localStorage.getItem('adminToken');
  //   
  //   if (isLoggedIn && userData && token) {
  //     try {
  //       const user = JSON.parse(userData);
  //       if (user.role === 'editor') {
  //         navigate('/editor/dashboard');
  //       } else {
  //         navigate('/admin/dashboard');
  //       }
  //     } catch (error) {
  //       console.error('Error parsing user data:', error);
  //       // Don't redirect, let the user stay on login page
  //     }
  //   }
  // }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/users/login', credentials);

      if (response.data.user) {
        console.log('Login response user data:', response.data.user);
        console.log('Full login response:', response.data);
        
        // Store user data and token from backend response
        const token = response.data.token;
        console.log('Received token from backend:', token);
        
        if (!token) {
          toast.error('Login failed: No token received from server');
          return;
        }
        
        // Store token directly in localStorage first
        localStorage.setItem('adminToken', token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        // Then call login function
        login(token, response.data.user);
        toast.success('Login successful!');
        
        // Wait for AuthContext to fully update before navigation
        setTimeout(() => {
          // Double-check the stored user data
          const storedUserData = localStorage.getItem('userData');
          const storedToken = localStorage.getItem('adminToken');
          const storedLoginStatus = localStorage.getItem('isLoggedIn');
          
          console.log('Login timeout - checking stored data:', {
            userData: storedUserData,
            token: storedToken,
            loginStatus: storedLoginStatus
          });
          
          if (storedUserData) {
            const user = JSON.parse(storedUserData);
            console.log('Stored user data before navigation:', user);
            
            // Navigate based on user role
            if (user.role === 'editor') {
              console.log('User is editor, navigating to editor dashboard');
              navigate('/editor/dashboard');
            } else {
              console.log('User is admin, navigating to admin dashboard');
              navigate('/admin/dashboard');
            }
          } else {
            console.error('No user data found in localStorage');
            toast.error('Login error: User data not found');
          }
        }, 200); // Increased delay to ensure state is fully updated
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faLock} className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Story Matters CMS
          </h2>
          <p className="text-blue-100">
            Sign in to manage your stories
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon 
                    icon={showPassword ? faEyeSlash : faEye} 
                    className="text-gray-400 hover:text-gray-600" 
                  />
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-100 text-sm">
            © 2024 Story Matters. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
