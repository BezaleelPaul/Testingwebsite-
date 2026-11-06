'use client';

import React, { useEffect, useRef } from 'react';

interface HorizontalScrollExperienceProps {
  children: React.ReactNode;
}

/**
 * Desktop: vertical page scroll drives a pinned horizontal project sequence.
 * Touch/small screens and reduced-motion users retain a normal vertical list.
 * Native page scrolling remains in control; no wheel events are hijacked.
 */
export function HorizontalScrollExperience({ children }: HorizontalScrollExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let distance = 0;
    let active = false;

    const measure = () => {
      active = desktop.matches && !reduced.matches;
      section.classList.toggle('horizontal-work-enabled', active);
      track.style.transform = '';
      section.style.height = '';
      distance = active ? Math.max(0, track.scrollWidth - window.innerWidth) : 0;

      if (active && distance > 0) {
        section.style.height = `${window.innerHeight + distance}px`;
        update();
      } else {
        track.style.transform = 'none';
        if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)';
      }
    };

    const update = () => {
      frame = 0;
      if (!active || distance <= 0) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      section.dataset.progress = progress.toFixed(3);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    measure();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', measure);
    desktop.addEventListener('change', measure);
    reduced.addEventListener('change', measure);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', measure);
      desktop.removeEventListener('change', measure);
      reduced.removeEventListener('change', measure);
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      section.style.height = '';
      track.style.transform = '';
      delete section.dataset.progress;
    };
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-work-section" aria-label="Selected projects">
      <div className="horizontal-work-pin">
        <div ref={trackRef} className="horizontal-work-track">
          {children}
        </div>
        <div className="horizontal-work-footer" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <span className="horizontal-work-progress"><span ref={progressRef} /></span>
          <span>SELECTED WORK / 01—03</span>
        </div>
      </div>
    </section>
  );
}
