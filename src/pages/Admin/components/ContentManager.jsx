import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { 
  collection, query, orderBy, getDocs, addDoc, updateDoc, 
  deleteDoc, doc, serverTimestamp, where, writeBatch, getDoc, setDoc, increment, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaEye, 
  FaTimes, FaTag, FaCalendar, FaFolder, FaHistory, FaClock, FaThLarge, FaList, FaCheck, FaDesktop, FaTabletAlt, FaMobileAlt, FaUser, FaPencilAlt, FaArchive, FaComment, FaHeart, FaBug 
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ContentManager.css';
import { auth } from '../../../firebase/config';
import { EMAIL_CONFIG } from '../../../utils/emailConfig';

const ContentManager = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories] = useState([
    'News', 'Events', 'Stories', 'Updates', 'Resources'
  ]);

  const [contentForm, setContentForm] = useState({
    title: '',
    type: 'article',
    status: 'draft',
    content: '',
    excerpt: '',
    featuredImage: '',
    category: '',
    tags: [],
    author: '',
    publishDate: new Date().toISOString().split('T')[0],
    location: '',
    editor: '',
    mainImageCredit: '',
    content: [],
    publishedAt: null,
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: ''
    }
  });

  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [schedulerForm, setSchedulerForm] = useState({
    publishDate: '',
    publishTime: '',
    notifySubscribers: false
  });

  const [viewMode, setViewMode] = useState('grid');
  const [unpublishedStories, setUnpublishedStories] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [contentStats, setContentStats] = useState({});
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [debugData, setDebugData] = useState(null);

  useEffect(() => {
    loadContent();
  }, [filter]);

  useEffect(() => {
    loadUnpublishedStories();
  }, []);

  useEffect(() => {
    const loadAllStats = async () => {
      const promises = content.map(item => loadContentStats(item.id));
      await Promise.all(promises);
    };
    
    if (content.length > 0) {
      loadAllStats();
    }
  }, [content]);

  const loadContent = async () => {
    try {
      setLoading(true);
      console.log('Loading content...');
      
      // Query the content collection
      const q = query(
        collection(db, 'content'), 
        orderBy('updatedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const contentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Apply filters
      const filteredContent = filter === 'all' 
        ? contentData 
        : contentData.filter(item => item.type === filter);

      // Apply search
      const searchedContent = searchTerm
        ? filteredContent.filter(item => 
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : filteredContent;

      console.log('Content loaded:', searchedContent);
      setContent(searchedContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnpublishedStories = async () => {
    try {
      const q = query(
        collection(db, 'content'),
        where('status', '==', 'draft'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setUnpublishedStories(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (error) {
      console.error('Error loading unpublished stories:', error);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      if (!file) return null;
      
      // Create a compressed version of the image
      const compressedFile = await compressImage(file);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `content/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressedFile);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          }, 'image/jpeg', 0.7); // Compress with 70% quality
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = contentForm.featuredImage;
      
      if (imagePreview && imagePreview.startsWith('data:')) {
        // Convert data URL to Blob
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        imageUrl = await handleImageUpload(file);
      }

      const timestamp = serverTimestamp();
      const contentData = {
        ...contentForm,
        featuredImage: imageUrl, // Now this will be a storage URL, not a data URL
        image: imageUrl,
        description: contentForm.excerpt,
        timestamp: timestamp,
        updatedAt: timestamp,
        type: contentForm.type || 'news',
        content: contentForm.content || '',
        contentSections: [{
          text: contentForm.content,
          image: imageUrl ? {
            src: imageUrl,
            credit: contentForm.mainImageCredit
          } : null
        }]
      };

      // Remove any data URLs from the content data
      Object.keys(contentData).forEach(key => {
        if (typeof contentData[key] === 'string' && contentData[key].startsWith('data:')) {
          delete contentData[key];
        }
      });

      if (!selectedContent) {
        contentData.createdAt = timestamp;
        contentData.publishedAt = contentData.status === 'published' ? timestamp : null;
        
        const docRef = await addDoc(collection(db, 'content'), contentData);
        console.log('New content saved:', {
          content: contentData,
          id: docRef.id
        });
      } else {
        if (contentData.status === 'published' && !selectedContent.publishedAt) {
          contentData.publishedAt = timestamp;
        }
        
        await updateDoc(doc(db, 'content', selectedContent.id), contentData);
        console.log('Content updated:', {
          content: contentData,
          id: selectedContent.id
        });
      }

      setShowEditor(false);
      setSelectedContent(null);
      resetForm();
      loadContent();
    } catch (error) {
      console.error('Error saving content:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const contentDoc = content.find(item => item.id === contentId);
        if (contentDoc.featuredImage) {
          const imageRef = ref(storage, contentDoc.featuredImage);
          await deleteObject(imageRef);
        }
        
        await deleteDoc(doc(db, 'content', contentId));
        if (contentDoc.type === 'article' || contentDoc.type === 'news') {
          await deleteDoc(doc(db, 'stories', contentId));
        }
        
        loadContent();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create a preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        // Don't set the featuredImage field yet - wait for actual upload
        setContentForm(prev => ({ ...prev, featuredImage: '' }));
      } catch (error) {
        console.error('Error handling image:', error);
      }
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!contentForm.tags.includes(newTag)) {
        setContentForm(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setContentForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    setContentForm({
      title: '',
      type: 'news',
      status: 'draft',
      content: '',
      excerpt: '',
      featuredImage: '',
      category: '',
      tags: [],
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      location: '',
      editor: '',
      mainImageCredit: '',
      content: '',
      publishedAt: null,
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: ''
      }
    });
    setImagePreview(null);
    setSelectedContent(null);
    setShowEditor(true);
  };

  const handleNewContent = () => {
    resetForm();
    setShowEditor(true);
  };

  const saveVersion = async () => {
    try {
      const versionData = {
        ...contentForm,
        createdAt: serverTimestamp(),
        versionNumber: versions.length + 1,
        parentId: selectedContent?.id || null
      };
      
      await addDoc(collection(db, 'contentVersions'), versionData);
      loadVersions();
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  const loadVersions = async () => {
    if (!selectedContent) return;
    
    try {
      const q = query(
        collection(db, 'contentVersions'),
        where('parentId', '==', selectedContent.id),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      setVersions(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (error) {
      console.error('Error loading versions:', error);
    }
  };

  const scheduleContent = async () => {
    try {
      const scheduledTime = new Date(
        `${schedulerForm.publishDate}T${schedulerForm.publishTime}`
      );
      
      await addDoc(collection(db, 'scheduledContent'), {
        content: contentForm,
        scheduledFor: scheduledTime,
        notifySubscribers: schedulerForm.notifySubscribers,
        status: 'scheduled'
      });
      
      setShowScheduler(false);
    } catch (error) {
      console.error('Error scheduling content:', error);
    }
  };

  const handleBulkAction = async (action, selectedIds) => {
    const batch = writeBatch(db);
    
    try {
      switch (action) {
        case 'publish':
          selectedIds.forEach(id => {
            const ref = doc(db, 'content', id);
            batch.update(ref, { status: 'published', publishedAt: serverTimestamp() });
          });
          break;
        case 'archive':
          selectedIds.forEach(id => {
            const ref = doc(db, 'content', id);
            batch.update(ref, { status: 'archived' });
          });
          break;
        case 'delete':
          selectedIds.forEach(id => {
            const ref = doc(db, 'content', id);
            batch.delete(ref);
          });
          break;
      }
      
      await batch.commit();
      loadContent();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const validateContent = () => {
    const errors = [];
    
    if (!contentForm.title.trim()) {
      errors.push('Title is required');
    }
    
    if (!contentForm.content.trim()) {
      errors.push('Content is required');
    }
    
    if (contentForm.seo.metaTitle && contentForm.seo.metaTitle.length > 60) {
      errors.push('Meta title should be less than 60 characters');
    }
    
    if (contentForm.seo.metaDescription && contentForm.seo.metaDescription.length > 160) {
      errors.push('Meta description should be less than 160 characters');
    }
    
    return errors;
  };

  const handlePreview = (content) => {
    const contentToPreview = content || {
      ...contentForm,
      id: selectedContent?.id
    };
    
    const cleanContent = {
      id: contentToPreview.id,
      title: contentToPreview.title || 'Untitled',
      content: contentToPreview.content || '',
      author: contentToPreview.author || 'Anonymous',
      publishDate: contentToPreview.publishDate || new Date().toISOString().split('T')[0],
      category: contentToPreview.category || '',
      tags: contentToPreview.tags || [],
      status: contentToPreview.status || 'draft',
      featuredImage: contentToPreview.featuredImage || '',
      excerpt: contentToPreview.excerpt || '',
      seo: contentToPreview.seo || {
        metaTitle: '',
        metaDescription: '',
        keywords: ''
      }
    };

    setPreviewContent(cleanContent);
    setPreviewDevice('desktop');
    setShowPreview(true);
  };

  const handlePublish = async (contentId) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'content', contentId), {
        status: 'published',
        publishedAt: serverTimestamp()
      });
      
      // Update local state
      setContent(prevContent => 
        prevContent.map(item => 
          item.id === contentId 
            ? { ...item, status: 'published' } 
            : item
        )
      );
      
      // Close preview if the content was being previewed
      if (previewContent?.id === contentId) {
        setPreviewContent(prev => ({ ...prev, status: 'published' }));
      }
      
      // Refresh unpublished stories
      loadUnpublishedStories();
      setLoading(false);
    } catch (error) {
      console.error('Error publishing content:', error);
      setLoading(false);
    }
  };

  const handleDeviceChange = (device) => {
    setPreviewDevice(device);
    // Add a small delay to allow the transition
    setTimeout(() => {
      const previewContent = document.querySelector('.preview-content');
      if (previewContent) {
        previewContent.scrollTop = 0;
      }
    }, 100);
  };

  const handleStatusChange = async (contentId, newStatus) => {
    try {
      setLoading(true);
      const timestamp = serverTimestamp();
      
      // Get the current content document
      const contentRef = doc(db, 'content', contentId);
      const contentDoc = await getDoc(contentRef);
      const contentData = contentDoc.data();

      // Prepare update data
      const updateData = {
        ...contentData,
        status: newStatus,
        updatedAt: timestamp,
        timestamp: timestamp,
        publishedAt: newStatus === 'published' ? timestamp : null
      };

      // Update content collection
      await updateDoc(contentRef, updateData);

      // Update stories collection
      const storyRef = doc(db, 'stories', contentId);
      await setDoc(storyRef, {
        ...updateData,
        id: contentId,
        title: contentData.title,
        status: newStatus,
        category: contentData.category,
        author: contentData.author,
        description: contentData.description || contentData.excerpt,
        image: contentData.image || contentData.featuredImage,
        mainImageCredit: contentData.mainImageCredit,
        content: contentData.content,
        publishedAt: newStatus === 'published' ? timestamp : null,
        timestamp: timestamp,
        views: contentData.views || 0,
        likes: contentData.likes || 0,
        comments: contentData.comments || 0
      }, { merge: true });

      console.log('Status updated:', {
        contentId,
        newStatus,
        updateData
      });

      loadContent();
      loadUnpublishedStories();
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setLoading(false);
    }
  };

  const organizeContentByStatus = (contentItems) => {
    return contentItems.reduce((acc, item) => {
      const status = item.status || 'draft';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(item);
      return acc;
    }, {});
  };

  const loadContentStats = async (contentId) => {
    try {
      const statsDoc = await getDoc(doc(db, 'contentStats', contentId));
      if (statsDoc.exists()) {
        setContentStats(prev => ({
          ...prev,
          [contentId]: statsDoc.data()
        }));
      } else {
        // Initialize stats if they don't exist
        const initialStats = {
          views: 0,
          likes: 0,
          comments: 0,
          likedBy: []
        };
        await setDoc(doc(db, 'contentStats', contentId), initialStats);
        setContentStats(prev => ({
          ...prev,
          [contentId]: initialStats
        }));
      }
    } catch (error) {
      console.error('Error loading content stats:', error);
    }
  };

  const handleLike = async (contentId) => {
    try {
      const userId = auth.currentUser.uid; // Assuming you have Firebase Auth
      const statsRef = doc(db, 'contentStats', contentId);
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        const stats = statsDoc.data();
        const isLiked = stats.likedBy.includes(userId);
        
        await updateDoc(statsRef, {
          likes: increment(isLiked ? -1 : 1),
          likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId)
        });
        
        // Update local state
        setContentStats(prev => ({
          ...prev,
          [contentId]: {
            ...prev[contentId],
            likes: prev[contentId].likes + (isLiked ? -1 : 1),
            likedBy: isLiked 
              ? prev[contentId].likedBy.filter(id => id !== userId)
              : [...prev[contentId].likedBy, userId]
          }
        }));
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const sendNotification = async (content) => {
    try {
      await addDoc(collection(db, 'mail'), {
        to: EMAIL_CONFIG.contactEmail,
        from: EMAIL_CONFIG.noReplyEmail,
        template: {
          name: 'content-notification',
          data: {
            title: content.title,
            type: content.type,
            status: content.status
          }
        }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div className="content-manager">
      {/* Header Section */}
      <div className="content-header">
        <div className="header-left">
          <h2>Content Management</h2>
          <button 
            className="new-content-btn" 
            onClick={handleNewContent}
          >
            <FaPlus /> New Content
          </button>
        </div>
        <div className="header-right">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="content-filter"
          >
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="page">Pages</option>
            <option value="news">News</option>
          </select>
        </div>
      </div>

      <div className="view-controls">
        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FaThLarge /> Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FaList /> List
          </button>
        </div>
        <div className="unpublished-counter">
          {unpublishedStories.length} Unpublished Stories
        </div>
      </div>

      {viewMode === 'list' && (
        <div className="unpublished-stories">
          <h3>Unpublished Stories</h3>
          <div className="stories-list">
            {unpublishedStories.map(story => (
              <div key={story.id} className="story-item">
                <div className="story-info">
                  <h4>{story.title}</h4>
                  <p>{story.excerpt}</p>
                  <div className="story-meta">
                    <span>By {story.author}</span>
                    <span>Created: {new Date(story.createdAt?.toDate()).toLocaleDateString()}</span>
                    <span className="status-badge draft">Draft</span>
                  </div>
                </div>
                <div className="story-actions">
                  <button onClick={() => {
                    setSelectedContent(story);
                    setContentForm(story);
                    setImagePreview(story.featuredImage);
                    setShowEditor(true);
                  }} title="Edit">
                    <FaEdit />
                  </button>
                  <button onClick={() => handlePreview(story)} title="Preview">
                    <FaEye />
                  </button>
                  <button onClick={() => handleDelete(story.id)} title="Delete">
                    <FaTrash />
                  </button>
                  <button 
                    onClick={() => handleBulkAction('publish', [story.id])} 
                    title="Publish"
                    className="publish-btn"
                  >
                    <FaCheck /> Publish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="content-list">
        {loading ? (
          <div className="loading">Loading content...</div>
        ) : content.length === 0 ? (
          <div className="empty-state">No content found</div>
        ) : (
          <div className="content-sections">
            {Object.entries(organizeContentByStatus(content)).map(([status, items]) => (
              <div key={status} className="content-section">
                <div className="section-header">
                  <h3>{status.charAt(0).toUpperCase() + status.slice(1)} Stories</h3>
                  <span className="count-badge">{items.length}</span>
                </div>
                <div className={`content-view ${viewMode}`}>
                  {items.map(item => (
                    <div key={item.id} className="content-card">
                      {viewMode === 'grid' ? (
                        <>
                          <div className="content-image">
                            {item.featuredImage ? (
                              <img src={item.featuredImage} alt={item.title} />
                            ) : (
                              <div className="placeholder-image">No Image</div>
                            )}
                          </div>
                          <div className="content-info">
                            <h3>{item.title}</h3>
                            <p>{item.excerpt}</p>
                            <div className="content-meta">
                              <span className={`status-badge ${item.status}`}>
                                {item.status}
                              </span>
                              <span className="type-badge">{item.type}</span>
                            </div>
                          </div>
                          <div className="content-stats">
                            <div className="stat-item">
                              <FaEye />
                              <span>{contentStats[item.id]?.views || 0}</span>
                            </div>
                            <div className="stat-item">
                              <FaComment />
                              <span>{contentStats[item.id]?.comments || 0}</span>
                            </div>
                            <button 
                              className={`like-btn ${contentStats[item.id]?.likedBy?.includes(auth.currentUser?.uid) ? 'liked' : ''}`}
                              onClick={() => handleLike(item.id)}
                            >
                              <FaHeart />
                              <span>{contentStats[item.id]?.likes || 0}</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="content-list-item">
                          <div className="content-list-info">
                            <h3>{item.title}</h3>
                            <p>{item.excerpt}</p>
                            <div className="content-meta">
                              <span className={`status-badge ${item.status}`}>
                                {item.status}
                              </span>
                              <span className="type-badge">{item.type}</span>
                              <span className="content-date">
                                <FaCalendar /> {new Date(item.publishDate).toLocaleDateString()}
                              </span>
                              <span className="content-author">
                                <FaUser /> {item.author || 'Anonymous'}
                              </span>
                            </div>
                          </div>
                          <div className="content-list-image">
                            {item.featuredImage ? (
                              <img src={item.featuredImage} alt={item.title} />
                            ) : (
                              <div className="placeholder-image">No Image</div>
                            )}
                          </div>
                          <div className="content-list-stats">
                            <div className="stat-item">
                              <FaEye />
                              <span>{contentStats[item.id]?.views || 0} views</span>
                            </div>
                            <div className="stat-item">
                              <FaComment />
                              <span>{contentStats[item.id]?.comments || 0} comments</span>
                            </div>
                            <button 
                              className={`like-btn ${contentStats[item.id]?.likedBy?.includes(auth.currentUser?.uid) ? 'liked' : ''}`}
                              onClick={() => handleLike(item.id)}
                            >
                              <FaHeart />
                              <span>{contentStats[item.id]?.likes || 0} likes</span>
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="content-actions">
                        <button onClick={() => handlePreview(item)} title="Preview">
                          <FaEye />
                        </button>
                        <button onClick={() => setShowVersions(true)} title="Versions">
                          <FaHistory />
                        </button>
                        <button onClick={() => setShowScheduler(true)} title="Schedule">
                          <FaClock />
                        </button>
                        <button onClick={() => {
                          setSelectedContent(item);
                          setContentForm(item);
                          setImagePreview(item.featuredImage);
                          setShowEditor(true);
                        }} title="Edit">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(item.id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Editor Modal */}
      {showEditor && (
        <div className="modal-overlay" onClick={() => setShowEditor(false)}>
          <div className="editor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedContent ? 'Edit Content' : 'New Content'}</h3>
              <div className="modal-header-actions">
                <button 
                  onClick={() => {
                    handlePreview(contentForm);
                    setShowEditor(false);
                  }} 
                  className="preview-btn"
                  title="Preview"
                >
                  <FaEye /> Preview
                </button>
                <button 
                  onClick={() => setShowEditor(false)} 
                  className="close-btn"
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={contentForm.title}
                    onChange={(e) => setContentForm(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={contentForm.type}
                    onChange={(e) => setContentForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="news">News</option>
                    <option value="article">Article</option>
                    <option value="page">Page</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={contentForm.category}
                    onChange={(e) => setContentForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={contentForm.status}
                    onChange={(e) => setContentForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Author</label>
                  <input
                    type="text"
                    value={contentForm.author}
                    onChange={(e) => setContentForm(prev => ({ ...prev, author: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Publish Date</label>
                  <input
                    type="date"
                    value={contentForm.publishDate}
                    onChange={(e) => setContentForm(prev => ({ ...prev, publishDate: e.target.value }))}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Excerpt</label>
                  <textarea
                    value={contentForm.excerpt}
                    onChange={(e) => setContentForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Content</label>
                  <ReactQuill
                    value={contentForm.content}
                    onChange={(content) => setContentForm(prev => ({ ...prev, content }))}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Tags</label>
                  <div className="tags-input">
                    <div className="tags-list">
                      {contentForm.tags.map(tag => (
                        <span key={tag} className="tag">
                          {tag}
                          <button type="button" onClick={() => removeTag(tag)}>
                            <FaTimes />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tags (press Enter)"
                      onKeyPress={handleTagInput}
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Featured Image</label>
                  <div className="image-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="image-upload-label">
                      <FaImage /> Choose Image
                    </label>
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button type="button" onClick={() => {
                          setImagePreview(null);
                          setContentForm(prev => ({ ...prev, featuredImage: '' }));
                        }}>
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={contentForm.location}
                    onChange={(e) => setContentForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Editor</label>
                  <input
                    type="text"
                    value={contentForm.editor}
                    onChange={(e) => setContentForm(prev => ({ ...prev, editor: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Image Credit</label>
                  <input
                    type="text"
                    value={contentForm.mainImageCredit}
                    onChange={(e) => setContentForm(prev => ({ ...prev, mainImageCredit: e.target.value }))}
                  />
                </div>

                {/* SEO Section */}
                <div className="form-group full-width seo-section">
                  <h4>SEO Settings</h4>
                  <div className="seo-fields">
                    <input
                      type="text"
                      placeholder="Meta Title"
                      value={contentForm.seo.metaTitle}
                      onChange={(e) => setContentForm(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value }
                      }))}
                    />
                    <textarea
                      placeholder="Meta Description"
                      value={contentForm.seo.metaDescription}
                      onChange={(e) => setContentForm(prev => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value }
                      }))}
                    />
                    <input
                      type="text"
                      placeholder="Keywords (comma-separated)"
                      value={contentForm.seo.keywords}
                      onChange={(e) => setContentForm(prev => ({
                        ...prev,
                        seo: { ...prev.seo, keywords: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditor(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Versions Modal */}
      {showVersions && (
        <div className="modal-overlay" onClick={() => setShowVersions(false)}>
          <div className="versions-modal" onClick={e => e.stopPropagation()}>
            <h3>Version History</h3>
            <div className="versions-list">
              {versions.map(version => (
                <div key={version.id} className="version-item">
                  <span>Version {version.versionNumber}</span>
                  <span>{new Date(version.createdAt?.toDate()).toLocaleString()}</span>
                  <button onClick={() => {
                    setContentForm(version);
                    setShowVersions(false);
                  }}>
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scheduler Modal */}
      {showScheduler && (
        <div className="modal-overlay" onClick={() => setShowScheduler(false)}>
          <div className="scheduler-modal" onClick={e => e.stopPropagation()}>
            <h3>Schedule Publication</h3>
            <form onSubmit={scheduleContent}>
              <div className="form-group">
                <label>Publish Date</label>
                <input
                  type="date"
                  value={schedulerForm.publishDate}
                  onChange={e => setSchedulerForm(prev => ({
                    ...prev,
                    publishDate: e.target.value
                  }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Publish Time</label>
                <input
                  type="time"
                  value={schedulerForm.publishTime}
                  onChange={e => setSchedulerForm(prev => ({
                    ...prev,
                    publishTime: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={schedulerForm.notifySubscribers}
                    onChange={e => setSchedulerForm(prev => ({
                      ...prev,
                      notifySubscribers: e.target.checked
                    }))}
                  />
                  Notify Subscribers
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowScheduler(false)}>
                  Cancel
                </button>
                <button type="submit" className="schedule-btn">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className={`preview-modal ${previewDevice}`} onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <div className="preview-controls">
                <button 
                  className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => handleDeviceChange('desktop')}
                >
                  <FaDesktop /> Desktop
                </button>
                <button 
                  className={`device-btn ${previewDevice === 'tablet' ? 'active' : ''}`}
                  onClick={() => handleDeviceChange('tablet')}
                >
                  <FaTabletAlt /> Tablet
                </button>
                <button 
                  className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
                  onClick={() => handleDeviceChange('mobile')}
                >
                  <FaMobileAlt /> Mobile
                </button>
              </div>
              <div className="preview-actions">
                <div className="status-buttons">
                  <button 
                    className={`status-btn ${previewContent?.status === 'draft' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(previewContent.id, 'draft')}
                    disabled={loading || previewContent?.status === 'draft'}
                    data-status="draft"
                  >
                    <FaPencilAlt /> Draft
                  </button>
                  <button 
                    className={`status-btn ${previewContent?.status === 'published' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(previewContent.id, 'published')}
                    disabled={loading || previewContent?.status === 'published'}
                    data-status="published"
                  >
                    <FaCheck /> Publish
                  </button>
                  <button 
                    className={`status-btn ${previewContent?.status === 'archived' ? 'active' : ''}`}
                    onClick={() => handleStatusChange(previewContent.id, 'archived')}
                    disabled={loading || previewContent?.status === 'archived'}
                    data-status="archived"
                  >
                    <FaArchive /> Archive
                  </button>
                </div>
                <button 
                  className="preview-action-btn"
                  onClick={() => {
                    setSelectedContent(previewContent);
                    setContentForm({
                      ...previewContent,
                      seo: previewContent.seo || {
                        metaTitle: '',
                        metaDescription: '',
                        keywords: ''
                      }
                    });
                    setImagePreview(previewContent.featuredImage);
                    setShowEditor(true);
                    setShowPreview(false);
                  }}
                  title="Edit"
                >
                  <FaEdit /> Edit
                </button>
                <button 
                  className="close-preview-btn"
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewDevice('desktop');
                    setPreviewContent(null);
                  }}
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="preview-content">
              <div className="preview-wrapper">
                {previewContent?.featuredImage && (
                  <div className="preview-image">
                    <img src={previewContent.featuredImage} alt={previewContent.title} />
                  </div>
                )}
                <div className="preview-body">
                  <h1>{previewContent?.title}</h1>
                  <div className="preview-meta">
                    {previewContent?.author && (
                      <span className="meta-item">
                        <FaUser /> {previewContent.author}
                      </span>
                    )}
                    <span className="meta-item">
                      <FaCalendar /> {new Date(previewContent?.publishDate).toLocaleDateString()}
                    </span>
                    {previewContent?.category && (
                      <span className="preview-category">
                        <FaFolder /> {previewContent.category}
                      </span>
                    )}
                    <span className={`status-badge ${previewContent?.status}`}>
                      {previewContent?.status}
                    </span>
                  </div>
                  <div 
                    className="preview-text ql-editor"
                    dangerouslySetInnerHTML={{ 
                      __html: previewContent?.content || '<p>No content</p>'
                    }}
                  />
                  {previewContent?.tags?.length > 0 && (
                    <div className="preview-tags">
                      <FaTag />
                      {previewContent.tags.map(tag => (
                        <span key={tag} className="preview-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className="debug-btn"
        onClick={async () => {
          try {
            console.log('Starting database debug...');
            
            const contentSnapshot = await getDocs(collection(db, 'content'));
            const contentData = contentSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            const contentByStatus = contentData.reduce((acc, item) => {
              acc[item.status] = acc[item.status] || [];
              acc[item.status].push(item);
              return acc;
            }, {});

            setDebugData({
              total: contentData.length,
              published: contentByStatus.published?.length || 0,
              draft: contentByStatus.draft?.length || 0,
              archived: contentByStatus.archived?.length || 0,
              byStatus: contentByStatus
            });

            setShowDebugModal(true);
          } catch (error) {
            console.error('Debug failed:', error);
            setDebugData({ error: error.message });
            setShowDebugModal(true);
          }
        }}
      >
        <FaBug /> Debug DB
      </button>

      {/* Debug Modal */}
      {showDebugModal && (
        <div className="modal-overlay" onClick={() => setShowDebugModal(false)}>
          <div className="debug-modal" onClick={e => e.stopPropagation()}>
            <div className="debug-modal-header">
              <h3>Database Debug Information</h3>
              <button className="close-btn" onClick={() => setShowDebugModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="debug-modal-content">
              {debugData?.error ? (
                <div className="debug-error">
                  <h4>Error occurred:</h4>
                  <p>{debugData.error}</p>
                </div>
              ) : (
                <>
                  <div className="debug-stats">
                    <div className="stat-item">
                      <h4>Total Items</h4>
                      <span>{debugData?.total || 0}</span>
                    </div>
                    <div className="stat-item">
                      <h4>Published</h4>
                      <span className="published">{debugData?.published || 0}</span>
                    </div>
                    <div className="stat-item">
                      <h4>Draft</h4>
                      <span className="draft">{debugData?.draft || 0}</span>
                    </div>
                    <div className="stat-item">
                      <h4>Archived</h4>
                      <span className="archived">{debugData?.archived || 0}</span>
                    </div>
                  </div>
                  <div className="debug-details">
                    <h4>Recent Content</h4>
                    <div className="debug-list">
                      {debugData?.byStatus?.published?.slice(0, 5).map(item => (
                        <div key={item.id} className="debug-item">
                          <span className="title">{item.title}</span>
                          <span className="status published">published</span>
                        </div>
                      ))}
                      {debugData?.byStatus?.draft?.slice(0, 5).map(item => (
                        <div key={item.id} className="debug-item">
                          <span className="title">{item.title}</span>
                          <span className="status draft">draft</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager; 