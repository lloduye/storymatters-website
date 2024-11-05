import React from 'react';
import '../ProgramPage.css';
import ScrollAnimation from '../../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../../components/ImagePlaceholder/ImagePlaceholder';
import Newsletter from '../../../components/Newsletter/Newsletter';

const KakumaMediaProduction = () => {
  const stats = {
    trainees: "100+",
    projects: "45",
    events: "12"
  };

  const objectives = [
    "Train youth in photography and videography",
    "Provide social media and video editing training",
    "Organize community theatre outreach",
    "Address social issues through media",
    "Document community stories and events",
    "Create employment opportunities in media"
  ];

  const impacts = [
    {
      title: "Media Training",
      description: "Comprehensive training in photography, cinematography, and video editing",
      image: "Media+Training"
    },
    {
      title: "Community Theatre",
      description: "Engaging outreach programs addressing social issues through performance",
      image: "Community+Theatre"
    },
    {
      title: "Digital Skills",
      description: "Social media and content creation training for youth empowerment",
      image: "Digital+Skills"
    }
  ];

  return (
    <div className="program-page">
      <div className="program-banner">
        <ImagePlaceholder 
          width={1920} 
          height={400} 
          text="Kakuma+Media+Production"
          className="banner-image"
        />
        <h1>Kakuma Media Production</h1>
      </div>

      <ScrollAnimation>
        <section className="program-intro">
          <h2>About the Program</h2>
          <p>
            Kakuma Media Production aims to enhance community well-being through community 
            theatre outreach, photography, cinematography, videography, social media and 
            video editing. We help the community and change lives through empowering and 
            showcasing youth talent, with the objective to engage, educate and promote 
            youth's talents and make sustainable development in the community.
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
            To ensure the longevity of positive outcomes, we have devised a sustainability plan. 
            This includes community engagement strategies, capacity building, and income-generating 
            initiatives that empower the community to take ownership of the program. Through 
            regular monitoring and evaluation, we ensure transparency and optimize our impact.
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

export default KakumaMediaProduction; 