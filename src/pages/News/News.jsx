import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCalendar, FaEye, FaUser } from 'react-icons/fa';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(
          collection(db, 'content'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          orderBy('__name__', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const newsData = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              publishDate: data.publishDate ? new Date(data.publishDate) : null,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate()
            };
          });

        console.log('Fetched news:', newsData);
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  if (loading) {
    return (
      <div className="news-page">
        <div className="loading">Loading news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="news-page">
        <div className="news-header">
          <h1>Latest News</h1>
          <p>Stay updated with our latest stories and announcements</p>
        </div>
        <div className="no-news">No news articles available.</div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Latest News</h1>
        <p>Stay updated with our latest stories and announcements</p>
      </div>

      <div className="news-grid">
        {news.map(story => (
          <Link to={`/news/${story.id}`} key={story.id} className="news-card">
            <div className="news-image">
              {story.featuredImage ? (
                <img 
                  src={story.featuredImage} 
                  alt={story.title} 
                  className="news-thumbnail"
                />
              ) : (
                <div className="placeholder-image" />
              )}
            </div>
            <div className="news-content">
              <h2 className="news-title">{story.title}</h2>
              <div className="news-meta">
                <span className="news-date">
                  <FaCalendar /> {formatDate(story.publishDate)}
                </span>
                <span className="news-views">
                  <FaEye /> {story.views || 0} views
                </span>
              </div>
              <p className="news-excerpt">
                {story.excerpt || truncateText(story.content)}
              </p>
              <span className="read-more">Read More →</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="newsletter-section">
        <NewsletterSubscribe source="news_page" />
      </div>
    </div>
  );
};

export default News;
