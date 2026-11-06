'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { label: 'Profile', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="site-shell nav-inner">
        <Link href="/" className="nav-brand" aria-label="Bezaleel Paul home">
          BP<span className="accent">.</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">{link.label}</a>
          ))}
        </nav>
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <Link href="/resume/" className="resume-button">
          Résumé <span aria-hidden="true">↗</span>
        </Link>
        <nav
          id="mobile-navigation"
          className={`mobile-nav-panel${menuOpen ? ' is-open' : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}<span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
