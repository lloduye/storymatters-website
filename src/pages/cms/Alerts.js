import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faBell, 
  faCheckCircle,
  faEye,
  faTrash,
  faCog
} from '@fortawesome/free-solid-svg-icons';

const Alerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: 'High Memory Usage',
      message: 'Server memory usage has exceeded 80% threshold',
      severity: 'warning',
      timestamp: '2025-01-15 15:30:00',
      read: false,
      category: 'system'
    },
    {
      id: 2,
      title: 'Backup Failed',
      message: 'Daily backup process failed due to insufficient disk space',
      severity: 'error',
      timestamp: '2025-01-15 14:00:00',
      read: false,
      category: 'backup'
    },
    {
      id: 3,
      title: 'New User Registration',
      message: 'New editor account created: editor3@storymatters.org',
      severity: 'info',
      timestamp: '2025-01-15 13:45:00',
      read: true,
      category: 'user'
    },
    {
      id: 4,
      title: 'Database Connection Slow',
      message: 'Database response time has increased to 500ms',
      severity: 'warning',
      timestamp: '2025-01-15 13:30:00',
      read: false,
      category: 'database'
    },
    {
      id: 5,
      title: 'SSL Certificate Expiring',
      message: 'SSL certificate will expire in 15 days',
      severity: 'warning',
      timestamp: '2025-01-15 12:00:00',
      read: true,
      category: 'security'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const markAsRead = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const deleteAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-100 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'success': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return faExclamationTriangle;
      case 'warning': return faExclamationTriangle;
      case 'info': return faBell;
      case 'success': return faCheckCircle;
      default: return faBell;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesCategory = selectedCategory === 'all' || alert.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return matchesCategory && matchesSeverity;
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-blue-600 mr-3" />
              System Alerts & Notifications
            </h1>
            <p className="text-gray-600 mt-2">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {unreadCount} unread alerts
            </span>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Alert Settings
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="system">System</option>
              <option value="backup">Backup</option>
              <option value="user">User</option>
              <option value="database">Database</option>
              <option value="security">Security</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setAlerts(alerts.map(alert => ({ ...alert, read: true })));
              }}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
          <span className="text-sm text-gray-500">{filteredAlerts.length} alerts found</span>
        </div>
        
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                alert.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-l-4 border-l-blue-500'
              } ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                    <FontAwesomeIcon icon={getSeverityIcon(alert.severity)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${alert.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {alert.title}
                      </h3>
                      {!alert.read && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${alert.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faBell} className="mr-1" />
                        {alert.timestamp}
                      </span>
                      <span className="capitalize">{alert.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-blue-600 hover:text-blue-700 p-2"
                      title="Mark as Read"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Delete Alert"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faBell} className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {alerts.filter(alert => alert.severity === 'warning').length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">
                {alerts.filter(alert => alert.severity === 'error').length}
              </p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
