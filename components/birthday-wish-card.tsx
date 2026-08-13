'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type BirthdayWishCardProps = {
  title: string;
  paragraphs: string[];
  index: number;
};

export function BirthdayWishCard({ title, paragraphs, index }: BirthdayWishCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        card,
        { autoAlpha: 0, x: index % 2 === 0 ? 42 : -42, y: 64, rotate: index % 2 === 0 ? 3 : -3, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          rotate: index % 2 === 0 ? -1.25 : 1.25,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.15)',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        },
      );
    }, card);

    return () => context.revert();
  }, [index]);

  return (
    <article
      ref={cardRef}
      className="relative border-4 border-black bg-white p-5 text-black shadow-[10px_10px_0_0_#000] sm:p-7"
    >
      <div className="absolute -right-3 -top-3 grid h-11 w-11 place-items-center rounded-full border-4 border-black bg-[#a9e4ff] text-xl">♥</div>
      <div className="flex items-center justify-between border-b-2 border-black pb-3 text-[10px] font-black uppercase tracking-[0.15em]">
        <span aria-label="Love note" className="text-lg leading-none">✦</span>
        <span className="text-[#2d8eb8]">My heart, in words</span>
      </div>
      <p className="mt-6 text-2xl font-black leading-[0.95] tracking-tight sm:text-3xl">{title}</p>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-base font-medium leading-relaxed sm:text-lg">{paragraph}</p>
      ))}
      <div className="mt-7 flex items-end justify-between border-t-2 border-black pt-4">
        <span className="border-2 border-black bg-[#a9e4ff] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em]">Doris</span>
        <span className="text-2xl leading-none">♥</span>
      </div>
    </article>
  );
}
