import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: 'https://placehold.co/800x600/4A90E2/FFFFFF?text=Community+Impact',
      caption: 'Making a Difference in Kakuma'
    },
    {
      url: 'https://placehold.co/800x600/45B7AF/FFFFFF?text=Youth+Empowerment',
      caption: 'Empowering Young Voices'
    },
    {
      url: 'https://placehold.co/800x600/FF6B6B/FFFFFF?text=Arts+and+Culture',
      caption: 'Celebrating Creative Expression'
    },
    {
      url: 'https://placehold.co/800x600/50E3C2/FFFFFF?text=Education',
      caption: 'Building Skills for Tomorrow'
    },
    {
      url: 'https://placehold.co/800x600/9B59B6/FFFFFF?text=Community+Events',
      caption: 'Bringing People Together'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  return (
    <div className="slideshow">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          >
            <div className="slide-caption">{slide.caption}</div>
          </div>
        ))}
      </div>
      
      <button className="slide-arrow prev" onClick={prevSlide} aria-label="Previous slide">
        &#10094;
      </button>
      <button className="slide-arrow next" onClick={nextSlide} aria-label="Next slide">
        &#10095;
      </button>
      
      <div className="slide-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow; 