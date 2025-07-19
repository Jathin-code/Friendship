import React, { useEffect, useRef, useState } from 'react';
import './PlaneAnimation.css';

const PlaneAnimation = () => {
  const canvasRef = useRef(null);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let planeX = 50;
    let clouds = [];
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize clouds
    for (let i = 0; i < 8; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3 + 50,
        speed: Math.random() * 0.5 + 0.2,
        size: Math.random() * 30 + 20
      });
    }

    // Initialize trail particles
    const addParticle = (x, y) => {
      particles.push({
        x,
        y,
        life: 100,
        maxLife: 100,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#001122');
      gradient.addColorStop(0.5, '#003366');
      gradient.addColorStop(1, '#004488');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw clouds
      clouds.forEach(cloud => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.fill();
        
        cloud.x -= cloud.speed;
        if (cloud.x < -cloud.size) {
          cloud.x = canvas.width + cloud.size;
        }
      });

      // Draw flight path
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      
      const startX = canvas.width * 0.1;
      const startY = canvas.height * 0.7;
      const endX = canvas.width * 0.9;
      const endY = canvas.height * 0.3;
      
      // Curved path
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(canvas.width * 0.5, canvas.height * 0.1, endX, endY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Calculate plane position on curve
      const t = (planeX % 200) / 200;
      const planeCurrentX = startX + (endX - startX) * t;
      const planeCurrentY = startY + (endY - startY) * t - 200 * t * (1 - t);

      // Add particles to trail
      if (Math.random() < 0.3) {
        addParticle(planeCurrentX - 20, planeCurrentY);
      }

      // Draw particles
      particles.forEach((particle, index) => {
        ctx.fillStyle = `rgba(0, 255, 255, ${particle.life / particle.maxLife})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });

      // Draw airplane
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Simple airplane shape
      const planeSize = 15;
      ctx.moveTo(planeCurrentX, planeCurrentY);
      ctx.lineTo(planeCurrentX - planeSize, planeCurrentY - 5);
      ctx.lineTo(planeCurrentX - planeSize * 0.5, planeCurrentY);
      ctx.lineTo(planeCurrentX - planeSize, planeCurrentY + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      planeX += 0.5;
      if (planeX > 200) planeX = 0;

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="plane-animation-container">
      <canvas 
        ref={canvasRef} 
        className="plane-canvas"
        onMouseMove={handleMouseMove}
      />
      
      <div className="cities">
        <div 
          className="city hyderabad"
          onMouseEnter={() => setHoveredCity('hyderabad')}
          onMouseLeave={() => setHoveredCity(null)}
        >
          <div className="city-marker"></div>
          <span className="city-name">Hyderabad</span>
          {hoveredCity === 'hyderabad' && (
            <div className="tooltip" style={{ left: mousePos.x, top: mousePos.y - 40 }}>
              Home of Jathin & Prasad
            </div>
          )}
        </div>
        
        <div 
          className="city mumbai"
          onMouseEnter={() => setHoveredCity('mumbai')}
          onMouseLeave={() => setHoveredCity(null)}
        >
          <div className="city-marker"></div>
          <span className="city-name">Mumbai</span>
          {hoveredCity === 'mumbai' && (
            <div className="tooltip" style={{ left: mousePos.x, top: mousePos.y - 40 }}>
              Madam Ji's Kingdom
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaneAnimation;