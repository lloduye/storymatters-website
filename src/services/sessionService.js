import jwt_decode from 'jwt-decode';

class SessionService {
  static TOKEN_KEY = 'auth_token';
  static USER_KEY = 'user_data';
  static REFRESH_TOKEN_KEY = 'refresh_token';

  // Store session data
  static setSession(token, refreshToken, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Clear session data
  static clearSession() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Get current token
  static getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get refresh token
  static getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Get current user
  static getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  static isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  // Check if token needs refresh
  static needsRefresh() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      // Refresh if token will expire in less than 5 minutes
      return decoded.exp - currentTime < 300;
    } catch (error) {
      return true;
    }
  }

  // Update token
  static updateToken(newToken) {
    localStorage.setItem(this.TOKEN_KEY, newToken);
  }
}

export default SessionService; 