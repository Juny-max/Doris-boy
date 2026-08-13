'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CACHE_NAME = 'hero-frames-v2';
export const HERO_FRAME_COUNT = 118;
const FRAME_DIRECTORY = '/hero-frames/8015054-hd_1920_1080_25fps_frames';

type CanvasFrameSequenceProps = {
  onProgress?: (progress: number) => void;
  onReady?: () => void;
  onFrameChange?: (frame: number, progress: number) => void;
};

const frameUrl = (index: number) =>
  `${FRAME_DIRECTORY}/frame_${String(index + 1).padStart(3, '0')}.jpg`;

export function CanvasFrameSequence({
  onProgress,
  onReady,
  onFrameChange,
}: CanvasFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const objectUrlsRef = useRef<string[]>([]);
  const frameIndexRef = useRef({ current: 0 });
  const drawFrameRef = useRef<(index: number) => void>(() => undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let cancelled = false;
    let animation: gsap.core.Tween | undefined;

    const drawFrame = (index: number) => {
      const frame = framesRef.current[index];
      if (!frame) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const imageRatio = frame.naturalWidth / frame.naturalHeight;
      const canvasRatio = width / height;
      const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
      const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#000';
      context.fillRect(0, 0, width, height);
      context.drawImage(
        frame,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    };
    drawFrameRef.current = drawFrame;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(frameIndexRef.current.current);
    };

    const imageFromBlob = (blob: Blob) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const objectUrl = URL.createObjectURL(blob);
        objectUrlsRef.current.push(objectUrl);
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Unable to decode a hero frame.'));
        image.src = objectUrl;
      });

    const loadFrames = async () => {
      const cache = 'caches' in window ? await caches.open(CACHE_NAME) : null;
      let completed = 0;

      const loadFrame = async (index: number) => {
        const url = frameUrl(index);
        let response = cache ? await cache.match(url) : undefined;
        if (!response) {
          response = await fetch(url);
          if (!response.ok) throw new Error(`Could not fetch ${url}`);
          await cache?.put(url, response.clone());
        }
        const image = await imageFromBlob(await response.blob());
        framesRef.current[index] = image;
        completed += 1;
        onProgress?.(Math.round((completed / HERO_FRAME_COUNT) * 100));
      };

      // Small batches keep the network responsive while still filling the cache quickly.
      for (let start = 0; start < HERO_FRAME_COUNT; start += 6) {
        await Promise.all(
          Array.from({ length: Math.min(6, HERO_FRAME_COUNT - start) }, (_, offset) =>
            loadFrame(start + offset),
          ),
        );
      }

      if (cancelled) return;
      resizeCanvas();
      onReady?.();
      animation = gsap.to(frameIndexRef.current, {
        current: HERO_FRAME_COUNT - 1,
        ease: 'none',
        snap: 'current',
        scrollTrigger: {
          trigger: '#birthday-hero-scroll',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const frame = Math.round(frameIndexRef.current.current);
          drawFrame(frame);
          onFrameChange?.(frame, frame / (HERO_FRAME_COUNT - 1));
        },
      });
    };

    resizeCanvas();
    void loadFrames().catch((error) => {
      console.error(error);
      // Allow the experience to remain usable even if one asset is unavailable.
      onReady?.();
    });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelled = true;
      animation?.kill();
      window.removeEventListener('resize', resizeCanvas);
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
      objectUrlsRef.current = [];
    };
  }, [onFrameChange, onProgress, onReady]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Birthday video sequence"
      className="fixed inset-0 z-0 h-full w-full border-4 border-black"
    />
  );
}
