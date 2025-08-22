import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faEye,
  faEdit,
  faPlus,
  faClock,
  faStar,
  faCalendarAlt,
  faBookOpen,
  faDraftingCompass,
  faArrowRight,
  faCheckCircle,
  faLightbulb,
  faRocket,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const EditorDashboard = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [actionLoading, setActionLoading] = useState({});

  // Get user data - use AuthContext if available, fallback to localStorage
  const currentUser = user || (() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
      }
    }
    return null;
  })();

  const fetchStoriesForUser = useCallback(async (userFullName) => {
    console.log('fetchStoriesForUser: Starting for user:', userFullName);
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    const token = adminToken || userToken;
    console.log('fetchStoriesForUser: Current token:', token);
    
    try {
      // First try to get user-specific stories
      console.log('fetchStoriesForUser: Trying user-specific endpoint...');
      const response = await axios.get(`/api/stories/user/${userFullName}`);
      setStories(response.data || []);
      console.log('fetchStoriesForUser: User stories loaded successfully:', response.data);
    } catch (userStoriesError) {
      console.log('fetchStoriesForUser: Failed to load user stories, trying all stories:', userStoriesError);
      console.log('fetchStoriesForUser: Error details:', userStoriesError.response?.status, userStoriesError.response?.data);
      
      // Fallback to all stories if user-specific fetch fails
      try {
        console.log('fetchStoriesForUser: Trying fallback to all stories...');
        const allStoriesResponse = await axios.get('/api/stories');
        console.log('fetchStoriesForUser: Looking for stories by author:', userFullName);
        console.log('fetchStoriesForUser: Available authors in stories:', allStoriesResponse.data.map(story => story.author));
        const userStories = allStoriesResponse.data.filter(story => story.author === userFullName);
        console.log('fetchStoriesForUser: All stories from API:', allStoriesResponse.data);
        console.log('fetchStoriesForUser: User stories after filtering:', userStories);
        console.log('fetchStoriesForUser: Sample story structure:', userStories[0]);
        setStories(userStories || []);
      } catch (allStoriesError) {
        console.error('fetchStoriesForUser: Failed to load all stories:', allStoriesError);
        console.log('fetchStoriesForUser: All stories error details:', allStoriesError.response?.status, allStoriesError.response?.data);
        setStories([]);
      }
    }
    console.log('fetchStoriesForUser: Completed');
  }, []);

  const fetchDashboardData = useCallback(async () => {
    console.log('fetchDashboardData: Starting...');
    
    try {
      console.log('fetchDashboardData: Starting data fetch');
      
      // Get user data - either from context or localStorage
      let userToFetch = currentUser;
      if (!userToFetch || !userToFetch.fullName) {
        console.log('fetchDashboardData: User data not available from AuthContext, trying localStorage');
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            userToFetch = JSON.parse(userData);
            console.log('fetchDashboardData: Using user data from localStorage:', userToFetch);
          } catch (error) {
            console.error('fetchDashboardData: Error parsing user data from localStorage:', error);
            setStories([]);
            return;
          }
        }
      }
      
      // If we have user data, fetch stories; otherwise set empty array
      if (userToFetch && userToFetch.fullName) {
        console.log('fetchDashboardData: Fetching stories for user:', userToFetch.fullName);
        await fetchStoriesForUser(userToFetch.fullName);
      } else {
        console.log('fetchDashboardData: No user data available, setting empty stories');
        setStories([]);
      }
      
      console.log('fetchDashboardData: Completed successfully');
    } catch (error) {
      console.error('fetchDashboardData: Error occurred:', error);
      setStories([]);
      toast.error('Failed to load dashboard data');
    } finally {
      console.log('fetchDashboardData: Finally block executing');
    }
  }, [currentUser, fetchStoriesForUser]);

  useEffect(() => {
    console.log('EditorDashboard useEffect triggered - Starting background data fetch');
    
    // Start loading data in background without blocking UI
    const loadDataInBackground = async () => {
      try {
        // Check authentication - try both admin and user tokens
        const adminToken = localStorage.getItem('adminToken');
        const userToken = localStorage.getItem('userToken');
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if ((!adminToken && !userToken) || isLoggedIn !== 'true') {
          console.log('User not authenticated, redirecting to login');
          setTimeout(() => {
            const userData = localStorage.getItem('userData');
            if (userData) {
              try {
                const user = JSON.parse(userData);
                if (user.role === 'editor') {
                  console.log('Editor user, staying on editor dashboard');
                  return;
                }
              } catch (error) {
                console.error('Error parsing user data:', error);
              }
            }
            window.location.href = '/admin';
          }, 1000);
          return;
        }
        
        // Load data in background
        console.log('Starting background data fetch...');
        await fetchDashboardData();
        console.log('Background data fetch completed');
      } catch (error) {
        console.error('Background data fetch failed:', error);
      }
    };
    
    // Start background loading immediately
    loadDataInBackground();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      loadDataInBackground();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]); // Include fetchDashboardData in dependency array

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleStatusToggle = async (storyId, currentStatus) => {
    try {
      console.log('handleStatusToggle: Starting status toggle for story:', storyId, 'Current status:', currentStatus);
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      const token = adminToken || userToken;
      console.log('handleStatusToggle: Token being used:', token);
      
      setActionLoading(prev => ({ ...prev, [`status_${storyId}`]: true }));
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      
      // Get the appropriate token
      const adminToken = localStorage.getItem('adminToken');
      const userToken = localStorage.getItem('userToken');
      const token = adminToken || userToken;
      
      const response = await axios.patch(`/api/stories/${storyId}/status`, 
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      console.log('handleStatusToggle: API response:', response.data);
      toast.success(`Story ${newStatus === 'published' ? 'published' : 'moved to drafts'} successfully!`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('handleStatusToggle: Error updating story status:', error);
      console.error('handleStatusToggle: Error response:', error.response?.data);
      console.error('handleStatusToggle: Error status:', error.response?.status);
      toast.error(`Failed to update story status: ${error.response?.data?.error || error.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [`status_${storyId}`]: false }));
    }
  };

  // Handle stories that might not have status field - default to 'draft' if missing
  console.log('Dashboard: Stories array:', stories);
  console.log('Dashboard: Stories with status field:', stories.filter(story => story.status));
  
  const publishedStories = stories.filter(story => story.status === 'published' || story.status === 'true');
  const draftStories = stories.filter(story => 
    !story.status || story.status === 'draft' || story.status === 'false'
  );
  const totalViews = stories.reduce((sum, story) => sum + (parseInt(story.viewCount) || 0), 0);
  
  console.log('Dashboard: Published stories count:', publishedStories.length);
  console.log('Dashboard: Draft stories count:', draftStories.length);
  console.log('Dashboard: Total views:', totalViews);

  const quickActions = [
    {
      title: 'Create New Story',
      description: 'Start writing your next impactful story',
      icon: faPlus,
      color: 'bg-blue-500',
      href: '/editor/stories/new'
    },
    {
      title: 'Manage Drafts',
      description: 'Continue working on your drafts',
      icon: faDraftingCompass,
      color: 'bg-yellow-500',
      href: '/editor/drafts'
    },
    {
      title: 'Content Library',
      description: 'Access templates and resources',
      icon: faBookOpen,
      color: 'bg-green-500',
      href: '/editor/library'
    },
    {
      title: 'My Stories',
      description: 'View and manage all your stories',
      icon: faNewspaper,
      color: 'bg-purple-500',
      href: '/editor/stories'
    }
  ];

  const tips = [
    'Use compelling headlines to grab reader attention',
    'Include high-quality images to enhance your stories',
    'Write with your audience in mind',
    'Proofread before publishing',
    'Use tags to improve discoverability'
  ];

  // FORCE DASHBOARD TO ALWAYS RENDER - NO MORE LOADING SCREENS
  // Skip all loading checks and always show the dashboard content

                  return (
                  <div className="space-y-6">


                          {/* Welcome Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h1 className="text-2xl font-bold mb-1">
                            Welcome back, {currentUser?.fullName || 'Editor'}! 👋
                          </h1>
                          <p className="text-blue-100 text-sm">
                            Ready to create amazing stories that make a difference?
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
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-blue-200 text-xs">
                            <span className="flex items-center">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                              Connected
                            </span>
                            <button
                              onClick={handleRefresh}
                              className="flex items-center px-2 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-200 text-xs"
                              title="Refresh Dashboard"
                            >
                              <FontAwesomeIcon icon={faArrowRight} className="mr-1" />
                              Refresh
                            </button>
                          </div>
                        </div>
                        <div className="hidden lg:block">
                          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faRocket} className="text-3xl text-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                          {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-600">Total Stories</p>
                            <p className="text-2xl font-bold text-gray-900">{stories.length}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {stories.length > 0 ? `${((publishedStories.length / stories.length) * 100).toFixed(0)}% published` : 'No stories yet'}
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
                            <p className="text-xs font-medium text-gray-600">Published</p>
                            <p className="text-2xl font-bold text-green-600">{publishedStories.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Live stories</p>
                          </div>
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-lg text-green-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-600">Drafts</p>
                            <p className="text-2xl font-bold text-yellow-600">{draftStories.length}</p>
                            <p className="text-xs text-gray-500 mt-1">In progress</p>
                          </div>
                          <div className="p-2 bg-yellow-100 rounded-lg">
                            <FontAwesomeIcon icon={faDraftingCompass} className="text-lg text-yellow-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-gray-600">Total Views</p>
                            <p className="text-2xl font-bold text-purple-600">{totalViews.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 mt-1">Engagement</p>
                          </div>
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FontAwesomeIcon icon={faEye} className="text-lg text-purple-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                          {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faRocket} className="text-blue-600 mr-2" />
                        Quick Actions
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((action, index) => (
                          <Link
                            key={index}
                            to={action.href}
                            className="group p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-start space-x-2">
                              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-105 transition-transform duration-200`}>
                                <FontAwesomeIcon icon={action.icon} className="text-white text-sm" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                  {action.title}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                          {/* Recent Stories */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faNewspaper} className="text-blue-600 mr-2" />
                        Recent Stories
                      </h2>
                      {stories.length === 0 ? (
                        <div className="text-center py-6">
                          <FontAwesomeIcon icon={faNewspaper} className="text-gray-400 text-3xl mb-3" />
                          <h3 className="text-base font-medium text-gray-900 mb-2">No stories yet</h3>
                          <p className="text-sm text-gray-600 mb-3">Get started by creating your first story</p>
                          <Link
                            to="/editor/stories/new"
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
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
                                <FontAwesomeIcon icon={faNewspaper} className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-sm text-gray-900">{story.title}</h3>
                                <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-1" />
                                    {story.author || 'Unknown Author'}
                                  </span>
                                  <span className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                    {story.publishDate ? new Date(story.publishDate).toLocaleDateString() : 'No date'}
                                  </span>
                                  {story.featured === 'true' && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-1">{story.excerpt}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link
                                  to={`/editor/stories/edit/${story.id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1.5"
                                  title="Edit"
                                >
                                  <FontAwesomeIcon icon={faEdit} className="text-xs" />
                                </Link>
                                <button
                                  onClick={() => handleStatusToggle(story.id, story.status)}
                                  className={`p-1.5 rounded ${
                                    story.status === 'published' 
                                      ? 'text-green-600 hover:text-green-900' 
                                      : 'text-yellow-600 hover:text-yellow-900'
                                  }`}
                                  title={story.status === 'published' ? 'Move to Drafts' : 'Publish'}
                                  disabled={actionLoading[`status_${story.id}`]}
                                >
                                  <FontAwesomeIcon 
                                    icon={story.status === 'published' ? faDraftingCompass : faCheckCircle} 
                                    className="text-xs" 
                                  />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                          {/* Tips Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600 mr-2" />
                        Writing Tips
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {tips.map((tip, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start space-x-2">
                              <FontAwesomeIcon icon={faLightbulb} className="text-blue-600 mt-1" />
                              <p className="text-xs text-blue-900">{tip}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                          {/* Call to Action */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-center text-white">
                      <h2 className="text-2xl font-bold mb-3">Ready to Make an Impact?</h2>
                      <p className="text-indigo-100 text-sm mb-4">
                        Your stories have the power to inspire change and connect communities
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                        <Link
                          to="/editor/stories/new"
                          className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center text-sm"
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          Start Writing
                        </Link>
                        <Link
                          to="/editor/library"
                          className="px-6 py-2 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-200 flex items-center text-sm"
                        >
                          <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                          Explore Resources
                        </Link>
                      </div>
                    </div>
    </div>
  );
};

export default EditorDashboard;
