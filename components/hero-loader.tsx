'use client';

import { useEffect, useState } from 'react';
import { DotLottiePlayer } from '@dotlottie/react-player';

type HeroLoaderProps = {
  progress: number;
  ready: boolean;
  onExited: () => void;
};

export function HeroLoader({ progress, ready, onExited }: HeroLoaderProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setLeaving(true);
    const timeout = window.setTimeout(onExited, 450);
    return () => window.clearTimeout(timeout);
  }, [onExited, ready]);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-[#a9e4ff] p-5 transition-opacity duration-[400ms] ${leaving ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm border-4 border-black bg-[#f5f1e8] p-6 text-center shadow-[8px_8px_0_0_#000]">
        <p className="mb-3 -rotate-1 bg-black px-3 py-2 text-sm font-black uppercase tracking-[0.18em] text-[#a9e4ff]">
          Preparing the party
        </p>
        <DotLottiePlayer
          src="/loading.lottie"
          autoplay
          loop
          className="mx-auto h-44 w-44"
        />
        <div className="mt-5 border-4 border-black bg-white p-1">
          <div
            className="h-5 bg-[#2d8eb8] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 font-black tabular-nums">{progress}% FRAMES CACHED</p>
      </div>
    </div>
  );
}
