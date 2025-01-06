import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../../firebase/config';
import { ref, listAll, getDownloadURL, deleteObject, uploadBytes } from 'firebase/storage';
import { FaImage, FaTrash, FaCopy, FaUpload, FaSearch, FaSort, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import './MediaManager.css';

const MediaManager = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [deleteItem, setDeleteItem] = useState(null);

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

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          setNotification({
            type: 'error',
            message: `File ${file.name} is too large. Maximum size is 5MB.`
          });
          continue;
        }

        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `content/${fileName}`);

        // Add metadata
        const metadata = {
          contentType: file.type,
          customMetadata: {
            uploadedBy: auth.currentUser?.email || 'unknown',
            uploadedAt: new Date().toISOString()
          }
        };

        await uploadBytes(storageRef, file, metadata);
      }

      await loadMediaItems(); // Reload the list after upload
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
      // Create a fresh reference to the file
      const fileRef = ref(storage, deleteItem.path);
      
      // Attempt to delete
      const deleted = await safeDeleteObject(fileRef);
      
      if (deleted) {
        // Update local state first
        setMediaItems(prev => prev.filter(item => item.path !== deleteItem.path));
        
        setNotification({
          type: 'success',
          message: 'File deleted successfully'
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
              <div className="media-preview">
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
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setDeleteItem(null)}
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
    </div>
  );
};

export default MediaManager; 