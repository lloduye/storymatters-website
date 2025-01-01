import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemType = 'submission' }) => {
  console.log('DeleteConfirmationModal rendered:', { isOpen });
  
  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
        <div className="delete-modal-header">
          <FaExclamationTriangle className="warning-icon" />
          <h2>Confirm Deletion</h2>
        </div>
        
        <div className="delete-modal-body">
          <p>Are you sure you want to delete this {itemType}?</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>

        <div className="delete-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 