'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function PortalHero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstHalfRef = useRef<HTMLSpanElement>(null);
  const lastHalfRef = useRef<HTMLSpanElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const leftDotRef = useRef<HTMLSpanElement>(null);
  const rightDotRef = useRef<HTMLSpanElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const scrollRoot = document.getElementById('birthday-hero-scroll');

    const context = gsap.context(() => {
      const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!motionAllowed) {
        gsap.set([leftPanelRef.current, rightPanelRef.current], { xPercent: 0 });
        return;
      }

      if (!scrollRoot) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scrollRoot,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      timeline
        // The portal opens in the first half, then holds on the uncovered
        // footage so the visitor can enjoy the frame sequence before moving on.
        .to(leftPanelRef.current, { xPercent: -220, ease: 'none', duration: 0.44 }, 0)
        .to(rightPanelRef.current, { xPercent: 220, ease: 'none', duration: 0.44 }, 0)
        .to(titleRef.current, { scale: 1.15, letterSpacing: '-0.075em', ease: 'none', duration: 0.44 }, 0)
        .to(firstHalfRef.current, { xPercent: -48, ease: 'none', duration: 0.44 }, 0)
        .to(lastHalfRef.current, { xPercent: 48, ease: 'none', duration: 0.44 }, 0)
        .to(washRef.current, { opacity: 0.18, ease: 'none', duration: 0.34 }, 0.1)
        .to(leftDotRef.current, { x: '-35vw', y: '-28vh', scale: 0.45, ease: 'none', duration: 0.44 }, 0)
        .to(rightDotRef.current, { x: '35vw', y: '28vh', scale: 0.45, ease: 'none', duration: 0.44 }, 0)
        .to(metadataRef.current, { autoAlpha: 0, y: -12, ease: 'none', duration: 0.18 }, 0.2)
        .to({}, { duration: 0.56 });
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <div ref={stageRef} className="absolute inset-0 isolate overflow-hidden text-[#ede7dc]">
      <div ref={washRef} className="absolute inset-0 z-[1] bg-[#2e6b72] mix-blend-mode-overlay opacity-0" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,12,14,0.58)_100%)]" />

      <div ref={metadataRef} className="pointer-events-none absolute bottom-5 left-5 z-30 font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede7dc]/75 sm:bottom-7 sm:left-8 md:left-12">
        Scroll to open
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <span ref={leftDotRef} className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#e8913c]" />
        <span ref={rightDotRef} className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-[#2e6b72]" />
      </div>

      <h1
        ref={titleRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-[11vw] font-black uppercase leading-none tracking-[-0.035em] text-[#ede7dc] sm:text-[11vw] md:text-[10vw]"
        aria-label="Happy Birthday"
      >
        <span ref={firstHalfRef}>Happy</span>
        <span className="inline-block w-[0.18em]" aria-hidden="true" />
        <span ref={lastHalfRef}>Birthday<span className="text-[#e8913c]">.</span></span>
      </h1>

      <div ref={leftPanelRef} className="absolute bottom-0 left-0 top-0 z-10 w-[56%] border-r border-[#ede7dc]/15 bg-[#0a0c0e]" />
      <div ref={rightPanelRef} className="absolute bottom-0 right-0 top-0 z-10 w-[56%] border-l border-[#ede7dc]/15 bg-[#101317]" />
    </div>
  );
}
