import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load data based on user role
      if (currentUser.role === 'admin') {
        const [statsData, postsData, mediaData] = await Promise.all([
          apiService.getStats(),
          apiService.getPosts(),
          apiService.getMedia()
        ]);
        
        setStats(statsData.data);
        setPosts(postsData.data);
        setMedia(mediaData.data);
      } else {
        // Regular user dashboard
        const [userPosts, userMedia] = await Promise.all([
          apiService.getPosts({ author: currentUser.id }),
          apiService.getMedia({ uploadedBy: currentUser.id })
        ]);
        
        setPosts(userPosts.data);
        setMedia(userMedia.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {currentUser.name}</h1>
        <p>Role: {currentUser.role}</p>
      </header>

      {currentUser.role === 'admin' && (
        <section className="stats-section">
          <h2>Website Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Views</h3>
              <p>{stats.totalPageViews}</p>
            </div>
            <div className="stat-card">
              <h3>Unique Visitors</h3>
              <p>{stats.totalUniqueVisitors}</p>
            </div>
            <div className="stat-card">
              <h3>Total Posts</h3>
              <p>{posts.length}</p>
            </div>
            <div className="stat-card">
              <h3>Media Files</h3>
              <p>{media.length}</p>
            </div>
          </div>
        </section>
      )}

      <section className="content-section">
        <h2>Recent Posts</h2>
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="post-meta">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="media-section">
        <h2>Media Library</h2>
        <div className="media-grid">
          {media.map(item => (
            <div key={item._id} className="media-card">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.filename} />
              ) : (
                <div className="media-placeholder">
                  {item.type.toUpperCase()}
                </div>
              )}
              <p>{item.filename}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 