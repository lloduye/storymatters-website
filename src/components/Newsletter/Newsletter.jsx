import React from 'react';
import './Newsletter.css';
import ScrollAnimation from '../ScrollAnimation/ScrollAnimation';

const Newsletter = () => {
  return (
    <ScrollAnimation>
      <div className="newsletter-section">
        <h2>Stay Connected</h2>
        <p>Join our community and receive updates about our impact and initiatives.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </ScrollAnimation>
  );
};

export default Newsletter; 