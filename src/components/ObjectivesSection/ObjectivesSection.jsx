import React from 'react';
import './ObjectivesSection.css';

const ObjectivesSection = () => {
  const objectives = [
    {
      title: "Educate and Promote Talent",
      description: "We engage youth through art, community theater, and online training."
    },
    {
      title: "Positive Representation",
      description: "We showcase stories and talents of young refugees through social media."
    },
    {
      title: "Foster Peaceful Coexistence",
      description: "We promote harmony between diverse nationalities within the camp."
    }
  ];

  return (
    <section className="objectives-section">
      <h2>Our Objectives</h2>
      <div className="objectives-grid">
        {objectives.map((objective, index) => (
          <div key={index} className="objective-card">
            <h3>{objective.title}</h3>
            <p>{objective.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ObjectivesSection; 