import React$1 from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faEye, 
  faUpload, 
  faTimes,
  faPlus,
  faEdit,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const EditorCreateStory = () => {
  useScrollToTop();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    location: '',
    category: '',
    readTime: '',
    content: '',
    tags: '',
    image: null,
    imagePreview: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, formData[key].split(',').map(tag => tag.trim()).join(','));
        } else if (key !== 'imagePreview') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add author and status - get user from context or localStorage
      const currentUser = user || JSON.parse(localStorage.getItem('userData') || '{}');
      formDataToSend.append('author', currentUser.fullName || currentUser.full_name || 'Unknown Author');
      formDataToSend.append('status', 'published');
      formDataToSend.append('featured', 'false');
      formDataToSend.append('publishDate', new Date().toISOString().split('T')[0]);
      formDataToSend.append('viewCount', '0');

      await axios.post('/api/stories', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success('Story created successfully!');
      navigate('/editor/dashboard');
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('Failed to create story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, formData[key].split(',').map(tag => tag.trim()).join(','));
        } else if (key !== 'imagePreview') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add author and status for draft
      const currentUser = user || JSON.parse(localStorage.getItem('userData') || '{}');
      formDataToSend.append('author', currentUser.fullName || currentUser.full_name || 'Unknown Author');
      formDataToSend.append('status', 'draft');
      formDataToSend.append('featured', 'false');
      formDataToSend.append('publishDate', new Date().toISOString().split('T')[0]);
      formDataToSend.append('viewCount', '0');

      await axios.post('/api/stories', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      toast.success('Draft saved successfully!');
      navigate('/editor/dashboard');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faEdit} className="text-blue-600 mr-2" />
              Create New Story
            </h1>
            <p className="text-sm text-gray-600 mt-1">Share your story with the community</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center"
            >
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              {showPreview ? 'Hide Preview' : 'Preview'}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 border border-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {!showPreview ? (
        /* Story Creation Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your story title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of your story"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Community Development">Community Development</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Youth Empowerment">Youth Empowerment</option>
                  <option value="Women Empowerment">Women Empowerment</option>
                  <option value="Technology">Technology</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Nairobi, Kenya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 5 min read"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of your story"
              />
            </div>
          </div>

          {/* Story Content */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Story Content</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="Write your story here... You can use HTML tags for formatting."
              />
              <p className="text-xs text-gray-500 mt-1">
                You can use HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;h2&gt;, etc.
              </p>
            </div>
          </div>

          {/* Media & Tags */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Media & Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload an image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        Choose Image
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple tags with commas (e.g., community, development, youth)
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/editor/dashboard')}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Publish Story
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Story Preview */
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || 'Story Title'}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>By {user?.fullName || user?.full_name || 'Editor'}</span>
              {formData.location && (
                <>
                  <span>•</span>
                  <span>{formData.location}</span>
                </>
              )}
              {formData.readTime && (
                <>
                  <span>•</span>
                  <span>{formData.readTime}</span>
                </>
              )}
            </div>
            {formData.description && (
              <p className="text-gray-600 mb-4">{formData.description}</p>
            )}
          </div>
          
          {formData.imagePreview && (
            <div className="mb-6">
              <img
                src={formData.imagePreview}
                alt="Story"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          {formData.content && (
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          )}
          
          {formData.tags && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {formData.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditorCreateStory;
