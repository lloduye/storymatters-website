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
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <nav className="admin-nav">
      <NavLink to="/admin/dashboard/overview" className={({ isActive }) => isActive ? 'active' : ''}>
        <FaHome /> <span>Overview</span>
      </NavLink>
      <NavLink to="/admin/dashboard/stories" className={({ isActive }) => isActive ? 'active' : ''}>
        <FaNewspaper /> <span>Stories</span>
      </NavLink>
      <NavLink to="/admin/dashboard/programs" className={({ isActive }) => isActive ? 'active' : ''}>
        <FaProjectDiagram /> <span>Programs</span>
      </NavLink>
      <NavLink to="/admin/dashboard/donations" className={({ isActive }) => isActive ? 'active' : ''}>
        <FaHandHoldingHeart /> <span>Donations</span>
      </NavLink>
      <NavLink to="/admin/dashboard/volunteers" className={({ isActive }) => isActive ? 'active' : ''}>
        <FaUsers /> <span>Volunteers</span>
      </NavLink>
      <NavLink to="/admin/dashboard/settings" className={({ isActive }) => isActive ? 'active' : ''}>
        <FaCog /> <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default AdminSidebar; 