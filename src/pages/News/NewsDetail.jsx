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
            <div key={idx} className={`content-section layout-${idx + 1}`}>
              {idx === 0 && (
                // First section: Side by side
                <>
                  <div className="text-content">
                    {section.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                  <div className="section-image">
                    <img 
                      src={section.image.src}
                      alt=""
                      className="story-image"
                    />
                  </div>
                </>
              )}
              {idx === 1 && (
                <>
                  <div className="content-section layout-2">
                    <div className="section-image full-width">
                      <img 
                        src={section.image.src}
                        alt=""
                        className="story-image"
                      />
                    </div>
                    <div className="text-content">
                      {section.text.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                  {section.fullWidthText && (
                    <div className="full-width-content">
                      {section.fullWidthText.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </>
              )}
              {idx === 2 && (
                // Third section: Image on left
                <>
                  <div className="section-image">
                    <img 
                      src={section.image.src}
                      alt=""
                      className="story-image"
                    />
                  </div>
                  <div className="text-content">
                    {section.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}

          {story.additionalImages && story.additionalImages.length > 0 && (
            <div className="additional-content full-width-gallery">
              <h2>More Pictures from the Event</h2>
              <div className="gallery-container">
                <div className="gallery-scroll">
                  {story.additionalImages.map((imageSrc, idx) => (
                    <div key={idx} className="gallery-item">
                      <img 
                        src={imageSrc}
                        alt=""
                        className="gallery-image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollAnimation>

      <Newsletter />
    </div>
  );
};

export default NewsDetail; 