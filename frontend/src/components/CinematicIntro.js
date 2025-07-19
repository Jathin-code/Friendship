import React, { useEffect, useState } from 'react';
import './CinematicIntro.css';

const CinematicIntro = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [showStarring, setShowStarring] = useState(false);

  useEffect(() => {
    // Loading animation
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => setShowTitle(true), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Show starring after title
    setTimeout(() => {
      setShowStarring(true);
    }, 3000);

    // Complete intro
    setTimeout(() => {
      onComplete();
    }, 6000);

    return () => clearInterval(loadingInterval);
  }, [onComplete]);

  return (
    <div className="cinematic-intro">
      <div className="stars-bg"></div>
      
      {!showTitle && (
        <div className="loading-container">
          <h1 className="loading-text">Launching Premium Friendship Experience...</h1>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <div className="loading-percentage">{loadingProgress}%</div>
        </div>
      )}

      {showTitle && (
        <div className="title-container">
          <h1 className="intro-title">Premium Friendship Experience</h1>
          {showStarring && (
            <div className="starring-credits">
              <p className="starring-text">Starring:</p>
              <h2 className="star-names">Prasad & Gauri</h2>
              <p className="director-text">Directed by Jathin</p>
            </div>
          )}
        </div>
      )}

      <div className="light-burst"></div>
    </div>
  );
};

export default CinematicIntro;