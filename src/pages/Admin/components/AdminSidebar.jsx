import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHome, 
  FaNewspaper, 
  FaProjectDiagram,
  FaHandHoldingHeart,
  FaUsers,
  FaCog
} from 'react-icons/fa';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard/overview">
          <FaHome /> Overview
        </NavLink>
        <NavLink to="/admin/dashboard/stories">
          <FaNewspaper /> Stories
        </NavLink>
        <NavLink to="/admin/dashboard/programs">
          <FaProjectDiagram /> Programs
        </NavLink>
        <NavLink to="/admin/dashboard/donations">
          <FaHandHoldingHeart /> Donations
        </NavLink>
        <NavLink to="/admin/dashboard/volunteers">
          <FaUsers /> Volunteers
        </NavLink>
        <NavLink to="/admin/dashboard/settings">
          <FaCog /> Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar; 