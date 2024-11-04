import React from 'react';
import './Home.css';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ObjectivesSection from '../../components/ObjectivesSection/ObjectivesSection';
import ProgramsHighlight from '../../components/ProgramsHighlight/ProgramsHighlight';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';

const Home = () => {
  return (
    <div className="home">
      <HeroBanner 
        title="Empowering Youth Through Creativity"
        subtitle="in Kakuma Refugee Camp"
        ctaText="Support Our Mission"
        ctaLink="/donate"
        backgroundImage="/images/hero/hero-banner.jpg"
      />
      
      <ScrollAnimation>
        <section className="intro-section">
          <h2>Welcome to Story Matters Entertainment</h2>
          <p>A Community-Based Organization founded by young refugees in Kakuma Refugee Camp, Kenya. 
             Established in 2019 and officially launched in 2020, our mission is to empower and showcase 
             the incredible talents of youth in our community.</p>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <ObjectivesSection />
      </ScrollAnimation>

      <ScrollAnimation>
        <ProgramsHighlight />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <section className="impact-section">
          <h2>Our Impact</h2>
          <div className="impact-grid">
            <ScrollAnimation animation="fade-right">
              <div className="impact-card">
                <h3>Talent Development</h3>
                <p>Showcasing youth talents through social media platforms</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-up">
              <div className="impact-card">
                <h3>Skill Building</h3>
                <p>Workshops and training sessions for skill enhancement</p>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation animation="fade-left">
              <div className="impact-card">
                <h3>Community Support</h3>
                <p>Providing essential supplies and educational materials</p>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
};

export default Home; 