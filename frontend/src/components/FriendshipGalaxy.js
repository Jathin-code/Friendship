import React, { useEffect, useRef, useState } from 'react';
import './FriendshipGalaxy.css';

const FriendshipGalaxy = () => {
  const canvasRef = useRef(null);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const friendshipMessages = [
    "Prasad - Bro for life! 🤝",
    "Madam Ji - The Queen of Smiles! 👑",
    "Premium friendship activated! ✨",
    "Best friends forever! 💖",
    "Friendship level: Legendary! 🌟",
    "Dever Ji is the best! 😄",
    "Madam Ji brings all the joy! 🎉",
    "Unbreakable bond! 💪"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    let rotation = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 60 + 180}, 100%, ${Math.random() * 50 + 50}%)`,
        pulse: Math.random() * Math.PI * 2,
        clickable: Math.random() < 0.3 // 30% of stars are clickable
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      rotation += 0.005;

      stars.forEach((star, index) => {
        // 3D rotation effect
        const rotatedX = (star.x - centerX) * Math.cos(rotation) - (star.z - 500) * Math.sin(rotation);
        const rotatedZ = (star.x - centerX) * Math.sin(rotation) + (star.z - 500) * Math.cos(rotation);
        
        const perspective = 500 / (rotatedZ + 500);
        const screenX = centerX + rotatedX * perspective;
        const screenY = centerY + (star.y - centerY) * perspective;

        if (perspective > 0.1) {
          const size = star.size * perspective;
          star.pulse += 0.05;
          const pulseSize = size + Math.sin(star.pulse) * size * 0.3;
          
          ctx.fillStyle = star.color;
          ctx.shadowColor = star.color;
          ctx.shadowBlur = star.clickable ? 15 : 5;
          
          ctx.beginPath();
          ctx.arc(screenX, screenY, pulseSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw larger glow for clickable stars
          if (star.clickable) {
            ctx.beginPath();
            ctx.arc(screenX, screenY, pulseSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = star.color.replace(')', ', 0.1)').replace('hsl', 'hsla');
            ctx.fill();
          }
          
          ctx.shadowBlur = 0;
          
          // Store screen position for click detection
          star.screenX = screenX;
          star.screenY = screenY;
          star.screenSize = pulseSize;
        }

        // Move star in 3D space
        star.z -= 2;
        if (star.z < 0) {
          star.z = 1000;
          star.x = Math.random() * canvas.width;
          star.y = Math.random() * canvas.height;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      stars.forEach(star => {
        if (star.clickable && star.screenX && star.screenY) {
          const distance = Math.sqrt(
            Math.pow(clickX - star.screenX, 2) + Math.pow(clickY - star.screenY, 2)
          );
          
          if (distance < star.screenSize + 10) {
            const randomMessage = friendshipMessages[Math.floor(Math.random() * friendshipMessages.length)];
            setMessage(randomMessage);
            setShowMessage(true);
            
            // Hide message after 3 seconds
            setTimeout(() => {
              setShowMessage(false);
            }, 3000);
          }
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="friendship-galaxy-container">
      <canvas ref={canvasRef} className="galaxy-canvas" />
      <div className="galaxy-instructions">
        Click on the glowing stars to reveal friendship messages! ✨
      </div>
      {showMessage && (
        <div className="galaxy-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default FriendshipGalaxy;