'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Volume2, VolumeX, Menu, X, Lock, Box } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const nextMuted = spaceAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      spaceAudio.playTelemetryBeep(880);
    }
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Voxel Cosmos', href: '#voxel-cosmos', highlight: true },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'GitHub', href: '#github' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-space-950/85 backdrop-blur-md border-b border-cyan-500/20 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-hud-cyan rounded px-1"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-hud-cyan group-hover:shadow-[0_0_10px_#00f3ff] transition-shadow" />
          <span className="font-display font-extrabold tracking-wider text-base sm:text-lg text-white group-hover:text-hud-cyan transition-colors">
            BEZALEEL PAUL
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.5 rounded hidden sm:inline">
            BEZFORGE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => spaceAudio.playTelemetryBeep(960)}
              className={`text-xs font-mono uppercase tracking-widest transition-colors focus:outline-none ${
                link.highlight 
                  ? 'text-hud-cyan font-bold hover:text-cyan-300 flex items-center gap-1 bg-hud-cyan/10 px-2 py-0.5 rounded border border-hud-cyan/30'
                  : 'text-slate-300 hover:text-hud-cyan focus:text-hud-cyan'
              }`}
            >
              {link.highlight && <Box className="w-3 h-3 text-hud-cyan" />}
              <span>{link.label}</span>
            </a>
          ))}
          <Link
            href="/observatory"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/50 text-hud-cyan hover:bg-hud-cyan hover:text-space-950 text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_12px_rgba(0,243,255,0.25)] group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan animate-ping group-hover:bg-space-950" />
            <span>🪐 3D Cosmos</span>
          </Link>
        </nav>

        {/* Controls & Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Subtle Audio Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? 'Enable Audio SFX' : 'Mute Audio SFX'}
            className="p-2 rounded bg-space-900 border border-slate-800 hover:border-hud-cyan text-slate-400 hover:text-hud-cyan transition-colors focus:outline-none focus:ring-1 focus:ring-hud-cyan"
            aria-label="Toggle sound feedback"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-hud-cyan" />}
          </button>

          {/* Download Resume Button */}
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold tracking-wider rounded bg-hud-cyan text-space-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RESUME (PDF)</span>
          </a>

          {/* Admin link */}
          <Link
            href="/admin"
            title="Private Admin Command Centre"
            className="p-2 rounded bg-space-900 border border-slate-800 hover:border-slate-700 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href="/resume.pdf"
            download
            className="p-2 text-xs font-mono font-bold rounded bg-hud-cyan text-space-950"
            aria-label="Download resume"
          >
            <FileText className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-space-950/95 border-b border-cyan-500/30 px-6 py-6 space-y-4 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/observatory"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-mono font-bold text-hud-cyan py-1 bg-cyan-950/40 px-3 rounded border border-cyan-800/60"
            >
              <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
              <span>🪐 Launch 3D Cosmos Simulation</span>
            </Link>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-mono uppercase tracking-widest py-1 flex items-center gap-2 ${
                  link.highlight ? 'text-hud-cyan font-bold' : 'text-slate-200 hover:text-hud-cyan'
                }`}
              >
                {link.highlight && <Box className="w-3.5 h-3.5 text-hud-cyan" />}
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={toggleSound}
              className="flex items-center gap-2 text-xs font-mono text-slate-400"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-hud-cyan" />}
              <span>{isMuted ? 'Audio Muted' : 'Audio Active'}</span>
            </button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1 text-xs font-mono text-slate-500 hover:text-slate-300"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
