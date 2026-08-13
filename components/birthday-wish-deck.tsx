'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useSiteAudio } from '@/components/audio-provider';

type BirthdayWishDeckProps = { pages: string[] };

export function BirthdayWishDeck({ pages }: BirthdayWishDeckProps) {
  const { playClick } = useSiteAudio();
  const [current, setCurrent] = useState(0);
  const cardRef = useRef<HTMLElement>(null);

  const next = () => {
    if (current >= pages.length - 1 || !cardRef.current) return;
    playClick();
    gsap.to(cardRef.current, {
      x: 52,
      y: -20,
      rotate: 6,
      autoAlpha: 0,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: () => {
        setCurrent((page) => page + 1);
        gsap.fromTo(cardRef.current, { x: -30, y: 18, rotate: -3, autoAlpha: 0 }, { x: 0, y: 0, rotate: -1, autoAlpha: 1, duration: 0.42, ease: 'back.out(1.25)' });
      },
    });
  };

  const previous = () => {
    if (current <= 0 || !cardRef.current) return;
    playClick();
    gsap.to(cardRef.current, {
      x: -52,
      y: -20,
      rotate: -6,
      autoAlpha: 0,
      duration: 0.24,
      ease: 'power2.in',
      onComplete: () => {
        setCurrent((page) => page - 1);
        gsap.fromTo(cardRef.current, { x: 30, y: 18, rotate: 3, autoAlpha: 0 }, { x: 0, y: 0, rotate: -1, autoAlpha: 1, duration: 0.42, ease: 'back.out(1.25)' });
      },
    });
  };

  return (
    <div className="w-full max-w-md" tabIndex={0} onKeyDown={(event) => {
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft') previous();
    }}>
      <div className="relative min-h-[22rem] sm:min-h-[25rem]">
        <div className="absolute inset-2 translate-x-5 translate-y-5 border-4 border-black bg-[#a9e4ff]" />
        <div className="absolute inset-1 translate-x-3 translate-y-3 border-4 border-black bg-white" />
        <article ref={cardRef} className="absolute inset-0 flex flex-col border-4 border-black bg-white p-5 text-black shadow-[10px_10px_0_0_#000] sm:p-7" aria-live="polite">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 text-[10px] font-black uppercase tracking-[0.14em]">
            <span>♥</span>
            <span className="text-[#2d8eb8]">My dearest Prince</span>
          </div>
          <p className="my-auto text-base font-medium leading-relaxed sm:text-lg">{pages[current]}</p>
          <div className="flex items-center justify-between border-t-2 border-black pt-4">
            <span className="border-2 border-black bg-[#a9e4ff] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]">Doris</span>
            <span className="font-mono text-[10px] font-black">Part {String(current + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</span>
          </div>
        </article>
      </div>
      <div className="mt-7 h-2 border-2 border-black bg-white p-px" aria-label={`${current + 1} of ${pages.length} letter parts read`}>
        <div className="h-full bg-[#2d8eb8] transition-[width] duration-300" style={{ width: `${((current + 1) / pages.length) * 100}%` }} />
      </div>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={previous} disabled={current === 0} className="border-4 border-black bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.1em] shadow-[4px_4px_0_0_#000] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-default disabled:opacity-45">← Back</button>
        <button type="button" onClick={next} disabled={current === pages.length - 1} className="flex-1 border-4 border-black bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[5px_5px_0_0_#000] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-default disabled:bg-[#2d8eb8]">
          {current === pages.length - 1 ? 'With all my love ♥' : 'Keep reading →'}
        </button>
      </div>
      <p className="mt-4 text-center text-[10px] font-black uppercase tracking-[0.12em] text-black/65">Use the arrows to move through my letter</p>
    </div>
  );
}
