'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type AudioContextValue = {
  enabled: boolean;
  toggle: () => void;
  playClick: () => void;
  playPageFlip: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function useSiteAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useSiteAudio must be used within AudioProvider');
  return context;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ambienceRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const ambience = new Audio('/audio/background-ambience.mp3');
    ambience.loop = true;
    ambience.volume = 0.16;
    ambienceRef.current = ambience;
    return () => { ambience.pause(); ambienceRef.current = null; };
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    const ambience = ambienceRef.current;
    if (!ambience) return;
    if (next) void ambience.play().catch(() => setEnabled(false));
    else { ambience.pause(); ambience.currentTime = 0; }
  }, [enabled]);

  const play = useCallback((src: string, volume: number) => {
    if (!enabled) return;
    const sound = new Audio(src);
    sound.volume = volume;
    void sound.play().catch(() => undefined);
  }, [enabled]);

  const value = { enabled, toggle, playClick: () => play('/audio/click.mp3', 0.32), playPageFlip: () => play('/audio/page-flip.mp3', 0.42) };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <button type="button" onClick={toggle} className="fixed bottom-5 right-5 z-[60] border-2 border-black bg-[#a9e4ff] px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-black shadow-[4px_4px_0_0_#000] transition active:translate-x-1 active:translate-y-1 active:shadow-none" aria-pressed={enabled}>
        {enabled ? 'Sound on ♫' : 'Sound off'}
      </button>
    </AudioContext.Provider>
  );
}
