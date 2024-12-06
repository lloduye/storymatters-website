import React from 'react';
import './ImagePlaceholder.css';

const ImagePlaceholder = ({ width, height, text, className }) => {
  // Convert text to proper image filename format
  const imageFileName = text.toLowerCase().replace(/\+/g, '-');
  
  // Try multiple image paths
  const imagePaths = [
    `/images/${imageFileName}.jpg`,
    `/images/news/${imageFileName}.jpg`,
    `/images/programs/${imageFileName}.jpg`,
    `/images/stories/${imageFileName}.jpg`
  ];

  return (
    <img
      src={imagePaths[0]} // Start with first path
      alt={text.replace(/\+/g, ' ')}
      className={className}
      onError={(e) => {
        // Try next path if current fails
        const currentIndex = imagePaths.indexOf(e.target.src);
        const nextPath = imagePaths[currentIndex + 1];
        
        if (nextPath) {
          e.target.src = nextPath;
        } else {
          // If all paths fail, use placeholder
          e.target.src = `https://placehold.co/${width}x${height}/4A90E2/FFFFFF/png?text=${text}`;
          e.target.onerror = null; // Prevent infinite loop
        }
      }}
    />
  );
};

export default ImagePlaceholder; 