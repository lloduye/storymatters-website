import axios from 'axios';
import SessionService from './sessionService';
import tokenRefreshMiddleware from '../middleware/tokenRefreshMiddleware';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = SessionService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token refresh
    if (error.response?.status === 401) {
      return tokenRefreshMiddleware(error);
    }
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, refreshToken, user } = response.data;
    SessionService.setSession(token, refreshToken, user);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      SessionService.clearSession();
    }
  },

  refreshToken: async () => {
    const refreshToken = SessionService.getRefreshToken();
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { token } = response.data;
    SessionService.updateToken(token);
    return token;
  },

  // Protected endpoints
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.put('/user/change-password', data),

  // Add other API endpoints...
};

export default apiService; 