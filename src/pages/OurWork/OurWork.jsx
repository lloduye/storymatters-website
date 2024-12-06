import React from 'react';
import './OurWork.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';

const OurWork = () => {
  const workAreas = [
    {
      title: "Creative Expression",
      subtitle: "Unleashing Artistic Potential",
      description: "We provide platforms for artistic expression through theater, visual arts, and digital media.",
      image: "Creative+Arts+Programs",
      category: "Arts"
    },
    {
      title: "Skills Development",
      subtitle: "Building Future Leaders",
      description: "Our workshops and training programs equip youth with practical skills in media production and arts.",
      image: "Skills+Training",
      category: "Education"
    },
    {
      title: "Community Impact",
      subtitle: "Creating Lasting Change",
      description: "We address social issues through awareness campaigns and community engagement initiatives.",
      image: "Community+Impact",
      category: "Community"
    }
  ];

  return (
    <div className="our-work">
      <div className="page-banner">
        <img 
          src={`${import.meta.env.BASE_URL}images/banners/our-work-banner.jpeg`}
          alt="Our Work"
          className="banner-image"
        />
        <h1>Our Work</h1>
      </div>

      <ScrollAnimation>
        <p className="page-intro">
          Through creativity and innovation, we empower young refugees to tell their stories 
          and develop valuable skills for their future.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="work-grid">
          {workAreas.map((area, index) => (
            <div key={index} className="work-card">
              <div className="work-image">
                <ImagePlaceholder 
                  width={800} 
                  height={400} 
                  text={area.image}
                />
                <span className="work-category">{area.category}</span>
              </div>
              <div className="work-content">
                <h2>{area.title}</h2>
                <h3>{area.subtitle}</h3>
                <p>{area.description}</p>
                <a href="#" className="read-more">Learn More →</a>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="newsletter-section">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter to receive updates about our work and impact.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default OurWork;