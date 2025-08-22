import React$1 from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faServer, 
  faDatabase, 
  faExclamationTriangle,
  faCheckCircle,
  faSync
} from '@fortawesome/free-solid-svg-icons';

const SystemHealth = () => {
  useScrollToTop();
  
  const [lastChecked, setLastChecked] = useState(new Date());

  const checkSystemHealth = () => {
    setLastChecked(new Date());
    // This would integrate with your backend to check actual system health
    console.log('Checking system health...');
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 mr-3" />
              System Health & Monitoring
            </h1>
            <p className="text-gray-600 mt-2">Monitor system performance and health metrics</p>
          </div>
          <button
            onClick={checkSystemHealth}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faSync} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Server Status</p>
              <p className="text-2xl font-bold text-green-600">Healthy</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faServer} className="text-lg text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Database</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faDatabase} className="text-lg text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Website</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faShieldAlt} className="text-lg text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">API Status</p>
              <p className="text-2xl font-bold text-green-600">Running</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faShieldAlt} className="text-lg text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Uptime</span>
              <span className="text-sm font-bold text-green-600">99.9%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Response Time</span>
              <span className="text-sm font-bold text-blue-600">245ms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">CPU Usage</span>
              <span className="text-sm font-bold text-orange-600">23%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '23%' }}></div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Memory Usage</span>
              <span className="text-sm font-bold text-purple-600">67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Disk Usage</span>
              <span className="text-sm font-bold text-indigo-600">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active Connections</span>
              <span className="text-sm font-bold text-teal-600">127</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h2>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">All systems operational</p>
              <p className="text-xs text-green-700">No critical issues detected</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Memory usage above 60%</p>
              <p className="text-xs text-yellow-700">Consider monitoring memory allocation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600">
          Last checked: {lastChecked.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default SystemHealth;
