import SessionService from '../services/sessionService';
import axios from 'axios';

const tokenRefreshMiddleware = async (error) => {
  const originalRequest = error.config;

  // If error is not 401 or request has already been retried, reject
  if (error.response?.status !== 401 || originalRequest._retry) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    const refreshToken = SessionService.getRefreshToken();
    
    if (!refreshToken) {
      SessionService.clearSession();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Request new token
    const response = await axios.post('/api/auth/refresh-token', {
      refreshToken
    });

    const { token } = response.data;
    
    // Update session with new token
    SessionService.updateToken(token);
    
    // Update authorization header
    originalRequest.headers['Authorization'] = `Bearer ${token}`;
    
    // Retry original request
    return axios(originalRequest);
  } catch (refreshError) {
    // If refresh fails, clear session and redirect to login
    SessionService.clearSession();
    window.location.href = '/login';
    return Promise.reject(refreshError);
  }
};

export default tokenRefreshMiddleware; 