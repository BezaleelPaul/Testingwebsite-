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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sync = () => setShowCanvas(!mediaQuery.matches);
    sync();
    mediaQuery.addEventListener('change', sync);

    return () => mediaQuery.removeEventListener('change', sync);
  }, []);

  return (
    <div
      className="pointer-events-none absolute -right-44 top-1/2 hidden h-[46rem] w-[46rem] -translate-y-1/2 sm:block"
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showCanvas ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 rounded-full border border-paper/10" />
        <div className="absolute inset-[18%] rounded-full border border-paper/10" />
        <div className="absolute inset-[36%] rounded-full border border-signal/20" />
        <div className="absolute inset-[44%] rounded-full bg-signal/10 blur-2xl" />
        <div className="absolute left-[8%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-signal" />
        <div className="absolute right-[22%] top-[22%] h-1.5 w-1.5 rounded-full bg-paper/60" />
        <div className="absolute bottom-[29%] right-[38%] h-1 w-1 rounded-full bg-paper/40" />
      </div>

      {showCanvas && (
        <div className="absolute inset-[6%] opacity-90">
          <HeroSignalCore />
        </div>
      )}

      <span className="absolute right-[4%] top-1/2 -translate-y-1/2 font-mono text-[8px] uppercase tracking-[0.16em] text-paper/30 [writing-mode:vertical-rl]">
        Work Atlas / 05 systems
      </span>
    </div>
  );
};
