'use client';

import React, { useEffect, useRef } from 'react';

/**
 * A lightweight portrait depth treatment: layered parallax and a soft reveal
 * driven by the pointer. It deliberately avoids a second custom cursor and
 * falls back to a static image on touch/reduced-motion devices.
 */
export const HeroPortraitDepth: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let raf = 0;
    let tx = 0, ty = 0, x = 0, y = 0;
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      ty = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
    };
    const leave = () => { tx = 0; ty = 0; };
    const animate = () => {
      x += (tx - x) * .075;
      y += (ty - y) * .075;
      el.style.setProperty('--portrait-x', `${x * 13}px`);
      el.style.setProperty('--portrait-y', `${y * -11}px`);
      el.style.setProperty('--portrait-rotate-x', `${y * -3.5}deg`);
      el.style.setProperty('--portrait-rotate-y', `${x * 4.5}deg`);
      el.style.setProperty('--portrait-light-x', `${50 + x * 28}%`);
      el.style.setProperty('--portrait-light-y', `${42 + y * 25}%`);
      raf = requestAnimationFrame(animate);
    };
    el.addEventListener('pointermove', move, { passive: true });
    el.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(animate);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hero-portrait-depth" aria-hidden="true">
      <div className="hero-portrait-depth__image" />
      <div className="hero-portrait-depth__shade" />
      <div className="hero-portrait-depth__light" />
      <span className="hero-portrait-depth__label">BUILDER / BENGALURU</span>
    </div>
  );
};
