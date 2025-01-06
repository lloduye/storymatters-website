import React, { useState, useEffect } from 'react';
import { storage, auth, db } from '../../../firebase/config';
import { ref, listAll, getDownloadURL, deleteObject, uploadBytes, getMetadata } from 'firebase/storage';
import { FaImage, FaTrash, FaCopy, FaUpload, FaSearch, FaSort, FaEye, FaExclamationTriangle, FaTimes, FaExchangeAlt, FaExternalLinkAlt } from 'react-icons/fa';
import './MediaManager.css';
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const MediaManager = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [deleteItem, setDeleteItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [affectedContent, setAffectedContent] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      loadMediaItems();
    }
  }, []);

  const loadMediaItems = async () => {
    try {
      setLoading(true);
      const storageRef = ref(storage, 'content');
      const result = await listAll(storageRef);
      
      const items = await Promise.all(
        result.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item);
            return {
              name: item.name,
              path: item.fullPath,
              url: url,
              ref: item,
              createdAt: new Date().toISOString()
            };
          } catch (error) {
            console.error(`Error loading item ${item.name}:`, error);
            return null;
          }
        })
      );

      // Filter out any null items from failed loads
      const validItems = items.filter(item => item !== null);
      setMediaItems(validItems);
    } catch (error) {
      console.error('Error loading media:', error);
      setNotification({
        type: 'error',
        message: 'Error loading media items'
      });
    } finally {
      setLoading(false);
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
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 1920px width/height)
          let width = img.width;
          let height = img.height;
          if (width > 1920) {
            height = (height * 1920) / width;
            width = 1920;
          }
          if (height > 1920) {
            width = (width * 1920) / height;
            height = 1920;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          }, 'image/jpeg', 0.8); // 80% quality
        };
      };
    });
  };

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        // Compress image before upload
        const compressedFile = await compressImage(file);
        
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `content/${fileName}`);

        // Add metadata
        const metadata = {
          contentType: 'image/jpeg',
          customMetadata: {
            originalName: file.name,
            uploadedBy: auth.currentUser?.email || 'unknown',
            uploadedAt: new Date().toISOString(),
            originalSize: `${file.size}`,
            compressedSize: `${compressedFile.size}`
          }
        };

        await uploadBytes(storageRef, compressedFile, metadata);
      }

      await loadMediaItems();
      setNotification({
        type: 'success',
        message: 'Files uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      setNotification({
        type: 'error',
        message: 'Error uploading files'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      if (!auth.currentUser) {
        setNotification({
          type: 'error',
          message: 'You must be logged in to delete files'
        });
        return;
      }

      // Check for content using this image
      const contentRef = collection(db, 'content');
      const q = query(contentRef, where('featuredImage', '==', item.url));
      const querySnapshot = await getDocs(q);
      
      setAffectedContent(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setDeleteItem(item);
    } catch (error) {
      console.error('Auth check error:', error);
      setNotification({
        type: 'error',
        message: 'Authentication error'
      });
    }
  };

  const safeDeleteObject = async (fileRef) => {
    try {
      // Check auth state again before delete
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      await deleteObject(fileRef);
      return true;
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        return true;
      }
      if (error.code === 'storage/unauthorized') {
        throw new Error('You do not have permission to delete this file');
      }
      throw error;
    }
  };

  const confirmDelete = async () => {
    if (!deleteItem || !deleteItem.path) {
      setNotification({
        type: 'error',
        message: 'Invalid file reference'
      });
      setDeleteItem(null);
      return;
    }

    try {
      // First, find all content using this image
      const contentRef = collection(db, 'content');
      const q = query(contentRef, where('featuredImage', '==', deleteItem.url));
      const querySnapshot = await getDocs(q);

      // Create a batch for updating multiple documents
      const batch = writeBatch(db);

      // Update all content items that use this image
      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          featuredImage: null // Or you could set it to a default image URL
        });
      });

      // Create a fresh reference to the file
      const fileRef = ref(storage, deleteItem.path);
      
      // Delete the file from storage
      const deleted = await safeDeleteObject(fileRef);
      
      if (deleted) {
        // Commit the batch update
        await batch.commit();

        // Update local state
        setMediaItems(prev => prev.filter(item => item.path !== deleteItem.path));
        
        setNotification({
          type: 'success',
          message: `File deleted successfully${querySnapshot.docs.length > 0 ? ` and ${querySnapshot.docs.length} content items updated` : ''}`
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Error deleting file. Please try again.'
      });
    } finally {
      setDeleteItem(null);
    }
  };

  const copyToClipboard = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setNotification({
        type: 'success',
        message: 'URL copied to clipboard'
      });
    } catch (error) {
      console.error('Copy error:', error);
      setNotification({
        type: 'error',
        message: 'Error copying URL'
      });
    }
  };

  const getAssociatedStories = async (imageUrl) => {
    try {
      const contentRef = collection(db, 'content');
      const q = query(contentRef, where('featuredImage', '==', imageUrl));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching associated stories:', error);
      return [];
    }
  };

  const handleImagePreview = async (item) => {
    try {
      const imageRef = ref(storage, item.path);
      const metadata = await getMetadata(imageRef);
      const associatedStories = await getAssociatedStories(item.url);
      
      setImageMetadata({
        ...metadata,
        associatedStories
      });
      setPreviewImage(item);
    } catch (error) {
      console.error('Error getting image details:', error);
      setNotification({
        type: 'error',
        message: 'Error loading image details'
      });
    }
  };

  const handleReplaceImage = async (event, currentImage) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);

      // Compress the new image
      const compressedFile = await compressImage(file);
      
      // Create a reference to the existing file path
      const storageRef = ref(storage, currentImage.path);
      
      // Upload the new file to the same path
      const uploadResult = await uploadBytes(storageRef, compressedFile, {
        contentType: 'image/jpeg',
        customMetadata: {
          replacedAt: new Date().toISOString(),
          replacedBy: auth.currentUser?.email || 'unknown',
          originalName: file.name
        }
      });

      // Get the new URL
      const newUrl = await getDownloadURL(uploadResult.ref);

      // Update any stories that use this image
      if (imageMetadata?.associatedStories?.length > 0) {
        const updatePromises = imageMetadata.associatedStories.map(story => {
          const storyRef = doc(db, 'content', story.id);
          return updateDoc(storyRef, {
            featuredImage: newUrl
          });
        });

        await Promise.all(updatePromises);
      }

      // Update local state
      setMediaItems(prev => prev.map(item => 
        item.path === currentImage.path 
          ? { ...item, url: newUrl }
          : item
      ));

      setNotification({
        type: 'success',
        message: 'Image replaced successfully'
      });

      // Close the preview modal
      setPreviewImage(null);
      
      // Refresh the media items to get the latest data
      await loadMediaItems();

    } catch (error) {
      console.error('Replace error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Error replacing image'
      });
    } finally {
      setUploading(false);
    }
  };

  const filteredAndSortedMedia = mediaItems
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div className="media-manager">
      <div className="media-header">
        <h2>Media Manager</h2>
        <div className="media-actions-bar">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
          </select>
          
          <div className="upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              id="media-upload"
              disabled={uploading}
              multiple
            />
            <label htmlFor="media-upload" className={`upload-button ${uploading ? 'uploading' : ''}`}>
              <FaUpload /> {uploading ? 'Uploading...' : 'Upload Media'}
            </label>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading media items...</div>
      ) : (
        <div className="media-grid">
          {filteredAndSortedMedia.map((item) => (
            <div key={item.path} className="media-item">
              <div 
                className="media-preview"
                onClick={() => handleImagePreview(item)}
              >
                <img src={item.url} alt={item.name} />
                <div className="media-overlay">
                  <FaEye />
                </div>
              </div>
              <div className="media-info">
                <p className="media-name">{item.name}</p>
                <div className="media-actions">
                  <button onClick={() => copyToClipboard(item.url)} title="Copy URL">
                    <FaCopy />
                  </button>
                  <button onClick={() => handleDelete(item)} title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteItem && (
        <div className="delete-modal-overlay" onClick={() => setDeleteItem(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h3>Confirm Delete</h3>
            </div>
            <div className="delete-modal-content">
              <p>Are you sure you want to delete this file?</p>
              {affectedContent.length > 0 && (
                <div className="affected-content">
                  <p className="warning-text">
                    This image is used in {affectedContent.length} content item{affectedContent.length !== 1 ? 's' : ''}:
                  </p>
                  <ul>
                    {affectedContent.map(content => (
                      <li key={content.id}>{content.title}</li>
                    ))}
                  </ul>
                  <p className="warning-text">These items will have their featured images removed.</p>
                </div>
              )}
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setDeleteItem(null);
                  setAffectedContent([]);
                }}
              >
                Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="preview-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="preview-modal" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Image Preview</h3>
              <button className="close-btn" onClick={() => setPreviewImage(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="preview-content">
              <div className="preview-image">
                <img src={previewImage.url} alt={previewImage.name} />
                <div className="replace-image">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleReplaceImage(e, previewImage)}
                    id="replace-image"
                    disabled={uploading}
                  />
                  <label htmlFor="replace-image" className={uploading ? 'uploading' : ''}>
                    <FaExchangeAlt /> Replace Image
                  </label>
                </div>
              </div>
              <div className="preview-info">
                <h4>File Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span>Name:</span>
                    <p>{previewImage.name}</p>
                  </div>
                  {imageMetadata && (
                    <>
                      <div className="info-item">
                        <span>Size:</span>
                        <p>{formatFileSize(imageMetadata.size)}</p>
                      </div>
                      <div className="info-item">
                        <span>Type:</span>
                        <p>{imageMetadata.contentType}</p>
                      </div>
                      <div className="info-item">
                        <span>Created:</span>
                        <p>{new Date(imageMetadata.timeCreated).toLocaleString()}</p>
                      </div>
                      <div className="info-item">
                        <span>Updated:</span>
                        <p>{new Date(imageMetadata.updated).toLocaleString()}</p>
                      </div>
                    </>
                  )}
                </div>

                {imageMetadata?.associatedStories?.length > 0 && (
                  <div className="associated-stories">
                    <h4>Published In:</h4>
                    <div className="stories-list">
                      {imageMetadata.associatedStories.map(story => (
                        <div key={story.id} className="story-item">
                          <h5>{story.title}</h5>
                          <p>Published: {new Date(story.createdAt).toLocaleDateString()}</p>
                          <Link to={`/news/${story.id}`} target="_blank">
                            <FaExternalLinkAlt /> View Story
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="preview-actions">
                  <button onClick={() => copyToClipboard(previewImage.url)}>
                    <FaCopy /> Copy URL
                  </button>
                  <button onClick={() => handleDelete(previewImage)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManager; 