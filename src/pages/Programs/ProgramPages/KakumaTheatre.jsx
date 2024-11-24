import React from 'react';
import '../ProgramPage.css';
import ScrollAnimation from '../../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../../components/ImagePlaceholder/ImagePlaceholder';
import Newsletter from '../../../components/Newsletter/Newsletter';

const KakumaTheatre = () => {
  const stats = {
    events: "15+",
    participants: "150+",
    performances: "30+",
    projects: "45"
  };

  const objectives = [
    "Train youth in photography and videography",
    "Provide social media and video editing training",
    "Address community issues through theatrical performances",
    "Showcase youth talent in drama and performing arts",
    "Promote cultural and modern performances",
    "Combat drug abuse through awareness",
    "Reduce crime through youth engagement",
    "Create sustainable theatre platforms",
    "Document community stories and events"
  ];

  const impacts = [
    {
      title: "Entertainment & Education",
      description: "Using theatre and performing arts to address social issues and educate the community",
      image: "Entertainment+Education"
    },
    {
      title: "Youth Development",
      description: "Training and showcasing young talent in drama, music, dance, photography and video editing",
      image: "Youth+Development"
    },
    {
      title: "Community Transformation",
      description: "Reducing crime and substance abuse through creative engagement while documenting community stories",
      image: "Community+Change"
    }
  ];

  return (
    <div className="program-page">
      <div className="program-banner">
        <ImagePlaceholder 
          width={1920} 
          height={400} 
          text="Kakuma+Theatre"
          className="banner-image"
        />
        <h1>Kakuma Theatre</h1>
      </div>

      <ScrollAnimation>
        <section className="program-intro">
          <h2>About the Program</h2>
          <p>
            Kakuma Theatre aims to enhance community well-being through dramatic performances, media production, 
            and other forms of creative expression. We address community issues and transform lives through 
            theatre, photography, and videography, showcasing youth talent via drama, music, cultural dance, 
            and modern performances. Our mission is to engage, educate, and promote youth talents while documenting 
            community stories and making the community free of vandalism and crimes.
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
            To ensure the longevity of positive outcomes, we have devised a sustainable plan. 
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

export default KakumaTheatre;