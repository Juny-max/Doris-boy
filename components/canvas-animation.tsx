'use client';

import { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'circle' | 'star' | 'square';
}

export function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = [
      '#ff1493', '#00bfff', '#ffd700', '#ff69b4', 
      '#00ff7f', '#ff4500', '#9370db', '#20b2aa'
    ];

    // Initialize shapes
    const initShapes = () => {
      shapesRef.current = [];
      for (let i = 0; i < 15; i++) {
        shapesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 20 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.05,
          type: ['circle', 'star', 'square'][Math.floor(Math.random() * 3)] as 'circle' | 'star' | 'square',
        });
      }
    };

    const drawCircle = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    const drawStar = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      
      const points = 5;
      const outerRadius = size;
      const innerRadius = size / 2;

      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = Math.cos(angle - Math.PI / 2) * radius;
        const py = Math.sin(angle - Math.PI / 2) * radius;
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const drawSquare = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw shapes
      shapesRef.current.forEach((shape) => {
        // Update position
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        // Bounce off walls
        if (shape.x - shape.size < 0 || shape.x + shape.size > canvas.width) {
          shape.vx *= -1;
          shape.x = Math.max(shape.size, Math.min(canvas.width - shape.size, shape.x));
        }
        if (shape.y - shape.size < 0 || shape.y + shape.size > canvas.height) {
          shape.vy *= -1;
          shape.y = Math.max(shape.size, Math.min(canvas.height - shape.size, shape.y));
        }

        // Draw shape
        if (shape.type === 'circle') {
          drawCircle(shape.x, shape.y, shape.size, shape.color, shape.rotation);
        } else if (shape.type === 'star') {
          drawStar(shape.x, shape.y, shape.size, shape.color, shape.rotation);
        } else {
          drawSquare(shape.x, shape.y, shape.size, shape.color, shape.rotation);
        }
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    initShapes();
    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
    />
  );
}
