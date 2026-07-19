'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BrutalistMemoryCardProps {
  title: string;
  date: string;
  description: string;
  image: string;
  index: number;
}

export function BrutalistMemoryCard({
  title,
  date,
  description,
  image,
  index,
}: BrutalistMemoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Stagger animations based on index
    gsap.from(cardRef.current, {
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
        markers: false,
      },
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      duration: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative border-4 mb-12"
      style={{
        backgroundColor: '#2d2d2d',
        borderColor: '#000000',
        boxShadow: index % 2 === 0 ? '8px 8px 0px #000000' : '-8px 8px 0px #000000',
        transform: index % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)',
      }}
    >
      <div className="flex flex-col md:flex-row gap-0">
        {/* Image */}
        <div
          className="w-full md:w-1/2 border-b-4 md:border-b-0 md:border-r-4 overflow-hidden"
          style={{ borderColor: '#000000' }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* Content */}
        <div
          className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <div>
            <h3
              className="font-black text-2xl md:text-3xl mb-2 uppercase tracking-tight leading-none"
              style={{ color: '#f5f1e8' }}
            >
              {title}
            </h3>
            <p
              className="font-bold text-sm md:text-base mb-4 uppercase tracking-widest"
              style={{ color: '#00d9ff' }}
            >
              {date}
            </p>
          </div>
          <p
            className="text-base leading-relaxed font-medium"
            style={{ color: '#f5f1e8' }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
