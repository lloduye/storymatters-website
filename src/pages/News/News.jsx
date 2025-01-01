import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './News.css';
import { Link } from 'react-router-dom';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching news...'); // Debug log
        console.log('Firebase config:', {
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
        });

        const newsRef = collection(db, 'news');
        const q = query(newsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const newsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Fetched news:', newsData); // Debug log
        setNews(newsData);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading">Loading news stories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <div className="error">
          Error loading news: {error}
          <br />
          <small>Please try refreshing the page</small>
        </div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="news-container">
        <div className="no-news">No news stories available at the moment</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <h1>Latest News</h1>
      <div className="news-grid">
        {news.map((story) => (
          <Link to={`/news/${story.id}`} key={story.id} className="news-card">
            <div className="news-image">
              {story.imageUrl && <img src={story.imageUrl} alt={story.title} />}
            </div>
            <div className="news-content">
              <h2>{story.title}</h2>
              <p className="date">
                {story.timestamp?.toDate().toLocaleDateString() || 'No date'}
              </p>
              <p className="excerpt">{story.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default News;
