'use client';

import { useCallback, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { CanvasFrameSequence } from '@/components/canvas-frame-sequence';
import { HeroLoader } from '@/components/hero-loader';
import { PortalHero } from '@/components/portal-hero';
import { BirthdayBook } from '@/components/birthday-book';
import { BirthdayWishDeck } from '@/components/birthday-wish-deck';
import { AudioProvider } from '@/components/audio-provider';

const galleryMedia = [
  { type: 'image' as const, src: '/memories/meta-favicon.jpg' },
  { type: 'image' as const, src: '/memories/img1.jpg' },
  { type: 'image' as const, src: '/memories/img2.jpg' },
  { type: 'image' as const, src: '/memories/img3.jpg' },
  { type: 'video' as const, src: '/memories/vid1.mp4' },
];

const letterPages = [
  'Happy birthday, my love. Today is the day heaven smiled upon the earth and gave me the greatest gift I could ever ask for you.',
  'This day is not just another date on the calendar; it is a celebration of your life, your existence, and the blessing you are to me.',
  'I want to take this moment not only to wish you well but to pour out my heart in its fullness, because words often fail me when I try to describe how much you mean to me. But today, I will try.',
  'Today, I will write until my soul feels lighter, until my love for you is painted in words so vividly that you can almost touch it.',
  'Prince, you are more than just my boyfriend, you are my answered prayer, my miracle, my constant reminder that love is real and that God listens to the deepest cries of our hearts.',
  'From the very first day you walked into my life, I knew something had shifted. You didn’t just enter quietly; you came with intention, with care, with a love so pure that it felt like home.',
  'Every birthday of yours is a celebration not only of your life but of the blessing you are to mine. You are thoughtful in ways that leave me speechless.',
  'You check on me, you care for me, you love me with a consistency that makes me believe in forever.',
  'I love you so much, Prince. I love you in ways that words cannot fully capture. I love you in the quiet moments when I think of you and smile.',
  'I love you in the loud moments when my heart screams your name. I love you when you are near, and I love you when you are far.',
  'I love you when you are strong, and I love you when you are vulnerable. My love for you is not shallow; it is deep, rooted, and unshakable.',
  'It is the kind of love that grows stronger with every sunrise, the kind that endures storms, the kind that celebrates victories, the kind that never gives up.',
  'Prince, you are caring, loving, thoughtful, and intentional. You are the kind of man who makes me believe that true love is not just a fairy tale but a reality.',
  'You are my protector, my encourager, my partner in every sense of the word. You have shown me what it means to be loved without conditions.',
  'You have taught me patience, kindness, and the beauty of being cherished. You have made me laugh when I wanted to cry, held me when I felt weak, and reminded me of my worth when I doubted myself.',
  'You are my answered prayer, my miracle, my constant reminder that love is real and that God listens to the deepest cries of our hearts.',
  'I celebrate your life, your dreams, your victories, your struggles, your growth, and your journey. I celebrate the man you are and the man you are becoming.',
  'I celebrate the love you give and the love you deserve. I pray that this new year of your life brings you joy beyond measure, peace that surpasses understanding, and blessings that overflow.',
  'I pray that your steps are ordered, your path is clear, and your heart is always full.',
  'Prince, our love story is my favourite. It is not perfect, but it is ours. It is filled with laughter, tears, lessons, and triumphs.',
  'It is a story of two souls who found each other and decided to walk hand in hand, no matter what.',
  'I cherish every moment with you, the late-night conversations, the random check-ins, the intentional gestures, the way you look at me, the way you hold me, the way you love me.',
  'I cherish the way you make me feel safe, valued, and adored.',
  'On this special day, I want to make you a promise. I promise to love you with all that I am, to stand by you in every season, to support you in every dream, to encourage you in every challenge, and to celebrate you in every victory.',
  'I promise to be your partner, your friend, your confidant, your cheerleader, and your safe place.',
  'I promise to love you not just in words but in actions, not just in feelings but in commitment, not just in moments but in a lifetime.',
  'Prince, I pray that God continues to bless you abundantly. I pray that He grants you wisdom, strength, and favour.',
  'I pray that He protects you, guides you, and uplifts you. I pray that He makes your dreams come true and that He fills your heart with joy.',
  'I pray that our love continues to grow, that our bond remains unbreakable, and that our journey together is filled with beauty, grace, and endless love.',
];

const closingLetter = 'Prince, I could write forever and still not capture the depth of my love for you. But I hope that in these words, you feel my heart, my soul, and my devotion. You are my everything, my forever, my always. Happy birthday, my love. May this day be as beautiful as you are, as intentional as your love, and as endless as my devotion. I love you, Prince. I love you more than words, more than time, more than life itself. I love you today, tomorrow, and forever.';

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
    <AudioProvider>
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
              <p className="mb-7 w-fit border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#000]">My dearest Prince,</p>
              <h2 className="max-w-4xl text-5xl font-black uppercase leading-[0.88] tracking-tighter sm:text-6xl md:text-8xl">
                Prince Kojo<br />Asante Kesse.
              </h2>
            </div>
            <BirthdayWishDeck pages={letterPages} />
          </div>
        </section>

        <section className="overflow-hidden border-b-2 border-black bg-[#171e19] py-5 text-[#b7c6c2]">
          <p className="whitespace-nowrap text-center text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">
            HAPPY BIRTHDAY • PRINCE KOJO ASANTE KESSE • HAPPY BIRTHDAY
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
              'Today, I celebrate you. I celebrate your life, your dreams, your victories, your struggles, your growth, and your journey.',
              'Prince, our love story is my favourite. It is not perfect, but it is ours.',
              'I promise to love you with all that I am, to stand by you in every season, to support you in every dream, to encourage you in every challenge, and to celebrate you in every victory.',
            ].map((message, index) => (
              <article key={message} className="border-2 border-white p-6 shadow-[6px_6px_0_0_#a9e4ff] md:p-8">
                <span className="mb-14 block text-xs font-black tracking-[0.14em] text-[#a9e4ff]">0{index + 1}</span>
                <p className="text-lg font-black leading-tight md:text-xl">{message}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="relative overflow-hidden border-t-2 border-black bg-[#a9e4ff] px-5 py-20 text-black md:px-10 md:py-28">
          <div className="absolute inset-0 opacity-12 [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:26px_26px]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="mb-4 inline-block border-2 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_0_#000]">
                My forever, my always
              </p>
              <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl md:text-8xl">
                Happy birthday,
                <br />
                my love.
              </h2>
              <p className="mt-7 max-w-2xl text-base font-medium leading-relaxed md:text-lg">
                {closingLetter}
              </p>
            </div>

            <div className="self-end border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_#000] md:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#2d8eb8]">Doris</p>
              <p className="mt-4 text-lg font-black leading-tight md:text-2xl">I love you today, tomorrow, and forever.</p>
            </div>
          </div>
        </footer>
      </main>
    </AudioProvider>
  );
}
