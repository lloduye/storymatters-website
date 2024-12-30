import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { FaCalendar, FaUser, FaFolder, FaEye, FaHeart, FaComment } from 'react-icons/fa';
import './News.css';

const News = () => {
  const [stories, setStories] = useState([]);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Fetch stories with real-time updates
  useEffect(() => {
    console.log('Fetching stories...');
    const storiesQuery = query(
      collection(db, 'stories'),
      where('status', '==', 'published'),
      orderBy('timestamp', 'desc'),
      limit(20) // Increased limit to get more stories
    );

    const unsubscribe = onSnapshot(
      storiesQuery,
      (snapshot) => {
        try {
          const storiesData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              title: data.title,
              description: data.description || data.excerpt || '',
              image: data.image || data.featuredImage || '',
              category: data.category || 'Uncategorized',
              author: data.author || 'Anonymous',
              publishedAt: data.publishedAt?.toDate() || data.timestamp?.toDate() || new Date(),
              views: data.views || 0,
              likes: data.likes || 0,
              comments: data.comments || 0
            };
          });

          // Set featured stories (top 3)
          const featured = storiesData.slice(0, 3);
          setFeaturedStories(featured);

          // Set trending stories (sort by views)
          const trending = [...storiesData]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
          setTrendingStories(trending);

          // Set latest stories (excluding featured)
          const latest = storiesData
            .filter(story => !featured.find(f => f.id === story.id))
            .sort((a, b) => 
              new Date(b.publishedAt || b.timestamp) - new Date(a.publishedAt || a.timestamp)
            )
            .slice(0, 10);
          setLatestStories(latest);

          // Set main stories (excluding featured)
          const mainStories = storiesData.filter(story => 
            !featured.find(f => f.id === story.id)
          );

          // Filter stories based on category
          const filteredStories = selectedCategory === 'All'
            ? mainStories
            : mainStories.filter(story => story.category === selectedCategory);

          // Extract categories
          const uniqueCategories = ['All', ...new Set(storiesData
            .map(story => story.category)
            .filter(Boolean)
          )];
          
          setCategories(uniqueCategories);
          setStories(filteredStories);
          setLoading(false);
        } catch (error) {
          console.error('Error processing stories:', error);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error in snapshot listener:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedCategory]);

  // Add function to format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-container">
      {/* Sidebar - Now on the left */}
      <aside className="news-sidebar">
        {/* Trending Stories */}
        <div className="sidebar-section">
          <h3>Trending Stories</h3>
          <div className="stories-grid">
            {trendingStories.map(story => (
              <Link to={`/news/${story.id}`} key={story.id} className="sidebar-story">
                <div className="story-image">
                  {story.image && <img src={story.image} alt={story.title} />}
                </div>
                <div className="story-info">
                  <h4>{story.title}</h4>
                  <div className="story-meta">
                    <span className="views"><FaEye /> {story.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Latest Stories */}
        <div className="sidebar-section">
          <h3>Latest Updates</h3>
          <div className="stories-grid">
            {latestStories.map(story => (
              <Link to={`/news/${story.id}`} key={story.id} className="sidebar-story">
                <div className="story-image">
                  {story.image && <img src={story.image} alt={story.title} />}
                </div>
                <div className="story-info">
                  <h4>{story.title}</h4>
                  <div className="story-meta">
                    <span className="date">
                      <FaCalendar /> {formatDate(story.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {featuredStories.length > 0 && (
        <section className="featured-stories">
          <div className="featured-grid">
            {featuredStories.map((story, index) => (
              <Link 
                to={`/news/${story.id}`} 
                key={story.id} 
                className={`featured-card ${index === 0 ? 'main-feature' : ''}`}
              >
                <div className="featured-image">
                  {story.image && <img src={story.image} alt={story.title} />}
                  {story.mainImageCredit && (
                    <div className="image-credit">Photo: {story.mainImageCredit}</div>
                  )}
                </div>
                <div className="featured-content">
                  <div className="story-meta">
                    {story.category && (
                      <span className="category-tag">{story.category}</span>
                    )}
                    <span className="date">
                      <FaCalendar />
                      {formatDate(story.publishedAt)}
                    </span>
                  </div>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <div className="story-stats">
                    <span><FaEye /> {story.views || 0}</span>
                    <span><FaHeart /> {story.likes || 0}</span>
                    <span><FaComment /> {story.comments || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default News;
