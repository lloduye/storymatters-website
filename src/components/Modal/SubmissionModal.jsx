import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaGlobe, FaTimes, FaCheck, FaTrash, FaUser, FaBuilding, FaEdit } from 'react-icons/fa';
import './SubmissionModal.css';

const SubmissionModal = ({ submission, onClose, onStatusUpdate, onDelete }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  
  if (!submission) return null;

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: '#FCD34D' },
    { value: 'approved', label: 'Approved', color: '#10B981' },
    { value: 'rejected', label: 'Rejected', color: '#EF4444' },
    { value: 'in-progress', label: 'In Progress', color: '#60A5FA' },
    { value: 'completed', label: 'Completed', color: '#8B5CF6' },
    { value: 'on-hold', label: 'On Hold', color: '#9CA3AF' }
  ];

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(submission.id, newStatus);
    setIsEditingStatus(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className="modal-header">
          <div className="status-section">
            {isEditingStatus ? (
              <div className="status-dropdown">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    className={`status-option ${option.value}`}
                    onClick={() => handleStatusChange(option.value)}
                    style={{ '--status-color': option.color }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="status-display">
                <div className={`status-badge ${submission.status}`}>
                  {submission.status}
                </div>
                <button 
                  className="edit-status-btn"
                  onClick={() => setIsEditingStatus(true)}
                >
                  <FaEdit />
                </button>
              </div>
            )}
          </div>

          <h2>
            {submission.type === 'volunteer' ? (
              <><FaUser /> {submission.name}</>
            ) : (
              <><FaBuilding /> {submission.organizationName}</>
            )}
          </h2>
          <p className="submission-date">
            Submitted on {submission.submittedAt.toLocaleDateString()}
          </p>
        </div>

        <div className="modal-body">
          <div className="status-options-bar">
            {statusOptions.map(option => (
              <button
                key={option.value}
                className={`status-option ${option.value} ${submission.status === option.value ? 'active' : ''}`}
                onClick={() => handleStatusChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="contact-section">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <p><FaEnvelope /> {submission.email}</p>
              {submission.phone && <p><FaPhone /> {submission.phone}</p>}
              {submission.website && (
                <p>
                  <FaGlobe />
                  <a href={submission.website} target="_blank" rel="noopener noreferrer">
                    {submission.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          {submission.type === 'volunteer' ? (
            <div className="details-section">
              <div className="section">
                <h3>Programs Interest</h3>
                <ul className="programs-list">
                  {submission.programs?.map(program => (
                    <li key={program}>{program}</li>
                  ))}
                </ul>
              </div>
              <div className="section">
                <h3>Availability</h3>
                <p>{submission.availability}</p>
              </div>
              <div className="section">
                <h3>Experience</h3>
                <p>{submission.experience || 'No experience provided'}</p>
              </div>
            </div>
          ) : (
            <div className="details-section">
              <div className="section">
                <h3>Organization Details</h3>
                <p><strong>Type:</strong> {submission.organizationType}</p>
              </div>
              <div className="section">
                <h3>Partnership Types</h3>
                <ul className="partnership-list">
                  {submission.partnershipTypes?.map(type => (
                    <li key={type}>{type}</li>
                  ))}
                </ul>
              </div>
              <div className="section">
                <h3>Goals</h3>
                <p>{submission.goals}</p>
              </div>
            </div>
          )}

          <div className="message-section">
            <h3>Additional Message</h3>
            <p>{submission.message || 'No additional message provided'}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this submission?')) {
                onDelete(submission.id);
              }
            }}
            className="delete-btn"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionModal; 