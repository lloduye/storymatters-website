import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

class SocialAuthService {
  static async handleSocialLogin(provider, providerName) {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await fetch(`/api/auth/${providerName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Social login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        user: data.user,
        token: data.token
      };
    } catch (error) {
      console.error('Social login error:', error);
      throw error;
    }
  }

  static async loginWithGoogle() {
    return this.handleSocialLogin(googleProvider, 'google');
  }

  static async loginWithFacebook() {
    return this.handleSocialLogin(facebookProvider, 'facebook');
  }
}

export default SocialAuthService; 