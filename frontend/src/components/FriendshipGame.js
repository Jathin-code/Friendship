import React, { useEffect, useRef, useState } from 'react';
import './FriendshipGame.css';

const FriendshipGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let hearts = [];
    let gameTimer;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Heart {
      constructor() {
        this.x = Math.random() * (canvas.width - 40) + 20;
        this.y = -20;
        this.size = Math.random() * 15 + 15;
        this.speed = Math.random() * 2 + 1;
        this.isGolden = Math.random() < 0.15; // 15% chance for golden heart
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const pulse = Math.sin(Date.now() * 0.005 + this.pulseOffset) * 0.2 + 1;
        const size = this.size * pulse;
        
        // Heart shape
        ctx.beginPath();
        ctx.moveTo(0, size * 0.3);
        ctx.bezierCurveTo(-size * 0.5, -size * 0.2, -size * 0.8, size * 0.1, 0, size * 0.8);
        ctx.bezierCurveTo(size * 0.8, size * 0.1, size * 0.5, -size * 0.2, 0, size * 0.3);
        
        if (this.isGolden) {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          gradient.addColorStop(0, '#FFD700');
          gradient.addColorStop(0.5, '#FFA500');
          gradient.addColorStop(1, '#FF6347');
          ctx.fillStyle = gradient;
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 20;
        } else {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
          gradient.addColorStop(0, '#FF69B4');
          gradient.addColorStop(0.5, '#FF1493');
          gradient.addColorStop(1, '#DC143C');
          ctx.fillStyle = gradient;
          ctx.shadowColor = '#FF69B4';
          ctx.shadowBlur = 15;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      isClicked(mouseX, mouseY) {
        const distance = Math.sqrt(
          Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2)
        );
        return distance < this.size;
      }
    }

    const spawnHeart = () => {
      if (gameActive && hearts.length < 8) {
        hearts.push(new Heart());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a0033');
      gradient.addColorStop(1, '#000011');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameActive) {
        // Update and draw hearts
        hearts.forEach((heart, index) => {
          heart.update();
          heart.draw();
          
          // Remove hearts that fall off screen
          if (heart.y > canvas.height + 50) {
            hearts.splice(index, 1);
          }
        });
        
        // Spawn new hearts
        if (Math.random() < 0.02) {
          spawnHeart();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    const handleCanvasClick = (e) => {
      if (!gameActive) return;
      
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      hearts.forEach((heart, index) => {
        if (heart.isClicked(mouseX, mouseY)) {
          const points = heart.isGolden ? 5 : 1;
          setScore(prev => prev + points);
          
          const messages = heart.isGolden 
            ? ["Golden Friendship Heart! +5 ✨", "Premium Bond! +5 💎", "Legendary Catch! +5 🌟"]
            : ["You caught a Friendship Heart! +1 💖", "Beautiful! +1 ❤️", "Amazing! +1 💕"];
          
          setMessage(messages[Math.floor(Math.random() * messages.length)]);
          setTimeout(() => setMessage(''), 1500);
          
          hearts.splice(index, 1);
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', resizeCanvas);
      if (gameTimer) clearInterval(gameTimer);
    };
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setMessage('');
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameActive(false);
          setMessage(`Game Over! Final Score: ${score} 🎉`);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="friendship-game-container">
      <div className="game-header">
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
        </div>
        
        {!gameActive && timeLeft === 30 && (
          <button className="start-game-btn" onClick={startGame}>
            Start Game
          </button>
        )}
        
        {!gameActive && timeLeft === 0 && (
          <button className="start-game-btn" onClick={startGame}>
            Play Again
          </button>
        )}
      </div>
      
      <canvas ref={canvasRef} className="game-canvas" />
      
      <div className="game-instructions">
        {gameActive ? (
          <p>Click the hearts to catch them! Golden hearts are worth 5 points! 💛</p>
        ) : (
          <p>Click hearts as they fall to score points! Can you catch them all? ❤️</p>
        )}
      </div>
      
      {message && (
        <div className="game-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default FriendshipGame;