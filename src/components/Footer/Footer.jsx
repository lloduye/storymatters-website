import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const quickLinksColumn1 = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Our Work', path: '/our-work' },
    { name: 'Programs', path: '/programs' }
  ];

  const quickLinksColumn2 = [
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'News & Impact', path: '/news' },
    { name: 'Support Us', path: '/donate' }
  ];

  const socialLinksColumn1 = [
    { name: 'Facebook', url: '#' },
    { name: 'Twitter', url: '#' }
  ];

  const socialLinksColumn2 = [
    { name: 'Instagram', url: '#' },
    { name: 'LinkedIn', url: '#' }
  ];

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
          <div className="quick-links-grid">
            <ul>
              {quickLinksColumn1.map((link, index) => (
                <li key={index}><Link to={link.path}>{link.name}</Link></li>
              ))}
            </ul>
            <ul>
              {quickLinksColumn2.map((link, index) => (
                <li key={index}><Link to={link.path}>{link.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="quick-links-grid">
            <ul>
              {socialLinksColumn1.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <ul>
              {socialLinksColumn2.map((link, index) => (
                <li key={index}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
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