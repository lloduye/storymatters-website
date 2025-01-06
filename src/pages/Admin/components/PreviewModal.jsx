import React from 'react';
import { FaCalendar, FaTimes, FaUser } from 'react-icons/fa';
import './PreviewModal.css';

const PreviewModal = ({ content, onClose }) => {
  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="preview-modal">
      <div className="preview-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>

        {content.featuredImage && (
          <div className="preview-image">
            <img src={content.featuredImage} alt={content.title} />
          </div>
        )}

        <div className="preview-header">
          <h1>{content.title}</h1>
          <div className="preview-meta">
            <span className="date">
              <FaCalendar /> {formatDate(content.publishDate)}
            </span>
            {content.author && (
              <span className="author">
                <FaUser /> {content.author}
              </span>
            )}
            {content.category && (
              <span className="category">{content.category}</span>
            )}
          </div>
        </div>

        {content.excerpt && (
          <div className="preview-excerpt">
            <p>{content.excerpt}</p>
          </div>
        )}

        <div 
          className="preview-body"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />

        {content.tags && content.tags.length > 0 && (
          <div className="preview-tags">
            {content.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal; 