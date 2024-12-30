import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { FaSearch, FaDownload, FaEye, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    volunteer: 0,
    contact: 0,
    newsletter: 0
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const submissionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionsData);
      calculateStats(submissionsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setLoading(false);
    }
  };

  const calculateStats = (submissionsData) => {
    setStats({
      total: submissionsData.length,
      unread: submissionsData.filter(sub => !sub.read).length,
      volunteer: submissionsData.filter(sub => sub.type === 'volunteer').length,
      contact: submissionsData.filter(sub => sub.type === 'contact').length,
      newsletter: submissionsData.filter(sub => sub.type === 'newsletter').length
    });
  };

  const handleStatusUpdate = async (submissionId, newStatus) => {
    try {
      await updateDoc(doc(db, 'messages', submissionId), {
        status: newStatus,
        read: true,
        updatedAt: new Date()
      });
      loadSubmissions();
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteDoc(doc(db, 'messages', submissionId));
        loadSubmissions();
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  const handleMarkAsRead = async (submissionId) => {
    try {
      await updateDoc(doc(db, 'messages', submissionId), {
        read: true,
        updatedAt: new Date()
      });
      loadSubmissions();
    } catch (error) {
      console.error('Error marking submission as read:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Name', 'Email', 'Type', 'Status', 'Message'];
    const csvData = submissions.map(submission => [
      new Date(submission.timestamp.toDate()).toLocaleDateString(),
      submission.name,
      submission.email,
      submission.type,
      submission.status,
      submission.message
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      submission.type === filter;

    const matchesDate = 
      (!dateRange.start || new Date(submission.timestamp.toDate()) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(submission.timestamp.toDate()) <= new Date(dateRange.end));

    return matchesSearch && matchesFilter && matchesDate;
  });

  const getTypeLabel = (type) => {
    switch (type) {
      case 'volunteer': return 'Volunteer Application';
      case 'contact': return 'Contact Message';
      case 'newsletter': return 'Newsletter Signup';
      default: return type;
    }
  };

  return (
    <div className="submissions-section">
      {/* Stats Overview */}
      <div className="submissions-stats">
        <div className="stat-card">
          <h4>Total Submissions</h4>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h4>Unread Messages</h4>
          <p>{stats.unread}</p>
        </div>
        <div className="stat-card">
          <h4>Volunteer Applications</h4>
          <p>{stats.volunteer}</p>
        </div>
        <div className="stat-card">
          <h4>Contact Messages</h4>
          <p>{stats.contact}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="submissions-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or email..."
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
            className="type-filter"
          >
            <option value="all">All Types</option>
            <option value="volunteer">Volunteer Applications</option>
            <option value="contact">Contact Messages</option>
            <option value="newsletter">Newsletter Signups</option>
          </select>

          <button onClick={exportToCSV} className="export-btn">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="submissions-table-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">Loading submissions...</td>
              </tr>
            ) : filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">No submissions found</td>
              </tr>
            ) : (
              filteredSubmissions.map(submission => (
                <tr key={submission.id} className={!submission.read ? 'unread' : ''}>
                  <td>{new Date(submission.timestamp.toDate()).toLocaleDateString()}</td>
                  <td>{submission.name}</td>
                  <td>{submission.email}</td>
                  <td>
                    <span className={`type-badge ${submission.type}`}>
                      {getTypeLabel(submission.type)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${submission.status}`}>
                      {submission.status || 'new'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="action-btn view"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {!submission.read && (
                      <button
                        onClick={() => handleMarkAsRead(submission.id)}
                        className="action-btn read"
                        title="Mark as Read"
                      >
                        <FaEnvelope />
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusUpdate(submission.id, 'processed')}
                      className="action-btn approve"
                      title="Mark as Processed"
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => handleDeleteSubmission(submission.id)}
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

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Submission Details</h3>
            <div className="submission-details">
              <div className="detail-row">
                <span>Type:</span>
                <span className={`type-badge ${selectedSubmission.type}`}>
                  {getTypeLabel(selectedSubmission.type)}
                </span>
              </div>
              <div className="detail-row">
                <span>Date:</span>
                <span>{new Date(selectedSubmission.timestamp.toDate()).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Name:</span>
                <span>{selectedSubmission.name}</span>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <span>{selectedSubmission.email}</span>
              </div>
              {selectedSubmission.phone && (
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedSubmission.phone}</span>
                </div>
              )}
              {selectedSubmission.message && (
                <div className="detail-row">
                  <span>Message:</span>
                  <span className="message-content">{selectedSubmission.message}</span>
                </div>
              )}
              {selectedSubmission.interests && (
                <div className="detail-row">
                  <span>Interests:</span>
                  <span>{selectedSubmission.interests.join(', ')}</span>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => handleStatusUpdate(selectedSubmission.id, 'processed')}
                className="process-btn"
              >
                Mark as Processed
              </button>
              <button 
                onClick={() => setSelectedSubmission(null)} 
                className="close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions; 