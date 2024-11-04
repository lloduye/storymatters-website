import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Story Matters Entertainment is dedicated to creating meaningful content that makes a difference in people's lives.</p>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@storymatters.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Story Street, Creative City, ST 12345</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="">What We Do</a></li>
            <li><a href="">Where We Work</a></li>
            <li><a href="">About Us</a></li>
            <li><a href="">News & Updates</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="">Facebook</a>
            <a href="">Twitter</a>
            <a href="">Instagram</a>
            <a href="">LinkedIn</a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Story Matters Entertainment. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 