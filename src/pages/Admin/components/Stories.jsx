import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const PREDEFINED_CATEGORIES = [
  "Refugee Teens Talk",
  "Kakuma Media Production",
  "Kakuma Theatre",
  "Events",
  "Updates",
  "Other"
];

const Stories = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [stories, setStories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    location: '',
    category: '',
    description: '',
    editor: '',
    mainImage: null,
    mainImageCredit: '',
    content: [
      { type: 'side-by-side', text: '', image: null, imageCredit: '' },
      { type: 'full-width', text: '', image: null, imageCredit: '' },
      { type: 'side-by-side-reverse', text: '', image: null, imageCredit: '' },
      { type: 'full-width', text: '', image: null, imageCredit: '' }
    ]
  });
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // Auth check effect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch stories effect
  useEffect(() => {
    if (authChecked) {
      fetchStories();
    }
  }, [authChecked]);

  const fetchStories = async () => {
    try {
      const q = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const storiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStories(storiesData);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    try {
      // Create a unique file name
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${file.name}`;
      
      // Create storage reference
      const storageRef = ref(storage, `stories/${uniqueFileName}`);
      
      // Create file metadata including the content type
      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: auth.currentUser.uid,
          uploadedAt: new Date().toISOString()
        }
      };

      // Upload the file with metadata
      const uploadResult = await uploadBytes(storageRef, file, metadata);
      console.log('File uploaded successfully:', uploadResult);

      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('Download URL:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const storyData = { ...formData };
      
      // Add timestamp and formatted date
      storyData.timestamp = serverTimestamp();
      storyData.publishedAt = formData.publishedAt;
      storyData.date = new Date(formData.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      // Upload main image if exists
      if (formData.mainImage) {
        try {
          const mainImageUrl = await handleImageUpload(formData.mainImage);
          if (!mainImageUrl) {
            throw new Error('Failed to upload main image');
          }
          storyData.image = mainImageUrl;
          storyData.mainImageCredit = formData.mainImageCredit;
        } catch (error) {
          console.error('Main image upload error:', error);
          alert(`Failed to upload main image: ${error.message}`);
          setLoading(false);
          return;
        }
      }

      // Process content sections with credits
      const contentWithImages = await Promise.all(
        formData.content.map(async (section, index) => {
          if (section.image) {
            try {
              const imageUrl = await handleImageUpload(section.image);
              return { 
                ...section, 
                image: { 
                  src: imageUrl,
                  credit: section.imageCredit
                }
              };
            } catch (error) {
              console.error(`Section ${index} image upload error:`, error);
              return { ...section, image: null };
            }
          }
          return section;
        })
      );

      storyData.content = contentWithImages;
      delete storyData.mainImage; // Remove the file object

      // Save to Firestore
      if (editingStory) {
        await updateDoc(doc(db, 'stories', editingStory.id), storyData);
      } else {
        await addDoc(collection(db, 'stories'), storyData);
      }

      // Refresh the stories list
      await fetchStories();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Story save error:', error);
      alert(`Failed to save story: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, 'stories', storyId));
        
        // Optionally, delete associated images from Storage
        // You might want to store image paths in the document to make this easier
        
        await fetchStories();
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      location: '',
      category: '',
      description: '',
      editor: '',
      mainImage: null,
      mainImageCredit: '',
      content: [
        { type: 'side-by-side', text: '', image: null, imageCredit: '' },
        { type: 'full-width', text: '', image: null, imageCredit: '' },
        { type: 'side-by-side-reverse', text: '', image: null, imageCredit: '' },
        { type: 'full-width', text: '', image: null, imageCredit: '' }
      ]
    });
    setEditingStory(null);
    setShowCustomCategory(false);
    setCustomCategory('');
  };

  const validateFormData = (data) => {
    if (!data.title?.trim()) return 'Title is required';
    if (!data.date?.trim()) return 'Date is required';
    if (!data.category?.trim()) return 'Category is required';
    if (!data.description?.trim()) return 'Description is required';
    if (!data.editor?.trim()) return 'Editor is required';
    if (!data.mainImage && !editingStory) return 'Main image is required';
    return null;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateFormData(formData);
    if (validationError) {
      alert(validationError);
      return;
    }
    await handleSubmit(e);
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stories-section">
      <div className="stories-header">
        <h2>Stories Management</h2>
        <button 
          className="primary-button"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> Add New Story
        </button>
      </div>

      {/* Stories List */}
      <div className="stories-list">
        {stories.map((story) => (
          <div key={story.id} className="story-item">
            <div className="story-image-container">
              <img src={story.image} alt={story.title} className="story-thumbnail" />
              {story.mainImageCredit && (
                <div className="story-image-credit">
                  Photo: {story.mainImageCredit}
                </div>
              )}
            </div>
            <div className="story-info">
              <h3>{story.title}</h3>
              <p>{story.description}</p>
              <div className="story-meta">
                <span>{new Date(story.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                <span className="location">{story.location}</span>
                <span className="category">{story.category}</span>
                <span>Editor: {story.editor}</span>
              </div>
            </div>
            <div className="story-actions">
              <button 
                className="edit-button"
                onClick={() => {
                  setEditingStory(story);
                  setFormData({ ...story });
                  setIsModalOpen(true);
                }}
              >
                <FaEdit />
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(story.id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Story Form Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingStory ? 'Edit Story' : 'Add New Story'}</h2>
            <form onSubmit={handleFormSubmit}>
              {/* Form fields */}
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Publication Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.publishedAt.slice(0, 16)}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      publishedAt: new Date(e.target.value).toISOString(),
                      date: new Date(e.target.value).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })
                    })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Nairobi, Kenya"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === 'other') {
                      setShowCustomCategory(true);
                      setFormData({ ...formData, category: '' });
                    } else {
                      setShowCustomCategory(false);
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  required
                >
                  <option value="">Select a category</option>
                  {PREDEFINED_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="other">Other (Custom)</option>
                </select>

                {showCustomCategory && (
                  <div className="custom-category-input">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setFormData({ ...formData, category: e.target.value });
                      }}
                      placeholder="Enter custom category"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Editor</label>
                <input
                  type="text"
                  value={formData.editor}
                  onChange={(e) => setFormData({ ...formData, editor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Main Image</label>
                <div className="image-upload-group">
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.files[0] })}
                    accept="image/*"
                  />
                  <input
                    type="text"
                    placeholder="Photographer credit"
                    value={formData.mainImageCredit}
                    onChange={(e) => setFormData({ ...formData, mainImageCredit: e.target.value })}
                    className="photographer-credit"
                  />
                </div>
              </div>

              {/* Content Sections */}
              <div className="content-sections">
                {formData.content.map((section, index) => (
                  <div key={index} className={`content-section ${section.type}`}>
                    <h3>Section {index + 1}: {section.type.split('-').join(' ').toUpperCase()}</h3>
                    
                    {section.type.includes('side-by-side') ? (
                      <div className="side-by-side-inputs">
                        <div className="text-input">
                          <label>Text Content</label>
                          <textarea
                            value={section.text}
                            onChange={(e) => {
                              const newContent = [...formData.content];
                              newContent[index].text = e.target.value;
                              setFormData({ ...formData, content: newContent });
                            }}
                            placeholder={`Enter text for section ${index + 1}`}
                          />
                        </div>
                        
                        <div className="image-input">
                          <label>Section Image</label>
                          <div className="image-upload-group">
                            <input
                              type="file"
                              onChange={(e) => {
                                const newContent = [...formData.content];
                                newContent[index].image = e.target.files[0];
                                setFormData({ ...formData, content: newContent });
                              }}
                              accept="image/*"
                            />
                            <input
                              type="text"
                              placeholder="Photographer credit"
                              value={section.imageCredit || ''}
                              onChange={(e) => {
                                const newContent = [...formData.content];
                                newContent[index].imageCredit = e.target.value;
                                setFormData({ ...formData, content: newContent });
                              }}
                              className="photographer-credit"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="full-width-input">
                        <label>Text Content</label>
                        <textarea
                          value={section.text}
                          onChange={(e) => {
                            const newContent = [...formData.content];
                            newContent[index].text = e.target.value;
                            setFormData({ ...formData, content: newContent });
                          }}
                          placeholder={`Enter text for section ${index + 1}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="primary-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories; 