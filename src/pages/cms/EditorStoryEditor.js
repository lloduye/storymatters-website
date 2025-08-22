import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave, 
  faTimes, 
  faUpload, 
  faEye, 
  faCalendarAlt,
  faMapMarkerAlt,
  faUser,
  faTag,
  faStar,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditorStoryEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [storyId, setStoryId] = useState(null);
  
  // Editor-specific navigation paths
  const navigationPaths = {
    backToStories: '/editor/stories',
    close: '/editor/dashboard'
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm();

  const isEditing = id !== 'new';

  // Predefined categories and tags
  const categories = [
    { value: 'Community Peacebuilding', label: 'Community Peacebuilding' },
    { value: 'Community Development', label: 'Community Development' },
    { value: 'Education', label: 'Education' },
    { value: 'Health', label: 'Health' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Youth Empowerment', label: 'Youth Empowerment' },
    { value: 'Gender Equality', label: 'Gender Equality' },
    { value: 'Refugee Support', label: 'Refugee Support' }
  ];

  const availableTags = [
    'Community Peacebuilding', 'Conflict Resolution', 'Kakuma', 'Kalobeyei', 
    'Kenya', 'Refugee Communities', 'Environmental Conservation', 'Gender-Based Violence',
    'Water Resources', 'Land Disputes', 'Community Media', 'Youth Development',
    'Education', 'Health', 'Sustainability', 'Community Dialogues'
  ];

  const tagOptions = availableTags.map(tag => ({ value: tag, label: tag }));

  useEffect(() => {
    if (isEditing && id !== 'new') {
      fetchStory();
    } else {
      // Set default values for new story
      setValue('publishDate', new Date().toISOString().split('T')[0]);
      setValue('status', 'draft');
    }
  }, [id, setValue, isEditing]);

  const fetchStory = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/stories/${id}`);
      const story = response.data;
      
      // Store the actual story ID
      setStoryId(story.id);
      
      // Set form values
      setValue('title', story.title);
      setValue('excerpt', story.excerpt);
      setValue('author', story.author);
      setValue('location', story.location);
      setValue('publishDate', story.publishDate);
      setValue('category', story.category);
      setValue('status', story.status || 'draft');
      setValue('featured', story.featured === 'true');
      
      // Set content and image
      setContent(story.content || '');
      setImagePreview(story.image || '');
      setUploadedImageUrl(story.image || '');
      
      // Set tags
      if (story.tags) {
        const tags = story.tags.split(', ').filter(tag => tag.trim());
        setSelectedTags(tags.map(tag => ({ value: tag, label: tag })));
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      toast.error('Failed to load story');
    } finally {
      setIsLoading(false);
    }
  }, [id, setValue, setContent, setImagePreview, setUploadedImageUrl, setSelectedTags]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    try {
      console.log('EditorStoryEditor: Starting image upload...');
      console.log('EditorStoryEditor: Token being used:', localStorage.getItem('adminToken'));
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      console.log('EditorStoryEditor: Image upload response:', response.data);
      setUploadedImageUrl(response.data.imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('EditorStoryEditor: Error uploading image:', error);
      console.error('EditorStoryEditor: Error response:', error.response?.data);
      console.error('EditorStoryEditor: Error status:', error.response?.status);
      toast.error(`Failed to upload image: ${error.response?.data?.error || error.message}`);
      setImagePreview('');
    }
  };

  const onSubmit = async (data) => {
    if (!content.trim()) {
      toast.error('Please add some content to your story');
      return;
    }

    if (!uploadedImageUrl && !imagePreview) {
      toast.error('Please upload an image for your story');
      return;
    }

    setIsSaving(true);

    try {
      const storyData = {
        title: data.title,
        excerpt: data.excerpt,
        author: data.author,
        location: data.location,
        publishDate: data.publishDate,
        category: data.category,
        content: content,
        image: uploadedImageUrl || imagePreview,
        tags: selectedTags.map(tag => tag.value).join(', '),
        featured: data.featured ? 'true' : 'false',
        status: data.status || 'draft',
        viewCount: '0'
      };

      console.log('EditorStoryEditor: Story data being prepared:', storyData);
      console.log('EditorStoryEditor: Token being used:', localStorage.getItem('adminToken'));

      console.log('Submitting story:', { isEditing, storyId, id, storyData });

      if (isEditing && storyId) {
        console.log('EditorStoryEditor: Updating existing story with ID:', storyId);
        console.log('EditorStoryEditor: Token being used:', localStorage.getItem('adminToken'));
        console.log('EditorStoryEditor: Story data being sent:', storyData);
        
        const response = await axios.put(`/api/stories/${storyId}`, storyData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        console.log('EditorStoryEditor: Update response:', response.data);
        
        if (data.status === 'published') {
          toast.success('Story published successfully! It is now live on the website.');
        } else {
          toast.success('Story saved as draft successfully! You can publish it later.');
        }
      } else {
        console.log('EditorStoryEditor: Creating new story');
        console.log('EditorStoryEditor: Token being used:', localStorage.getItem('adminToken'));
        console.log('EditorStoryEditor: Story data being sent:', storyData);
        
        const response = await axios.post('/api/stories', storyData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        console.log('EditorStoryEditor: Create response:', response.data);
        
        if (data.status === 'published') {
          toast.success('Story created and published successfully! It is now live on the website.');
        } else {
          toast.success('Story created and saved as draft successfully! You can publish it later.');
        }
      }

      // Navigate back to editor stories after successful save
      navigate('/editor/stories');
    } catch (error) {
      console.error('EditorStoryEditor: Error saving story:', error);
      console.error('EditorStoryEditor: Error response:', error.response?.data);
      console.error('EditorStoryEditor: Error status:', error.response?.status);
      console.error('EditorStoryEditor: Error message:', error.message);
      
      if (error.response?.data?.error) {
        toast.error(`Failed to save story: ${error.response.data.error}`);
      } else if (error.response?.data?.message) {
        toast.error(`Failed to save story: ${error.response.data.message}`);
      } else {
        toast.error(`Failed to save story: ${error.message}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Story' : 'Create New Story'}
            </h1>
            {isEditing && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                watch('status') === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {watch('status') === 'published' ? '📱 Live' : '📝 Draft'}
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update your story content and details' : 'Add a new story to your collection'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Left side - Back to Stories */}
          <button
            onClick={() => navigate(navigationPaths.backToStories)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Back to Stories
          </button>
          
          {/* Right side - Close and Action buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => navigate(navigationPaths.close)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Close
            </button>
             
            {/* Save as Draft Button */}
            <button
              onClick={() => {
                setValue('status', 'draft');
                handleSubmit(onSubmit)();
              }}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200 flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {isEditing ? 'Save as Draft' : 'Create Draft'}
                </>
              )}
            </button>
            
            {/* Save Button - saves changes without changing status */}
            <button
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Save
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Save
                </>
              )}
            </button>
            
            {/* Publish Button */}
            <button
              onClick={() => {
                setValue('status', 'published');
                handleSubmit(onSubmit)();
              }}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  {isEditing ? 'Publish Story' : 'Create & Publish'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Current Status:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              watch('status') === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {watch('status') === 'published' ? (
                <>
                  <FontAwesomeIcon icon={faEye} className="mr-2 text-xs" />
                  Published
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTimes} className="mr-2 text-xs" />
                  Draft
                </>
              )}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {watch('status') === 'published' 
                ? 'This story will be visible on the public website' 
                : 'This story is saved as a draft and not visible publicly'
              }
            </div>
            <button
              type="button"
              onClick={() => {
                const newStatus = watch('status') === 'published' ? 'draft' : 'published';
                setValue('status', newStatus);
                toast.success(`Status changed to ${newStatus === 'published' ? 'published' : 'draft'}`);
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 font-medium"
            >
              🔄 Toggle Status
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-blue-800">Quick Actions:</span>
            <span className="text-sm text-blue-600">
              {watch('status') === 'published' 
                ? 'Story is currently published and visible on website' 
                : 'Story is currently a draft and not visible publicly'
              }
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setValue('status', 'draft');
                toast.success('Status set to Draft');
              }}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors duration-200 ${
                watch('status') === 'draft' 
                  ? 'bg-yellow-200 text-yellow-800' 
                  : 'bg-gray-200 text-gray-700 hover:bg-yellow-200 hover:text-yellow-800'
              }`}
            >
              📝 Set to Draft
            </button>
            <button
              type="button"
              onClick={() => {
                setValue('status', 'published');
                toast.success('Status set to Published');
              }}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors duration-200 ${
                watch('status') === 'published' 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-gray-200 text-gray-700 hover:bg-green-200 hover:text-green-800'
              }`}
            >
              ✅ Set to Published
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your story title"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Excerpt *
              </label>
              <textarea
                {...register('excerpt', { required: 'Excerpt is required' })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief summary of your story"
              />
              {errors.excerpt && (
                <p className="text-red-600 text-sm mt-1">{errors.excerpt.message}</p>
              )}
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Story Content *
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link', 'blockquote'],
                    ['clean']
                  ]
                }}
                className="bg-white"
                placeholder="Write your story content here..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                Story Image
              </h3>
              
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                {imagePreview ? 'Change Image' : 'Upload Image'}
              </label>
            </div>

            {/* Story Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Story Details</h3>
              
              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Author *
                </label>
                <input
                  type="text"
                  {...register('author', { required: 'Author is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Author name"
                />
                {errors.author && (
                  <p className="text-red-600 text-sm mt-1">{errors.author.message}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  Location *
                </label>
                <select
                  {...register('location', { required: 'Location is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a location</option>
                  <option value="Kakuma Refugee Camp">Kakuma Refugee Camp</option>
                  <option value="Kalobeyei Settlement Camp">Kalobeyei Settlement Camp</option>
                </select>
                {errors.location && (
                  <p className="text-red-600 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Publish Date *
                </label>
                <input
                  type="date"
                  {...register('publishDate', { required: 'Publish date is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.publishDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.publishDate.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faTag} className="mr-2" />
                  Tags
                </label>
                <Select
                  isMulti
                  value={selectedTags}
                  onChange={handleTagChange}
                  options={tagOptions}
                  placeholder="Select tags..."
                  className="text-sm"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('featured')}
                  id="featured"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 flex items-center text-sm text-gray-700">
                  <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-500" />
                  Feature this story
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                Preview
              </h3>
              <button
                type="button"
                onClick={() => window.open(`/stories/${id || 'preview'}`, '_blank')}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Preview Story
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditorStoryEditor;
