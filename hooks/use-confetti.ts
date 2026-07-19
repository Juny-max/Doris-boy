import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const trigger = useCallback(() => {
    // Duration in milliseconds
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Confetti burst from center with varied properties
      confetti({
        particleCount: 50,
        angle: randomInRange(55, 125),
        spread: randomInRange(40, 80),
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff1493', '#00bfff', '#ffd700', '#ff69b4', '#00ff7f', '#ff4500'],
        ticks: 300,
        gravity: 0.8,
        decay: 0.95,
        scalar: randomInRange(0.8, 1.2),
      });
    }, 250);
  }, []);

  return trigger;
}
