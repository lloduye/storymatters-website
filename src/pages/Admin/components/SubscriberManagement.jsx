import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import './SubscriberManagement.css';
import { FaTrash, FaDownload, FaEnvelope } from 'react-icons/fa';

const SubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    sources: {}
  });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, orderBy('subscribedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const subscribersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt?.toDate()
      }));

      setSubscribers(subscribersData);
      
      // Calculate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const stats = {
        total: subscribersData.length,
        recent: subscribersData.filter(s => s.subscribedAt > thirtyDaysAgo).length,
        sources: subscribersData.reduce((acc, sub) => {
          acc[sub.source] = (acc[sub.source] || 0) + 1;
          return acc;
        }, {})
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriberId) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        await deleteDoc(doc(db, 'subscribers', subscriberId));
        await loadSubscribers();
      } catch (error) {
        console.error('Error deleting subscriber:', error);
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Subscribed Date', 'Source'],
      ...subscribers.map(sub => [
        sub.email,
        sub.subscribedAt.toLocaleDateString(),
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleBulkEmail = () => {
    const emailList = subscribers.map(sub => sub.email).join(',');
    window.location.href = `mailto:?bcc=${emailList}`;
  };

  if (loading) {
    return (
      <div className="subscriber-management">
        <div className="loading-state">Loading subscribers...</div>
      </div>
    );
  }

  return (
    <div className="subscriber-management">
      <div className="subscriber-header">
        <h2>Newsletter Subscribers ({stats.total})</h2>
        <div className="subscriber-actions">
          <button onClick={handleExport} className="action-btn">
            <FaDownload /> Export CSV
          </button>
          <button onClick={handleBulkEmail} className="action-btn">
            <FaEnvelope /> Email All
          </button>
        </div>
      </div>

      <div className="subscriber-stats">
        <div className="stat-card">
          <h3>Total Subscribers</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>New This Month</h3>
          <p>{stats.recent}</p>
        </div>
        <div className="stat-card sources">
          <h3>Top Sources</h3>
          <ul>
            {Object.entries(stats.sources).map(([source, count]) => (
              <li key={source}>
                {source}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="subscriber-list">
        {subscribers.length === 0 ? (
          <div className="empty-state">No subscribers yet</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed Date</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(subscriber => (
                <tr key={subscriber.id}>
                  <td>{subscriber.email}</td>
                  <td>{subscriber.subscribedAt?.toLocaleDateString() || 'N/A'}</td>
                  <td>{subscriber.source || 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      className="delete-btn"
                      title="Delete subscriber"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubscriberManagement; 