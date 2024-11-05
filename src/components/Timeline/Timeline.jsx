import React, { useState } from 'react';
import './Timeline.css';
import ScrollAnimation from '../ScrollAnimation/ScrollAnimation';

const Timeline = () => {
  const [activeYear, setActiveYear] = useState('2020');

  const timelineData = {
    '2019': {
      title: 'Foundation',
      description: 'Story Matters Entertainment was founded by young refugees in Kakuma Refugee Camp.',
      events: [
        'Initial community meetings and planning',
        'Formation of core team',
        'Development of mission and vision'
      ]
    },
    '2020': {
      title: 'Official Launch',
      description: 'Launched our first programs and initiatives.',
      events: [
        'Launch of Refugee Teens Talk Program',
        'First community theater production',
        'Initial media training workshops'
      ]
    },
    '2021': {
      title: 'Program Expansion',
      description: 'Expanded our reach and introduced new programs.',
      events: [
        'Launch of Kakuma Laugh Industry',
        'Start of photography workshops',
        'First Miss Kakuma-Kalobeyei Beauty Pageant'
      ]
    },
    '2022': {
      title: 'Community Impact',
      description: 'Deepened our community engagement and impact.',
      events: [
        'Launch of Art and Craft Initiatives',
        'Expanded media production training',
        'Community awareness campaigns'
      ]
    },
    '2023': {
      title: 'Growth & Innovation',
      description: 'Introduced new initiatives and strengthened existing programs.',
      events: [
        'Digital media expansion',
        'Youth leadership programs',
        'Cross-cultural exchange projects'
      ]
    }
  };

  return (
    <div className="timeline-container">
      <div className="timeline-years">
        {Object.keys(timelineData).map((year) => (
          <div
            key={year}
            className={`timeline-year ${activeYear === year ? 'active' : ''}`}
            onClick={() => setActiveYear(year)}
          >
            <div className="year-dot"></div>
            <span>{year}</span>
          </div>
        ))}
      </div>

      <ScrollAnimation>
        <div className="timeline-content">
          <h3>{timelineData[activeYear].title}</h3>
          <p className="timeline-description">{timelineData[activeYear].description}</p>
          <div className="timeline-events">
            {timelineData[activeYear].events.map((event, index) => (
              <ScrollAnimation key={index} animation="fade-up" delay={index * 200}>
                <div className="timeline-event">
                  <div className="event-dot"></div>
                  <p>{event}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Timeline; 