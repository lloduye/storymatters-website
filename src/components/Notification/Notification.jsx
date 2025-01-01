import React from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default Notification; 