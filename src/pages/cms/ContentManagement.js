import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faSave, 
  faTimes, 
  faEye, 
  faPlus,
  faHome,
  faInfoCircle,
  faUsers,
  faHandHoldingHeart,
  faEnvelope,
  faImage,
  faFileAlt,
  faCheckCircle,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const ContentManagement = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(null);

  // Mock data for website pages
  const mockPages = useMemo(() => [
    {
      id: 1,
      title: 'Home',
      slug: 'home',
      content: {
        hero: {
          title: 'Story Matters',
          subtitle: 'Empowering communities through storytelling',
          description: 'We believe in the power of stories to transform communities and create lasting change.',
          ctaText: 'Get Involved',
          ctaLink: '/get-involved',
          image: '/Images/2025-01-06-community-dialogues.jpg'
        },
        sections: [
          {
            title: 'Our Mission',
            content: 'To amplify voices and create positive change through community storytelling.'
          },
          {
            title: 'What We Do',
            content: 'We work with communities to share their stories and create meaningful impact.'
          }
        ]
      },
      status: 'published',
      lastModified: '2024-01-15T10:30:00Z',
      views: 1247
    },
    {
      id: 2,
      title: 'About',
      slug: 'about',
      content: {
        hero: {
          title: 'About Story Matters',
          subtitle: 'Our journey and mission',
          description: 'Learn about our organization, our values, and the impact we\'ve made in communities.',
          image: '/Images/2025-01-07-art-for.jpeg'
        },
        sections: [
          {
            title: 'Our Story',
            content: 'Founded in 2020, Story Matters began with a simple belief: every voice matters.'
          },
          {
            title: 'Our Values',
            content: 'Community, Empowerment, Transparency, and Impact guide everything we do.'
          },
          {
            title: 'Our Team',
            content: 'Meet the dedicated individuals working to make a difference.'
          }
        ]
      },
      status: 'published',
      lastModified: '2024-01-16T14:20:00Z',
      views: 892
    },
    {
      id: 3,
      title: 'Programs',
      slug: 'programs',
      content: {
        hero: {
          title: 'Our Programs',
          subtitle: 'Creating impact through community engagement',
          description: 'Discover the various programs we offer to support community development and storytelling.',
          image: '/Images/2025-01-17-nurture-talent.jpg'
        },
        sections: [
          {
            title: 'Community Workshops',
            content: 'Interactive workshops to help communities develop their storytelling skills.'
          },
          {
            title: 'Youth Programs',
            content: 'Specialized programs designed to empower young voices.'
          },
          {
            title: 'Digital Storytelling',
            content: 'Modern approaches to sharing stories through digital platforms.'
          }
        ]
      },
      status: 'published',
      lastModified: '2024-01-17T09:15:00Z',
      views: 654
    },
    {
      id: 4,
      title: 'Contact',
      slug: 'contact',
      content: {
        hero: {
          title: 'Get in Touch',
          subtitle: 'We\'d love to hear from you',
          description: 'Reach out to us for questions, collaborations, or to learn more about our work.',
          image: '/Images/2025-01-29-meeting-with.jpg'
        },
        sections: [
          {
            title: 'Contact Information',
            content: 'Email: info@storymatters.org\nPhone: +1 (555) 123-4567\nAddress: 123 Community St, City, State 12345'
          },
          {
            title: 'Office Hours',
            content: 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM'
          }
        ]
      },
      status: 'draft',
      lastModified: '2024-01-18T16:45:00Z',
      views: 321
    }
  ], []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPages(mockPages);
      setIsLoading(false);
    }, 1000);
  }, [mockPages]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageIcon = (slug) => {
    switch (slug) {
      case 'home': return faHome;
      case 'about': return faInfoCircle;
      case 'programs': return faUsers;
      case 'donate': return faHandHoldingHeart;
      case 'contact': return faEnvelope;
      default: return faFileAlt;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    totalPages: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    drafts: pages.filter(p => p.status === 'draft').length,
    totalViews: pages.reduce((sum, p) => sum + p.views, 0)
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
  };

  const handleSavePage = (pageId, updatedContent) => {
    setPages(prev => prev.map(p => 
      p.id === pageId ? { ...p, content: updatedContent, lastModified: new Date().toISOString() } : p
    ));
    setEditingPage(null);
    toast.success('Page updated successfully');
  };

  const handlePreviewPage = (page) => {
    setPreviewPage(page);
    setShowPreview(true);
  };

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color}`}>
            <FontAwesomeIcon icon={icon} className="text-white text-xl" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <FontAwesomeIcon icon={changeType === 'up' ? faArrowUp : faArrowDown} className="mr-1" />
            {change}
          </div>
        )}
      </div>
    </div>
  );

  const PageEditor = ({ page, onSave, onCancel }) => {
    const [content, setContent] = useState(page.content);

    const handleSave = () => {
      onSave(page.id, content);
    };

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Edit {page.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Hero Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Hero Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={content.hero.title}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={content.hero.subtitle}
                      onChange={(e) => setContent({
                        ...content,
                        hero: { ...content.hero, subtitle: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Content Sections */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Content Sections</h4>
                {content.sections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const newSections = [...content.sections];
                            newSections[index].title = e.target.value;
                            setContent({ ...content, sections: newSections });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        rows={4}
                        value={section.content}
                        onChange={(e) => {
                          const newSections = [...content.sections];
                          newSections[index].content = e.target.value;
                          setContent({ ...content, sections: newSections });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Manage website pages and content</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Page
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pages"
          value={stats.totalPages}
          icon={faFileAlt}
          color="bg-blue-500"
          change="+2"
          changeType="up"
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={faCheckCircle}
          color="bg-green-500"
          change="+1"
          changeType="up"
        />
        <StatCard
          title="Drafts"
          value={stats.drafts}
          icon={faEdit}
          color="bg-yellow-500"
          change="+1"
          changeType="up"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={faEye}
          color="bg-purple-500"
          change="+15.3%"
          changeType="up"
        />
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading pages...</span>
          </div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FontAwesomeIcon icon={getPageIcon(page.slug)} className="text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                      <p className="text-sm text-gray-500">/{page.slug}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                    {page.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Views</span>
                    <span className="font-medium">{page.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Last Modified</span>
                    <span className="font-medium">{formatDate(page.lastModified)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePreviewPage(page)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleEditPage(page)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Page Editor Modal */}
      {editingPage && (
        <PageEditor
          page={editingPage}
          onSave={handleSavePage}
          onCancel={() => setEditingPage(null)}
        />
      )}

      {/* Page Preview Modal */}
      {showPreview && previewPage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Preview: {previewPage.title}</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {/* Hero Section */}
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{previewPage.content.hero.title}</h1>
                  <h2 className="text-xl text-gray-600 mb-4">{previewPage.content.hero.subtitle}</h2>
                  <p className="text-gray-700 mb-6">{previewPage.content.hero.description}</p>
                  {previewPage.content.hero.image && (
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <FontAwesomeIcon icon={faImage} className="text-gray-400 text-2xl" />
                      <span className="ml-2 text-gray-500">Hero Image</span>
                    </div>
                  )}
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                  {previewPage.content.sections.map((section, index) => (
                    <div key={index} className="border-t border-gray-200 pt-6">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
