import React from 'react';
import './Programs.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';

const Programs = () => {
  const programs = [
    {
      title: "Refugee Teens Talk Program",
      description: "Empowering vulnerable teenage girls and mothers through workshops, support services, and awareness campaigns.",
      image: "/images/programs/teens-talk.jpg"
    },
    {
      title: "Kakuma Laugh Industry",
      description: "A talent showcase platform promoting awareness of drug abuse and crime through creative expression.",
      image: "/images/programs/laugh-industry.jpg"
    },
    {
      title: "Kakuma Media Production",
      description: "Training in photography and video editing, plus organizing events like the Miss Kakuma-Kalobeyei Beauty Pageant.",
      image: "/images/programs/media-production.jpg"
    },
    {
      title: "Art and Craft Initiatives",
      description: "Drawing workshops for children and raising awareness about critical social issues through art.",
      image: "/images/programs/art-craft.jpg"
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
            <div key={index} className="program-card">
              <div className="program-image">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg'; // Fallback image
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
              <div className="program-content">
                <h2>{program.title}</h2>
                <p>{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Programs; 