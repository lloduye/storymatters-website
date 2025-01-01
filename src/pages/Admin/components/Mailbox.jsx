import React from 'react';
import './Mailbox.css';

const Mailbox = () => {
  return (
    <div className="mailbox-container">
      <div className="mailbox-info">
        <h2>Email Management</h2>
        <p>To access your emails, please use one of these options:</p>
        
        <div className="email-options">
          <a 
            href="https://mail.zoho.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="email-button"
          >
            Open Zoho Mail
          </a>
          
          <a 
            href={`mailto:${import.meta.env.VITE_ZOHO_EMAIL}`} 
            className="email-button"
          >
            Open in Email Client
          </a>
        </div>

        <div className="email-help">
          <h3>Need Help?</h3>
          <ul>
            <li>Access your email directly at <a href="https://mail.zoho.com">mail.zoho.com</a></li>
            <li>Download Zoho Mail apps for <a href="https://www.zoho.com/mail/desktop-app.html">desktop</a> or mobile</li>
            <li>View Zoho Mail <a href="https://www.zoho.com/mail/help/">documentation</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mailbox; 