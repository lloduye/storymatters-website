import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faEye, 
  faEdit, 
  faTrash, 
  faPlus, 
  faCalendarAlt,
  faUser,
  faStar,
  faChartLine,
  faUsers,
  faDollarSign,
  faHandHoldingHeart,
  faGlobe,
  faCog,
  faBell,
  faSearch,
  faFilter,
  faDownload,
  faUpload,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 0,
    featuredStories: 0,
    totalViews: 0,
    totalAuthors: 0,
    totalDonations: 0,
    monthlyDonations: 0,
    totalDonors: 0,
    pendingDonations: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    websiteVisitors: 1247,
    pageViews: 8923,
    bounceRate: 23.4,
    avgSessionDuration: '4m 32s'
  });
  const [previewStory, setPreviewStory] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5000/api/stories');
      const storiesData = response.data;
      setStories(storiesData);
      
      // Calculate stats
      const featuredCount = storiesData.filter(story => story.featured === 'true').length;
      const uniqueAuthors = new Set(storiesData.map(story => story.author)).size;
      
      setStats({
        totalStories: storiesData.length,
        featuredStories: featuredCount,
        totalViews: storiesData.reduce((sum, story) => sum + (parseInt(story.views) || 0), 0),
        totalAuthors: uniqueAuthors,
        totalDonations: 45600,
        monthlyDonations: 8900,
        totalDonors: 234,
        pendingDonations: 12
      });

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'donation', message: 'New donation of $500 from John Doe', time: '2 hours ago', status: 'completed' },
        { id: 2, type: 'story', message: 'New story published: "Community Transformation"', time: '4 hours ago', status: 'published' },
        { id: 3, type: 'donation', message: 'Monthly recurring donation of $100 from Jane Smith', time: '6 hours ago', status: 'completed' },
        { id: 4, type: 'story', message: 'Story "Youth Empowerment" updated', time: '1 day ago', status: 'updated' },
        { id: 5, type: 'donation', message: 'New donor registered: Sarah Johnson', time: '1 day ago', status: 'new' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await axios.delete(`http://localhost:5000/api/stories/${storyId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        toast.success('Story deleted successfully');
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting story:', error);
        toast.error('Failed to delete story');
      }
    }
  };

  const handlePreviewStory = (story) => {
    setPreviewStory(story);
    setShowPreview(true);
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
    
    if (imagePath.startsWith('/uploads/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    return imagePath;
  };

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-md ${color}`}>
            <FontAwesomeIcon icon={icon} className="text-white text-sm" />
          </div>
          <div className="ml-3">
            <p className="text-xs font-medium text-gray-600">{title}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center text-xs ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <FontAwesomeIcon icon={changeType === 'up' ? faArrowUp : faArrowDown} className="mr-1" />
            {change}
          </div>
        )}
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, link, color, count }) => (
    <Link
      to={link}
      className="block bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color}`}>
            <FontAwesomeIcon icon={icon} className="text-white text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        {count && (
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {count}
          </div>
        )}
      </div>
    </Link>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'donation': return faDollarSign;
        case 'story': return faNewspaper;
        default: return faBell;
      }
    };

    const getColor = (type) => {
      switch (type) {
        case 'donation': return 'text-green-600 bg-green-100';
        case 'story': return 'text-blue-600 bg-blue-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return 'text-green-600';
        case 'published': return 'text-blue-600';
        case 'updated': return 'text-yellow-600';
        case 'new': return 'text-purple-600';
        default: return 'text-gray-600';
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
        <div className={`p-2 rounded-lg ${getColor(activity.type)}`}>
          <FontAwesomeIcon icon={getIcon(activity.type)} className="text-sm" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
        <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
          {activity.status}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <p className="text-gray-600 text-lg">Welcome back! Here's what's happening with Story Matters today.</p>
      </div>

             {/* Main Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donations"
          value={`$${stats.totalDonations.toLocaleString()}`}
          icon={faDollarSign}
          color="bg-green-500"
          change="+12.5%"
          changeType="up"
        />
        <StatCard
          title="Monthly Donations"
          value={`$${stats.monthlyDonations.toLocaleString()}`}
          icon={faHandHoldingHeart}
          color="bg-blue-500"
          change="+8.2%"
          changeType="up"
        />
        <StatCard
          title="Total Stories"
          value={stats.totalStories}
          icon={faNewspaper}
          color="bg-purple-500"
          change="+3"
          changeType="up"
        />
        <StatCard
          title="Website Visitors"
          value={quickStats.websiteVisitors.toLocaleString()}
          icon={faGlobe}
          color="bg-orange-500"
          change="+15.3%"
          changeType="up"
        />
      </div>

             {/* Secondary Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Donors"
          value={stats.totalDonors}
          icon={faUsers}
          color="bg-indigo-500"
        />
        <StatCard
          title="Featured Stories"
          value={stats.featuredStories}
          icon={faStar}
          color="bg-yellow-500"
        />
        <StatCard
          title="Page Views"
          value={quickStats.pageViews.toLocaleString()}
          icon={faEye}
          color="bg-teal-500"
        />
        <StatCard
          title="Pending Donations"
          value={stats.pendingDonations}
          icon={faClock}
          color="bg-red-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard
            title="Create Story"
            description="Add a new story to your collection"
            icon={faPlus}
            link="/admin/stories/new"
            color="bg-blue-500"
          />
          <QuickActionCard
            title="Manage Donations"
            description="View and process donations"
            icon={faDollarSign}
            link="/admin/donations"
            color="bg-green-500"
            count={stats.pendingDonations}
          />
          <QuickActionCard
            title="Website Content"
            description="Update website pages and content"
            icon={faGlobe}
            link="/admin/content"
            color="bg-purple-500"
          />
          <QuickActionCard
            title="Analytics"
            description="View detailed analytics and reports"
            icon={faChartLine}
            link="/admin/analytics"
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Stories */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Stories</h2>
                <Link
                  to="/admin/stories"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All →
                </Link>
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading stories...</p>
              </div>
            ) : stories.length === 0 ? (
              <div className="p-8 text-center">
                <FontAwesomeIcon icon={faNewspaper} className="text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first story</p>
                <Link
                  to="/admin/stories/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Create Story
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {stories.slice(0, 5).map((story) => (
                  <div key={story.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={getImageUrl(story.image)}
                          alt={story.title}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {story.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {story.featured === 'true' && (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                <FontAwesomeIcon icon={faStar} className="mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{story.excerpt}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {formatDate(story.publishDate)}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {story.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePreviewStory(story)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Preview"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <Link
                          to={`/admin/stories/edit/${story.id}`}
                          className="text-green-600 hover:text-green-900 p-2"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        <button
                          onClick={() => handleDeleteStory(story.id)}
                          className="text-red-600 hover:text-red-900 p-2"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/admin/activity"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All Activity →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Pending Actions</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Donations to process</span>
              <span className="text-sm font-medium text-red-600">{stats.pendingDonations}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Stories to review</span>
              <span className="text-sm font-medium text-yellow-600">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Messages to reply</span>
              <span className="text-sm font-medium text-blue-600">7</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Website Health</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response time</span>
              <span className="text-sm font-medium text-green-600">245ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">SSL Status</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Performance</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bounce rate</span>
              <span className="text-sm font-medium text-blue-600">{quickStats.bounceRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg session</span>
              <span className="text-sm font-medium text-blue-600">{quickStats.avgSessionDuration}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion rate</span>
              <span className="text-sm font-medium text-blue-600">2.4%</span>
            </div>
          </div>
        </div>
      </div>

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
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Story Image */}
              <div className="mb-6">
                <img
                  src={previewStory.image ? `http://localhost:5000${previewStory.image}` : '/Images/2025-01-06-community-dialogues.jpg'}
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
                    <FontAwesomeIcon icon={faStar} className="mr-2" />
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
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
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

export default AdminDashboard;
