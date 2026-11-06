'use client';

import Link from 'next/link';

const links = [
  { label: 'Profile', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
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
        <Link href="/resume/" className="resume-button">
          Résumé <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
