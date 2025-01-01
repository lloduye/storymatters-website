import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { 
  FaEnvelope, FaPhone, FaTrash, FaCheck, FaTimes, 
  FaDownload, FaFilter, FaBuilding, FaUser, FaGlobe,
  FaHandshake, FaHands, FaEye
} from 'react-icons/fa';
import './Submissions.css';
import { sendEmailNotification } from '../../../utils/emailService';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import SubmissionModal from '../../../components/Modal/SubmissionModal';
import CustomNotification from '../../../components/CustomNotification/CustomNotification';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [typeFilter, setTypeFilter] = useState('all'); // all, volunteer, partnership
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    volunteer: 0,
    partnership: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const submissionsRef = collection(db, 'submissions');
      const q = query(submissionsRef, orderBy('submittedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const submissionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate()
      }));

      setSubmissions(submissionsData);
      
      // Calculate stats
      const newStats = submissionsData.reduce((acc, sub) => ({
        total: acc.total + 1,
        pending: acc.pending + (sub.status === 'pending' ? 1 : 0),
        approved: acc.approved + (sub.status === 'approved' ? 1 : 0),
        rejected: acc.rejected + (sub.status === 'rejected' ? 1 : 0),
        volunteer: acc.volunteer + (sub.type === 'volunteer' ? 1 : 0),
        partnership: acc.partnership + (sub.type === 'partnership' ? 1 : 0)
      }), {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        volunteer: 0,
        partnership: 0
      });

      setStats(newStats);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId, newStatus) => {
    try {
      const submissionRef = doc(db, 'submissions', submissionId);
      
      await updateDoc(submissionRef, {
        status: newStatus,
        reviewedAt: new Date()
      });

      if (newStatus === 'approved') {
        const submission = submissions.find(s => s.id === submissionId);
        if (submission) {
          const emailTemplate = submission.type === 'volunteer' 
            ? 'volunteerApproved' 
            : 'partnershipApproved';
          
          const emailData = {
            email: submission.email,
            name: submission.type === 'volunteer' ? submission.name : submission.organizationName,
            type: submission.type,
            programs: submission.type === 'volunteer' ? submission.programs : [],
            partnershipTypes: submission.type === 'partnership' ? submission.partnershipTypes : [],
            organizationName: submission.organizationName || '',
            submittedAt: submission.submittedAt.toLocaleDateString(),
            id: submission.id
          };

          await sendEmailNotification(emailTemplate, emailData);
          
          setNotification({
            type: 'success',
            message: `${submission.type === 'volunteer' ? 'Volunteer' : 'Partnership'} application approved and notification email sent!`
          });
        }
      } else {
        setNotification({
          type: 'success',
          message: 'Status updated successfully!'
        });
      }
      
      await loadSubmissions();
    } catch (error) {
      console.error('Error updating submission status:', error);
      setNotification({
        type: 'error',
        message: 'Error updating status. Please try again.'
      });
    }
  };

  const handleDelete = async (submissionId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteDoc(doc(db, 'submissions', submissionId));
        await loadSubmissions();
      } catch (error) {
        console.error('Error deleting submission:', error);
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Type', 'Name', 'Email', 'Phone', 'Status', 'Details'],
      ...submissions.map(sub => [
        sub.submittedAt.toLocaleDateString(),
        sub.type,
        sub.type === 'volunteer' ? sub.name : sub.organizationName,
        sub.email,
        sub.phone,
        sub.status,
        sub.type === 'volunteer' 
          ? `Programs: ${sub.programs?.join(', ')}`
          : `Organization Type: ${sub.organizationType}`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleBulkAction = async (action) => {
    if (selectedSubmissions.length === 0) return;

    switch (action) {
      case 'approve':
      case 'reject':
        await Promise.all(
          selectedSubmissions.map(id => 
            handleStatusUpdate(id, action === 'approve' ? 'approved' : 'rejected')
          )
        );
        break;
      case 'delete':
        if (window.confirm(`Delete ${selectedSubmissions.length} submissions?`)) {
          await Promise.all(
            selectedSubmissions.map(id => handleDelete(id))
          );
        }
        break;
      case 'export':
        handleExportSelected();
        break;
      default:
        break;
    }
    setSelectedSubmissions([]);
  };

  const handleAddNote = async (submissionId, noteText) => {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        notes: arrayUnion({
          text: noteText,
          date: new Date(),
          user: auth.currentUser.email
        })
      });
      await loadSubmissions();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const filteredAndSearchedSubmissions = useCallback(() => {
    return submissions.filter(sub => {
      const matchesSearch = searchTerm === '' || 
        Object.values(sub).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesDate = !dateRange.start || !dateRange.end || 
        (sub.submittedAt >= dateRange.start && sub.submittedAt <= dateRange.end);

      const matchesStatus = filter === 'all' || sub.status === filter;
      const matchesType = typeFilter === 'all' || sub.type === typeFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesType;
    }).sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'date':
          return order * (a.submittedAt - b.submittedAt);
        case 'name':
          return order * (a.name || a.organizationName)
            .localeCompare(b.name || b.organizationName);
        case 'status':
          return order * a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [submissions, searchTerm, dateRange, filter, typeFilter, sortBy, sortOrder]);

  const getSubmissionIcon = (type) => {
    switch (type) {
      case 'volunteer': return <FaHands />;
      case 'partnership': return <FaHandshake />;
      default: return null;
    }
  };

  const renderSubmissionDetails = (submission) => {
    if (submission.type === 'volunteer') {
      return (
        <>
          <div className="detail-section">
            <h4>Programs Interest</h4>
            <ul>
              {submission.programs?.map(program => (
                <li key={program}>{program}</li>
              ))}
            </ul>
          </div>
          <div className="detail-section">
            <h4>Availability</h4>
            <p>{submission.availability}</p>
          </div>
          <div className="detail-section">
            <h4>Experience</h4>
            <p>{submission.experience}</p>
          </div>
        </>
      );
    } else if (submission.type === 'partnership') {
      return (
        <>
          <div className="detail-section">
            <h4>Organization Type</h4>
            <p>{submission.organizationType}</p>
          </div>
          <div className="detail-section">
            <h4>Partnership Types</h4>
            <ul>
              {submission.partnershipTypes?.map(type => (
                <li key={type}>{type}</li>
              ))}
            </ul>
          </div>
          <div className="detail-section">
            <h4>Goals</h4>
            <p>{submission.goals}</p>
          </div>
          {submission.website && (
            <div className="detail-section">
              <h4>Website</h4>
              <a href={submission.website} target="_blank" rel="noopener noreferrer">
                {submission.website}
              </a>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div className="submissions-manager">
      <div className="submissions-header">
        <div className="header-content">
          <h2>Submissions Management</h2>
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-label">Total</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item pending">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
            <div className="stat-item approved">
              <span className="stat-label">Approved</span>
              <span className="stat-value">{stats.approved}</span>
            </div>
            <div className="stat-item rejected">
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{stats.rejected}</span>
            </div>
          </div>
        </div>
        
        <div className="submissions-actions">
          <div className="filter-group">
            <FaFilter />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="volunteer">Volunteers</option>
              <option value="partnership">Partnerships</option>
            </select>
          </div>

          <button onClick={handleExport} className="action-btn">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="submissions-toolbar">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
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
        </div>

        <div className="sort-section">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
          <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {selectedSubmissions.length > 0 && (
          <div className="bulk-actions">
            <button onClick={() => handleBulkAction('approve')}>
              Approve Selected
            </button>
            <button onClick={() => handleBulkAction('reject')}>
              Reject Selected
            </button>
            <button onClick={() => handleBulkAction('delete')}>
              Delete Selected
            </button>
            <button onClick={() => handleBulkAction('export')}>
              Export Selected
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-state">Loading submissions...</div>
      ) : filteredAndSearchedSubmissions().length === 0 ? (
        <div className="empty-state">No submissions found</div>
      ) : (
        <div className="submissions-list">
          {filteredAndSearchedSubmissions().map(submission => (
            <div 
              key={submission.id} 
              className={`submission-item ${submission.status}`}
            >
              <div className="submission-header">
                <div className="submission-meta">
                  <span className="submission-type">
                    {getSubmissionIcon(submission.type)}
                    {submission.type}
                  </span>
                  <span className="submission-date">
                    {submission.submittedAt.toLocaleDateString()}
                  </span>
                  <span className={`status-badge ${submission.status}`}>
                    {submission.status}
                  </span>
                </div>

                <h3>
                  {submission.type === 'volunteer' ? (
                    <><FaUser /> {submission.name}</>
                  ) : (
                    <><FaBuilding /> {submission.organizationName}</>
                  )}
                </h3>

                <div className="contact-info">
                  <span><FaEnvelope /> {submission.email}</span>
                  {submission.phone && (
                    <span><FaPhone /> {submission.phone}</span>
                  )}
                  {submission.website && (
                    <span><FaGlobe /> {submission.website}</span>
                  )}
                </div>

                <div className="submission-actions">
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    className="view-btn"
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>

              <div className={`submission-details ${
                selectedSubmission?.id === submission.id ? 'expanded' : ''
              }`}>
                {renderSubmissionDetails(submission)}
                
                <div className="submission-message">
                  <h4>Additional Message</h4>
                  <p>{submission.message || 'No additional message'}</p>
                </div>
                
                <div className="submission-actions">
                  {submission.status === 'pending' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(submission.id, 'approved');
                        }}
                        className="approve-btn"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(submission.id, 'rejected');
                        }}
                        className="reject-btn"
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(submission.id);
                    }}
                    className="delete-btn"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedSubmission(null);
          }}
        />
      )}

      {notification && (
        <CustomNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Submissions; 