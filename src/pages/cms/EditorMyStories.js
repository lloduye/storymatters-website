import React, { useState, useEffect, useCallback } from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faEye,
  faEdit,
  faToggleOn,
  faToggleOff,
  faStar,
  faPlus,
  faSearch,
  faCircle,
  faTrash,
  faPencilAlt,
  faMapMarkerAlt,
  faClock,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const EditorMyStories = () => {
  useScrollToTop();
  
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchMyStories = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const currentUser = user || JSON.parse(localStorage.getItem('userData') || '{}');
      // Always use full_name from database for API calls
      const userName = currentUser.full_name || currentUser.fullName;
      if (!userName) {
        toast.error('User information not found');
        setIsLoading(false);
        return;
      }
      const response = await axios.get(`/api/stories/user/${userName}`);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load your stories');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]); // Add isLoading dependency to prevent multiple requests

  useEffect(() => {
    fetchMyStories();
  }, []); // Only fetch on mount, not on every user change

  const handleToggleStatus = async (storyId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
              await axios.patch(`/api/stories/${storyId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success(`Story status updated to ${newStatus}`);
      fetchMyStories();
    } catch (error) {
      console.error('Error updating story status:', error);
      toast.error('Failed to update story status');
    }
  };

  const handleToggleFeatured = async (storyId, currentFeatured) => {
    try {
              await axios.patch(`/api/stories/${storyId}/featured`, 
        { featured: !currentFeatured },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success(`Story featured status updated`);
      fetchMyStories();
    } catch (error) {
      console.error('Error updating story featured status:', error);
      toast.error('Failed to update story featured status');
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
              await axios.delete(`/api/stories/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success('Story deleted successfully');
      fetchMyStories();
      setShowDeleteModal(false);
      setSelectedStory(null);
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Failed to delete story');
    }
  };

  const handlePreviewStory = (story) => {
    setSelectedStory(story);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedStory(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeaturedColor = (featured) => {
    return featured ? 'text-yellow-500' : 'text-gray-400';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/Images/2025-01-06-community-dialogues.jpg';
    
    // If the image path is already a full URL, use it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If the image path starts with /uploads/, it's from the CMS
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    
    // If it's a local image in the Images folder, prepend the path
    if (imagePath.includes('Images/') || imagePath.includes('2025-')) {
      return `/${imagePath}`;
    }
    
    // For placeholder images or other cases
    if (imagePath.includes('placeholder')) {
      return imagePath;
    }
    
    // Default fallback
    return '/Images/2025-01-06-community-dialogues.jpg';
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const publishedStories = stories.filter(story => story.status === 'published');
  const draftStories = stories.filter(story => story.status === 'draft');
  const featuredStories = stories.filter(story => story.featured);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 mr-2" />
            My Stories
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage and edit your published stories and drafts</p>
        </div>
        <Link
          to="/editor/stories/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create New Story
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Stories</p>
              <p className="text-xl font-semibold text-gray-900">{stories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faEye} className="text-green-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Published</p>
              <p className="text-xl font-semibold text-gray-900">{publishedStories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faPencilAlt} className="text-yellow-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Drafts</p>
              <p className="text-xl font-semibold text-gray-900">{draftStories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faStar} className="text-purple-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Featured</p>
              <p className="text-xl font-semibold text-gray-900">{featuredStories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Stories</label>
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Filter</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
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
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 mr-2" />
            Your Stories ({filteredStories.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your stories with full editing capabilities
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Story</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {stories.length === 0 ? 'No stories found. Create your first story!' : 'No stories match your filters'}
                  </td>
                </tr>
              ) : (
                filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50 border-l-4 border-l-green-400">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon icon={faNewspaper} className="text-white text-sm" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {story.title}
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              My Story
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">{story.description}</div>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                            <span className="flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                              {story.location || 'No location'}
                            </span>
                            <span className="flex items-center">
                              <FontAwesomeIcon icon={faClock} className="mr-1" />
                              {story.readTime || 'No read time'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                        {story.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FontAwesomeIcon 
                        icon={story.featured ? faStar : faCircle} 
                        className={`text-lg ${getFeaturedColor(story.featured)}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {story.viewCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {story.createdAt ? format(new Date(story.createdAt), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePreviewStory(story)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                          title="Preview Story"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <Link
                          to={`/editor/stories/edit/${story.id}`}
                          className="text-green-600 hover:text-green-900 p-2 rounded-md hover:bg-green-50 transition-colors"
                          title="Edit Story"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(story.id, story.status)}
                          className={`p-2 rounded-md transition-colors ${story.status === 'published' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                          title={story.status === 'published' ? 'Set to Draft' : 'Publish Story'}
                        >
                          <FontAwesomeIcon icon={story.status === 'published' ? faToggleOff : faToggleOn} />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(story.id, story.featured)}
                          className={`p-2 rounded-md transition-colors ${story.featured ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          title={story.featured ? 'Remove from Featured' : 'Mark as Featured'}
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStory(story);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete Story"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Story Preview</h2>
              <button
                onClick={closePreviewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedStory.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>By {selectedStory.author}</span>
                  <span>•</span>
                  <span>{selectedStory.location || 'No location'}</span>
                  <span>•</span>
                  <span>{selectedStory.createdAt ? format(new Date(selectedStory.createdAt), 'MMM dd, yyyy') : 'No date'}</span>
                </div>
              </div>
              
              {selectedStory.image && (
                <div>
                  <img 
                    src={getImageUrl(selectedStory.image)} 
                    alt={selectedStory.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedStory.content }} />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={closePreviewModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faTrash} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Story</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedStory.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStory(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStory(selectedStory.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorMyStories;
