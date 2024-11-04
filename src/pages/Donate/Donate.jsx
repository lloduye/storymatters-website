import React from 'react';
import './Donate.css';
import DonationForm from '../../components/DonationForm/DonationForm';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';

const Donate = () => {
  return (
    <div className="donate">
      <ScrollAnimation>
        <h1>Support Our Mission</h1>
        <p className="donate-intro">
          Your contribution helps us empower young refugees through creativity and education. 
          Choose your donation type and amount below.
        </p>
      </ScrollAnimation>
      
      <ScrollAnimation>
        <DonationForm />
      </ScrollAnimation>
      
      <ScrollAnimation>
        <div className="impact-message">
          <h2>Your Impact</h2>
          <div className="impact-grid">
            <div className="impact-item">
              <h3>$10</h3>
              <p>Provides art supplies for one student</p>
            </div>
            <div className="impact-item">
              <h3>$25</h3>
              <p>Supports one workshop session</p>
            </div>
            <div className="impact-item">
              <h3>$50</h3>
              <p>Funds equipment for media training</p>
            </div>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Donate; 