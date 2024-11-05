import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';

const Home = () => {
  const objectives = [
    {
      title: "Educate and Promote Talent",
      description: "We engage youth through art, community theater, and online training to help them develop their skills.",
      image: "Education+and+Talent",
      stats: {
        workshops: "24+",
        participants: "200+",
        programs: "5"
      }
    },
    {
      title: "Positive Representation",
      description: "We showcase stories and talents of young refugees through social media.",
      image: "Positive+Representation",
      stats: {
        stories: "100+",
        reach: "10K+",
        platforms: "4"
      }
    },
    {
      title: "Foster Peaceful Coexistence",
      description: "We promote harmony between diverse nationalities within the camp.",
      image: "Community+Harmony",
      stats: {
        communities: "12",
        events: "30+",
        impact: "1000+"
      }
    }
  ];

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="home">
      <HeroBanner 
        title="Empowering Youth Through Creativity"
        subtitle="in Kakuma Refugee Camp"
        ctaText="Support Our Mission"
        ctaLink="/donate"
        backgroundImage="https://placehold.co/1920x1080/4A90E2/FFFFFF/png?text=Story+Matters+Entertainment"
      />
      
      <div className="content-wrapper">
        <ScrollAnimation>
          <section className="intro-section">
            <div className="intro-content">
              <h2>Welcome to Story Matters Entertainment</h2>
              <p>A Community-Based Organization founded by young refugees in Kakuma Refugee Camp, Kenya. 
                 Established in 2019 and officially launched in 2020, our mission is to empower and showcase 
                 the incredible talents of youth in our community.</p>
              <Link 
                to="/about-us" 
                className="learn-more-btn"
                onClick={scrollToTop}
              >
                Learn More About Us →
              </Link>
            </div>
            <div className="intro-image">
              <ImagePlaceholder 
                width={600} 
                height={400} 
                text="Empowering+Youth+Through+Creativity"
              />
            </div>
          </section>
        </ScrollAnimation>

        <ScrollAnimation>
          <section className="objectives-section">
            <h2>Our Objectives</h2>
            <p className="section-intro">
              We are committed to making a positive impact through arts, education, and awareness.
            </p>
            <div className="objectives-grid">
              {objectives.map((objective, index) => (
                <div key={index} className="objective-card">
                  <div className="objective-image">
                    <ImagePlaceholder 
                      width={400} 
                      height={250} 
                      text={objective.image}
                    />
                  </div>
                  <div className="objective-content">
                    <h3>{objective.title}</h3>
                    <p>{objective.description}</p>
                    <div className="objective-stats">
                      {Object.entries(objective.stats).map(([key, value]) => (
                        <div key={key} className="stat-item">
                          <span className="stat-value">{value}</span>
                          <span className="stat-label">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Home;