import React from 'react';
import './GetInvolved.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import { Link } from 'react-router-dom';

const GetInvolved = () => {
  return (
    <div className="get-involved">
      <ScrollAnimation>
        <h1>Get Involved</h1>
        <p className="involvement-intro">
          Join us in making a difference in the lives of young refugees. There are many ways 
          you can support our mission.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="involvement-options">
          <div className="involvement-card">
            <h2>Donate</h2>
            <p>Support our programs financially to help us reach more youth and expand our impact.</p>
            <Link to="/donate" className="action-button">Make a Donation</Link>
          </div>
          
          <div className="involvement-card">
            <h2>Volunteer</h2>
            <p>Share your skills and time to help with our programs and initiatives.</p>
            <a href="#contact" className="action-button">Contact Us</a>
          </div>
          
          <div className="involvement-card">
            <h2>Partner With Us</h2>
            <p>Organizations can collaborate with us to create greater impact together.</p>
            <a href="#contact" className="action-button">Learn More</a>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default GetInvolved; 