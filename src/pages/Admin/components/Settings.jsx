import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase/config';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaUser, FaLock, FaCog, FaBell } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [activeSiteSection, setActiveSiteSection] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [settings, setSettings] = useState({
    profile: {
      displayName: '',
      email: '',
      role: '',
      bio: ''
    },
    notifications: {
      emailAlerts: true,
      newSubmissions: true,
      newDonations: true,
      systemUpdates: true
    },
    site: {
      siteName: 'Story Matters Entertainment',
      contactEmail: '',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: ''
      },
      appearance: {
        primaryColor: '#4A90E2',
        secondaryColor: '#2C3E50',
        fontFamily: 'Inter',
        logoUrl: ''
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: '',
        googleAnalyticsId: ''
      },
      contact: {
        address: '',
        phone: '',
        whatsapp: '',
        supportEmail: ''
      },
      footer: {
        copyrightText: '',
        showSocialLinks: true,
        showNewsletter: true,
        customLinks: []
      },
      maintenance: {
        isEnabled: false,
        message: '',
        allowedIPs: []
      }
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const settingsDoc = await getDoc(doc(db, 'adminSettings', user.uid));
        if (settingsDoc.exists()) {
          setSettings(prev => ({
            ...prev,
            ...settingsDoc.data(),
            profile: {
              ...prev.profile,
              displayName: user.displayName || '',
              email: user.email || ''
            }
          }));
        }
      }
    } catch (error) {
      showMessage('Error loading settings: ' + error.message, 'error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      await updateProfile(user, {
        displayName: settings.profile.displayName
      });
      await updateDoc(doc(db, 'adminSettings', user.uid), {
        profile: settings.profile
      });
      showMessage('Profile updated successfully');
    } catch (error) {
      showMessage(error.message, 'error');
    }
    setLoading(false);
  };

  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'adminSettings', user.uid), {
        notifications: settings.notifications
      });
      showMessage('Notification preferences updated');
    } catch (error) {
      showMessage(error.message, 'error');
    }
    setLoading(false);
  };

  const handleSiteSettingsUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.currentUser;
      await updateDoc(doc(db, 'adminSettings', user.uid), {
        site: settings.site
      });
      showMessage('Site settings updated');
    } catch (error) {
      showMessage(error.message, 'error');
    }
    setLoading(false);
  };

  const updateSettings = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const siteConfigSections = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'social', label: 'Social Media' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'seo', label: 'SEO Settings' },
    { id: 'contact', label: 'Contact Information' },
    { id: 'footer', label: 'Footer Settings' },
    { id: 'maintenance', label: 'Maintenance Mode' }
  ];

  const renderSiteConfigContent = () => {
    switch (activeSiteSection) {
      case 'basic':
        return (
          <>
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                value={settings.site.siteName}
                onChange={(e) => updateSettings('site', 'siteName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input
                type="email"
                value={settings.site.contactEmail}
                onChange={(e) => updateSettings('site', 'contactEmail', e.target.value)}
              />
            </div>
          </>
        );
      case 'social':
        return (
          <>
            <div className="form-group">
              <label>Facebook URL</label>
              <input
                type="url"
                value={settings.site.socialLinks.facebook}
                onChange={(e) => updateSettings('site', 'socialLinks', {
                  ...settings.site.socialLinks,
                  facebook: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Twitter URL</label>
              <input
                type="url"
                value={settings.site.socialLinks.twitter}
                onChange={(e) => updateSettings('site', 'socialLinks', {
                  ...settings.site.socialLinks,
                  twitter: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Instagram URL</label>
              <input
                type="url"
                value={settings.site.socialLinks.instagram}
                onChange={(e) => updateSettings('site', 'socialLinks', {
                  ...settings.site.socialLinks,
                  instagram: e.target.value
                })}
              />
            </div>
          </>
        );
      case 'appearance':
        return (
          <>
            <div className="form-group">
              <label>Primary Color</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={settings.site.appearance.primaryColor}
                  onChange={(e) => updateSettings('site', 'appearance', {
                    ...settings.site.appearance,
                    primaryColor: e.target.value
                  })}
                />
                <input
                  type="text"
                  value={settings.site.appearance.primaryColor}
                  onChange={(e) => updateSettings('site', 'appearance', {
                    ...settings.site.appearance,
                    primaryColor: e.target.value
                  })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Font Family</label>
              <select
                value={settings.site.appearance.fontFamily}
                onChange={(e) => updateSettings('site', 'appearance', {
                  ...settings.site.appearance,
                  fontFamily: e.target.value
                })}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
          </>
        );
      case 'seo':
        return (
          <>
            <div className="form-group">
              <label>Meta Title</label>
              <input
                type="text"
                value={settings.site.seo.metaTitle}
                onChange={(e) => updateSettings('site', 'seo', {
                  ...settings.site.seo,
                  metaTitle: e.target.value
                })}
                placeholder="Site Meta Title"
              />
            </div>
            <div className="form-group">
              <label>Meta Description</label>
              <textarea
                value={settings.site.seo.metaDescription}
                onChange={(e) => updateSettings('site', 'seo', {
                  ...settings.site.seo,
                  metaDescription: e.target.value
                })}
                placeholder="Site description for search engines"
              />
            </div>
            <div className="form-group">
              <label>Keywords</label>
              <input
                type="text"
                value={settings.site.seo.keywords}
                onChange={(e) => updateSettings('site', 'seo', {
                  ...settings.site.seo,
                  keywords: e.target.value
                })}
                placeholder="Comma-separated keywords"
              />
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="form-group">
              <label>Office Address</label>
              <textarea
                value={settings.site.contact.address}
                onChange={(e) => updateSettings('site', 'contact', {
                  ...settings.site.contact,
                  address: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={settings.site.contact.phone}
                onChange={(e) => updateSettings('site', 'contact', {
                  ...settings.site.contact,
                  phone: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="tel"
                value={settings.site.contact.whatsapp}
                onChange={(e) => updateSettings('site', 'contact', {
                  ...settings.site.contact,
                  whatsapp: e.target.value
                })}
              />
            </div>
          </>
        );
      case 'footer':
        return (
          <>
            <div className="form-group">
              <label>Copyright Text</label>
              <input
                type="text"
                value={settings.site.footer.copyrightText}
                onChange={(e) => updateSettings('site', 'footer', {
                  ...settings.site.footer,
                  copyrightText: e.target.value
                })}
              />
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.site.footer.showSocialLinks}
                  onChange={(e) => updateSettings('site', 'footer', {
                    ...settings.site.footer,
                    showSocialLinks: e.target.checked
                  })}
                />
                <span>Show Social Links in Footer</span>
              </label>
            </div>
          </>
        );
      case 'maintenance':
        return (
          <>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.site.maintenance.isEnabled}
                  onChange={(e) => updateSettings('site', 'maintenance', {
                    ...settings.site.maintenance,
                    isEnabled: e.target.checked
                  })}
                />
                <span>Enable Maintenance Mode</span>
              </label>
            </div>
            <div className="form-group">
              <label>Maintenance Message</label>
              <textarea
                value={settings.site.maintenance.message}
                onChange={(e) => updateSettings('site', 'maintenance', {
                  ...settings.site.maintenance,
                  message: e.target.value
                })}
                placeholder="Message to display during maintenance"
                disabled={!settings.site.maintenance.isEnabled}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-section">
      <div className="settings-container">
        <div className="settings-sidebar">
          <button
            className={`settings-tab ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <FaUser /> Profile Settings
          </button>
          <button
            className={`settings-tab ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <FaBell /> Notifications
          </button>
          <button
            className={`settings-tab ${activeSection === 'site' ? 'active' : ''}`}
            onClick={() => setActiveSection('site')}
          >
            <FaCog /> Site Settings
          </button>
        </div>

        <div className="settings-content">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeSection === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="settings-form">
              <h3>Profile Settings</h3>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={settings.profile.displayName}
                  onChange={(e) => updateSettings('profile', 'displayName', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={settings.profile.email}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={settings.profile.bio}
                  onChange={(e) => updateSettings('profile', 'bio', e.target.value)}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          )}

          {activeSection === 'notifications' && (
            <form onSubmit={handleNotificationUpdate} className="settings-form">
              <h3>Notification Preferences</h3>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => updateSettings('notifications', 'emailAlerts', e.target.checked)}
                  />
                  <span>Email Alerts</span>
                </label>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newSubmissions}
                    onChange={(e) => updateSettings('notifications', 'newSubmissions', e.target.checked)}
                  />
                  <span>New Form Submissions</span>
                </label>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.newDonations}
                    onChange={(e) => updateSettings('notifications', 'newDonations', e.target.checked)}
                  />
                  <span>New Donations</span>
                </label>
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) => updateSettings('notifications', 'systemUpdates', e.target.checked)}
                  />
                  <span>System Updates</span>
                </label>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          )}

          {activeSection === 'site' && (
            <form onSubmit={handleSiteSettingsUpdate} className="settings-form">
              <div className="site-config-header">
                <h3>Site Configuration</h3>
                <select 
                  value={activeSiteSection}
                  onChange={(e) => setActiveSiteSection(e.target.value)}
                  className="site-config-dropdown"
                >
                  {siteConfigSections.map(section => (
                    <option key={section.id} value={section.id}>
                      {section.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="settings-section-divider">
                <h4>{siteConfigSections.find(s => s.id === activeSiteSection)?.label}</h4>
              </div>

              {renderSiteConfigContent()}

              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 