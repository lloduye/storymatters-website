import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import './News.css';

const News = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const storiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStories(storiesData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching stories:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get unique categories from stories
  const categories = ['All', ...new Set(stories.map(story => story.category))];
  
  // Get latest 3 stories for main section
  const mainStories = stories.slice(0, 3);
  
  // Get filtered stories for sidebar
  const sidebarStories = stories.filter(story => 
    selectedCategory === 'All' || story.category === selectedCategory
  ).slice(3); // Skip the first 3 stories that are shown in main section

  if (loading) return <div className="loading">Loading stories...</div>;

  return (
    <div className="news-container">
      <h1>News</h1>
      <div className="news-layout">
        {/* Main Stories Section */}
        <div className="main-stories">
          {mainStories.map(story => (
            <Link to={`/news/${story.id}`} key={story.id} className="news-card main-card">
              <div className="story-image-container">
                <img src={story.image} alt={story.title} />
                {story.mainImageCredit && (
                  <div className="image-credit">Photo: {story.mainImageCredit}</div>
                )}
              </div>
              <div className="news-content">
                <h2>{story.title}</h2>
                <div className="news-meta">
                  <span>{new Date(story.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  {story.location && <span className="location">{story.location}</span>}
                  <span className="category">{story.category}</span>
                </div>
                <p>{story.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar with Categories */}
        <div className="news-sidebar">
          <div className="category-filter">
            <h3>Categories</h3>
            <div className="category-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-stories">
            <h3>More Stories</h3>
            {sidebarStories.map(story => (
              <Link to={`/news/${story.id}`} key={story.id} className="sidebar-story-card">
                <div className="sidebar-story-image">
                  <img src={story.image} alt={story.title} />
                </div>
                <div className="sidebar-story-content">
                  <h4>{story.title}</h4>
                  <div className="sidebar-story-meta">
                    <span>{new Date(story.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                    <span className="category">{story.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;