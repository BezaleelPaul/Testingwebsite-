'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(false);
      return;
    }

    let frame = 0;
    let exitTimer = 0;
    let removeTimer = 0;
    const startedAt = performance.now();
    const duration = 1650;

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      // Deliberate eased loading choreography; the overlay stays until the
      // full intro sequence finishes instead of disappearing on a CSS timer.
      const eased = 1 - Math.pow(1 - elapsed, 2.4);
      setProgress(Math.min(100, Math.round(eased * 100)));

      if (elapsed < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        exitTimer = window.setTimeout(() => setExiting(true), 180);
        removeTimer = window.setTimeout(() => setVisible(false), 1120);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`portfolio-preloader${exiting ? ' is-exiting' : ''}`}
      role="status"
      aria-label="Loading portfolio"
      aria-live="polite"
    >
      <div className="preloader-topline">
        <span>BP / DIGITAL PORTFOLIO</span>
        <span>INDEPENDENT SOFTWARE ENGINEERING</span>
      </div>
      <div className="preloader-center">
        <div className="preloader-monogram" aria-hidden="true">BP<span>.</span></div>
        <p className="preloader-statement">BUILT WITH INTENT.<br /><span>ALWAYS IN MOTION.</span></p>
      </div>
      <div className="preloader-bottom">
        <div className="preloader-status"><span>PREPARING EXPERIENCE</span><span>{String(progress).padStart(3, '0')}%</span></div>
        <div className="portfolio-preloader-track"><span style={{ width: progress + '%' }} /></div>
        <div className="preloader-bottom-meta"><span>BEZALEEL PAUL N</span><span>BENGALURU · INDIA</span><span>2026 — PRESENT</span></div>
      </div>
    </div>
  );
}
