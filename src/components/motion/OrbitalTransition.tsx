'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A quiet orbital signal between major chapters. It is decorative only:
 * content order, keyboard navigation, and reading flow remain unchanged.
 */
export function OrbitalTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.55, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`orbital-transition${active ? ' is-active' : ''}`}
      aria-hidden="true"
    >
      <span className="orbital-transition-line" />
      <span className="orbital-transition-signal" />
      <span className="orbital-transition-signal orbital-transition-signal-two" />
    </div>
  );
}
