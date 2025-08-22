import React$1 from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faSearch, 
  faDownload,
  faEye,
  faUser,
  faClock,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const AuditLogs = () => {
  useScrollToTop();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const auditLogs = [
    { 
      id: 1, 
      timestamp: '2025-01-15 15:30:00', 
      user: 'admin@storymatters.org', 
      action: 'User Login', 
      details: 'Successful login from 192.168.1.100', 
      severity: 'info',
      ip: '192.168.1.100'
    },
    { 
      id: 2, 
      timestamp: '2025-01-15 15:25:00', 
      user: 'editor1@storymatters.org', 
      action: 'Story Created', 
      details: 'New story "Community Impact" created', 
      severity: 'info',
      ip: '192.168.1.101'
    },
    { 
      id: 3, 
      timestamp: '2025-01-15 15:20:00', 
      user: 'admin@storymatters.org', 
      action: 'User Deleted', 
      details: 'User account deleted: test@example.com', 
      severity: 'warning',
      ip: '192.168.1.100'
    },
    { 
      id: 4, 
      timestamp: '2025-01-15 15:15:00', 
      user: 'system', 
      action: 'Backup Completed', 
      details: 'Daily backup completed successfully', 
      severity: 'success',
      ip: 'N/A'
    },
    { 
      id: 5, 
      timestamp: '2025-01-15 15:10:00', 
      user: 'editor2@storymatters.org', 
      action: 'Failed Login', 
      details: 'Invalid password attempt', 
      severity: 'warning',
      ip: '192.168.1.102'
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'success': return faCheckCircle;
      case 'warning': return faExclamationTriangle;
      case 'error': return faExclamationTriangle;
      case 'info': return faInfoCircle;
      default: return faInfoCircle;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || log.severity === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const exportLogs = () => {
    // This would integrate with your backend to export logs
    console.log('Exporting audit logs...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faClipboardList} className="text-blue-600 mr-3" />
              Audit Logs & Activity Tracking
            </h1>
            <p className="text-gray-600 mt-2">Monitor system activities and user actions</p>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Logs</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search actions, users, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity Filter</label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
          <span className="text-sm text-gray-500">{filteredLogs.length} entries found</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="text-gray-400 mr-2" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                      <FontAwesomeIcon icon={getSeverityIcon(log.severity)} className="mr-1" />
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 p-2" title="View Details">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{auditLogs.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faClipboardList} className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Info Logs</p>
              <p className="text-2xl font-bold text-blue-600">{auditLogs.filter(log => log.severity === 'info').length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faInfoCircle} className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{auditLogs.filter(log => log.severity === 'warning').length}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-lg text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Success</p>
              <p className="text-2xl font-bold text-green-600">{auditLogs.filter(log => log.severity === 'success').length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faCheckCircle} className="text-lg text-green-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
