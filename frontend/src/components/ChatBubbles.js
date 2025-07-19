import React, { useEffect, useState } from 'react';
import './ChatBubbles.css';

const ChatBubbles = () => {
  const [visibleBubbles, setVisibleBubbles] = useState([]);
  
  const chatMessages = [
    { text: "Dever Ji, tum toh best ho! 😄", sender: "gauri", delay: 0 },
    { text: "Premium subscription friends forever! 💎", sender: "prasad", delay: 1500 },
    { text: "Madam Ji, you're the queen! 👑", sender: "jathin", delay: 3000 },
    { text: "Best friendship experience ever! ✨", sender: "gauri", delay: 4500 },
    { text: "This is so cinematic! 🎬", sender: "prasad", delay: 6000 },
    { text: "We're friendship goals! 🎯", sender: "jathin", delay: 7500 },
    { text: "Premium vibes only! 🌟", sender: "gauri", delay: 9000 },
    { text: "Forever and always! ❤️", sender: "prasad", delay: 10500 }
  ];

  useEffect(() => {
    chatMessages.forEach((message, index) => {
      setTimeout(() => {
        setVisibleBubbles(prev => [...prev, { ...message, id: index }]);
      }, message.delay);
    });

    // Reset animation every 15 seconds
    const resetInterval = setInterval(() => {
      setVisibleBubbles([]);
      chatMessages.forEach((message, index) => {
        setTimeout(() => {
          setVisibleBubbles(prev => [...prev, { ...message, id: `${Date.now()}-${index}` }]);
        }, message.delay);
      });
    }, 15000);

    return () => clearInterval(resetInterval);
  }, []);

  const getSenderStyle = (sender) => {
    switch (sender) {
      case 'gauri':
        return 'bubble-gauri';
      case 'prasad':
        return 'bubble-prasad';
      case 'jathin':
        return 'bubble-jathin';
      default:
        return '';
    }
  };

  const getSenderName = (sender) => {
    switch (sender) {
      case 'gauri':
        return 'Madam Ji';
      case 'prasad':
        return 'Prasad';
      case 'jathin':
        return 'Jathin';
      default:
        return '';
    }
  };

  return (
    <div className="chat-bubbles-container">
      <div className="chat-area">
        {visibleBubbles.map((bubble) => (
          <div key={bubble.id} className={`chat-bubble ${getSenderStyle(bubble.sender)}`}>
            <div className="sender-name">{getSenderName(bubble.sender)}</div>
            <div className="bubble-text">{bubble.text}</div>
            <div className="bubble-tail"></div>
          </div>
        ))}
      </div>
      <div className="floating-emojis">
        <span className="floating-emoji">💫</span>
        <span className="floating-emoji">✨</span>
        <span className="floating-emoji">🌟</span>
        <span className="floating-emoji">💖</span>
      </div>
    </div>
  );
};

export default ChatBubbles;