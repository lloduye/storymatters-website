import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, faPlus, faSearch, faEdit, faTrash, faEye, faEyeSlash,
  faStar, faCalendarAlt, faUser, faTag, faCheckCircle,
  faClock, faTimes, faDownload, faTimes as faClose,
  faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const Stories = () => {
  useScrollToTop();
  
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [previewStory, setPreviewStory] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAllStories, setShowAllStories] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/.netlify/functions/stories');
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await axios.delete(`/.netlify/functions/stories`, {
          data: { storyId },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Story deleted successfully');
        fetchStories();
      } catch (error) {
        console.error('Error deleting story:', error);
        toast.error('Failed to delete story');
      }
    }
  };

  const handleToggleFeatured = async (storyId, currentFeatured) => {
    try {
      await axios.patch(`/.netlify/functions/stories`, {
        storyId,
        featured: !currentFeatured
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success(`Story ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`);
      fetchStories();
    } catch (error) {
      console.error('Error updating story:', error);
      toast.error('Failed to update story');
    }
  };

  const handleToggleStatus = async (storyId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await axios.patch(`/.netlify/functions/stories`, {
        storyId,
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      toast.success(`Story ${newStatus === 'published' ? 'published' : 'moved to draft'} successfully`);
      fetchStories();
    } catch (error) {
      console.error('Error updating story status:', error);
      toast.error('Failed to update story status');
    }
  };

  const handlePreviewStory = async (story) => {
    setPreviewStory(story);
    setShowPreview(true);
    
    // Don't increment view count for admin previews - only count actual website visitors
    // Removed the view count increment code here
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewStory(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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

  // Helper function to parse tags properly
  const parseTags = (tagsString) => {
    if (!tagsString) return [];
    
    try {
      // First try to parse as JSON
      if (tagsString.startsWith('{') || tagsString.startsWith('[')) {
        const parsed = JSON.parse(tagsString);
        if (Array.isArray(parsed)) {
          return parsed;
        } else if (typeof parsed === 'object') {
          // If it's an object with tags property
          return parsed.tags || Object.values(parsed) || [];
        }
      }
      
      // Fallback to comma-separated string
      return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || story.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || story.status === statusFilter;
    const matchesFeatured = featuredFilter === 'all' || 
                           (featuredFilter === 'featured' && story.featured === 'true') ||
                           (featuredFilter === 'not-featured' && story.featured !== 'true');
    
    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
  });

  const stats = {
    total: stories.length,
    published: stories.filter(s => s.status === 'published').length,
    draft: stories.filter(s => s.status === 'draft').length,
    featured: stories.filter(s => s.featured === 'true').length,
    totalViews: stories.reduce((sum, s) => sum + (parseInt(s.view_count) || 0), 0)
  };

  const categories = [...new Set(stories.map(story => story.category))];
  const statuses = [...new Set(stories.map(story => story.status))];

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center">
        <div className={`p-2 rounded-md ${color}`}>
          <FontAwesomeIcon icon={icon} className="text-white text-sm" />
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Story Management</h1>
          <p className="text-gray-600 mt-1">Manage your collection of stories and articles</p>
        </div>
        <Link
          to="/admin/stories/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Create Story
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Stories"
          value={stats.total}
          icon={faNewspaper}
          color="bg-blue-500"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={faCheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Drafts"
          value={stats.draft}
          icon={faClock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Featured"
          value={stats.featured}
          icon={faStar}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={faEye}
          color="bg-indigo-500"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stories</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center">
              <FontAwesomeIcon icon={faDownload} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

             {/* Stories Grid */}
       {isLoading ? (
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
           <p className="text-gray-600 mt-2">Loading stories...</p>
         </div>
       ) : filteredStories.length === 0 ? (
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
           <FontAwesomeIcon icon={faNewspaper} className="text-gray-400 text-4xl mb-4" />
           <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
           <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
           <Link
             to="/admin/stories/new"
             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
           >
             <FontAwesomeIcon icon={faPlus} className="mr-2" />
             Create Your First Story
           </Link>
         </div>
       ) : (
         <>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
             {filteredStories.slice(0, 15).map((story) => (
               <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
                 {/* Story Image */}
                 <div 
                   className="relative h-32 bg-gray-200 cursor-pointer"
                   onClick={() => handlePreviewStory(story)}
                 >
                   <img
                     src={getImageUrl(story.image)}
                     alt={story.title}
                     className="w-full h-full object-cover"
                   />
                   {story.featured === 'true' && (
                     <div className="absolute top-1 right-1">
                       <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                         <FontAwesomeIcon icon={faStar} className="mr-1 text-xs" />
                         Featured
                       </span>
                     </div>
                   )}
                   <div className="absolute top-1 left-1">
                     <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                       story.status === 'published' ? 'bg-green-100 text-green-800' :
                       story.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-gray-100 text-gray-800'
                     }`}>
                       {story.status === 'published' ? <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-xs" /> :
                        story.status === 'draft' ? <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" /> :
                        <FontAwesomeIcon icon={faTimes} className="mr-1 text-xs" />}
                       {story.status}
                     </span>
                   </div>
                 </div>

                 {/* Story Content */}
                 <div 
                   className="p-3 cursor-pointer"
                   onClick={() => handlePreviewStory(story)}
                 >
                   <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                     {story.title}
                   </h3>
                   <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                     {story.excerpt}
                   </p>

                   {/* Story Meta */}
                   <div className="space-y-1 mb-3">
                     <div className="flex items-center text-xs text-gray-500">
                       <FontAwesomeIcon icon={faUser} className="mr-1 text-xs" />
                       <span className="truncate">{story.author}</span>
                     </div>
                     <div className="flex items-center text-xs text-gray-500">
                       <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-xs" />
                       <span className="truncate">{formatDate(story.publish_date || story.publishDate)}</span>
                     </div>
                     <div className="flex items-center text-xs text-gray-500">
                       <FontAwesomeIcon icon={faEye} className="mr-1 text-xs" />
                       <span className="truncate">{story.view_count || 0} views</span>
                     </div>
                   </div>

                   {/* Tags */}
                   <div className="px-4 py-3 border-b border-gray-200">
                     <div className="flex flex-wrap gap-1">
                       {story.tags && parseTags(story.tags).slice(0, 3).map((tag, index) => (
                         <span
                           key={index}
                           className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                         >
                           {tag}
                         </span>
                       ))}
                       {story.tags && parseTags(story.tags).length > 3 && (
                         <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                           +{parseTags(story.tags).length - 3} more
                         </span>
                       )}
                     </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center justify-between pt-2 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                     <div className="flex items-center space-x-1">
                       <button
                         onClick={() => handlePreviewStory(story)}
                         className="text-blue-600 hover:text-blue-900 p-1"
                         title="Preview"
                       >
                         <FontAwesomeIcon icon={faEye} className="text-xs" />
                       </button>
                       <Link
                         to={`/admin/stories/edit/${story.id}`}
                         className="text-green-600 hover:text-green-900 p-1"
                         title="Edit"
                       >
                         <FontAwesomeIcon icon={faEdit} className="text-xs" />
                       </Link>
                       <button
                         onClick={() => handleToggleFeatured(story.id, story.featured === 'true')}
                         className={`p-1 ${story.featured === 'true' ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'}`}
                         title={story.featured === 'true' ? 'Unfeature' : 'Feature'}
                       >
                         <FontAwesomeIcon icon={faStar} className="text-xs" />
                       </button>
                       <button
                         onClick={() => handleToggleStatus(story.id, story.status)}
                         className={`p-1 ${story.status === 'published' ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                         title={story.status === 'published' ? 'Move to Draft' : 'Publish'}
                       >
                         <FontAwesomeIcon icon={story.status === 'published' ? faEyeSlash : faEye} className="text-xs" />
                       </button>
                       <button
                         onClick={() => handleDeleteStory(story.id)}
                         className="text-red-600 hover:text-red-900 p-1"
                         title="Delete"
                       >
                         <FontAwesomeIcon icon={faTrash} className="text-xs" />
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             ))}
           </div>

           {/* See All Button */}
           {filteredStories.length > 15 && (
             <div className="text-center mt-6">
               <button
                 onClick={() => setShowAllStories(!showAllStories)}
                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center mx-auto"
               >
                 <FontAwesomeIcon icon={showAllStories ? faChevronUp : faChevronDown} className="mr-2" />
                 {showAllStories ? 'Show Less' : `See All ${filteredStories.length} Stories`}
               </button>
             </div>
           )}

           {/* All Stories Grid (when expanded) */}
           {showAllStories && filteredStories.length > 15 && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6">
               {filteredStories.slice(15).map((story) => (
                 <div key={story.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
                   {/* Story Image */}
                   <div 
                     className="relative h-32 bg-gray-200 cursor-pointer"
                     onClick={() => handlePreviewStory(story)}
                   >
                     <img
                       src={getImageUrl(story.image)}
                       alt={story.title}
                       className="w-full h-full object-cover"
                     />
                     {story.featured === 'true' && (
                       <div className="absolute top-1 right-1">
                         <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                           <FontAwesomeIcon icon={faStar} className="mr-1 text-xs" />
                           Featured
                         </span>
                       </div>
                     )}
                     <div className="absolute top-1 left-1">
                       <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                         story.status === 'published' ? 'bg-green-100 text-green-800' :
                         story.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                         'bg-gray-100 text-gray-800'
                       }`}>
                         {story.status === 'published' ? <FontAwesomeIcon icon={faCheckCircle} className="mr-1 text-xs" /> :
                          story.status === 'draft' ? <FontAwesomeIcon icon={faClock} className="mr-1 text-xs" /> :
                          <FontAwesomeIcon icon={faTimes} className="mr-1 text-xs" />}
                         {story.status}
                       </span>
                     </div>
                   </div>

                   {/* Story Content */}
                   <div 
                     className="p-3 cursor-pointer"
                     onClick={() => handlePreviewStory(story)}
                   >
                     <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                       {story.title}
                     </h3>
                     <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                       {story.excerpt}
                     </p>

                     {/* Story Meta */}
                     <div className="space-y-1 mb-3">
                       <div className="flex items-center text-xs text-gray-500">
                         <FontAwesomeIcon icon={faUser} className="mr-1 text-xs" />
                         <span className="truncate">{story.author}</span>
                       </div>
                       <div className="flex items-center text-xs text-gray-500">
                         <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-xs" />
                         <span className="truncate">{formatDate(story.publish_date || story.publishDate)}</span>
                       </div>
                       <div className="flex items-center text-xs text-gray-500">
                         <FontAwesomeIcon icon={faEye} className="mr-1 text-xs" />
                         <span className="truncate">{story.view_count || 0} views</span>
                       </div>
                     </div>

                     {/* Tags */}
                     <div className="px-4 py-3 border-b border-gray-200">
                       <div className="flex flex-wrap gap-1">
                         {story.tags && parseTags(story.tags).slice(0, 3).map((tag, index) => (
                           <span
                             key={index}
                             className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                           >
                             {tag}
                           </span>
                         ))}
                         {story.tags && parseTags(story.tags).length > 3 && (
                           <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                             +{parseTags(story.tags).length - 3} more
                           </span>
                         )}
                       </div>
                     </div>

                     {/* Actions */}
                     <div className="flex items-center justify-between pt-2 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center space-x-1">
                         <button
                           onClick={() => handlePreviewStory(story)}
                           className="text-blue-600 hover:text-blue-900 p-1"
                           title="Preview"
                         >
                           <FontAwesomeIcon icon={faEye} className="text-xs" />
                         </button>
                         <Link
                           to={`/admin/stories/edit/${story.id}`}
                           className="text-green-600 hover:text-green-900 p-1"
                           title="Edit"
                         >
                           <FontAwesomeIcon icon={faEdit} className="text-xs" />
                         </Link>
                         <button
                           onClick={() => handleToggleFeatured(story.id, story.featured === 'true')}
                           className={`p-1 ${story.featured === 'true' ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 hover:text-yellow-600'}`}
                           title={story.featured === 'true' ? 'Unfeature' : 'Feature'}
                         >
                           <FontAwesomeIcon icon={faStar} className="text-xs" />
                         </button>
                         <button
                           onClick={() => handleToggleStatus(story.id, story.status)}
                           className={`p-1 ${story.status === 'published' ? 'text-green-600 hover:text-green-900' : 'text-yellow-600 hover:text-yellow-900'}`}
                           title={story.status === 'published' ? 'Move to Draft' : 'Publish'}
                         >
                           <FontAwesomeIcon icon={story.status === 'published' ? faEyeSlash : faEye} className="text-xs" />
                         </button>
                         <button
                           onClick={() => handleDeleteStory(story.id)}
                           className="text-red-600 hover:text-red-900 p-1"
                           title="Delete"
                         >
                           <FontAwesomeIcon icon={faTrash} className="text-xs" />
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </>
       )}

      {/* Story Preview Modal */}
      {showPreview && previewStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Story Preview</h2>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faClose} className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Story Image */}
              <div className="mb-6">
                <img
                  src={getImageUrl(previewStory.image)}
                  alt={previewStory.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Story Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{previewStory.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {previewStory.author}
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {formatDate(previewStory.publishDate)}
                  </span>
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faTag} className="mr-2" />
                    {previewStory.category}
                  </span>
                  {previewStory.featured === 'true' && (
                    <span className="flex items-center text-yellow-600">
                      <FontAwesomeIcon icon={faStar} className="mr-2" />
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">{previewStory.excerpt}</p>
              </div>

              {/* Story Content */}
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: previewStory.content }} />
              </div>

              {/* Story Meta */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span>Status: <span className={`font-medium ${
                      previewStory.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                    }`}>{previewStory.status}</span></span>
                  </div>
                  <div>
                    <span>Location: <span className="font-medium">{previewStory.location}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closePreview}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Close
              </button>
              <Link
                to={`/admin/stories/edit/${previewStory.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Edit Story
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stories;
