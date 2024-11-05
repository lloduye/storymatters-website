import React from 'react';
import { Link } from 'react-router-dom';
import Slideshow from '../../components/Slideshow/Slideshow';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Story Matters Entertainment</h1>
          <p className="tagline">Transforming Lives Through Storytelling</p>
          <p className="description">
            We are a community-based organization in Kakuma Refugee Camp, dedicated to 
            empowering youth through creative expression and media arts. Our programs 
            create opportunities for learning, growth, and positive change.
          </p>
          <div className="cta-buttons">
            <Link to="/programs" className="cta-button primary">Our Programs</Link>
            <Link to="/get-involved" className="cta-button secondary">Get Involved</Link>
          </div>
        </div>
        <div className="slideshow-container">
          <Slideshow />
        </div>
      </div>
      {/* Rest of your home page content */}
    </div>
  );
};

export default Home;