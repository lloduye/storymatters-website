import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Newsletter from '../../components/Newsletter/Newsletter';
import './NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'stories', id), (doc) => {
      if (doc.exists()) {
        setStory({ id: doc.id, ...doc.data() });
        setLoading(false);
      } else {
        console.log('No such story!');
        navigate('/news');
      }
    }, (error) => {
      console.error('Error fetching story:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading story...</div>;
  if (!story) return <div className="error">Story not found</div>;

  return (
    <>
      <div className="news-detail">
        <div className="story-header">
          <h1>{story.title}</h1>
          <div className="story-meta">
            <span>{new Date(story.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
            {story.location && <span className="location">{story.location}</span>}
            <span className="category">{story.category}</span>
            <span className="editor">By {story.editor}</span>
          </div>
        </div>

        <div className="main-content">
          <div className="story-image-container">
            <img src={story.image} alt={story.title} />
            {story.mainImageCredit && (
              <div className="image-credit">Photo: {story.mainImageCredit}</div>
            )}
          </div>
          <p className="story-description">{story.description}</p>
        </div>

        <div className="story-content">
          {story.content.map((section, index) => {
            if (index === 0) {
              return (
                <div key={index} className="content-section side-by-side">
                  <div className="text-content">
                    <p>{section.text}</p>
                  </div>
                  {section.image && (
                    <div className="section-image-container">
                      <img src={section.image.src} alt={`Section ${index + 1}`} />
                      {section.image.credit && (
                        <div className="image-credit">Photo: {section.image.credit}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            } else if (index === 1) {
              return (
                <div key={index} className="content-section full-width">
                  <p>{section.text}</p>
                </div>
              );
            } else if (index === 2) {
              return (
                <div key={index} className="content-section side-by-side reverse">
                  {section.image && (
                    <div className="section-image-container">
                      <img src={section.image.src} alt={`Section ${index + 1}`} />
                      {section.image.credit && (
                        <div className="image-credit">Photo: {section.image.credit}</div>
                      )}
                    </div>
                  )}
                  <div className="text-content">
                    <p>{section.text}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="content-section full-width">
                  <p>{section.text}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
      
      <div style={{ marginTop: '4rem', marginBottom: '2rem' }}>
        <Newsletter />
      </div>
    </>
  );
};

export default NewsDetail; 