'use client';

import { useEffect, useRef } from 'react';
import { CanvasFrameSequence } from '@/components/canvas-frame-sequence';
import { BrutalistMemoryCard } from '@/components/brutalist-memory-card';
import { BrutalistButton } from '@/components/brutalist-button';
import confetti from 'canvas-confetti';

const memories = [
  {
    title: 'The First Moment',
    date: 'Day 1',
    description:
      'Remember when we first met? That spark of connection, the nervousness, the butterflies. It all started here, and I knew you were special.',
    image: '/memories/memory-1.png',
  },
  {
    title: 'Adventure Awaits',
    date: 'Summer',
    description:
      'Every adventure with you feels like a movie. Whether we\'re hiking mountains or exploring new cities, you make every moment unforgettable.',
    image: '/memories/memory-2.png',
  },
  {
    title: 'Coffee & Conversations',
    date: 'Every Week',
    description:
      'Our quiet moments matter just as much. Late night talks over coffee, sharing dreams and fears. These are the moments I treasure most.',
    image: '/memories/memory-3.png',
  },
  {
    title: 'Living Free',
    date: 'Always',
    description:
      'You inspire me to be braver, to dream bigger, to live fully. With you, I feel like I can conquer anything. You\'re my greatest adventure.',
    image: '/memories/memory-4.png',
  },
  {
    title: 'Celebrations & Joy',
    date: 'Every Time',
    description:
      'Your smile lights up every room. The way you celebrate life, even the small victories, reminds me to find joy in everything. Thank you for that.',
    image: '/memories/memory-5.png',
  },
  {
    title: 'Us',
    date: 'Forever',
    description:
      'In a world full of chaos, you\'re my constant. My home, my peace, my person. Here\'s to more memories, more laughs, more love. Happy Birthday.',
    image: '/memories/memory-6.png',
  },
];

export default function BirthdayPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;

    const colors = ['#00d9ff', '#f5f1e8', '#1b6b4a', '#ff3333'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: Math.random() * 360,
        spread: Math.random() * 100,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    triggerConfetti();
  }, []);

  return (
    <>
      <CanvasFrameSequence />

      {/* Content overlay */}
      <div
        ref={contentRef}
        className="relative z-10"
        style={{ backgroundColor: 'rgba(26, 26, 26, 0.95)' }}
      >
        {/* Hero Section */}
        <div className="h-screen flex items-center justify-center px-4 relative">
          <div className="text-center">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 leading-none"
              style={{ color: '#f5f1e8' }}
            >
              HAPPY
              <br />
              BIRTHDAY
              <br />
              [NAME]
            </h1>

            <p
              className="text-lg md:text-2xl font-bold uppercase tracking-widest mb-12"
              style={{ color: '#00d9ff' }}
            >
              A Celebration of You
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap">
              <BrutalistButton onClick={triggerConfetti}>
                Celebrate
              </BrutalistButton>
              <BrutalistButton onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })} variant="secondary">
                Scroll Down
              </BrutalistButton>
            </div>
          </div>
        </div>

        {/* Memories Section */}
        <section className="relative z-20 py-20 md:py-32 px-4 md:px-8 max-w-5xl mx-auto">
          <h2
            className="text-4xl md:text-6xl font-black uppercase mb-20 tracking-tight"
            style={{ color: '#f5f1e8' }}
          >
            Our Moments
          </h2>

          <div className="space-y-16">
            {memories.map((memory, index) => (
              <BrutalistMemoryCard key={index} index={index} {...memory} />
            ))}
          </div>
        </section>

        {/* Final Message */}
        <section className="relative z-20 py-20 md:py-32 px-4 md:px-8">
          <div
            className="border-4 p-8 md:p-16 text-center"
            style={{
              backgroundColor: '#1b6b4a',
              borderColor: '#000000',
              boxShadow: '12px 12px 0px #000000',
            }}
          >
            <p
              className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-8 leading-tight"
              style={{ color: '#f5f1e8' }}
            >
              You deserve all the happiness in the world
            </p>
            <p
              className="text-base md:text-lg font-bold leading-relaxed"
              style={{ color: '#f5f1e8' }}
            >
              Thank you for being you. Thank you for being mine. Here&apos;s to another year of adventures, laughs, and love. I can&apos;t wait to celebrate every moment with you.
            </p>
          </div>
        </section>

      </div>
    </>
  );
}
