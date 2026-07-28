import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import carousel0 from '../assets/carouselimage0.png';
import carousel1 from '../assets/carouselimage1.png';
import carousel2 from '../assets/carouselimage2.jpg';
import carousel3 from '../assets/carouselimage3.png';
import carousel4 from '../assets/carouselimage4.png';
import carousel5 from '../assets/carouselimage5.png';

const slides = [
  {
    image: carousel0,
    link: '/planters',
    buttonText: 'Shop Now',
    position: 'center 20%' // Prevent cutting off female head at top and text at bottom
  },
  {
    image: carousel1,
    link: '/plants',
    buttonText: 'Shop Now',
    position: 'center 20%' // Prevent cutting off top and bottom content
  },
  {
    image: carousel2,
    link: '/seeds',
    buttonText: 'Shop Now',
    position: 'center'
  },
  {
    image: carousel3,
    link: '/fertilizer',
    buttonText: 'Shop Now',
    position: 'center'
  },
  {
    image: carousel4,
    link: '/garden-decor',
    buttonText: 'Shop Now',
    position: 'center'
  },
  {
    image: carousel5,
    link: '/plants',
    buttonText: 'Shop Now',
    position: 'center'
  }
];

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    if (!isPaused) {
      const interval = setInterval(play, 4000); // Slide changes every 4 seconds
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  return (
    <div 
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
        >
          <img 
            src={slide.image} 
            alt={`Plants and Planters Carousel Slide ${index + 1}`} 
            className="carousel-image" 
            style={{ objectPosition: slide.position || 'center' }}
          />
          <div className="carousel-overlay">
            <Link to={slide.link} className="btn btn-primary">
              {slide.buttonText}
            </Link>
          </div>
        </div>
      ))}



      {/* Slide Indicators */}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
