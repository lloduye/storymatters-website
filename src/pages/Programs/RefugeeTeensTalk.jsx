import React from 'react';
import './ProgramPage.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';

const RefugeeTeensTalk = () => {
  const stats = {
    beneficiaries: "200+",
    workshops: "24",
    communities: "12"
  };

  const objectives = [
    "Empower teenage girls and mothers through education and support",
    "Provide sexual reproductive health education",
    "Address gender-based violence issues",
    "Improve hygiene awareness and access to sanitary supplies",
    "Support education through provision of stationery",
    "Create lasting positive impact in the community"
  ];

  const impacts = [
    {
      title: "Education Support",
      description: "Providing stationery and resources to reduce school dropout rates"
    },
    {
      title: "Health & Hygiene",
      description: "Distribution of sanitary supplies and hygiene education"
    },
    {
      title: "Community Awareness",
      description: "Training and workshops on gender-based violence prevention"
    }
  ];

  return (
    <div className="program-page">
      <div className="program-banner">
        <ImagePlaceholder 
          width={1920} 
          height={400} 
          text="Refugee+Teens+Talk"
          className="banner-image"
        />
        <h1>Refugee Teens Talk</h1>
      </div>

      <ScrollAnimation>
        <section className="program-intro">
          <h2>Empowering Young Lives</h2>
          <p>
            Refugee Teens Talk seeks to enhance community well-being through targeted initiatives 
            and collaborative efforts. We focus on empowering teenage girls and mothers through 
            education, support, and essential resources.
          </p>
          <div className="program-stats">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="stat-item">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{key}</span>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="program-objectives">
          <h2>Our Objectives</h2>
          <div className="objectives-list">
            {objectives.map((objective, index) => (
              <div key={index} className="objective-item">
                <div className="objective-marker"></div>
                <p>{objective}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="program-impact">
          <h2>Our Impact</h2>
          <div className="impact-grid">
            {impacts.map((impact, index) => (
              <div key={index} className="impact-card">
                <ImagePlaceholder 
                  width={400} 
                  height={250} 
                  text={impact.title}
                />
                <h3>{impact.title}</h3>
                <p>{impact.description}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="get-involved">
          <h2>Support This Program</h2>
          <p>Your contribution helps us continue making a difference in young lives.</p>
          <div className="cta-buttons">
            <a href="/donate" className="cta-button primary">Donate Now</a>
            <a href="/contact" className="cta-button secondary">Contact Us</a>
          </div>
        </section>
      </ScrollAnimation>
    </div>
  );
};

export default RefugeeTeensTalk; 