'use client';

import { useEffect, useRef, useState } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Browser-only scroll coordinator with reduced-motion and touch fallbacks. */
export function SiteScrollMotion() {
  const lenisRef = useRef<LenisRef>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = lenisRef.current?.lenis;
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
    };
  }, [enabled]);

  if (!enabled) return null;
  return <ReactLenis root options={{ autoRaf: false, anchors: true, smoothWheel: true, syncTouch: false, respectReducedMotion: true }} ref={lenisRef} />;
}
