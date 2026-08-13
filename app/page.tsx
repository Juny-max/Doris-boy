'use client';

import { useCallback, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { CanvasFrameSequence } from '@/components/canvas-frame-sequence';
import { HeroLoader } from '@/components/hero-loader';
import { PortalHero } from '@/components/portal-hero';
import { BirthdayBook } from '@/components/birthday-book';
import { BirthdayWishCard } from '@/components/birthday-wish-card';

const galleryMedia = [
  { type: 'image' as const, src: '/memories/meta-favicon.jpg' },
  { type: 'image' as const, src: '/memories/img1.jpg' },
  { type: 'image' as const, src: '/memories/img2.jpg' },
  { type: 'image' as const, src: '/memories/img3.jpg' },
  { type: 'video' as const, src: '/memories/vid1.mp4' },
];

export default function BirthdayPage() {
  const [cacheProgress, setCacheProgress] = useState(0);
  const [framesReady, setFramesReady] = useState(false);
  const [loaderExited, setLoaderExited] = useState(false);
  const previousPhaseRef = useRef(0);

  const triggerConfetti = useCallback(() => {
    const end = Date.now() + 1800;
    const colors = ['#00d9ff', '#ffe500', '#f5f1e8', '#ff3333'];
    const fire = () => {
      confetti({
        particleCount: 3,
        angle: Math.random() * 360,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.45 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();
  }, []);

  const handleProgress = useCallback((progress: number) => setCacheProgress(progress), []);
  const handleReady = useCallback(() => setFramesReady(true), []);
  const handleLoaderExited = useCallback(() => setLoaderExited(true), []);

  const handleFrameChange = useCallback((_: number, progress: number) => {
    const nextPhase = progress <= 0.25 ? 0 : progress <= 0.6 ? 1 : 2;
    if (previousPhaseRef.current === nextPhase) return;
    const enteringFinalPhase = nextPhase === 2 && previousPhaseRef.current !== 2;
    previousPhaseRef.current = nextPhase;
    if (enteringFinalPhase) triggerConfetti();
  }, [triggerConfetti]);

  return (
    <>
      <CanvasFrameSequence
        onProgress={handleProgress}
        onReady={handleReady}
        onFrameChange={handleFrameChange}
      />
      {!loaderExited && (
        <HeroLoader progress={cacheProgress} ready={framesReady} onExited={handleLoaderExited} />
      )}

      <main className="relative z-10">
        <section id="birthday-hero-scroll" className="relative h-[320vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden px-4 py-8 md:px-8">
            <PortalHero />
          </div>
        </section>

        <section className="relative overflow-hidden border-y-2 border-black bg-[#ffe17c] px-5 py-24 text-black md:px-10 md:py-36">
          <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:gap-20">
            <div>
              <p className="mb-7 w-fit border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000]">A birthday note</p>
              <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-tighter sm:text-6xl md:text-8xl">
                Prince Kojo<br />Asante Kesse.
              </h2>
              <p className="mt-8 max-w-md text-lg font-medium leading-relaxed md:text-xl">A little page for your special day.</p>
            </div>
            <BirthdayWishCard />
          </div>
        </section>

        <section className="overflow-hidden border-b-2 border-black bg-[#171e19] py-5 text-[#b7c6c2]">
          <p className="whitespace-nowrap text-center text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">
            HAPPY BIRTHDAY — PRINCE KOJO ASANTE KESSE — HAPPY BIRTHDAY
          </p>
        </section>

        <section className="bg-white px-5 py-20 text-black md:px-10 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#2e6b72]">The gallery</p>
                <h2 className="mt-2 text-5xl font-black uppercase leading-none tracking-tighter md:text-7xl">Your frames.</h2>
              </div>
            </div>
            <BirthdayBook coverImage="/memories/fav.jpg" media={galleryMedia} name="Prince Kojo Asante Kesse" />
          </div>
        </section>

        <section className="border-y-2 border-black bg-[#171e19] px-5 py-20 text-white md:px-10 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {[
              {
                title: 'Another year, and you are still my favorite person.',
                body: 'Thank you for being kind, steady, and full of heart. You make love feel safe and beautiful.',
              },
              {
                title: 'I pray this year meets you with peace and answered dreams.',
                body: 'May every door meant for you open at the right time, and may joy find you in ordinary days.',
              },
              {
                title: 'I am proud of you, and I am grateful for you.',
                body: 'Keep becoming all that you are called to be. I will always be cheering you on, my love.',
              },
            ].map((item, index) => (
              <div key={item.title} className="border-2 border-white p-6 md:p-8">
                <span className="mb-16 block text-xs font-black tracking-[0.14em] text-[#b7c6c2]">0{index + 1}</span>
                <h3 className="text-2xl font-black uppercase leading-[1.03] tracking-tight md:text-3xl">{item.title}</h3>
                <p className="mt-5 text-sm font-medium leading-relaxed text-[#d5dfdc] md:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="relative overflow-hidden border-t-2 border-black bg-[linear-gradient(160deg,#ffe17c_0%,#f6d468_55%,#edbe4d_100%)] px-5 py-20 text-black md:px-10 md:py-28">
          <div className="absolute inset-0 opacity-12 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-4 inline-block border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]">
                Final note
              </p>
              <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl md:text-8xl">
                Happy birthday,
                <br />
                my love.
              </h2>
              <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed md:text-lg">
                You are deeply loved. You are celebrated. You are one of the best gifts in my life, and I pray this new chapter brings you strength, laughter, favor, and beautiful surprises.
              </p>
            </div>

            <div className="self-end border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000] md:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2e6b72]">From Doris</p>
              <p className="mt-4 text-lg font-black leading-tight md:text-2xl">Forever proud of you. Forever grateful for you.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['peace', 'joy', 'growth', 'favor', 'love'].map((tag) => (
                  <span key={tag} className="border-2 border-black bg-[#b7c6c2] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
