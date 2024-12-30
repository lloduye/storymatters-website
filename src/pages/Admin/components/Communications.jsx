import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { FaEnvelope, FaBell, FaUsers, FaPaperPlane, FaHistory, FaCog, FaPlus } from 'react-icons/fa';
import './Communications.css';

const Communications = () => {
  const [activeTab, setActiveTab] = useState('email');
  const [subscribers, setSubscribers] = useState([]);
  const [emailDraft, setEmailDraft] = useState({
    subject: '',
    content: '',
    recipients: 'all',
    template: 'default'
  });
  const [notificationDraft, setNotificationDraft] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all'
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [settings, setSettings] = useState({
    emailTemplates: [],
    autoResponders: [],
    notificationPreferences: {}
  });

  useEffect(() => {
    loadSubscribers();
    loadHistory();
    loadSettings();
  }, []);

  const loadSubscribers = async () => {
    try {
      const q = query(collection(db, 'subscribers'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      setSubscribers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      showMessage('Error loading subscribers: ' + error.message, 'error');
    }
  };

  const loadHistory = async () => {
    try {
      const q = query(collection(db, 'communications'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      showMessage('Error loading history: ' + error.message, 'error');
    }
  };

  const loadSettings = async () => {
    try {
      const settingsDoc = await getDocs(collection(db, 'communicationSettings'));
      if (!settingsDoc.empty) {
        setSettings(settingsDoc.docs[0].data());
      }
    } catch (error) {
      showMessage('Error loading settings: ' + error.message, 'error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add to communications collection
      await addDoc(collection(db, 'communications'), {
        type: 'email',
        ...emailDraft,
        timestamp: new Date(),
        status: 'sent'
      });
      
      // Here you would integrate with your email service
      // Example: sendEmailService(emailDraft);
      
      showMessage('Email campaign scheduled successfully');
      setEmailDraft({ subject: '', content: '', recipients: 'all', template: 'default' });
      loadHistory();
    } catch (error) {
      showMessage('Error sending email: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'communications'), {
        type: 'notification',
        ...notificationDraft,
        timestamp: new Date(),
        status: 'sent'
      });
      
      // Here you would integrate with your notification service
      // Example: sendNotificationService(notificationDraft);
      
      showMessage('Notification sent successfully');
      setNotificationDraft({ title: '', message: '', type: 'info', target: 'all' });
      loadHistory();
    } catch (error) {
      showMessage('Error sending notification: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const renderEmailTab = () => (
    <div className="email-campaign">
      <form onSubmit={handleSendEmail}>
        <div className="form-group">
          <label>Email Template</label>
          <select
            value={emailDraft.template}
            onChange={(e) => setEmailDraft(prev => ({ ...prev, template: e.target.value }))}
          >
            <option value="default">Default Template</option>
            <option value="newsletter">Newsletter Template</option>
            <option value="announcement">Announcement Template</option>
          </select>
        </div>

        <div className="form-group">
          <label>Recipients</label>
          <select
            value={emailDraft.recipients}
            onChange={(e) => setEmailDraft(prev => ({ ...prev, recipients: e.target.value }))}
          >
            <option value="all">All Subscribers</option>
            <option value="volunteers">Volunteers Only</option>
            <option value="donors">Donors Only</option>
            <option value="newsletter">Newsletter Subscribers</option>
          </select>
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={emailDraft.subject}
            onChange={(e) => setEmailDraft(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Enter email subject"
            required
          />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea
            value={emailDraft.content}
            onChange={(e) => setEmailDraft(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Enter email content"
            required
            rows={10}
          />
        </div>

        <button type="submit" className="send-btn" disabled={loading}>
          <FaPaperPlane /> {loading ? 'Sending...' : 'Send Email Campaign'}
        </button>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="notifications">
      <form onSubmit={handleSendNotification}>
        <div className="form-group">
          <label>Notification Type</label>
          <select
            value={notificationDraft.type}
            onChange={(e) => setNotificationDraft(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="info">Information</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="form-group">
          <label>Target Audience</label>
          <select
            value={notificationDraft.target}
            onChange={(e) => setNotificationDraft(prev => ({ ...prev, target: e.target.value }))}
          >
            <option value="all">All Users</option>
            <option value="admin">Admin Only</option>
            <option value="volunteers">Volunteers</option>
          </select>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={notificationDraft.title}
            onChange={(e) => setNotificationDraft(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter notification title"
            required
          />
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            value={notificationDraft.message}
            onChange={(e) => setNotificationDraft(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Enter notification message"
            required
          />
        </div>

        <button type="submit" className="send-btn" disabled={loading}>
          <FaBell /> {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>
    </div>
  );

  const renderSubscribersTab = () => (
    <div className="subscribers-list">
      <div className="subscribers-header">
        <h3>Subscribers ({subscribers.length})</h3>
        <button className="export-btn">Export List</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Type</th>
            <th>Subscribed Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map(subscriber => (
            <tr key={subscriber.id}>
              <td>{subscriber.email}</td>
              <td>{subscriber.type}</td>
              <td>{new Date(subscriber.timestamp.toDate()).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge ${subscriber.status}`}>
                  {subscriber.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="communications-history">
      <div className="history-header">
        <h3>Communication History</h3>
      </div>
      <div className="history-list">
        {history.map(item => (
          <div key={item.id} className="history-item">
            <div className="history-icon">
              {item.type === 'email' ? <FaEnvelope /> : <FaBell />}
            </div>
            <div className="history-content">
              <h4>{item.type === 'email' ? item.subject : item.title}</h4>
              <p>{item.content || item.message}</p>
              <div className="history-meta">
                <span>{new Date(item.timestamp.toDate()).toLocaleString()}</span>
                <span className={`status-badge ${item.status}`}>{item.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="settings-tab">
      <div className="settings-grid">
        {/* Email Templates Section */}
        <div className="settings-section">
          <h3>Email Templates</h3>
          <div className="template-list">
            {settings.emailTemplates.map((template, index) => (
              <div key={index} className="template-item">
                <div className="template-header">
                  <h4>{template.name}</h4>
                  <div className="template-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
                <p>{template.description}</p>
              </div>
            ))}
            <button className="add-template-btn">
              <FaPlus /> Add New Template
            </button>
          </div>
        </div>

        {/* Auto Responders Section */}
        <div className="settings-section">
          <h3>Auto Responders</h3>
          <div className="auto-responders">
            <div className="form-group">
              <label>Welcome Email</label>
              <div className="toggle-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.autoResponders.welcomeEmail} 
                  onChange={(e) => updateAutoResponder('welcomeEmail', e.target.checked)}
                />
                <span className="toggle-label">Send welcome email to new subscribers</span>
              </div>
            </div>
            <div className="form-group">
              <label>Donation Receipt</label>
              <div className="toggle-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.autoResponders.donationReceipt} 
                  onChange={(e) => updateAutoResponder('donationReceipt', e.target.checked)}
                />
                <span className="toggle-label">Send receipt after donation</span>
              </div>
            </div>
            <div className="form-group">
              <label>Volunteer Application</label>
              <div className="toggle-wrapper">
                <input 
                  type="checkbox" 
                  checked={settings.autoResponders.volunteerConfirmation} 
                  onChange={(e) => updateAutoResponder('volunteerConfirmation', e.target.checked)}
                />
                <span className="toggle-label">Send confirmation for volunteer applications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h3>Notification Preferences</h3>
          <div className="notification-settings">
            <div className="form-group">
              <label>Admin Notifications</label>
              <select 
                value={settings.notificationPreferences.adminLevel || 'all'}
                onChange={(e) => updateNotificationPreference('adminLevel', e.target.value)}
              >
                <option value="all">All Notifications</option>
                <option value="important">Important Only</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email Frequency</label>
              <select 
                value={settings.notificationPreferences.emailFrequency || 'instant'}
                onChange={(e) => updateNotificationPreference('emailFrequency', e.target.value)}
              >
                <option value="instant">Instant</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          </div>
        </div>

        {/* SMTP Configuration */}
        <div className="settings-section">
          <h3>SMTP Configuration</h3>
          <div className="smtp-settings">
            <div className="form-group">
              <label>SMTP Host</label>
              <input 
                type="text"
                value={settings.smtp?.host || ''}
                onChange={(e) => updateSmtpSettings('host', e.target.value)}
                placeholder="smtp.example.com"
              />
            </div>
            <div className="form-group">
              <label>SMTP Port</label>
              <input 
                type="number"
                value={settings.smtp?.port || ''}
                onChange={(e) => updateSmtpSettings('port', e.target.value)}
                placeholder="587"
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text"
                value={settings.smtp?.username || ''}
                onChange={(e) => updateSmtpSettings('username', e.target.value)}
                placeholder="username@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                value={settings.smtp?.password || ''}
                onChange={(e) => updateSmtpSettings('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button className="test-connection-btn">
              Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* Save button at the bottom */}
      <div className="settings-actions">
        <button 
          className="save-settings-btn" 
          onClick={handleSaveSettings}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );

  const updateAutoResponder = async (key, value) => {
    try {
      setSettings(prev => ({
        ...prev,
        autoResponders: {
          ...prev.autoResponders,
          [key]: value
        }
      }));
    } catch (error) {
      showMessage('Error updating auto responder: ' + error.message, 'error');
    }
  };

  const updateNotificationPreference = async (key, value) => {
    try {
      setSettings(prev => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [key]: value
        }
      }));
    } catch (error) {
      showMessage('Error updating notification preferences: ' + error.message, 'error');
    }
  };

  const updateSmtpSettings = async (key, value) => {
    try {
      setSettings(prev => ({
        ...prev,
        smtp: {
          ...prev.smtp,
          [key]: value
        }
      }));
    } catch (error) {
      showMessage('Error updating SMTP settings: ' + error.message, 'error');
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'communicationSettings', 'config'), settings);
      showMessage('Settings saved successfully');
    } catch (error) {
      showMessage('Error saving settings: ' + error.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="communications-section">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="communications-tabs">
        <button
          className={`tab-btn ${activeTab === 'email' ? 'active' : ''}`}
          onClick={() => setActiveTab('email')}
        >
          <FaEnvelope /> Email Campaign
        </button>
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell /> Notifications
        </button>
        <button
          className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          <FaUsers /> Subscribers
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <FaHistory /> History
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'email' && renderEmailTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'subscribers' && renderSubscribersTab()}
        {activeTab === 'history' && renderHistoryTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default Communications; 