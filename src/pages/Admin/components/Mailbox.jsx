import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { collection, query, orderBy, getDocs, updateDoc, doc, addDoc, deleteDoc, where } from 'firebase/firestore';
import { 
  FaInbox, FaPaperPlane, FaTrash, FaStar, FaDraft2Digital, 
  FaSearch, FaArchive, FaEnvelope, FaPaperclip, FaReply,
  FaForward, FaExclamationCircle, FaCheck, FaTimes, FaClipboardList, FaChevronDown
} from 'react-icons/fa';
import './Mailbox.css';

const Mailbox = () => {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    attachments: []
  });
  const [expandedFolders, setExpandedFolders] = useState(['inbox']);
  const [activeSubFolder, setActiveSubFolder] = useState(null);

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: FaInbox, count: 3 },
    { id: 'sent', label: 'Sent', icon: FaPaperPlane },
    { id: 'drafts', label: 'Drafts', icon: FaDraft2Digital },
    { 
      id: 'forms', 
      label: 'Form Submissions', 
      icon: FaClipboardList,
      subFolders: [
        { id: 'contact', label: 'Contact Form' },
        { id: 'volunteer', label: 'Volunteer Applications' },
        { id: 'newsletter', label: 'Newsletter Signups' },
        { id: 'donations', label: 'Donation Messages' }
      ]
    },
    { id: 'starred', label: 'Starred', icon: FaStar },
    { id: 'archive', label: 'Archive', icon: FaArchive },
    { id: 'trash', label: 'Trash', icon: FaTrash }
  ];

  useEffect(() => {
    loadMessages();
  }, [activeFolder, activeSubFolder]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      let q;
      
      if (activeFolder === 'forms' && activeSubFolder) {
        // Load specific form submissions
        q = query(
          collection(db, 'submissions'),
          where('type', '==', activeSubFolder),
          orderBy('timestamp', 'desc')
        );
      } else {
        // Load regular messages
        q = query(
          collection(db, activeFolder === 'forms' ? 'submissions' : 'messages'),
          orderBy('timestamp', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        selected: false
      })));
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    setLoading(false);
  };

  const handleMessageSelect = (messageId) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      }
      return [...prev, messageId];
    });
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(msg => msg.id));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...newMessage,
        from: 'admin@example.com',
        timestamp: new Date(),
        status: 'sent',
        folder: 'sent'
      });
      setShowCompose(false);
      setNewMessage({ to: '', subject: '', content: '', attachments: [] });
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setLoading(false);
  };

  const handleBulkAction = async (action) => {
    try {
      for (const messageId of selectedMessages) {
        const messageRef = doc(db, 'messages', messageId);
        switch (action) {
          case 'delete':
            await deleteDoc(messageRef);
            break;
          case 'archive':
            await updateDoc(messageRef, { folder: 'archive' });
            break;
          case 'mark-read':
            await updateDoc(messageRef, { read: true });
            break;
          default:
            break;
        }
      }
      setSelectedMessages([]);
      loadMessages();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      }
      return [...prev, folderId];
    });
  };

  const renderFolderNav = () => (
    <nav className="folder-nav">
      {folders.map(folder => (
        <div key={folder.id} className="folder-item">
          <button
            className={`folder-btn ${activeFolder === folder.id ? 'active' : ''}`}
            onClick={() => {
              setActiveFolder(folder.id);
              if (folder.subFolders) {
                toggleFolder(folder.id);
              }
              setActiveSubFolder(null);
            }}
          >
            <folder.icon />
            <span>{folder.label}</span>
            {folder.count && <span className="badge">{folder.count}</span>}
            {folder.subFolders && (
              <FaChevronDown className={`chevron ${expandedFolders.includes(folder.id) ? 'expanded' : ''}`} />
            )}
          </button>
          
          {folder.subFolders && expandedFolders.includes(folder.id) && (
            <div className="sub-folders">
              {folder.subFolders.map(sub => (
                <button
                  key={sub.id}
                  className={`sub-folder-btn ${activeSubFolder === sub.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFolder('forms');
                    setActiveSubFolder(sub.id);
                  }}
                >
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  const renderMessageList = () => {
    const filteredMessages = messages.filter(message => 
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="messages-table">
        <div className="messages-header">
          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectedMessages.length === messages.length}
              onChange={handleSelectAll}
            />
          </label>
          {selectedMessages.length > 0 && (
            <div className="bulk-actions">
              <button onClick={() => handleBulkAction('mark-read')} title="Mark as Read">
                <FaEnvelope />
              </button>
              <button onClick={() => handleBulkAction('archive')} title="Archive">
                <FaArchive />
              </button>
              <button onClick={() => handleBulkAction('delete')} title="Delete">
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        {filteredMessages.map(message => (
          <div 
            key={message.id} 
            className={`message-row ${message.read ? '' : 'unread'} ${selectedMessages.includes(message.id) ? 'selected' : ''}`}
          >
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={selectedMessages.includes(message.id)}
                onChange={() => handleMessageSelect(message.id)}
                onClick={e => e.stopPropagation()}
              />
            </label>
            <div 
              className="message-content"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="message-sender">
                {message.type === 'submission' ? message.name : message.from}
              </div>
              <div className="message-subject">
                {message.type === 'submission' ? `${message.type} - ${message.formType}` : message.subject}
                {message.attachments?.length > 0 && (
                  <FaPaperclip className="attachment-icon" />
                )}
              </div>
              <div className="message-preview">
                {message.type === 'submission' ? message.message || 'No message' : message.content}
              </div>
              <div className="message-date">
                {new Date(message.timestamp?.toDate()).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderComposeModal = () => (
    <div className="modal-overlay" onClick={() => setShowCompose(false)}>
      <div className="compose-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Message</h3>
          <button onClick={() => setShowCompose(false)}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="form-group">
            <input
              type="email"
              placeholder="To"
              value={newMessage.to}
              onChange={e => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Subject"
              value={newMessage.subject}
              onChange={e => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your message here..."
              value={newMessage.content}
              onChange={e => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={12}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="send-btn" disabled={loading}>
              <FaPaperPlane />
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const getMessagePreview = (message) => {
    if (!message.type || message.type === 'email') return message.content;

    switch (message.type) {
      case 'contact':
        return message.message;
      case 'volunteer':
        return `Interests: ${message.interests.join(', ')} | Experience: ${message.experience}`;
      case 'newsletter':
        return `Preferences: ${message.preferences?.join(', ') || 'None specified'}`;
      case 'donation':
        return `Amount: $${message.amount} | ${message.isRecurring ? 'Recurring' : 'One-time'} ${message.message ? '| Message: ' + message.message : ''}`;
      default:
        return message.message || 'No message';
    }
  };

  const renderMessageDetail = (message) => (
    <div className="message-detail">
      <div className="detail-header">
        <h3>{message.type === 'submission' ? getSubmissionTitle(message) : message.subject}</h3>
        <div className="detail-actions">
          {message.type !== 'submission' && (
            <>
              <button title="Reply">
                <FaReply />
              </button>
              <button title="Forward">
                <FaForward />
              </button>
            </>
          )}
          <button title="Delete" onClick={() => handleBulkAction('delete')}>
            <FaTrash />
          </button>
          <button onClick={() => setSelectedMessage(null)}>
            <FaTimes />
          </button>
        </div>
      </div>
      
      <div className="message-meta">
        {message.type === 'submission' ? (
          <>
            <div>Name: {message.name}</div>
            <div>Email: {message.email}</div>
            {message.phone && <div>Phone: {message.phone}</div>}
            <div>Type: {getFormTypeLabel(message.type)}</div>
            <div>Date: {new Date(message.timestamp?.toDate()).toLocaleString()}</div>
            {message.type === 'volunteer' && (
              <>
                <div>Interests: {message.interests.join(', ')}</div>
                <div>Availability: {message.availability}</div>
              </>
            )}
            {message.type === 'donation' && (
              <>
                <div>Amount: ${message.amount}</div>
                <div>Payment Method: {message.paymentMethod}</div>
                <div>Recurring: {message.isRecurring ? 'Yes' : 'No'}</div>
              </>
            )}
          </>
        ) : (
          <>
            <div>From: {message.from}</div>
            <div>To: {message.to}</div>
            <div>Date: {new Date(message.timestamp?.toDate()).toLocaleString()}</div>
          </>
        )}
      </div>
      
      <div className="message-body">
        {message.type === 'submission' ? getMessagePreview(message) : message.content}
      </div>
    </div>
  );

  return (
    <div className="mailbox-container">
      <div className="mailbox-sidebar">
        <div className="compose-btn-wrapper">
          <button className="compose-btn" onClick={() => setShowCompose(true)}>
            <FaEnvelope /> Compose
          </button>
        </div>

        {renderFolderNav()}
      </div>

      <div className="mailbox-content">
        <div className="mailbox-toolbar">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="messages-list">
          {loading ? (
            <div className="loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="empty-state">No messages found</div>
          ) : (
            renderMessageList()
          )}
        </div>
      </div>

      {selectedMessage && (
        renderMessageDetail(selectedMessage)
      )}

      {showCompose && renderComposeModal()}
    </div>
  );
};

export default Mailbox; 