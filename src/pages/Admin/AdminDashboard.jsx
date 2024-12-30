import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { FaSignOutAlt } from 'react-icons/fa';
import './AdminDashboard.css';

// Import available component
import Stories from './components/Stories';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-nav">
            <h1>Admin Dashboard</h1>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="content-wrapper">
        <Stories />
      </div>
    </div>
  );
};

export default AdminDashboard; 