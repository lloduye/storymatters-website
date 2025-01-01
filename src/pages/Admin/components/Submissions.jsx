import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { FaEnvelope, FaPhone, FaTrash, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, reviewed
  const [selectedSubmission, setSelectedSubmission] = useState(null);

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
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId, newStatus) => {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        status: newStatus,
        reviewedAt: new Date()
      });
      
      await loadSubmissions();
    } catch (error) {
      console.error('Error updating submission status:', error);
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
      ['Date', 'Name', 'Email', 'Phone', 'Type', 'Message', 'Status'],
      ...submissions.map(sub => [
        sub.submittedAt.toLocaleDateString(),
        sub.name,
        sub.email,
        sub.phone || 'N/A',
        sub.type,
        sub.message,
        sub.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  return (
    <div className="submissions-manager">
      <div className="submissions-header">
        <h2>Submissions</h2>
        <div className="submissions-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={handleExport} className="export-btn">
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading submissions...</div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="empty-state">No submissions found</div>
      ) : (
        <div className="submissions-list">
          {filteredSubmissions.map(submission => (
            <div 
              key={submission.id} 
              className={`submission-item ${submission.status}`}
              onClick={() => setSelectedSubmission(
                selectedSubmission?.id === submission.id ? null : submission
              )}
            >
              <div className="submission-header">
                <div className="submission-meta">
                  <span className="submission-date">
                    {submission.submittedAt.toLocaleDateString()}
                  </span>
                  <span className={`status-badge ${submission.status}`}>
                    {submission.status}
                  </span>
                </div>
                <h3>{submission.name}</h3>
                <div className="contact-info">
                  <span><FaEnvelope /> {submission.email}</span>
                  {submission.phone && (
                    <span><FaPhone /> {submission.phone}</span>
                  )}
                </div>
              </div>

              <div className={`submission-details ${
                selectedSubmission?.id === submission.id ? 'expanded' : ''
              }`}>
                <div className="submission-type">
                  Type: {submission.type}
                </div>
                <div className="submission-message">
                  {submission.message}
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
    </div>
  );
};

export default Submissions; 