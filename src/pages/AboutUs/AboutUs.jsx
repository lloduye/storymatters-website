import React from 'react';
import './AboutUs.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import Newsletter from '../../components/Newsletter/Newsletter';

// SVG icons as components
const EducationIcon = () => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="var(--primary)"/>
  </svg>
);

const CommunityIcon = () => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" fill="var(--primary)"/>
  </svg>
);

const CreativityIcon = () => (
  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3M12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19M12 15.5C14.33 15.5 16.3 14.07 17.11 12C16.3 9.93 14.33 8.5 12 8.5C9.67 8.5 7.7 9.93 6.89 12C7.7 14.07 9.67 15.5 12 15.5M12 13C11.45 13 11 12.55 11 12C11 11.45 11.45 11 12 11C12.55 11 13 11.45 13 12C13 12.55 12.55 13 12 13Z" fill="var(--primary)"/>
  </svg>
);

const AboutUs = () => {
  return (
    <div className="about-us">
      <div 
        className="about-banner"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
            url('https://placehold.co/1920x600/4A90E2/FFFFFF/png?text=About+Us')` 
        }}
      >
        <h1>About Us</h1>
      </div>

      <ScrollAnimation>
        <p className="about-intro">
          Story Matters Entertainment is a Community-Based Organization founded by young refugees 
          in Kakuma Refugee Camp, Kenya. Established in 2019 and officially launched in 2020, 
          our mission is to empower and showcase the incredible talents of youth in our community.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>We believe in the power of creativity, innovation, and the home-grown potential of young people, 
             and we are committed to making a positive impact through arts, education, and awareness.</p>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="objectives-section">
          <h2>Our Objectives</h2>
          <div className="objectives-grid">
            <div className="objective-card">
              <h3>Educate and Promote Talent</h3>
              <p>We engage youth through art, community theater, and online training to help them develop their skills.</p>
            </div>
            <div className="objective-card">
              <h3>Positive Representation</h3>
              <p>We use social media to share the stories and talents of young refugees, showcasing their initiatives and achievements.</p>
            </div>
            <div className="objective-card">
              <h3>Empowerment and Opportunities</h3>
              <p>We provide a platform for talented refugees to gain visibility and connect with potential sponsors and organizations.</p>
            </div>
            <div className="objective-card">
              <h3>Foster Peaceful Coexistence</h3>
              <p>We promote harmony between diverse nationalities within the camp and with the host community.</p>
            </div>
            <div className="objective-card">
              <h3>Community Awareness</h3>
              <p>We address important issues like drug abuse, teenage pregnancy, and gender-based violence through education and outreach.</p>
            </div>
            <div className="objective-card">
              <h3>Engaging Entertainment</h3>
              <p>We offer meaningful entertainment that resonates with the youth, fostering creativity and expression.</p>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="achievements-section">
          <h2>Our Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card">
              <h3>Talent Documentation</h3>
              <p>Successfully showcased the talents of youth through social media platforms.</p>
            </div>
            <div className="achievement-card">
              <h3>Skill Development</h3>
              <p>Conducted workshops to help youth enhance their skills and explore market opportunities.</p>
            </div>
            <div className="achievement-card">
              <h3>Community Support</h3>
              <p>Provided sanitary supplies, educational materials, and organized campaigns for gender awareness and substance abuse prevention.</p>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="values-section">
          <div className="value-card">
            <EducationIcon />
            <h3>Education First</h3>
            <p>Empowering through knowledge and skills development</p>
          </div>
          <div className="value-card">
            <CommunityIcon />
            <h3>Community Impact</h3>
            <p>Creating positive change in Kakuma Refugee Camp</p>
          </div>
          <div className="value-card">
            <CreativityIcon />
            <h3>Creative Expression</h3>
            <p>Fostering talent and artistic development</p>
          </div>
        </section>
      </ScrollAnimation>

      <Newsletter />
    </div>
  );
};

export default AboutUs;