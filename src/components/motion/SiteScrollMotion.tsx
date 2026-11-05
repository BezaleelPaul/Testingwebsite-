'use client';

import { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Browser-only scroll coordinator with reduced-motion and touch fallbacks. */
export function SiteScrollMotion() {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const lenis = finePointer ? lenisRef.current?.lenis : undefined;
    const syncScroll = () => ScrollTrigger.update();
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      lenis.on('scroll', syncScroll);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 30 }, {
          autoAlpha: 1,
          y: 0,
          duration: finePointer ? 0.9 : 0.65,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });
    });

    ScrollTrigger.refresh();
    return () => {
      context.revert();
      if (lenis) {
        lenis.off('scroll', syncScroll);
        gsap.ticker.remove(tick);
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reducedMotion || !finePointer) return null;

  return <ReactLenis root options={{ autoRaf: false, anchors: true, smoothWheel: true }} ref={lenisRef} />;
}
