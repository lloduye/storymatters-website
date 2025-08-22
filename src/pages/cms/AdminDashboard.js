import React, { useState, useEffect } from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
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
  faGlobe,
  faCog,
  faBell,

  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faArrowUp,
  faTimes,
  faRocket,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  useScrollToTop();
  
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
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
  const [quickStats] = useState({
    websiteVisitors: 1247,
    pageViews: 8923,
    bounceRate: 23.4,
    avgSessionDuration: '4m 32s'
  });
  const [previewStory, setPreviewStory] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userDataFromStorage = localStorage.getItem('userData');
    if (userDataFromStorage) {
      try {
        const parsed = JSON.parse(userDataFromStorage);
        console.log('AdminDashboard: User data loaded:', parsed);
        setUserData(parsed);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.log('AdminDashboard: No user data found in localStorage');
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Use the correct backend port
      const backendUrl = '';
      const response = await axios.get(`${backendUrl}/api/stories`);
      const storiesData = response.data;
      
      console.log('AdminDashboard: Stories data fetched:', storiesData);
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
      toast.error('Failed to load dashboard data. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        const backendUrl = '';
        await axios.delete(`${backendUrl}/api/stories/${storyId}`, {
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
      return imagePath;
    }
    
    return imagePath;
  };



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
       <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
         <div className={`p-1.5 rounded-lg ${getColor(activity.type)}`}>
           <FontAwesomeIcon icon={getIcon(activity.type)} className="text-xs" />
         </div>
         <div className="flex-1">
           <p className="text-xs text-gray-900">{activity.message}</p>
           <p className="text-xs text-gray-500">{activity.time}</p>
         </div>
         <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
           {activity.status}
         </span>
       </div>
     );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {userData?.fullName || userData?.full_name || 'Administrator'}! 👋
            </h1>
            <p className="text-blue-100 text-sm">
              Here's what's happening with Story Matters today.
            </p>
            <div className="flex items-center space-x-4 mt-2 text-blue-100 text-xs">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-1" />
                {new Date().toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Connected
              </span>
              <button
                onClick={fetchDashboardData}
                className="flex items-center px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-all duration-200"
                title="Refresh Dashboard"
              >
                <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                Refresh
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCog} className="text-3xl text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalDonations.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                +12.5% from last month
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faDollarSign} className="text-lg text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Stories</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalStories}</p>
              <p className="text-xs text-gray-500">
                {stats.featuredStories} featured
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faNewspaper} className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Website Visitors</p>
              <p className="text-2xl font-bold text-purple-600">{quickStats.websiteVisitors.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                +15.3% from last week
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FontAwesomeIcon icon={faGlobe} className="text-lg text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalDonors}</p>
              <p className="text-xs text-gray-500">
                {stats.pendingDonations} pending
              </p>
            </div>
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FontAwesomeIcon icon={faUsers} className="text-lg text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faRocket} className="text-blue-600 mr-2" />
            Quick Actions
          </h2>
          <Link 
            to="/admin/stories" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            View All
            <FontAwesomeIcon icon={faArrowUp} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            to="/admin/stories/new"
            className="group p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-lg bg-blue-500 group-hover:scale-105 transition-transform duration-200">
                <FontAwesomeIcon icon={faPlus} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 text-sm">
                  Create Story
                </h3>
                <p className="text-xs text-gray-600">Add a new story to your collection</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/donations"
            className="group p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-lg bg-green-500 group-hover:scale-105 transition-transform duration-200">
                <FontAwesomeIcon icon={faDollarSign} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200 text-sm">
                  Manage Donations
                </h3>
                <p className="text-xs text-gray-600">View and process donations</p>
                {stats.pendingDonations > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full mt-1">
                    {stats.pendingDonations} pending
                  </span>
                )}
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/content"
            className="group p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-lg bg-purple-500 group-hover:scale-105 transition-transform duration-200">
                <FontAwesomeIcon icon={faGlobe} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 text-sm">
                  Website Content
                </h3>
                <p className="text-xs text-gray-600">Update website pages and content</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="group p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start space-x-2">
              <div className="p-2 rounded-lg bg-orange-500 group-hover:scale-105 transition-transform duration-200">
                <FontAwesomeIcon icon={faChartLine} className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 text-sm">
                  Analytics
                </h3>
                <p className="text-xs text-gray-600">View detailed analytics and reports</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stories */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 mr-2" />
                Recent Stories
              </h2>
              <Link 
                to="/admin/stories" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All
                <FontAwesomeIcon icon={faArrowUp} className="ml-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading stories...</p>
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-8">
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
                                                          <div className="space-y-3">
                 {stories.slice(0, 5).map((story) => (
                   <div key={story.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                     <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                       <img
                         className="h-8 w-8 rounded-lg object-cover"
                         src={getImageUrl(story.image)}
                         alt={story.title}
                       />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-medium text-gray-900 text-sm">{story.title}</h3>
                       <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                         <span className="flex items-center">
                           <FontAwesomeIcon icon={faUser} className="mr-1" />
                           {story.author || 'Unknown Author'}
                         </span>
                         <span className="flex items-center">
                           <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                           {formatDate(story.publishDate)}
                         </span>
                         {story.featured === 'true' && (
                           <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                             <FontAwesomeIcon icon={faStar} className="mr-1" />
                             Featured
                           </span>
                         )}
                       </div>
                       <p className="text-xs text-gray-500 truncate mt-1">{story.excerpt}</p>
                       <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                         <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                           {story.category || 'Uncategorized'}
                           </span>
                         <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full">
                           {story.status || 'Draft'}
                         </span>
                       </div>
                     </div>
                     <div className="flex items-center space-x-1">
                       <button
                         onClick={() => handlePreviewStory(story)}
                         className="text-blue-600 hover:text-blue-900 p-1.5"
                         title="Preview"
                       >
                         <FontAwesomeIcon icon={faEye} className="text-sm" />
                       </button>
                       <Link
                         to={`/admin/stories/edit/${story.id}`}
                         className="text-green-600 hover:text-green-900 p-1.5"
                         title="Edit"
                       >
                         <FontAwesomeIcon icon={faEdit} className="text-sm" />
                       </Link>
                       <button
                         onClick={() => handleDeleteStory(story.id)}
                         className="text-red-600 hover:text-red-900 p-1.5"
                         title="Delete"
                       >
                         <FontAwesomeIcon icon={faTrash} className="text-sm" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
              Recent Activity
            </h2>
            <Link
              to="/admin/activity"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              View All
              <FontAwesomeIcon icon={faArrowUp} className="ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

            {/* Additional Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-lg" />
            </div>
            <h3 className="ml-2 text-base font-semibold text-gray-900">Pending Actions</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
              <span className="text-xs text-gray-700">Donations to process</span>
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">{stats.pendingDonations}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
              <span className="text-xs text-gray-700">Stories to review</span>
              <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">3</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-xs text-gray-700">Messages to reply</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">7</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 text-lg" />
            </div>
            <h3 className="ml-2 text-base font-semibold text-gray-900">Website Health</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-700">Uptime</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-700">Response time</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">245ms</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
              <span className="text-xs text-gray-700">SSL Status</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-lg" />
            </div>
            <h3 className="ml-2 text-base font-semibold text-gray-900">Performance</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-xs text-gray-700">Bounce rate</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{quickStats.bounceRate}%</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-xs text-gray-700">Avg session</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{quickStats.avgSessionDuration}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
              <span className="text-xs text-gray-700">Conversion rate</span>
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">2.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600 mr-2" />
            Admin Tips
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <FontAwesomeIcon icon={faDollarSign} className="text-blue-600 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 text-sm">Donation Management</h3>
                <p className="text-xs text-blue-700">Process donations promptly to maintain donor trust</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <FontAwesomeIcon icon={faNewspaper} className="text-green-600 mt-1" />
              <div>
                <h3 className="font-medium text-green-900 text-sm">Content Quality</h3>
                <p className="text-xs text-green-700">Review stories before publishing for quality control</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start space-x-2">
              <FontAwesomeIcon icon={faUsers} className="text-purple-600 mt-1" />
              <div>
                <h3 className="font-medium text-purple-900 text-sm">User Management</h3>
                <p className="text-xs text-purple-700">Regularly review user permissions and access</p>
              </div>
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
                  src={previewStory.image ? previewStory.image : '/Images/2025-01-06-community-dialogues.jpg'}
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
