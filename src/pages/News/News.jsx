import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './News.css';
import { Link } from 'react-router-dom';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        const contentRef = collection(db, 'content');
        console.log('Fetching content...');
        
        const q = query(
          contentRef,
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        console.log('Raw snapshot:', querySnapshot.docs.length, 'documents found');
        
        const newsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Document data:', data);  // Log each document
          return {
            id: doc.id,
            title: data.title,
            description: data.description || data.excerpt,
            image: data.image || data.featuredImage,
            createdAt: data.createdAt,
            status: data.status,
            type: data.type
          };
        });
        
        console.log('Processed news data:', newsData);
        setNews(newsData);
      } catch (err) {
        console.error('Error details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="news-page">
        <div className="loading">Loading news stories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="error">Error loading news: {error}</div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="news-page">
        <div className="news-header">
          <h1>Latest News</h1>
          <p>Stay updated with our latest stories and announcements</p>
        </div>
        <div className="no-news">No news stories available at the moment</div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Latest News</h1>
        <p>Stay updated with our latest stories and announcements</p>
      </div>
      
      <div className="news-layout">
        <aside className="news-sidebar">
          <div className="sidebar-section">
            <h3>Categories</h3>
            <ul className="category-list">
              <li><Link to="/news?category=updates">Updates</Link></li>
              <li><Link to="/news?category=stories">Stories</Link></li>
              <li><Link to="/news?category=events">Events</Link></li>
              <li><Link to="/news?category=announcements">Announcements</Link></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Featured Stories</h3>
            <div className="featured-stories">
              {news.slice(0, 3).map((story) => (
                <Link to={`/news/${story.id}`} key={story.id} className="featured-story">
                  {story.image && (
                    <div className="featured-image">
                      <img src={story.image} alt={story.title} />
                    </div>
                  )}
                  <div className="featured-content">
                    <h4>{story.title}</h4>
                    <span className="featured-date">
                      {story.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Popular Tags</h3>
            <div className="tag-cloud">
              {['Community', 'Events', 'Updates', 'Stories', 'News', 'Announcements'].map(tag => (
                <Link key={tag} to={`/news?tag=${tag.toLowerCase()}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="news-main">
          <div className="news-grid">
            {news.map((story) => (
              <Link to={`/news/${story.id}`} key={story.id} className="news-card">
                <div className="news-image">
                  {story.image && (
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="news-thumbnail"
                    />
                  )}
                </div>
                <div className="news-content">
                  <h2 className="news-title">{story.title}</h2>
                  <p className="news-date">
                    {story.createdAt?.toDate().toLocaleDateString() || 'No date'}
                  </p>
                  <p className="news-excerpt">
                    {story.description || story.excerpt}
                  </p>
                  <span className="read-more">Read More →</span>
                </div>
              </Link>
            ))}
          </div>
          <NewsletterSubscribe source="news_page" />
        </div>
      </div>
    </div>
  );
};

export default News;
