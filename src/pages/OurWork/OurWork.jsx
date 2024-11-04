import React from 'react';
import './OurWork.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';

const OurWork = () => {
  return (
    <div className="our-work">
      <ScrollAnimation>
        <h1>Our Work</h1>
        <p className="work-intro">
          Through creativity and innovation, we empower young refugees to tell their stories 
          and develop valuable skills for their future.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="work-areas">
          <div className="work-area">
            <h2>Creative Expression</h2>
            <p>We provide platforms for artistic expression through theater, visual arts, and digital media.</p>
          </div>
          <div className="work-area">
            <h2>Skills Development</h2>
            <p>Our workshops and training programs equip youth with practical skills in media production and arts.</p>
          </div>
          <div className="work-area">
            <h2>Community Impact</h2>
            <p>We address social issues through awareness campaigns and community engagement initiatives.</p>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
};

export default OurWork; 