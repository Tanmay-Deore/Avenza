import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useVisual } from './visualStateStore';

export const MasterScrollController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setScrollProgress } = useVisual();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? Math.min(1.0, Math.max(0, scrollY / totalScroll)) : 0;

      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const velocity = (scrollY - lastScrollY) / dt;

      lastScrollY = scrollY;
      lastTime = now;

      setScrollProgress(progress, velocity);
    };

    lenis.on('scroll', handleScroll);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Initial calculation
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setScrollProgress]);

  return <div className="relative w-full">{children}</div>;
};
