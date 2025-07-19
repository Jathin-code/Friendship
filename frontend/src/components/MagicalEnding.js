import React, { useEffect, useRef, useState } from 'react';
import './MagicalEnding.css';

const MagicalEnding = () => {
  const canvasRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [showFireworks, setShowFireworks] = useState(false);
  const [showSurpriseButton, setShowSurpriseButton] = useState(true);
  
  const finalMessage = "This is my forever gift for you both. ❤️ – Jathin";

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let heart = { rotation: 0, pulseScale: 1 };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class for magical effects
    class MagicalParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 100;
        this.maxLife = 100;
        this.size = Math.random() * 3 + 1;
        this.color = `hsl(${Math.random() * 60 + 300}, 100%, 70%)`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // gravity
        this.life--;
        this.size *= 0.995;
      }

      draw() {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Firework class
    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.3 + 50;
        this.speed = 5;
        this.exploded = false;
        this.particles = [];
        this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      }

      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          if (this.y <= this.targetY) {
            this.explode();
          }
        } else {
          this.particles.forEach(particle => particle.update());
          this.particles = this.particles.filter(particle => particle.life > 0);
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < 30; i++) {
          this.particles.push(new MagicalParticle(this.x, this.y));
        }
      }

      draw() {
        if (!this.exploded) {
          ctx.fillStyle = this.color;
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          this.particles.forEach(particle => particle.draw());
        }
      }
    }

    let fireworks = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw magical background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, '#1a0033');
      gradient.addColorStop(1, '#000011');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update heart animation
      heart.rotation += 0.02;
      heart.pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.2;

      // Draw 3D spinning heart
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 3;
      const heartSize = 30;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(heart.rotation);
      ctx.scale(heart.pulseScale, heart.pulseScale);

      // Heart gradient
      const heartGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, heartSize);
      heartGradient.addColorStop(0, '#FF69B4');
      heartGradient.addColorStop(0.5, '#FF1493');
      heartGradient.addColorStop(1, '#DC143C');
      
      ctx.fillStyle = heartGradient;
      ctx.shadowColor = '#FF69B4';
      ctx.shadowBlur = 30;

      // Draw heart shape
      ctx.beginPath();
      ctx.moveTo(0, heartSize * 0.3);
      ctx.bezierCurveTo(-heartSize * 0.5, -heartSize * 0.2, -heartSize * 0.8, heartSize * 0.1, 0, heartSize * 0.8);
      ctx.bezierCurveTo(heartSize * 0.8, heartSize * 0.1, heartSize * 0.5, -heartSize * 0.2, 0, heartSize * 0.3);
      ctx.fill();
      
      ctx.shadowBlur = 0;
      ctx.restore();

      // Add particles around heart
      if (Math.random() < 0.3) {
        particles.push(new MagicalParticle(
          centerX + (Math.random() - 0.5) * 100,
          centerY + (Math.random() - 0.5) * 100
        ));
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      particles = particles.filter(particle => particle.life > 0);

      // Handle fireworks
      if (showFireworks) {
        if (Math.random() < 0.03) {
          fireworks.push(new Firework());
        }

        fireworks.forEach(firework => {
          firework.update();
          firework.draw();
        });
        fireworks = fireworks.filter(firework => 
          !firework.exploded || firework.particles.length > 0
        );
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [showFireworks]);

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < finalMessage.length) {
        setTypedText(finalMessage.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const triggerSurprise = () => {
    setShowFireworks(true);
    setShowSurpriseButton(false);
    
    // Trigger confetti if available
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        window.confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 500);
      
      setTimeout(() => {
        window.confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 1000);
    }
    
    // Stop fireworks after 10 seconds
    setTimeout(() => {
      setShowFireworks(false);
      setShowSurpriseButton(true);
    }, 10000);
  };

  return (
    <div className="magical-ending-container">
      <canvas ref={canvasRef} className="magical-canvas" />
      
      <div className="ending-content">
        <div className="typing-message">
          {typedText}
          <span className="cursor">|</span>
        </div>
        
        {showSurpriseButton && (
          <button className="surprise-button" onClick={triggerSurprise}>
            Special Surprise 🎉
          </button>
        )}
        
        {showFireworks && (
          <div className="celebration-message">
            Best Friends Forever! 🎆✨💖
          </div>
        )}
      </div>
      
      <div className="floating-hearts">
        <span className="floating-heart">💖</span>
        <span className="floating-heart">✨</span>
        <span className="floating-heart">🌟</span>
        <span className="floating-heart">💫</span>
      </div>
    </div>
  );
};

export default MagicalEnding;