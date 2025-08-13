import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    // Check if already logged in
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    }
  }, [isLoggedIn, navigate]);

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
      // Try admin login first
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        login('admin123');
        toast.success('Admin login successful! Welcome to the admin panel.');
        navigate('/admin/dashboard');
        return;
      }

      // If not admin, try user login
      try {
        const userResponse = await axios.post('http://localhost:5000/api/users/login', credentials);
        
        if (userResponse.data.message === 'Login successful') {
          // Store user data in localStorage
          localStorage.setItem('userData', JSON.stringify(userResponse.data.user));
          localStorage.setItem('userToken', 'user_logged_in');
          localStorage.setItem('isLoggedIn', 'true');
          
          toast.success('Login successful!');
          
                     // Redirect based on user role
           if (userResponse.data.user.role === 'admin') {
             navigate('/admin/dashboard');
           } else if (userResponse.data.user.role === 'manager') {
             navigate('/manager/dashboard');
           } else if (userResponse.data.user.role === 'editor') {
             navigate('/editor/dashboard');
           } else {
             navigate('/'); // Regular users go to home page for now
           }
          return;
        }
      } catch (userError) {
        console.error('User login failed:', userError);
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="text-left">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-100 hover:text-white transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center mb-6">
            <img src="/logo.jpg" alt="Story Matters Entertainment" className="h-16 w-auto rounded-full" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-blue-100 text-lg">
            Sign in to access your account (Admin or User)
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
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-100 text-sm">
            © 2024 Story Matters Entertainment. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
