import React from 'react';

const Overview = () => {
  return (
    <div className="overview-section">
      <div className="dashboard-container">
        <h2>Dashboard Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Stories</h3>
            <p>24</p>
          </div>
          <div className="stat-card">
            <h3>Active Programs</h3>
            <p>3</p>
          </div>
          <div className="stat-card">
            <h3>Volunteers</h3>
            <p>45</p>
          </div>
          <div className="stat-card">
            <h3>Donations</h3>
            <p>$12,450</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview; 