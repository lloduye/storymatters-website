import React from 'react';
import '../ProgramPage.css';
import ScrollAnimation from '../../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../../components/ImagePlaceholder/ImagePlaceholder';
import Newsletter from '../../../components/Newsletter/Newsletter';

const RefugeeTeensTalk = () => {
  const stats = {
    beneficiaries: "200+",
    workshops: "24",
    communities: "12"
  };

  const objectives = [
    "Empower teenage girls and mothers through education",
    "Provide sexual reproductive health education",
    "Address gender-based violence issues",
    "Improve hygiene awareness",
    "Provide access to sanitary supplies",
    "Support education through stationery provision"
  ];

  const impacts = [
    {
      title: "Education Support",
      description: "Providing stationery and resources to reduce school dropout rates",
      image: "Education+Support"
    },
    {
      title: "Health & Hygiene",
      description: "Distribution of sanitary supplies and hygiene education",
      image: "Health+Hygiene"
    },
    {
      title: "Community Awareness",
      description: "Training and workshops on gender-based violence prevention",
      image: "Community+Awareness"
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
          <h2>About the Program</h2>
          <p>
            Our project seeks to help teenage girls and mothers change their lives by empowering 
            and educating them on sexual reproductive health, gender-based violence, hygiene and 
            providing them with sanitary towels and stationeries. Our objective is to ensure they 
            realize their potential and achieve their dreams which is a long lasting positive 
            impact on the community.
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
                  text={impact.image}
                />
                <h3>{impact.title}</h3>
                <p>{impact.description}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="program-sustainability">
          <h2>Sustainability</h2>
          <p>
            To ensure the longevity of positive outcomes, we have developed a sustainable plan. 
            This includes community engagement strategies, capacity building, and income-generating 
            initiatives that empower the community to take ownership of the program.
          </p>
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

      <Newsletter />
    </div>
  );
};

export default RefugeeTeensTalk; 