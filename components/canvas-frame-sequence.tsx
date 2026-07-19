'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function CanvasFrameSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Preload frame images
    const frameCount = 12;
    const frames: HTMLImageElement[] = [];

    const loadFrames = async () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        const frameNum = String(i).padStart(2, '0');
        img.src = `/frames/frame-${frameNum}.png`;

        await new Promise((resolve) => {
          img.onload = () => {
            frames.push(img);
            resolve(null);
          };
          img.onerror = resolve;
        });
      }

      framesRef.current = frames;

      // Draw initial frame
      drawFrame(0);

      // Set up GSAP ScrollTrigger animation
      gsap.to(frameIndexRef, {
        current: frameCount - 1,
        snap: 'current',
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.15,
          markers: false,
        },
        onUpdate: () => {
          drawFrame(Math.floor(frameIndexRef.current));
        },
      });
    };

    const drawFrame = (index: number) => {
      const frame = framesRef.current[index];
      if (frame && frame.complete) {
        // Cover the canvas
        const imgRatio = frame.width / frame.height;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth = canvas.width;
        let drawHeight = canvas.height;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawHeight = canvas.width / imgRatio;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    loadFrames();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
