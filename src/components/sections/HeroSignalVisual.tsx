'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HeroSignalCore = dynamic(() => import('@/components/canvas/HeroSignalCore'), {
  ssr: false,
  loading: () => null,
});

export const HeroSignalVisual: React.FC = () => {
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const sync = () => setShowCanvas(!motionQuery.matches && desktopQuery.matches);
    sync();
    motionQuery.addEventListener('change', sync);
    desktopQuery.addEventListener('change', sync);
    return () => {
      motionQuery.removeEventListener('change', sync);
      desktopQuery.removeEventListener('change', sync);
    };
  }, []);

  return (
    <div
      className="hero-signal-visual pointer-events-none absolute right-[-12rem] top-[44%] z-0 h-[25rem] w-[25rem] -translate-y-1/2 sm:right-[-17rem] sm:top-1/2 sm:h-[42rem] sm:w-[42rem] lg:right-[-13rem] lg:h-[48rem] lg:w-[48rem]"
      aria-hidden="true"
    >
      <div className="hero-signal-rings absolute inset-0">
        <div className="hero-signal-ring hero-signal-ring-one" />
        <div className="hero-signal-ring hero-signal-ring-two" />
        <div className="hero-signal-ring hero-signal-ring-three" />
        <div className="hero-signal-core-glow" />
        <span className="hero-signal-node hero-signal-node-one" />
        <span className="hero-signal-node hero-signal-node-two" />
        <span className="hero-signal-node hero-signal-node-three" />
      </div>
      {showCanvas && (
        <div className="pointer-events-auto absolute inset-[5%] opacity-95">
          <HeroSignalCore />
        </div>
      )}
      <span className="absolute right-[4%] top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.16em] text-paper/30 [writing-mode:vertical-rl]">
        Work Atlas / 05 systems
      </span>
    </div>
  );
};
