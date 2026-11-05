'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Work', href: '/#projects' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      frame = 0;
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="absolute left-4 top-3 -translate-y-20 rounded-full bg-ink px-4 py-2 text-xs font-bold text-paper focus:translate-y-0"
      >
        Skip to content
      </a>

      <div className="section-shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2.5" aria-label="Bezaleel Paul, home">
          <span className="font-display text-[1.65rem] leading-none tracking-tight text-ink">
            Bezaleel Paul
          </span>
          <span className="hidden font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-ink/45 sm:inline">
            / software engineer
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-link font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/60 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-ink-soft"
          >
            Résumé
            <ArrowUpRight className="h-3.5 w-3.5 text-signal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink md:hidden"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        ref={progressRef}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink/70"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />

      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="mobile-nav-enter max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-ink/10 bg-paper px-5 pb-7 pt-5 md:hidden"
        >
          <div className="flex flex-col">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-baseline justify-between border-b border-ink/10 py-4 font-display text-3xl tracking-tight text-ink"
              >
                <span>{link.label}</span>
                <span className="font-mono text-[9px] tracking-[0.16em] text-ink/40">
                  0{index + 1}
                </span>
              </a>
            ))}
          </div>
          <Link
            href="/resume"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 flex items-center justify-between rounded-full bg-ink px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-paper"
          >
            <span>View résumé</span>
            <ArrowUpRight className="h-4 w-4 text-signal" />
          </Link>
        </nav>
      )}
    </header>
  );
};
