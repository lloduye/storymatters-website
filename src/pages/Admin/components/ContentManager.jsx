import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase/config';
import { 
  collection, query, orderBy, getDocs, addDoc, updateDoc, 
  deleteDoc, doc, serverTimestamp, where, writeBatch 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaEye, 
  FaTimes, FaTag, FaCalendar, FaFolder, FaHistory, FaClock, FaThLarge, FaList, FaCheck, FaDesktop, FaTabletAlt, FaMobileAlt, FaUser, FaPencilAlt, FaArchive 
} from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ContentManager.css';

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

  useEffect(() => {
    loadContent();
  }, [filter]);

  useEffect(() => {
    loadUnpublishedStories();
  }, []);

  const loadContent = async () => {
    try {
      const q = query(collection(db, 'content'), orderBy('publishDate', 'desc'));
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
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : filteredContent;

      setContent(searchedContent);
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
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
    if (!file) return null;
    const storageRef = ref(storage, `content/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = contentForm.featuredImage;
      
      // Handle new image upload
      if (imagePreview && imagePreview !== contentForm.featuredImage) {
        const file = await fetch(imagePreview).then(r => r.blob());
        imageUrl = await handleImageUpload(file);
      }

      const contentData = {
        ...contentForm,
        featuredImage: imageUrl,
        updatedAt: serverTimestamp()
      };

      if (selectedContent) {
        await updateDoc(doc(db, 'content', selectedContent.id), contentData);
      } else {
        contentData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'content'), contentData);
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
        loadContent();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setContentForm(prev => ({ ...prev, featuredImage: reader.result }));
      };
      reader.readAsDataURL(file);
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
      type: 'article',
      status: 'draft',
      content: '',
      excerpt: '',
      featuredImage: '',
      category: '',
      tags: [],
      author: '',
      publishDate: new Date().toISOString().split('T')[0],
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: ''
      }
    });
    setImagePreview(null);
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
      await updateDoc(doc(db, 'content', contentId), {
        status: newStatus,
        ...(newStatus === 'published' ? { publishedAt: serverTimestamp() } : {})
      });
      
      // Update local state
      setContent(prevContent => 
        prevContent.map(item => 
          item.id === contentId 
            ? { ...item, status: newStatus } 
            : item
        )
      );
      
      // Update preview content
      setPreviewContent(prev => ({ ...prev, status: newStatus }));
      
      // Refresh unpublished stories if needed
      if (newStatus === 'published' || newStatus === 'draft') {
        loadUnpublishedStories();
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error changing content status:', error);
      setLoading(false);
    }
  };

  return (
    <div className="content-manager">
      {/* Header Section */}
      <div className="content-header">
        <div className="header-left">
          <h2>Content Management</h2>
          <button className="add-content-btn" onClick={() => setShowEditor(true)}>
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
          <div className="content-grid">
            {content.map(item => (
              <div key={item.id} className="content-card">
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
                    <option value="article">Article</option>
                    <option value="page">Page</option>
                    <option value="news">News</option>
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
    </div>
  );
};

export default ContentManager; 