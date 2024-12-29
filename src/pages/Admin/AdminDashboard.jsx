import React from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import AdminSidebar from './components/AdminSidebar';
import Overview from './components/Overview';
import Stories from './components/Stories';
import Programs from './components/Programs';
import Donations from './components/Donations';
import Volunteers from './components/Volunteers';
import Settings from './components/Settings';
import './Admin.css';

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
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
        <div className="admin-content">
          <Routes>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="stories" element={<Stories />} />
            <Route path="programs" element={<Programs />} />
            <Route path="donations" element={<Donations />} />
            <Route path="volunteers" element={<Volunteers />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 