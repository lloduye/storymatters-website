import React, { useState } from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faEye, faMousePointer, faArrowUp, faArrowDown, faDollarSign, faNewspaper, faHeart,
  faDesktop, faMobile, faTablet, faDownload, faClock
} from '@fortawesome/free-solid-svg-icons';

const Analytics = () => {
  useScrollToTop();
  
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalVisitors: 12470,
      pageViews: 89230,
      bounceRate: 23.4,
      avgSessionDuration: '4m 32s',
      conversionRate: 2.4,
      totalRevenue: 45600
    },
    traffic: {
      organic: 45,
      direct: 30,
      social: 15,
      referral: 10
    },
    devices: {
      desktop: 58,
      mobile: 35,
      tablet: 7
    },
    topPages: [
      { page: '/', views: 15420, change: '+12.5%' },
      { page: '/stories', views: 12340, change: '+8.2%' },
      { page: '/about', views: 9870, change: '+15.3%' },
      { page: '/programs', views: 7650, change: '+5.7%' },
      { page: '/contact', views: 5430, change: '+3.1%' }
    ],
    recentActivity: [
      { time: '2 hours ago', event: 'New donation of $500', type: 'donation' },
      { time: '4 hours ago', event: 'Story published: "Community Transformation"', type: 'content' },
      { time: '6 hours ago', event: 'New user registration', type: 'user' },
      { time: '1 day ago', event: 'Monthly recurring donation', type: 'donation' },
      { time: '1 day ago', event: 'Page view milestone reached', type: 'milestone' }
    ]
  };

  const StatCard = ({ title, value, icon, color, change, changeType }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
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

  const ChartCard = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your website performance and visitor insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Visitors"
          value={analyticsData.overview.totalVisitors.toLocaleString()}
          icon={faUsers}
          color="bg-blue-500"
          change="+15.3%"
          changeType="up"
        />
        <StatCard
          title="Page Views"
          value={analyticsData.overview.pageViews.toLocaleString()}
          icon={faEye}
          color="bg-green-500"
          change="+8.2%"
          changeType="up"
        />
        <StatCard
          title="Bounce Rate"
          value={`${analyticsData.overview.bounceRate}%`}
          icon={faMousePointer}
          color="bg-orange-500"
          change="-2.1%"
          changeType="down"
        />
        <StatCard
          title="Avg Session"
          value={analyticsData.overview.avgSessionDuration}
          icon={faClock}
          color="bg-purple-500"
          change="+12s"
          changeType="up"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <ChartCard title="Traffic Sources" className="lg:col-span-1">
          <div className="space-y-4">
            {Object.entries(analyticsData.traffic).map(([source, percentage]) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    source === 'organic' ? 'bg-blue-500' :
                    source === 'direct' ? 'bg-green-500' :
                    source === 'social' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-sm font-medium text-gray-700 capitalize">{source}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Device Distribution */}
        <ChartCard title="Device Distribution" className="lg:col-span-1">
          <div className="space-y-4">
            {Object.entries(analyticsData.devices).map(([device, percentage]) => (
              <div key={device} className="flex items-center justify-between">
                <div className="flex items-center">
                  <FontAwesomeIcon 
                    icon={device === 'desktop' ? faDesktop : device === 'mobile' ? faMobile : faTablet}
                    className="w-4 h-4 text-gray-500 mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{device}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Conversion Metrics */}
        <ChartCard title="Conversion Metrics" className="lg:col-span-1">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Conversion Rate</span>
              <span className="text-sm font-semibold text-green-600">{analyticsData.overview.conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Total Revenue</span>
              <span className="text-sm font-semibold text-green-600">${analyticsData.overview.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Avg Order Value</span>
              <span className="text-sm font-semibold text-blue-600">$195</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Top Pages */}
      <ChartCard title="Top Performing Pages">
        <div className="space-y-3">
          {analyticsData.topPages.map((page, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold mr-3">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900">{page.page}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{page.views.toLocaleString()} views</span>
                <span className="text-xs text-green-600 font-medium">{page.change}</span>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Recent Activity */}
      <ChartCard title="Recent Activity">
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activity.type === 'donation' ? 'bg-green-100 text-green-600' :
                activity.type === 'content' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'user' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'
              }`}>
                <FontAwesomeIcon 
                  icon={
                    activity.type === 'donation' ? faDollarSign :
                    activity.type === 'content' ? faNewspaper :
                    activity.type === 'user' ? faUsers : faHeart
                  }
                  className="text-sm"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.event}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Analytics;
