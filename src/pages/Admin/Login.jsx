import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider 
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import './Admin.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode) => {
    console.log('Error code:', errorCode);
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled';
      case 'auth/operation-not-allowed':
        return 'Google sign in is not enabled. Please contact administrator.';
      case 'auth/cancelled-popup-request':
        return 'Sign in cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Sign in popup was blocked. Please allow popups for this site.';
      default:
        return `Authentication error: ${errorCode}`;
    }
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <h1>Admin Login</h1>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in with Email'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-auth">
          <button 
            onClick={handleGoogleLogin}
            className="social-button google"
          >
            <FaGoogle /> Google
          </button>
          <button 
            onClick={handleFacebookLogin}
            className="social-button facebook"
          >
            <FaFacebook /> Facebook
          </button>
          <button 
            onClick={handleGithubLogin}
            className="social-button github"
          >
            <FaGithub /> GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 