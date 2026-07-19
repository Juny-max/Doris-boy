'use client';

import React from 'react';

export function HBDMarquee() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t-4" style={{ borderColor: '#000000', backgroundColor: '#00d9ff' }}>
      <div className="overflow-hidden">
        <div className="inline-flex animate-scroll whitespace-nowrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className="px-8 py-4 text-4xl md:text-6xl font-black uppercase tracking-tighter"
              style={{ color: '#1a1a1a' }}
            >
              HBD • HBD • HBD •
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        :global(.animate-scroll) {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
