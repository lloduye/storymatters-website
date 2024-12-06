import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  const slides = [
    {
      image: `${import.meta.env.BASE_URL}images/homepage/slide1.jpeg`,
      title: 'Empowering Youth Through Creativity',
      description: 'Developing talents and building confidence in Kakuma Refugee Camp'
    },
    {
      image: `${import.meta.env.BASE_URL}images/homepage/slide2.jpeg`,
      title: 'Community Impact',
      description: 'Creating positive change through arts and education'
    },
    {
      image: `${import.meta.env.BASE_URL}images/homepage/slide3.jpeg`,
      title: 'Cultural Expression',
      description: 'Celebrating diversity through performance and storytelling'
    },
    {
      image: `${import.meta.env.BASE_URL}images/homepage/slide4.jpeg`,
      title: 'Skills Development',
      description: 'Training youth in media production and performing arts'
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

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleImageError = (index) => {
    console.error(`Failed to load image at index: ${index}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index) => {
    console.log(`Successfully loaded image at index: ${index}`);
  };

  return (
    <div className="slider-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            onError={() => handleImageError(index)}
            onLoad={() => handleImageLoad(index)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          <div className="overlay" />
          <div className="slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
          </div>
        </div>
      ))}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider; 