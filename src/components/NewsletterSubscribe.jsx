import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import './NewsletterSubscribe.css';

const NewsletterSubscribe = ({ source }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: serverTimestamp(),
        source: source || 'general'
      });

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="newsletter-section">
      <div className="newsletter-content">
        <h3>Stay Connected</h3>
        <p>Subscribe to our newsletter for the latest updates and stories.</p>
        
        <form onSubmit={handleSubscribe} className="subscribe-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button 
            type="submit"
            disabled={status === 'loading'}
            className={status}
          >
            {status === 'loading' ? 'Subscribing...' : 
             status === 'success' ? 'Subscribed!' : 
             status === 'error' ? 'Try Again' : 
             'Subscribe'}
          </button>
        </form>
        
        {status === 'success' && (
          <p className="success-message">
            Thank you for subscribing!
          </p>
        )}
        {status === 'error' && (
          <p className="error-message">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsletterSubscribe; 