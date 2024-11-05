import React from 'react';
import './Programs.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import Timeline from '../../components/Timeline/Timeline';
import { Link } from 'react-router-dom';

const Programs = () => {
  const programs = [
    {
      title: "Refugee Teens Talk Program",
      description: "Empowering vulnerable teenage girls and mothers through workshops, support services, and awareness campaigns.",
      image: "https://placehold.co/800x600/4A90E2/FFFFFF/png?text=Refugee+Teens+Talk",
      link: "/programs/refugee-teens-talk"
    },
    {
      title: "Kakuma Laugh Industry",
      description: "A talent showcase platform promoting awareness of drug abuse and crime through creative expression.",
      image: "https://placehold.co/800x600/4A90E2/FFFFFF/png?text=Kakuma+Laugh+Industry",
      link: "/programs/laugh-industry"
    },
    {
      title: "Kakuma Media Production",
      description: "Training in photography and video editing, plus organizing events like the Miss Kakuma-Kalobeyei Beauty Pageant.",
      image: "https://placehold.co/800x600/4A90E2/FFFFFF/png?text=Media+Production",
      link: "/programs/media-production"
    },
    {
      title: "Art and Craft Initiatives",
      description: "Drawing workshops for children and raising awareness about critical social issues through art.",
      image: "https://placehold.co/800x600/4A90E2/FFFFFF/png?text=Art+and+Craft",
      link: "/programs/art-craft"
    }
  ];

  return (
    <div className="programs">
      <ScrollAnimation>
        <h1>Our Programs</h1>
        <p className="programs-intro">
          We run various initiatives designed to empower youth through creativity and education.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="programs-grid">
          {programs.map((program, index) => (
            <Link to={program.link} key={index} className="program-card">
              <div className="program-image">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Program+Image';
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="program-content">
                <h2>{program.title}</h2>
                <p>{program.description}</p>
                <span className="learn-more">Learn More →</span>
              </div>
            </Link>
          ))}
        </div>
      </ScrollAnimation>

      <ScrollAnimation>
        <section className="timeline-section">
          <h2>Our Journey</h2>
          <Timeline />
        </section>
      </ScrollAnimation>
    </div>
  );
};

export default Programs; 