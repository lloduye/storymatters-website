import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { 
  FaSignOutAlt, 
  FaNewspaper, 
  FaTachometerAlt, 
  FaEnvelope,
  FaUsers,
  FaHandHoldingHeart,
  FaClipboardList,
  FaCog
} from 'react-icons/fa';
import './AdminDashboard.css';

// Import available component
import Stories from './components/Stories';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'content', label: 'Content Management', icon: FaNewspaper },
    { id: 'communications', label: 'Communications', icon: FaEnvelope },
    { id: 'submissions', label: 'Form Submissions', icon: FaClipboardList },
    { id: 'donations', label: 'Donation Records', icon: FaHandHoldingHeart },
    { id: 'team', label: 'Team Management', icon: FaUsers },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'content':
        return <Stories />;
      case 'dashboard':
        return <div>Dashboard Coming Soon</div>;
      case 'communications':
        return <div>Communications Coming Soon</div>;
      case 'submissions':
        return <div>Form Submissions Coming Soon</div>;
      case 'donations':
        return <div>Donation Records Coming Soon</div>;
      case 'team':
        return <div>Team Management Coming Soon</div>;
      case 'settings':
        return <div>Settings Coming Soon</div>;
      default:
        return <Stories />;
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-nav">
            <h1>Admin Dashboard</h1>
            <nav className="nav-links">
              {navigationTabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon /> {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="header-actions">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="content-wrapper">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard; 