import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, increment, collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaCalendar, FaUser, FaFolder, FaEye, FaHeart, FaComment, FaArrowLeft, FaImages, FaImage } from 'react-icons/fa';
import './NewsDetail.css';
import { 
  FacebookShareButton, TwitterShareButton, WhatsappShareButton,
  FacebookIcon, TwitterIcon, WhatsappIcon
} from 'react-share';
import NewsletterSubscribe from '../../components/NewsletterSubscribe';

const CopyLinkButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button 
      className={`copy-link-button ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
};

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredStories, setFeaturedStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);

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
        console.log('Loaded story data:', storyData);
        console.log('Featured image URL:', storyData.featuredImage);
        setStory({
          id: storyDoc.id,
          ...storyData,
          publishedAt: storyData.publishedAt?.toDate()
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

  useEffect(() => {
    const fetchOtherStories = async () => {
      try {
        const storiesQuery = query(
          collection(db, 'content'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(15)
        );

        const snapshot = await getDocs(storiesQuery);
        const storiesData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishedAt: doc.data().publishedAt?.toDate()
          }))
          .filter(story => story.id !== id);

        // Set featured stories (top 3)
        setFeaturedStories(storiesData.slice(0, 3));

        // Set trending stories (sort by views, top 5)
        const trending = [...storiesData]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5);
        setTrendingStories(trending);

        // Set latest stories (all stories except featured ones, ordered by date)
        const latest = storiesData
          .filter(story => !featuredStories.find(f => f.id === story.id))
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10);
        setLatestStories(latest);

        console.log({
          total: storiesData.length,
          featured: featuredStories.length,
          trending: trending.length,
          latest: latest.length
        });
      } catch (error) {
        console.error('Error fetching other stories:', error);
      }
    };

    fetchOtherStories();
  }, [id]);

  useEffect(() => {
    if (story?.category) {
      loadRelatedStories(story.category);
    }
    loadRecentStories();
  }, [story?.category]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ShareButtons = ({ url, title, description }) => {
    return (
      <div className="share-buttons">
        <h4>Share this story:</h4>
        <div className="social-buttons">
          <FacebookShareButton url={url} quote={title}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <WhatsappShareButton url={url} title={title} separator=" - ">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <div className="copy-share">
            <CopyLinkButton url={url} />
            <small>Copy link for Instagram/TikTok</small>
          </div>
        </div>
      </div>
    );
  };

  const RelatedStories = ({ stories }) => {
    return (
      <div className="related-stories">
        {stories.map(story => (
          <Link to={`/news/${story.id}`} key={story.id} className="related-story">
            <div className="related-story-image">
              {(story.featuredImage || story.image) ? (
                <img src={story.featuredImage || story.image} alt={story.title} />
              ) : (
                <div className="placeholder-image">
                  <FaImage />
                </div>
              )}
            </div>
            <div className="related-story-content">
              <h3>{story.title}</h3>
              <p>{story.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const RecentStories = ({ stories }) => {
    return (
      <div className="recent-stories">
        {stories.map(story => (
          <Link to={`/news/${story.id}`} key={story.id} className="recent-story">
            <div className="recent-story-image">
              {story.featuredImage ? (
                <img src={story.featuredImage} alt={story.title} />
              ) : (
                <div className="placeholder-image">
                  <FaImage />
                </div>
              )}
            </div>
            <div className="recent-story-content">
              <h3>{story.title}</h3>
              <p>{story.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const loadRelatedStories = async (category) => {
    try {
      const q = query(
        collection(db, 'content'),
        where('category', '==', category),
        where('status', '==', 'published'),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      const stories = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Related story data:', {
          id: doc.id,
          image: data.image,
          featuredImage: data.featuredImage,
          title: data.title
        });
        return {
          id: doc.id,
          ...data
        };
      });
      setRelatedStories(stories);
    } catch (error) {
      console.error('Error loading related stories:', error);
    }
  };

  const loadRecentStories = async () => {
    try {
      const q = query(
        collection(db, 'content'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const stories = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Recent story data:', {
          id: doc.id,
          image: data.image,
          featuredImage: data.featuredImage,
          title: data.title
        });
        return {
          id: doc.id,
          ...data
        };
      });
      setRecentStories(stories);
    } catch (error) {
      console.error('Error loading recent stories:', error);
    }
  };

  const StoryCard = ({ story }) => {
    return (
      <div className="story-card">
        <div className="story-image">
          {(story.featuredImage || story.image) ? (
            <img 
              src={story.featuredImage || story.image} 
              alt={story.title}
              loading="lazy"
            />
          ) : (
            <div className="placeholder-image">
              <FaImage />
              <span>No image available</span>
            </div>
          )}
        </div>
        <div className="story-content">
          <h3>{story.title}</h3>
          <p>{story.excerpt}</p>
        </div>
      </div>
    );
  };

  const SidebarStory = ({ story }) => {
    return (
      <Link to={`/news/${story.id}`} className="sidebar-story">
        <div className="story-image">
          {(story.featuredImage || story.image) ? (
            <img 
              src={story.featuredImage || story.image} 
              alt={story.title}
              loading="lazy"
            />
          ) : (
            <div className="placeholder-image">
              <FaImage />
            </div>
          )}
        </div>
        <div className="story-content">
          <h4>{story.title}</h4>
          <p>{story.excerpt}</p>
        </div>
      </Link>
    );
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

      <div className="news-detail-layout">
        <article className="story-detail">
          {story.featuredImage && (
            <div className="story-hero-image">
              <img src={story.featuredImage} alt={story.title} />
              {story.mainImageCredit && (
                <div className="image-credit">Photo: {story.mainImageCredit}</div>
              )}
            </div>
          )}

          <div className="story-header">
            <h1>{story.title}</h1>
            
            <div className="story-meta">
              <div className="meta-left">
                {story.category && (
                  <span className="category-tag">
                    <FaFolder /> {story.category}
                  </span>
                )}
                <span className="date">
                  <FaCalendar /> {formatDate(story.publishedAt)}
                </span>
                {story.author && (
                  <span className="author">
                    <FaUser /> {story.author}
                  </span>
                )}
              </div>
              
              <div className="story-stats">
                <span><FaEye /> {story.views || 0}</span>
                <span><FaHeart /> {story.likes || 0}</span>
                <span><FaComment /> {story.comments || 0}</span>
              </div>
            </div>
          </div>

          {story.description && (
            <div className="story-excerpt">
              {story.description}
            </div>
          )}

          <div className="story-content">
            {/* Handle different content types */}
            {typeof story.content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: story.content }} />
            ) : (
              story.contentSections?.map((section, index) => (
                <div key={index} className={`content-section ${section.type || 'text-only'}`}>
                  {section.text && (
                    <div className="section-text" dangerouslySetInnerHTML={{ __html: section.text }} />
                  )}
                  {section.image && (
                    <div className="section-image-container">
                      <img src={section.image.src} alt="" />
                      {section.image.credit && (
                        <div className="image-credit">Photo: {section.image.credit}</div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {story.additionalImages && story.additionalImages.length > 0 && (
            <div className="story-gallery">
              <h3 className="gallery-title">
                <FaImages /> More Images
              </h3>
              <div className="gallery-grid">
                {story.additionalImages.map((image, index) => (
                  <div key={index} className="gallery-item">
                    <img 
                      src={image} 
                      alt={`${story.title} - Image ${index + 1}`}
                      onClick={() => window.open(image, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <ShareButtons 
            url={window.location.href}
            title={story.title}
            description={story.description}
          />

          {story.tags && story.tags.length > 0 && (
            <div className="story-tags">
              <h3>Tags:</h3>
              <div className="tags-list">
                {story.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </article>

        <aside className="stories-sidebar">
          {/* Featured Stories */}
          {featuredStories.length > 0 && (
            <section className="sidebar-section">
              <h3>Featured Stories</h3>
              {featuredStories.map(story => (
                <Link 
                  to={`/news/${story.id}`} 
                  key={story.id} 
                  className="sidebar-story featured"
                >
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
            </section>
          )}

          {/* Trending Stories */}
          {trendingStories.length > 0 && (
            <section className="sidebar-section">
              <h3>Trending Stories</h3>
              {trendingStories.map(story => (
                <Link 
                  to={`/news/${story.id}`} 
                  key={story.id} 
                  className="sidebar-story trending"
                >
                  <div className="story-image">
                    {story.image && <img src={story.image} alt={story.title} />}
                  </div>
                  <div className="story-info">
                    <h4>{story.title}</h4>
                    <div className="story-meta">
                      <span className="views"><FaEye /> {story.views || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          )}

          {/* Latest Stories */}
          {latestStories.length > 0 && (
            <section className="sidebar-section">
              <h3>Latest Stories</h3>
              {latestStories.map(story => (
                <Link 
                  to={`/news/${story.id}`} 
                  key={story.id} 
                  className="sidebar-story"
                >
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
            </section>
          )}
        </aside>
      </div>

      <NewsletterSubscribe source="news_detail" />
    </div>
  );
};

export default NewsDetail; 