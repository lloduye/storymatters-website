import React from 'react';
import './ProgramsHighlight.css';

const ProgramsHighlight = () => {
  const programs = [
    {
      title: "Refugee Teens Talk Program",
      description: "Empowering vulnerable teenage girls and mothers through workshops and support services."
    },
    {
      title: "Kakuma Laugh Industry",
      description: "Promoting awareness of social issues through talent showcases."
    },
    {
      title: "Kakuma Media Production",
      description: "Training youth in photography and video editing while organizing community events."
    }
  ];

  return (
    <section className="programs-section">
      <h2>Our Programs</h2>
      <div className="programs-grid">
        {programs.map((program, index) => (
          <div key={index} className="program-card">
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProgramsHighlight; 