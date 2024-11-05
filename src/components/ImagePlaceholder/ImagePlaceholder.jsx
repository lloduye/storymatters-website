import React from 'react';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ width, height, text, className }) => {
  const imageUrl = `https://placehold.co/${width}x${height}/4A90E2/FFFFFF/png?text=${encodeURIComponent(text)}`;
  
  return (
    <div className={`image-placeholder ${className || ''}`}>
      <img 
        src={imageUrl} 
        alt={text}
        loading="lazy"
        onError={(e) => {
          e.target.src = `https://placehold.co/${width}x${height}/cccccc/666666/png?text=Image+Not+Found`;
        }}
      />
    </div>
  );
};

export default ImagePlaceholder; 