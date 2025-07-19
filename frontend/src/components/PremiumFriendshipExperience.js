import React, { useState, useEffect, useRef } from 'react';
import CinematicIntro from './CinematicIntro';
import PlaneAnimation from './PlaneAnimation';
import FriendshipGalaxy from './FriendshipGalaxy';
import ChatBubbles from './ChatBubbles';
import MemoryCarousel from './MemoryCarousel';
import FriendshipGame from './FriendshipGame';
import MagicalEnding from './MagicalEnding';
import './PremiumFriendshipExperience.css';

const PremiumFriendshipExperience = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="premium-friendship-container">
      {/* Real-time Greeting */}
      <div className="greeting-section">
        <h1 className="greeting-text">
          {getGreeting()}, Prasad & Gauri! 🌟
        </h1>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Premium Friendship Experience</h1>
          <p className="hero-subtitle">A Cinematic Journey of Friendship</p>
          <div className="hero-names">
            <span className="name prasad">Prasad</span>
            <span className="name-connector">&</span>
            <span className="name gauri">Gauri (Madam Ji)</span>
          </div>
          <p className="director-credit">Directed by Jathin</p>
        </div>
      </section>

      {/* 3D Plane Animation Section */}
      <section className="plane-section">
        <h2 className="section-title">Journey of Friendship</h2>
        <PlaneAnimation />
      </section>

      {/* Friendship Galaxy Section */}
      <section className="galaxy-section">
        <h2 className="section-title">Friendship Galaxy</h2>
        <FriendshipGalaxy />
      </section>

      {/* Chat Bubbles Section */}
      <section className="chat-section">
        <h2 className="section-title">Premium Conversations</h2>
        <ChatBubbles />
      </section>

      {/* Memory Carousel Section */}
      <section className="carousel-section">
        <h2 className="section-title">Friendship Quotes</h2>
        <MemoryCarousel />
      </section>

      {/* Friendship Game Section */}
      <section className="game-section">
        <h2 className="section-title">Catch the Friendship Hearts!</h2>
        <FriendshipGame />
      </section>

      {/* Magical Ending Section */}
      <section className="ending-section">
        <MagicalEnding />
      </section>
    </div>
  );
};

export default PremiumFriendshipExperience;