import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { FaSearch, FaFilter, FaDownload, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './Donations.css';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    total: 0,
    monthly: 0,
    average: 0,
    count: 0
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const q = query(collection(db, 'donations'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const donationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donationsData);
      calculateStats(donationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading donations:', error);
      setLoading(false);
    }
  };

  const calculateStats = (donationsData) => {
    const total = donationsData.reduce((sum, donation) => sum + donation.amount, 0);
    const currentMonth = new Date().getMonth();
    const monthlyDonations = donationsData.filter(donation => 
      new Date(donation.timestamp.toDate()).getMonth() === currentMonth
    );
    const monthlyTotal = monthlyDonations.reduce((sum, donation) => sum + donation.amount, 0);

    setStats({
      total: total.toFixed(2),
      monthly: monthlyTotal.toFixed(2),
      average: (total / donationsData.length || 0).toFixed(2),
      count: donationsData.length
    });
  };

  const handleStatusUpdate = async (donationId, newStatus) => {
    try {
      await updateDoc(doc(db, 'donations', donationId), {
        status: newStatus,
        updatedAt: new Date()
      });
      loadDonations();
    } catch (error) {
      console.error('Error updating donation status:', error);
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (window.confirm('Are you sure you want to delete this donation record?')) {
      try {
        await deleteDoc(doc(db, 'donations', donationId));
        loadDonations();
      } catch (error) {
        console.error('Error deleting donation:', error);
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Donor', 'Amount', 'Status', 'Payment Method', 'Email'];
    const csvData = donations.map(donation => [
      new Date(donation.timestamp.toDate()).toLocaleDateString(),
      donation.donor,
      donation.amount,
      donation.status,
      donation.paymentMethod,
      donation.email
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.donor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      donation.status === filter;

    const matchesDate = 
      (!dateRange.start || new Date(donation.timestamp.toDate()) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(donation.timestamp.toDate()) <= new Date(dateRange.end));

    return matchesSearch && matchesFilter && matchesDate;
  });

  return (
    <div className="donations-section">
      {/* Stats Overview */}
      <div className="donations-stats">
        <div className="stat-card">
          <h4>Total Donations</h4>
          <p>${stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Monthly Donations</h4>
          <p>${stats.monthly}</p>
        </div>
        <div className="stat-card">
          <h4>Average Donation</h4>
          <p>${stats.average}</p>
        </div>
        <div className="stat-card">
          <h4>Total Count</h4>
          <p>{stats.count}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="donations-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search donors or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="date-filters">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <span>to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <button onClick={exportToCSV} className="export-btn">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Donations Table */}
      <div className="donations-table-container">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Donor</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Method</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="loading-cell">Loading donations...</td>
              </tr>
            ) : filteredDonations.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-cell">No donations found</td>
              </tr>
            ) : (
              filteredDonations.map(donation => (
                <tr key={donation.id}>
                  <td>{new Date(donation.timestamp.toDate()).toLocaleDateString()}</td>
                  <td>{donation.donor}</td>
                  <td>${donation.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${donation.status}`}>
                      {donation.status}
                    </span>
                  </td>
                  <td>{donation.paymentMethod}</td>
                  <td>{donation.email}</td>
                  <td className="actions-cell">
                    <button
                      onClick={() => setSelectedDonation(donation)}
                      className="action-btn view"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(donation.id, 'completed')}
                      className="action-btn approve"
                      title="Mark as Completed"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDeleteDonation(donation.id)}
                      className="action-btn delete"
                      title="Delete"
                    >
                      <FaTimesCircle />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="modal-overlay" onClick={() => setSelectedDonation(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Donation Details</h3>
            <div className="donation-details">
              <div className="detail-row">
                <span>Donor:</span>
                <span>{selectedDonation.donor}</span>
              </div>
              <div className="detail-row">
                <span>Amount:</span>
                <span>${selectedDonation.amount.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span>Date:</span>
                <span>{new Date(selectedDonation.timestamp.toDate()).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Status:</span>
                <span className={`status-badge ${selectedDonation.status}`}>
                  {selectedDonation.status}
                </span>
              </div>
              <div className="detail-row">
                <span>Payment Method:</span>
                <span>{selectedDonation.paymentMethod}</span>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <span>{selectedDonation.email}</span>
              </div>
              {selectedDonation.message && (
                <div className="detail-row">
                  <span>Message:</span>
                  <span>{selectedDonation.message}</span>
                </div>
              )}
            </div>
            <button onClick={() => setSelectedDonation(null)} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations; 