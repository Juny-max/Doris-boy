'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSiteAudio } from '@/components/audio-provider';

type BookMedia = {
  src: string;
  type: 'image' | 'video';
};

type BirthdayBookProps = {
  coverImage: string;
  media: BookMedia[];
  name: string;
};

type TurnDirection = 'next' | 'previous' | null;

function PaperPage({ item, page, name, side }: { item: BookMedia; page: number; name: string; side: 'left' | 'right' }) {
  return (
    <article className="absolute inset-0 grid grid-rows-[1fr_auto] overflow-hidden border-4 border-black bg-[#fffdf8] p-2.5 sm:p-4">
      <div className="relative min-h-0 overflow-hidden border-2 border-black bg-[#b7c6c2]">
        {item.type === 'image' ? (
          <img src={item.src} alt={`${name}, gallery frame ${page}`} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <video
            src={item.src}
            className="h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
          />
        )}
        <span className="absolute left-2 top-2 border-2 border-black bg-[#ffe17c] px-1.5 py-1 text-[8px] font-black uppercase tracking-[0.1em] sm:left-3 sm:top-3 sm:text-[10px]">
          Frame {String(page).padStart(2, '0')}
        </span>
      </div>
      <footer className="flex items-center justify-between gap-2 pt-2 text-[8px] font-black uppercase tracking-[0.08em] sm:pt-3 sm:text-[10px]">
        <span className="truncate">{name}</span>
        <span>{side === 'left' ? '←' : '→'} {String(page).padStart(2, '0')}</span>
      </footer>
    </article>
  );
}

