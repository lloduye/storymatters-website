import React from 'react';
import './GetInvolved.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import { Link } from 'react-router-dom';

const GetInvolved = () => {
  const involvementOptions = [
    {
      title: "Donate",
      description: "Support our programs financially to help us reach more youth and expand our impact.",
      link: "/donate"
    },
    {
      title: "Volunteer",
      description: "Share your skills and time to help with our programs and initiatives.",
      link: "/volunteer"
    },
    {
      title: "Partner With Us",
      description: "Organizations can collaborate with us to create greater impact together.",
      link: "#contact"
    }
  ];

  return (
    <div className="get-involved">
      <div className="involvement-banner">
        <img 
          src={`${import.meta.env.BASE_URL}images/banners/get-involved-banner.jpeg`}
          alt="Get Involved"
          className="banner-image"
        />
        <h1>Get Involved</h1>
      </div>

      <ScrollAnimation>
        <p className="involvement-intro">
          Join us in making a difference in the lives of young refugees. There are many ways 
          you can support our mission.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="involvement-options">
          {involvementOptions.map((option, index) => (
            <div key={index} className="involvement-card">
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <Link to={option.link} className="action-button">
                {option.title === "Donate" ? "Make a Donation" : "Learn More"}
              </Link>
            </div>
          ))}
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default GetInvolved; 