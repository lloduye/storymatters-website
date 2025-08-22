import React$1 from 'react';
import { useScrollToTop } from '../../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileAlt, 
  faDownload, 
  faChartBar,
  faDollarSign,
  faNewspaper,
  faUsers,
  faEye
} from '@fortawesome/free-solid-svg-icons';

const Reports = () => {
  useScrollToTop();
  
  const [selectedReport, setSelectedReport] = useState('donations');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    { id: 'donations', name: 'Donations Report', icon: faDollarSign, color: 'bg-green-500' },
    { id: 'stories', name: 'Stories Report', icon: faNewspaper, color: 'bg-blue-500' },
    { id: 'users', name: 'Users Report', icon: faUsers, color: 'bg-purple-500' },
    { id: 'analytics', name: 'Analytics Report', icon: faChartBar, color: 'bg-orange-500' },
  ];

  const generateReport = () => {
    // This would integrate with your backend to generate actual reports
    console.log(`Generating ${selectedReport} report for ${dateRange}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-blue-600 mr-3" />
              Reports & Analytics
            </h1>
            <p className="text-gray-600 mt-2">Generate comprehensive reports for your organization</p>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedReport === report.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="p-4">
              <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center mb-3`}>
                <FontAwesomeIcon icon={report.icon} className="text-white text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">{report.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Generate detailed insights</p>
            </div>
          </div>
        ))}
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Include Charts</label>
            <div className="flex items-center mt-2">
              <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={generateReport}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faEye} className="mr-2" />
            Generate Report
          </button>
          
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reports</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faDollarSign} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Donations Report - January 2025</h3>
                <p className="text-sm text-gray-500">Generated 2 hours ago</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faNewspaper} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Stories Report - Q4 2024</h3>
                <p className="text-sm text-gray-500">Generated 1 day ago</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
