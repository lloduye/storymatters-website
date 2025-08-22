import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDatabase, 
  faDownload, 
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faPlay,
  faPause,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Backup = () => {
  const [backupStatus, setBackupStatus] = useState('idle');
  const [lastBackup] = useState('2025-01-15 14:30:00');
  const [nextBackup] = useState('2025-01-16 02:00:00');

  const backupHistory = [
    { id: 1, date: '2025-01-15 14:30:00', type: 'Full Backup', size: '2.4 GB', status: 'completed' },
    { id: 2, date: '2025-01-14 14:30:00', type: 'Full Backup', size: '2.3 GB', status: 'completed' },
    { id: 3, date: '2025-01-13 14:30:00', type: 'Full Backup', size: '2.2 GB', status: 'completed' },
    { id: 4, date: '2025-01-12 14:30:00', type: 'Full Backup', size: '2.1 GB', status: 'failed' },
  ];

  const startBackup = () => {
    setBackupStatus('running');
    // This would integrate with your backend to start actual backup
    console.log('Starting backup...');
  };

  const stopBackup = () => {
    setBackupStatus('idle');
    console.log('Stopping backup...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return faCheckCircle;
      case 'running': return faClock;
      case 'failed': return faExclamationTriangle;
      default: return faClock;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faDatabase} className="text-blue-600 mr-3" />
              Backup & Data Protection
            </h1>
            <p className="text-gray-600 mt-2">Manage system backups and data recovery</p>
          </div>
          <div className="flex space-x-3">
            {backupStatus === 'idle' ? (
              <button
                onClick={startBackup}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Start Backup
              </button>
            ) : (
              <button
                onClick={stopBackup}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faPause} className="mr-2" />
                Stop Backup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backup Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Last Backup</p>
              <p className="text-lg font-bold text-gray-900">{lastBackup}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FontAwesomeIcon icon={faClock} className="text-lg text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Next Backup</p>
              <p className="text-lg font-bold text-gray-900">{nextBackup}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FontAwesomeIcon icon={faClock} className="text-lg text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Status</p>
              <p className={`text-lg font-bold ${
                backupStatus === 'running' ? 'text-blue-600' : 
                backupStatus === 'completed' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {backupStatus === 'running' ? 'Running' : 
                 backupStatus === 'completed' ? 'Completed' : 'Idle'}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${
              backupStatus === 'running' ? 'bg-blue-100' : 
              backupStatus === 'completed' ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <FontAwesomeIcon icon={faDatabase} className={`text-lg ${
                backupStatus === 'running' ? 'text-blue-600' : 
                backupStatus === 'completed' ? 'text-green-600' : 'text-gray-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Backup Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Backup Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Daily Backup</span>
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Weekly Full Backup</span>
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Monthly Archive</span>
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">Storage</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Local Storage</span>
                <span className="text-sm font-medium text-gray-900">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Cloud Backup</span>
                <span className="text-sm font-medium text-gray-900">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Retention Period</span>
                <span className="text-sm font-medium text-gray-900">30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Backup History</h2>
        
        <div className="space-y-3">
          {backupHistory.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(backup.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(backup.status)} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{backup.type}</h3>
                  <p className="text-sm text-gray-500">{backup.date} • {backup.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-700 p-2" title="Download">
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button className="text-red-600 hover:text-red-700 p-2" title="Delete">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Backup;
