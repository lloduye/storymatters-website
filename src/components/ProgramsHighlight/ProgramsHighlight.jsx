import React from 'react';
import './ProgramsHighlight.css';

const ProgramsHighlight = () => {
  const programs = [
    {
      title: "Refugee Teens Talk Program",
      description: "Empowering vulnerable teenage mothers through workshops and support services."
    },
    {
      title: "Kakuma Theatre",
      description: "A creative platform combining theatre and media production to showcase youth talent and address community issues."
    },
    {
      title: "Kakuma Media Production",
      description: "Training youth in photography, videography, and storytelling."
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