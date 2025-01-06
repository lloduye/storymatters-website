import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCalendar, FaArrowLeft, FaEye, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import './NewsDetail.css';
import { 
  FacebookShareButton, TwitterShareButton, WhatsappShareButton,
  FacebookIcon, TwitterIcon, WhatsappIcon
} from 'react-share';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyRef = doc(db, 'content', id);
        const storyDoc = await getDoc(storyRef);
        
        if (!storyDoc.exists()) {
          setError('Story not found');
          return;
        }

        const storyData = storyDoc.data();
        
        // Use publishDate for display, fallback to publishedAt or createdAt
        const displayDate = storyData.publishDate 
          ? new Date(storyData.publishDate)
          : storyData.publishedAt?.toDate() 
            || storyData.createdAt?.toDate() 
            || new Date();

        setStory({
          id: storyDoc.id,
          ...storyData,
          publishedAt: displayDate
        });

        // Increment view count
        await updateDoc(storyRef, {
          views: increment(1)
        });

      } catch (error) {
        console.error('Error fetching story:', error);
        setError('Error loading story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="news-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-detail-container">
        <div className="error-message">
          <h2>{error}</h2>
          <button onClick={() => navigate('/news')}>Back to News</button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-container">
      <button className="back-button" onClick={() => navigate('/news')}>
        <FaArrowLeft /> Back to News
      </button>

      <article className="story-content">
        {story.featuredImage && (
          <div className="story-hero-image">
            <img src={story.featuredImage} alt={story.title} />
          </div>
        )}
        
        <h1 className="story-title">{story.title}</h1>
        
        <div className="story-meta">
          <span className="date">
            <FaCalendar /> {formatDate(story.publishDate)}
          </span>
          {story.author && (
            <span className="author">
              <FaUser /> {story.author}
            </span>
          )}
          {story.location && (
            <span className="location">
              <FaMapMarkerAlt /> {story.location}
            </span>
          )}
          <span className="views">
            <FaEye /> {story.views || 0} views
          </span>
        </div>

        <div 
          className="story-content"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        <div className="share-buttons">
          <h4>Share this story:</h4>
          <div className="social-buttons">
            <FacebookShareButton url={window.location.href} quote={story.title}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <TwitterShareButton url={window.location.href} title={story.title}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>

            <WhatsappShareButton url={window.location.href} title={story.title}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </div>

        <NewsletterSubscribe source="news_detail" />
      </article>
    </div>
  );
};

export default NewsDetail; 