export function BirthdayBook({ coverImage, media, name }: BirthdayBookProps) {
  const { playClick, playPageFlip } = useSiteAudio();
  // `rightPage` is the visible page on the right; the previous photo is its left neighbour.
  const [rightPage, setRightPage] = useState(1);
  const [turning, setTurning] = useState<TurnDirection>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [coverResting, setCoverResting] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const closedBackRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<number | null>(null);
  const isTurning = useRef(false);

  useLayoutEffect(() => {
    gsap.set(coverRef.current, { rotateY: 0, z: 0 });
    gsap.set(pagesRef.current, { autoAlpha: 0 });
  }, []);

  const openBook = () => {
    if (isOpen) return;
    playClick();
    setIsOpen(true);
    setCoverResting(false);
    requestAnimationFrame(() => {
      gsap.timeline({ onComplete: () => { setCoverResting(true); setShowControls(true); } })
        .to(closedBackRef.current, { autoAlpha: 0, duration: 0.22, ease: 'power1.out' }, 0)
        .to(pagesRef.current, { autoAlpha: 1, duration: 0.34, ease: 'power1.out' }, 0.24)
        .to(coverRef.current, { rotateY: -180, z: 18, duration: 0.8, ease: 'power3.inOut' }, 0)
        .to(coverRef.current, { z: 0, duration: 0.2, ease: 'power2.out' }, 0.8);
    });
  };

  const closeBook = () => {
    if (!isOpen || isTurning.current) return;
    playClick();
    setShowControls(false);
    setCoverResting(false);
    gsap.timeline({ onComplete: () => setIsOpen(false) })
      .to(pagesRef.current, { autoAlpha: 0, duration: 0.2, ease: 'power1.out' }, 0)
      .to(coverRef.current, { rotateY: 0, z: 0, duration: 0.8, ease: 'power3.inOut' }, 0)
      .to(closedBackRef.current, { autoAlpha: 1, duration: 0.18, ease: 'power1.out' }, 0.55);
  };

  const turn = useCallback((direction: Exclude<TurnDirection, null>) => {
    if (!isOpen || isTurning.current) return;
    if ((direction === 'next' && rightPage >= media.length - 1) || (direction === 'previous' && rightPage <= 1)) return;

    isTurning.current = true;
    playPageFlip();
    setTurning(direction);

    requestAnimationFrame(() => {
      const leaf = leafRef.current;
      const shadow = shadowRef.current;
      if (!leaf || !shadow) return;

      const rotation = direction === 'next' ? -180 : 180;
      gsap.set(leaf, { rotateY: 0, scale: 1, z: 0 });
      gsap.set(shadow, { opacity: 0, scaleX: direction === 'next' ? 1 : -1 });

      gsap.timeline({
        onComplete: () => {
          setRightPage((page) => direction === 'next' ? page + 1 : page - 1);
          setTurning(null);
          isTurning.current = false;
        },
      })
        .to(leaf, { rotateY: rotation / 2, z: 22, scale: 1.03, duration: 0.3, ease: 'power1.in' })
        .to(shadow, { opacity: 0.34, duration: 0.24, ease: 'power1.in' }, 0)
        .to(leaf, { rotateY: rotation, z: 0, scale: 1, duration: 0.34, ease: 'power2.out' })
        .to(shadow, { opacity: 0.05, duration: 0.28, ease: 'power2.out' }, 0.3);
    });
  }, [isOpen, media.length, playPageFlip, rightPage]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isOpen) return;
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 48) return;
    turn(distance < 0 ? 'next' : 'previous');
  };

  const targetLeft = turning === 'next' ? rightPage : turning === 'previous' ? rightPage - 2 : rightPage - 1;
  const targetRight = turning === 'next' ? rightPage + 1 : turning === 'previous' ? rightPage - 1 : rightPage;
  const flippingPage = turning === 'previous' ? rightPage - 1 : rightPage;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div
        ref={bookRef}
        className="relative mx-auto aspect-square w-full max-w-3xl touch-pan-y select-none sm:aspect-[4/3] [perspective:1500px]"
        tabIndex={0}
        role="group"
        aria-label="Birthday photo book. Swipe or use left and right arrow keys to turn pages."
        onKeyDown={(event) => {
          if (isOpen && event.key === 'ArrowRight') turn('next');
          if (isOpen && event.key === 'ArrowLeft') turn('previous');
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-x-3 bottom-0 top-3 border-4 border-black bg-[#b7c6c2] shadow-[8px_8px_0_0_#000]" />
        <div className="absolute inset-x-1 bottom-2 top-1 border-4 border-black bg-[#ffe17c]" />
        <div className="absolute inset-0 overflow-hidden border-4 border-black bg-[#171e19] shadow-[8px_8px_0_0_#000] sm:shadow-[12px_12px_0_0_#000]">
          <div ref={closedBackRef} className="absolute inset-y-0 left-0 z-30 w-1/2 border-r-[12px] border-black bg-[#171e19] p-3 sm:p-4">
            <div className="relative h-full w-full overflow-hidden border-2 border-black bg-[#0f1411]">
              <img
                src={coverImage}
                alt={`${name}, full cover preview`}
                className="h-full w-full object-contain"
                draggable={false}
              />
              <span className="pointer-events-none absolute bottom-2 left-2 border border-black bg-[#ffe17c] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-black sm:text-[9px]">
                Birthday edition
              </span>
            </div>
          </div>

          <div ref={pagesRef} className="absolute inset-0 z-20">
            <div className="absolute inset-y-0 left-0 w-1/2">
              <PaperPage item={media[targetLeft]} page={targetLeft + 1} name={name} side="left" />
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2">
              <PaperPage item={media[targetRight]} page={targetRight + 1} name={name} side="right" />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-1 -translate-x-1/2 bg-black sm:w-1.5" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-5 -translate-x-1/2 bg-[linear-gradient(90deg,rgba(0,0,0,0.25),transparent,rgba(0,0,0,0.25))]" />

          {turning && (
            <div
              ref={leafRef}
              className={`absolute inset-y-0 z-40 w-1/2 [transform-style:preserve-3d] ${turning === 'next' ? 'left-1/2 [transform-origin:left_center]' : 'left-0 [transform-origin:right_center]'}`}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <PaperPage item={media[flippingPage]} page={flippingPage + 1} name={name} side={turning === 'next' ? 'right' : 'left'} />
                <div ref={shadowRef} className="pointer-events-none absolute inset-0 origin-center bg-[linear-gradient(90deg,rgba(0,0,0,0.58),transparent_65%)] opacity-0" />
              </div>
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <PaperPage item={media[flippingPage]} page={flippingPage + 1} name={name} side={turning === 'next' ? 'left' : 'right'} />
                <div className="pointer-events-none absolute inset-0 bg-black/10" />
              </div>
            </div>
          )}

          <button
            ref={coverRef}
            type="button"
            onClick={openBook}
            aria-label="Open the birthday photo book"
            className={`absolute inset-y-0 left-1/2 w-1/2 cursor-pointer border-0 bg-transparent p-0 text-left [backface-visibility:hidden] [transform-origin:left_center] [transform-style:preserve-3d] ${coverResting ? 'z-10 pointer-events-none' : 'z-50'}`}
          >
            <span className="absolute inset-0 grid place-items-center overflow-hidden border-4 border-black bg-[#ffe17c] p-3 sm:p-5 [backface-visibility:hidden]">
              <span className="absolute inset-y-0 left-0 w-3 border-r-4 border-black bg-[#171e19]" />
              <span className="relative w-full border-4 border-black bg-white p-2.5 shadow-[5px_5px_0_0_#000] sm:p-5">
                <img src={coverImage} alt={`${name}, book cover`} className="mb-2 h-20 w-full border-2 border-black object-cover sm:mb-3 sm:h-32" draggable={false} />
                <span className="block text-[10px] font-black uppercase tracking-[0.15em] text-[#2e6b72]">A birthday book</span>
                <strong className="mt-2 block text-xl font-black uppercase leading-[0.88] tracking-tighter sm:mt-3 sm:text-4xl">Prince<br />Kojo.</strong>
                <span className="mt-3 block border-2 border-black bg-[#b7c6c2] p-1.5 text-center font-mono text-[8px] font-black uppercase tracking-[0.1em] animate-pulse sm:mt-5 sm:p-2 sm:text-[10px]">Click / Tap to open 📖</span>
              </span>
            </span>
            <span className="absolute inset-0 grid place-items-center overflow-hidden border-4 border-black bg-[#fffdf8] p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="h-full w-full border-2 border-black bg-[#b7c6c2]" />
            </span>
          </button>
        </div>
      </div>

      {showControls && (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:justify-between">
        <button
          type="button"
          onClick={() => turn('previous')}
          disabled={rightPage <= 1 || turning !== null}
          className="border-4 border-black bg-[#ffe17c] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] shadow-[4px_4px_0_0_#000] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          ← Prev
        </button>
        <p className="border-2 border-black bg-[#b7c6c2] px-3 py-2 font-mono text-xs font-black uppercase tracking-[0.08em]">
          Pages {String(rightPage).padStart(2, '0')}–{String(rightPage + 1).padStart(2, '0')} / {String(media.length).padStart(2, '0')}
        </p>
        <button
          type="button"
          onClick={() => turn('next')}
          disabled={rightPage >= media.length - 1 || turning !== null}
          className="border-4 border-black bg-[#ffe17c] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] shadow-[4px_4px_0_0_#000] transition active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          Next →
        </button>
        <button type="button" onClick={closeBook} className="order-last basis-full text-center text-[10px] font-black uppercase tracking-[0.14em] underline underline-offset-4">Close book</button>
      </div>
      )}
    </div>
  );
}
