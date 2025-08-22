import React$1 from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDraftingCompass, 
  faEye,
  faEdit,
  faToggleOn,
  faPlus,
  faSearch,
  faTrash,
  faPencilAlt,
  faMapMarkerAlt,
  faClock,
  faTimes,
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const EditorDrafts = () => {
  useScrollToTop();
  
  const { user } = useAuth();
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const fetchDrafts = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = user || JSON.parse(localStorage.getItem('userData') || '{}');
      const userName = currentUser.fullName || currentUser.full_name;
      if (!userName) {
        toast.error('User information not found');
        setIsLoading(false);
        return;
      }
      const response = await axios.get(`/api/stories/user/${userName}`);
      // Filter for draft stories only
      const draftStories = response.data.filter(story => story.status === 'draft');
      setDrafts(draftStories);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      toast.error('Failed to load your drafts');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handlePublishDraft = async (draftId) => {
    try {
              await axios.patch(`/api/stories/${draftId}/status`, 
        { status: 'published' },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      toast.success('Draft published successfully!');
      fetchDrafts();
      setShowPublishModal(false);
      setSelectedDraft(null);
    } catch (error) {
      console.error('Error publishing draft:', error);
      toast.error('Failed to publish draft');
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
              await axios.delete(`/api/stories/${draftId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success('Draft deleted successfully');
      fetchDrafts();
      setShowDeleteModal(false);
      setSelectedDraft(null);
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
    }
  };

  const handlePreviewDraft = (draft) => {
    setSelectedDraft(draft);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedDraft(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Community Development': 'bg-blue-100 text-blue-800',
      'Education': 'bg-green-100 text-green-800',
      'Health': 'bg-red-100 text-red-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'Youth Empowerment': 'bg-purple-100 text-purple-800',
      'Women Empowerment': 'bg-pink-100 text-pink-800',
      'Technology': 'bg-indigo-100 text-indigo-800',
      'Arts & Culture': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.tags.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || draft.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(drafts.map(draft => draft.category)))];

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
            <FontAwesomeIcon icon={faDraftingCompass} className="text-blue-600 mr-2" />
            My Drafts
          </h1>
          <p className="text-sm text-gray-600 mt-1">Manage and publish your draft stories</p>
        </div>
        <Link
          to="/editor/stories/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create New Draft
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faDraftingCompass} className="text-blue-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Drafts</p>
              <p className="text-xl font-semibold text-gray-900">{drafts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faPencilAlt} className="text-yellow-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">In Progress</p>
              <p className="text-xl font-semibold text-gray-900">
                {drafts.filter(draft => draft.content && draft.content.length > 100).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Ready to Publish</p>
              <p className="text-xl font-semibold text-gray-900">
                {drafts.filter(draft => draft.title && draft.description && draft.content).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-purple-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Need Attention</p>
              <p className="text-xl font-semibold text-gray-900">
                {drafts.filter(draft => !draft.title || !draft.description || !draft.content).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Drafts</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Filter</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Drafts Grid */}
      {filteredDrafts.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <FontAwesomeIcon icon={faDraftingCompass} className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts found</h3>
          <p className="text-gray-500 mb-6">
            {drafts.length === 0 
              ? "You don't have any draft stories yet. Start creating your first story!" 
              : 'No drafts match your current filters.'}
          </p>
          {drafts.length === 0 && (
            <Link
              to="/editor/stories/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Create Your First Story
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrafts.map((draft) => (
            <div key={draft.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(draft.category)}`}>
                    {draft.category || 'Uncategorized'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {draft.updatedAt ? format(new Date(draft.updatedAt), 'MMM dd') : 'Draft'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {draft.title || 'Untitled Draft'}
                </h3>
                <p className="text-sm text-gray-600">
                  {draft.description || 'No description available'}
                </p>
              </div>

              {/* Content Preview */}
              <div className="p-4 border-b border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Content Preview:</div>
                <div className="text-sm text-gray-700 line-clamp-3">
                  {draft.content ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: draft.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                    }} />
                  ) : (
                    <span className="text-gray-400 italic">No content yet</span>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                    {draft.location || 'No location'}
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {draft.readTime || 'No read time'}
                  </span>
                </div>
                {draft.tags && (
                  <div className="flex flex-wrap gap-1">
                    {draft.tags.split(',').slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                    {draft.tags.split(',').length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{draft.tags.split(',').length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePreviewDraft(draft)}
                      className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors duration-200"
                      title="Preview Draft"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <Link
                      to={`/editor/stories/edit/${draft.id}`}
                      className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors duration-200"
                      title="Edit Draft"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </div>
                  <div className="flex items-center space-x-2">
                    {draft.title && draft.description && draft.content ? (
                      <button
                        onClick={() => {
                          setSelectedDraft(draft);
                          setShowPublishModal(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                        title="Ready to Publish"
                      >
                        <FontAwesomeIcon icon={faToggleOn} className="mr-1" />
                        Publish
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md">
                        Incomplete
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDraft(draft);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors duration-200"
                      title="Delete Draft"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Draft Preview</h2>
              <button
                onClick={closePreviewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedDraft.title || 'Untitled Draft'}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>By {selectedDraft.author}</span>
                  {selectedDraft.location && (
                    <>
                      <span>•</span>
                      <span>{selectedDraft.location}</span>
                    </>
                  )}
                  {selectedDraft.readTime && (
                    <>
                      <span>•</span>
                      <span>{selectedDraft.readTime}</span>
                    </>
                  )}
                </div>
                {selectedDraft.description && (
                  <p className="text-gray-600 mt-2">{selectedDraft.description}</p>
                )}
              </div>
              
              {selectedDraft.image && (
                <div>
                  <img 
                    src={selectedDraft.image} 
                    alt={selectedDraft.title || 'Draft'}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {selectedDraft.content ? (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedDraft.content }} />
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FontAwesomeIcon icon={faPencilAlt} className="text-4xl mb-2" />
                  <p>No content written yet</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-6">
              <Link
                to={`/editor/stories/edit/${selectedDraft.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continue Editing
              </Link>
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

      {/* Publish Confirmation Modal */}
      {showPublishModal && selectedDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faToggleOn} className="text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Publish Draft</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you ready to publish "{selectedDraft.title}"? This will make it visible to the public.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setSelectedDraft(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePublishDraft(selectedDraft.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Publish Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faTrash} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Draft</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedDraft.title || 'this draft'}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDraft(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDraft(selectedDraft.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorDrafts;
