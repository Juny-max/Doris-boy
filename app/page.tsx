'use client';

import { useEffect } from 'react';
import { CanvasAnimation } from '@/components/canvas-animation';
import { MemoryCard } from '@/components/memory-card';
import { useConfetti } from '@/hooks/use-confetti';

const MEMORIES = [
  {
    title: 'Birthday Celebration',
    date: 'March 15',
    description: 'An unforgettable birthday party filled with laughter, delicious cake, and colorful decorations. The highlight of the year!',
    imageUrl: '/memories/memory-1.png',
    imageAlt: 'Birthday celebration with balloons and cake',
  },
  {
    title: 'Beach Adventure',
    date: 'July 22',
    description: 'Golden sunset moments with friends at the beach. Building sandcastles, splashing in waves, and making priceless memories.',
    imageUrl: '/memories/memory-2.png',
    imageAlt: 'Group photo at the beach during sunset',
  },
  {
    title: 'Coffee Shop Hangout',
    date: 'September 8',
    description: 'Cozy afternoons talking about life, dreams, and everything in between. The best conversations happen over coffee.',
    imageUrl: '/memories/memory-3.png',
    imageAlt: 'Friends at a coffee shop',
  },
  {
    title: 'Mountain Hike',
    date: 'May 10',
    description: 'Breathtaking views from the summit after an adventurous hike. Fresh air, stunning landscapes, and a sense of accomplishment.',
    imageUrl: '/memories/memory-4.png',
    imageAlt: 'Group hiking on a mountain trail',
  },
  {
    title: 'Fireworks Night',
    date: 'July 4',
    description: 'Magical fireworks lighting up the night sky. Celebrating with loved ones, hearts full of joy and wonder.',
    imageUrl: '/memories/memory-5.png',
    imageAlt: 'Fireworks celebration at night',
  },
  {
    title: 'Park Picnic',
    date: 'June 12',
    description: 'Relaxing day in the park with friends, good food, and good company. Nature, laughter, and simple pleasures.',
    imageUrl: '/memories/memory-6.png',
    imageAlt: 'Picnic in the park with friends',
  },
];

export default function BirthdayPage() {
  const triggerConfetti = useConfetti();

  // Trigger confetti on load
  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Canvas Background */}
        <div className="absolute inset-0 w-full h-full">
          <CanvasAnimation />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
            🎉 Happy Birthday!
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-cyan-400 mb-8">
            [NAME]
          </p>
          <p className="text-lg md:text-xl text-slate-100 max-w-2xl mb-12 drop-shadow-md">
            Celebrating the wonderful moments and cherished memories we&apos;ve shared together. Here&apos;s to more adventures, laughter, and unforgettable times!
          </p>
          <button
            onClick={triggerConfetti}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Celebrate! 🎊
          </button>
        </div>
      </section>

      {/* Memories Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            Cherished Memories
          </h2>
          <p className="text-slate-300 text-center mb-16 max-w-2xl mx-auto">
            A collection of our favorite moments together. Each memory is a treasure, each laugh is a gift.
          </p>

          {/* Memory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEMORIES.map((memory, index) => (
              <MemoryCard
                key={index}
                title={memory.title}
                date={memory.date}
                description={memory.description}
                imageUrl={memory.imageUrl}
                imageAlt={memory.imageAlt}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-16 px-4 text-center bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700">
        <div className="max-w-2xl mx-auto">
          <p className="text-2xl md:text-3xl font-bold text-white mb-4">
            Thank You
          </p>
          <p className="text-slate-300 mb-8">
            For the beautiful memories, the incredible moments, and for being part of this special day. Your presence makes every celebration brighter and every memory sweeter.
          </p>
          <p className="text-slate-400 text-sm">
            ✨ Here&apos;s to celebrating life, friendship, and all the joy that comes with growing another year older. ✨
          </p>
        </div>
      </section>
    </main>
  );
}
