import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import bannerImage from '../../assets/Banner.JPG';

const Home = () => {
  return (
    <div className="home">
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          className="hero-content"
          style={{
            backgroundColor: 'transparent',
            padding: '20px',
            textAlign: 'left',
            maxWidth: '40%',
            position: 'absolute',
            top: '50%',
            left: '5%',
            transform: 'translateY(-50%)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '20px' }}>Story Matters Entertainment</h1>
          <p style={{ fontSize: '1.5rem', lineHeight: '1.6', marginBottom: '20px' }}>Transforming Lives Through Storytelling</p>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
            We are a community-based organization in Kakuma Refugee Camp, dedicated to 
            empowering youth through creative expression and media arts. Our programs 
            create opportunities for learning, growth, and positive change.
          </p>
          <div className="cta-buttons" style={{ display: 'flex', gap: '15px' }}>
            <Link to="/programs" className="btn btn-primary" style={{ backgroundColor: 'blue', color: 'white', borderRadius: '50px', padding: '15px 30px', fontSize: '1.2rem', border: 'none', transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'darkblue'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'blue'}
            >Our Programs</Link>
            <Link to="/get-involved" className="btn btn-secondary" style={{ backgroundColor: 'blue', color: 'white', borderRadius: '50px', padding: '15px 30px', fontSize: '1.2rem', border: 'none', transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'darkblue'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'blue'}
            >Get Involved</Link>
          </div>
        </div>
      </div>
      {/* Rest of your home page content */}
    </div>
  );
};

export default Home;