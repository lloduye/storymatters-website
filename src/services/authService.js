import axios from 'axios';

class AuthService {
  static async login(email, password) {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  static async register(userData) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  static async logout() {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async getProfile() {
    try {
      const response = await axios.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }
}

export default AuthService; 