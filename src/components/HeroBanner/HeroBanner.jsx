import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = ({ title, subtitle, ctaText, ctaLink, backgroundImage }) => {
  return (
    <div 
      className="hero-banner"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})` 
      }}
    >
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Link to={ctaLink} className="cta-button">{ctaText}</Link>
      </div>
    </div>
  );
};

export default HeroBanner; 