import React, { useState } from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faDownload,
  faEye,
  faSearch,
  faFileAlt,
  faImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faLink,
  faStar,
  faClock,
  faUser,
  faTag
} from '@fortawesome/free-solid-svg-icons';

const EditorContentLibrary = () => {
  useScrollToTop();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample content library data
  const contentItems = [
    {
      id: 1,
      title: 'Story Writing Guidelines',
      description: 'Comprehensive guide for writing impactful community stories',
      category: 'Guidelines',
      type: 'PDF',
      author: 'Editorial Team',
      date: '2024-01-15',
      downloads: 45,
      featured: true,
      tags: ['writing', 'guidelines', 'community'],
      icon: faFilePdf,
      color: 'text-red-500'
    },
    {
      id: 2,
      title: 'Photo Story Template',
      description: 'Template for creating photo-based stories with captions',
      category: 'Templates',
      type: 'Word',
      author: 'Creative Team',
      date: '2024-01-20',
      downloads: 32,
      featured: false,
      tags: ['template', 'photo', 'story'],
      icon: faFileWord,
      color: 'text-blue-500'
    },
    {
      id: 3,
      title: 'Community Impact Metrics',
      description: 'Excel template for tracking and measuring community impact',
      category: 'Templates',
      type: 'Excel',
      author: 'Analytics Team',
      date: '2024-01-18',
      downloads: 28,
      featured: true,
      tags: ['metrics', 'impact', 'tracking'],
      icon: faFileExcel,
      color: 'text-green-500'
    },
    {
      id: 4,
      title: 'Interview Questions Bank',
      description: 'Collection of interview questions for different story types',
      category: 'Resources',
      type: 'Document',
      author: 'Journalism Team',
      date: '2024-01-22',
      downloads: 38,
      featured: false,
      tags: ['interview', 'questions', 'journalism'],
      icon: faFileAlt,
      color: 'text-purple-500'
    },
    {
      id: 5,
      title: 'Visual Storytelling Guide',
      description: 'Guide on using images and videos effectively in stories',
      category: 'Guidelines',
      type: 'PDF',
      author: 'Visual Team',
      date: '2024-01-16',
      downloads: 41,
      featured: true,
      tags: ['visual', 'storytelling', 'media'],
      icon: faFilePdf,
      color: 'text-red-500'
    },
    {
      id: 6,
      title: 'Social Media Templates',
      description: 'Ready-to-use templates for promoting stories on social media',
      category: 'Templates',
      type: 'Image',
      author: 'Marketing Team',
      date: '2024-01-19',
      downloads: 35,
      featured: false,
      tags: ['social media', 'marketing', 'templates'],
      icon: faImage,
      color: 'text-pink-500'
    },
    {
      id: 7,
      title: 'Fact-Checking Checklist',
      description: 'Comprehensive checklist for verifying story facts and sources',
      category: 'Guidelines',
      type: 'Document',
      author: 'Editorial Team',
      date: '2024-01-17',
      downloads: 52,
      featured: true,
      tags: ['fact-checking', 'verification', 'quality'],
      icon: faFileAlt,
      color: 'text-purple-500'
    },
    {
      id: 8,
      title: 'Video Story Script Template',
      description: 'Template for writing video story scripts and storyboards',
      category: 'Templates',
      type: 'Word',
      author: 'Video Team',
      date: '2024-01-21',
      downloads: 29,
      featured: false,
      tags: ['video', 'script', 'storyboard'],
      icon: faFileWord,
      color: 'text-blue-500'
    }
  ];

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = ['all', ...Array.from(new Set(contentItems.map(item => item.category)))];
  const types = ['all', ...Array.from(new Set(contentItems.map(item => item.type)))];

  const handleDownload = (item) => {
    // Simulate download
    console.log(`Downloading ${item.title}`);
    // In real implementation, this would trigger actual file download
  };

  const handlePreview = (item) => {
    // Simulate preview
    console.log(`Previewing ${item.title}`);
    // In real implementation, this would open a preview modal
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 mr-2" />
            Content Library
          </h1>
          <p className="text-sm text-gray-600 mt-1">Access shared resources, templates, and guidelines</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Resources</p>
              <p className="text-xl font-semibold text-gray-900">{contentItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faDownload} className="text-green-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Downloads</p>
              <p className="text-xl font-semibold text-gray-900">
                {contentItems.reduce((sum, item) => sum + item.downloads, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faStar} className="text-yellow-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Featured</p>
              <p className="text-xl font-semibold text-gray-900">
                {contentItems.filter(item => item.featured).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faTag} className="text-purple-600 text-lg" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Categories</p>
              <p className="text-xl font-semibold text-gray-900">
                {Array.from(new Set(contentItems.map(item => item.category))).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Resources</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type Filter</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={item.icon} className={`text-lg ${item.color}`} />
                  <span className="text-xs font-medium text-gray-500 uppercase">{item.type}</span>
                </div>
                {item.featured && (
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500 text-sm" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>

            {/* Tags */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-1" />
                  {item.author}
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {item.downloads} downloads
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreview(item)}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors duration-200"
                    title="Preview"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-md transition-colors duration-200"
                    title="Download"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-500">
            {contentItems.length === 0 
              ? 'The content library is empty.' 
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      )}

      {/* Quick Access Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-xl" />
              <div>
                <p className="font-medium text-gray-900">Writing Guidelines</p>
                <p className="text-sm text-gray-500">Essential rules</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFileWord} className="text-blue-500 text-xl" />
              <div>
                <p className="font-medium text-gray-900">Story Templates</p>
                <p className="text-sm text-gray-500">Ready to use</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faFileAlt} className="text-purple-500 text-xl" />
              <div>
                <p className="font-medium text-gray-900">Best Practices</p>
                <p className="text-sm text-gray-500">Pro tips</p>
              </div>
            </div>
          </button>
          <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faLink} className="text-green-500 text-xl" />
              <div>
                <p className="font-medium text-gray-900">External Resources</p>
                <p className="text-sm text-gray-500">Useful links</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorContentLibrary;
