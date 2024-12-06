import React, { useState, useEffect } from 'react';
import './Slideshow.css';

const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: `${import.meta.env.BASE_URL}images/homepage/slide1.jpeg`,
      caption: 'Making a Difference in Kakuma'
    },
    {
      url: `${import.meta.env.BASE_URL}images/homepage/slide2.jpeg`,
      caption: 'Empowering Young Voices'
    },
    {
      url: `${import.meta.env.BASE_URL}images/homepage/slide3.jpeg`,
      caption: 'Celebrating Creative Expression'
    },
    {
      url: `${import.meta.env.BASE_URL}images/homepage/slide4.jpeg`,
      caption: 'Building Skills for Tomorrow'
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

  const handleImageError = (index) => {
    console.error(`Failed to load image at index: ${index}`);
  };

  return (
    <div className="slideshow">
      <div className="slides-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slide.url})` }}
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