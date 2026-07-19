'use client';

import React from 'react';

interface BrutalistButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function BrutalistButton({
  onClick,
  children,
  variant = 'primary',
}: BrutalistButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      className="font-black uppercase tracking-tight text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 border-4 transition-all duration-150 hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2"
      style={{
        backgroundColor: isPrimary ? '#00d9ff' : '#1b6b4a',
        color: isPrimary ? '#1a1a1a' : '#f5f1e8',
        borderColor: '#000000',
        boxShadow: '8px 8px 0px #000000',
      }}
    >
      {children}
    </button>
  );
}
