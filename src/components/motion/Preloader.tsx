'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      setHidden(true);
      window.dispatchEvent(new Event('portfolio:intro-complete'));
    };

    if (reducedMotion) {
      finish();
      return;
    }

    const timer = window.setTimeout(finish, 1050);
    return () => window.clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className="portfolio-preloader" aria-hidden="true">
      <div className="preloader-content">
        <div className="preloader-mark">BP.</div>
        <p className="preloader-caption">Initialising orbital systems</p>
        <div className="preloader-line" />
      </div>
    </div>
  );
}
