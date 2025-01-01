import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
import './CustomNotification.css';

const CustomNotification = ({ 
  message, 
  type = 'success', 
  onClose,
  duration = 5000 // Auto close after 5 seconds
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`custom-notification ${type}`}>
      <div className="notification-content">
        <div className="notification-icon">
          {type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <div className="notification-message">
          <h4>{type === 'success' ? 'Success!' : 'Error'}</h4>
          <p>{message}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="notification-progress">
        <div className="progress-bar" style={{ animationDuration: `${duration}ms` }} />
      </div>
    </div>
  );
};

export default CustomNotification; 