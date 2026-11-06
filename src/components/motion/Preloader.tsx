'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setVisible(false);
      window.dispatchEvent(new Event('portfolio:intro-complete'));
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const duration = 1650;

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 2.4);
      setProgress(Math.min(100, Math.round(eased * 100)));
      if (elapsed < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setReady(true);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const enterPortfolio = () => {
    if (!ready || exiting) return;
    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      window.dispatchEvent(new Event('portfolio:intro-complete'));
    }, 980);
  };

  if (!visible) return null;

  return (
    <div
      className={`portfolio-preloader${exiting ? ' is-exiting' : ''}`}
      role="dialog"
      aria-label="Portfolio introduction"
      aria-modal="true"
    >
      <div className="preloader-topline">
        <span>BP / DIGITAL PORTFOLIO</span>
        <span>INDEPENDENT SOFTWARE ENGINEERING</span>
      </div>
      <div className="preloader-center">
        <div className="preloader-monogram" aria-hidden="true">BP<span>.</span></div>
        <p className="preloader-statement">BUILT WITH INTENT.<br /><span>ALWAYS IN MOTION.</span></p>
        <button
          type="button"
          className="preloader-enter-button"
          onClick={enterPortfolio}
          disabled={!ready || exiting}
        >
          <span>{ready ? 'ENTER PORTFOLIO' : 'INITIALIZING EXPERIENCE'}</span>
          <span className="preloader-enter-arrow" aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="preloader-bottom">
        <div className="preloader-status">
          <span>{ready ? 'EXPERIENCE READY' : 'PREPARING EXPERIENCE'}</span>
          <span>{String(progress).padStart(3, '0')}%</span>
        </div>
        <div className="portfolio-preloader-track"><span style={{ width: progress + '%' }} /></div>
        <div className="preloader-bottom-meta"><span>BEZALEEL PAUL N</span><span>BENGALURU · INDIA</span><span>2026 — PRESENT</span></div>
      </div>
    </div>
  );
}
