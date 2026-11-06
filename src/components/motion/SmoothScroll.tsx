'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** One Lenis instance for the whole App Router shell, synced to GSAP. */
export function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      anchors: true,
      autoRaf: false,
    });

    const updateScroll = () => ScrollTrigger.update();
    const hero = document.querySelector<HTMLElement>('[data-hero-scroll]');
    const heroContext = gsap.context(() => {
      const visual = hero?.querySelector<HTMLElement>('.hero-signal-visual');
      const copy = hero?.querySelector<HTMLElement>('[data-hero-copy]');
      if (hero && visual) {
        gsap.to(visual, {
          scale: 1.12,
          yPercent: 12,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (hero && copy) {
        gsap.to(copy, {
          yPercent: -8,
          opacity: 0.42,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
    }, hero || undefined);
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', updateScroll);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const refreshFrame = window.requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      window.cancelAnimationFrame(refreshFrame);
      lenis.off('scroll', updateScroll);
      gsap.ticker.remove(tick);
      lenis.destroy();
      heroContext.revert();
    };
  }, []);

  return null;
}
