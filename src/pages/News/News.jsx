import React from 'react';
import './News.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';

const News = () => {
  const newsItems = [
    {
      title: "Youth Media Workshop Success",
      subtitle: "Empowering Future Storytellers",
      date: "March 15, 2024",
      description: "30 young refugees completed advanced media training, mastering skills in digital storytelling, photography, and video production. The workshop culminated in a showcase of their original works.",
      image: "Youth+Media+Workshop",
      category: "Education"
    },
    {
      title: "Community Theater Festival",
      subtitle: "Celebrating Cultural Expression",
      date: "March 1, 2024",
      description: "Annual performance showcase highlights refugee talent through powerful performances addressing social issues and celebrating diverse cultural heritage.",
      image: "Theater+Festival",
      category: "Events"
    },
    {
      title: "New Art Program Launch",
      subtitle: "Creative Horizons Expand",
      date: "February 20, 2024",
      description: "Expanding creative opportunities for youth with the introduction of our comprehensive visual arts program, including painting, sculpture, and digital art.",
      image: "Art+Program",
      category: "Programs"
    }
  ];

  return (
    <div className="news">
      <div className="page-banner">
        <ImagePlaceholder 
          width={1920} 
          height={400} 
          text="Latest+News+and+Updates"
          className="banner-image"
        />
        <h1>News & Impact</h1>
      </div>

      <ScrollAnimation>
        <p className="page-intro">
          Stay updated with our latest initiatives, success stories, and community impact.
        </p>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="news-grid">
          {newsItems.map((item, index) => (
            <div key={index} className="news-card">
              <div className="news-image">
                <ImagePlaceholder 
                  width={800} 
                  height={400} 
                  text={item.image}
                />
                <span className="news-category">{item.category}</span>
              </div>
              <div className="news-content">
                <span className="news-date">{item.date}</span>
                <h2>{item.title}</h2>
                <h3>{item.subtitle}</h3>
                <p>{item.description}</p>
                <a href="#" className="read-more">Read Full Story →</a>
              </div>
            </div>
          ))}
        </div>
      </ScrollAnimation>

      <ScrollAnimation>
        <div className="newsletter-section">
          <h2>Stay Connected</h2>
          <p>Subscribe to our newsletter for regular updates on our impact and initiatives.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default News;