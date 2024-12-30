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
import Dashboard from './components/Dashboard';
import Communications from './components/Communications';
import Submissions from './components/Submissions';
import Donations from './components/Donations';
import Team from './components/Team';
import Settings from './components/Settings';

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
        return <Dashboard />;
      case 'communications':
        return <Communications />;
      case 'submissions':
        return <Submissions />;
      case 'donations':
        return <Donations />;
      case 'team':
        return <Team />;
      case 'settings':
        return <Settings />;
      default:
        return <Stories />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
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
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h2>{navigationTabs.find(tab => tab.id === activeTab)?.label}</h2>
        </header>
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 