import React, { useState, useEffect } from 'react';
import './MemoryCarousel.css';

const MemoryCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const friendshipQuotes = [
    {
      quote: "A real friend is one who walks in when the rest of the world walks out.",
      author: "For Prasad & Gauri",
      theme: "loyalty"
    },
    {
      quote: "Friendship isn't about whom you have known the longest. It's about who came and never left your side.",
      author: "Premium Bond",
      theme: "connection"
    },
    {
      quote: "Good friends are like stars. You don't always see them, but you know they're always there.",
      author: "Eternal Friendship",
      theme: "presence"
    },
    {
      quote: "True friendship multiplies the good in life and divides its troubles.",
      author: "Jathin's Dedication",
      theme: "support"
    },
    {
      quote: "Friends are the family we choose for ourselves.",
      author: "Chosen Family",
      theme: "family"
    },
    {
      quote: "A friend knows the song in my heart and sings it to me when my memory fails.",
      author: "Heart Connection",
      theme: "understanding"
    }
  ];

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % friendshipQuotes.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, friendshipQuotes.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % friendshipQuotes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + friendshipQuotes.length) % friendshipQuotes.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className="memory-carousel-container"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="carousel-wrapper">
        <button className="carousel-btn prev-btn" onClick={prevSlide}>
          <span>‹</span>
        </button>
        
        <div className="carousel-track">
          {friendshipQuotes.map((quote, index) => {
            let className = 'carousel-card';
            const diff = (index - currentSlide + friendshipQuotes.length) % friendshipQuotes.length;
            
            if (diff === 0) className += ' active';
            else if (diff === 1 || diff === friendshipQuotes.length - 1) className += ' side';
            else className += ' hidden';
            
            return (
              <div 
                key={index} 
                className={`${className} theme-${quote.theme}`}
                onClick={() => goToSlide(index)}
              >
                <div className="card-content">
                  <div className="quote-mark">"</div>
                  <p className="quote-text">{quote.quote}</p>
                  <div className="quote-author">— {quote.author}</div>
                </div>
                <div className="card-glow"></div>
              </div>
            );
          })}
        </div>
        
        <button className="carousel-btn next-btn" onClick={nextSlide}>
          <span>›</span>
        </button>
      </div>
      
      <div className="carousel-indicators">
        {friendshipQuotes.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default MemoryCarousel;