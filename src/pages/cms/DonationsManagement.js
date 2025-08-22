import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign, 
  faSearch, 
  faDownload, 
  faEye, 
  faCheckCircle, 
  faTimes, 
  faClock,
  faUser,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faCreditCard,
  faHandHoldingHeart,
  faArrowUp,
  faArrowDown,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const DonationsManagement = () => {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for donations
  const mockDonations = useMemo(() => [
    {
      id: 1,
      donorName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      amount: 500,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      transactionId: 'TXN-2024-001',
      recurring: false,
      notes: 'Monthly supporter',
      address: '123 Main St, City, State 12345'
    },
    {
      id: 2,
      donorName: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      amount: 100,
      currency: 'USD',
      paymentMethod: 'PayPal',
      status: 'pending',
      date: '2024-01-16T14:20:00Z',
      transactionId: 'TXN-2024-002',
      recurring: true,
      notes: 'Recurring monthly donation',
      address: '456 Oak Ave, City, State 12345'
    },
    {
      id: 3,
      donorName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 456-7890',
      amount: 250,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      date: '2024-01-17T09:15:00Z',
      transactionId: 'TXN-2024-003',
      recurring: false,
      notes: 'One-time donation',
      address: '789 Pine Rd, City, State 12345'
    },
    {
      id: 4,
      donorName: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1 (555) 321-6540',
      amount: 1000,
      currency: 'USD',
      paymentMethod: 'Credit Card',
      status: 'failed',
      date: '2024-01-18T16:45:00Z',
      transactionId: 'TXN-2024-004',
      recurring: false,
      notes: 'Large donation - needs verification',
      address: '321 Elm St, City, State 12345'
    },
    {
      id: 5,
      donorName: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 789-0123',
      amount: 75,
      currency: 'USD',
      paymentMethod: 'PayPal',
      status: 'completed',
      date: '2024-01-19T11:30:00Z',
      transactionId: 'TXN-2024-005',
      recurring: true,
      notes: 'Student supporter',
      address: '654 Maple Dr, City, State 12345'
    }
  ], []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDonations(mockDonations);
      setIsLoading(false);
    }, 1000);
  }, [mockDonations]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return faCheckCircle;
      case 'pending': return faClock;
      case 'failed': return faTimes;
      default: return faClock;
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

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: donations.length,
    completed: donations.filter(d => d.status === 'completed').length,
    pending: donations.filter(d => d.status === 'pending').length,
    failed: donations.filter(d => d.status === 'failed').length,
    totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    monthlyAmount: donations
      .filter(d => new Date(d.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, d) => sum + d.amount, 0)
  };

  const handleStatusUpdate = (donationId, newStatus) => {
    setDonations(prev => prev.map(d => 
      d.id === donationId ? { ...d, status: newStatus } : d
    ));
    toast.success(`Donation status updated to ${newStatus}`);
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donations Management</h1>
          <p className="text-gray-600 mt-2">Manage and process all donations from your supporters</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Donation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donations"
          value={stats.total}
          icon={faDollarSign}
          color="bg-blue-500"
          change="+12"
          changeType="up"
        />
        <StatCard
          title="Total Amount"
          value={`$${stats.totalAmount.toLocaleString()}`}
          icon={faHandHoldingHeart}
          color="bg-green-500"
          change="+$8.2K"
          changeType="up"
        />
        <StatCard
          title="Monthly Amount"
          value={`$${stats.monthlyAmount.toLocaleString()}`}
          icon={faCalendarAlt}
          color="bg-purple-500"
          change="+$2.1K"
          changeType="up"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={faClock}
          color="bg-yellow-500"
          change="+3"
          changeType="up"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by donor name, email, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading donations...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                          <div className="text-sm text-gray-500">{donation.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${donation.amount.toLocaleString()}
                      </div>
                      {donation.recurring && (
                        <div className="text-xs text-blue-600">Recurring</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                        <FontAwesomeIcon icon={getStatusIcon(donation.status)} className="mr-1" />
                        {donation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(donation.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-gray-400" />
                        {donation.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(donation)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="View Details"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        {donation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(donation.id, 'completed')}
                              className="text-green-600 hover:text-green-900 p-2"
                              title="Approve"
                            >
                              <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(donation.id, 'failed')}
                              className="text-red-600 hover:text-red-900 p-2"
                              title="Reject"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Donation Details Modal */}
      {showModal && selectedDonation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Donation Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Donor Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="w-4 text-gray-400 mr-2" />
                        <span>{selectedDonation.donorName}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faEnvelope} className="w-4 text-gray-400 mr-2" />
                        <span>{selectedDonation.email}</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="w-4 text-gray-400 mr-2" />
                        <span>{selectedDonation.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Donation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">${selectedDonation.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDonation.status)}`}>
                          {selectedDonation.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-xs">{selectedDonation.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span>{selectedDonation.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recurring:</span>
                        <span>{selectedDonation.recurring ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedDonation.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600">{selectedDonation.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsManagement;
