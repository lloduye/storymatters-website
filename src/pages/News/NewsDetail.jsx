import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import './NewsDetail.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';
import Newsletter from '../../components/Newsletter/Newsletter';

const NewsDetail = () => {
  const location = useLocation();
  const story = location.state?.story;

  if (!story) {
    return <Navigate to="/news" replace />;
  }

  return (
    <div className="news-detail">
      <div className="story-banner">
        <img 
          src={story.image}
          alt={story.title}
          className="banner-image"
        />
        <div className="story-header">
          <span className="story-category">{story.category}</span>
          <h1>{story.title}</h1>
          <span className="story-date">{story.date}</span>
        </div>
      </div>

      <ScrollAnimation>
        <div className="story-content">
          {story.content.map((section, idx) => (
            <div key={idx} className="content-section">
              {idx % 2 === 0 ? (
                <>
                  <div className="text-content">
                    {section.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                  <figure className="section-image">
                    <img 
                      src={section.image.src}
                      alt={section.image.caption}
                      className="story-image"
                    />
                    <figcaption>{section.image.caption}</figcaption>
                  </figure>
                </>
              ) : (
                <>
                  <figure className="section-image">
                    <img 
                      src={section.image.src}
                      alt={section.image.caption}
                      className="story-image"
                    />
                    <figcaption>{section.image.caption}</figcaption>
                  </figure>
                  <div className="text-content">
                    {section.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollAnimation>

      <Newsletter />
    </div>
  );
};

export default NewsDetail; 