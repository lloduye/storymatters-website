import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import './NewsDetail.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import ImagePlaceholder from '../../components/ImagePlaceholder/ImagePlaceholder';
import Newsletter from '../../components/Newsletter/Newsletter';

const NewsDetail = () => {
  const location = useLocation();
  const newsItem = location.state?.newsItem;

  if (!newsItem || !newsItem.fullStory) {
    return <Navigate to="/news" replace />;
  }

  return (
    <div className="news-detail">
      <div className="story-banner">
        <ImagePlaceholder 
          width={1920} 
          height={600} 
          text={newsItem.fullStory.mainImage}
          className="banner-image"
        />
        <div className="story-header">
          <span className="story-category">{newsItem.category}</span>
          <h1>{newsItem.title}</h1>
          <h2>{newsItem.subtitle}</h2>
          <span className="story-date">{newsItem.date}</span>
        </div>
      </div>

      <ScrollAnimation>
        <div className="story-content">
          <div className="main-content">
            {newsItem.fullStory.content}
          </div>

          {newsItem.fullStory.sections.map((section, index) => (
            <section key={index} className="story-section">
              {section.title && <h2>{section.title}</h2>}
              <p>{section.content}</p>
              {section.image && (
                <div className="section-image">
                  <ImagePlaceholder 
                    width={800} 
                    height={400} 
                    text={section.image}
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </ScrollAnimation>

      <Newsletter />
    </div>
  );
};

export default NewsDetail; 