'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowDown, FileText, Send, Sparkles, MapPin, Orbit, Radio } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';
import { PilotProfile, GitHubAnalyticsData } from '@/types/portfolio';
import { NasaDiscoveriesModal } from '../hud/NasaDiscoveriesModal';
import { fetchNasaDiscoveries, NasaLiveTelemetry } from '@/lib/nasaApi';

// Dynamic import of 3D Hero Horizon with SSR disabled for optimal bundle splitting
const HeroCelestialHorizon = dynamic(
  () => import('../canvas/HeroCelestialHorizon').then((mod) => mod.HeroCelestialHorizon),
  { ssr: false }
);

interface HeroSectionProps {
  profile: PilotProfile;
  stats: GitHubAnalyticsData['stats'];
  cp: GitHubAnalyticsData['cp'];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, stats, cp }) => {
  const [typedIndex, setTypedIndex] = useState(0);
  const [isNasaModalOpen, setIsNasaModalOpen] = useState(false);
  const [nasaTelemetry, setNasaTelemetry] = useState<NasaLiveTelemetry | null>(null);

  useEffect(() => {
    fetchNasaDiscoveries().then((data) => setNasaTelemetry(data)).catch(() => {});
  }, []);

  const typingSnippets = [
    'Flutter & Cross-Platform Mobile Applications',
    'AI-Driven Digital Twins & Predictive Machine Learning',
    'Full-Stack Web Systems & High-Throughput Utilities',
    'Double Degree: CMR University & IIT Madras BS Data Science'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTypedIndex((prev) => (prev + 1) % typingSnippets.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [typingSnippets.length]);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Celestial Horizon Visual Layer */}
      <HeroCelestialHorizon />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Availability & Location Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-space-900/90 border border-cyan-500/30 text-xs font-mono backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.15)] animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            {profile.status}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-hud-cyan" /> {profile.location}
          </span>
        </div>

        {/* Main Editorial Headline */}
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white leading-none">
            BEZALEEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-hud-cyan via-sky-300 to-indigo-400">PAUL</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl font-mono text-cyan-300 font-medium tracking-wide">
            Software Developer <span className="text-slate-500">/</span> Flutter <span className="text-slate-500">/</span> Full-Stack <span className="text-slate-500">/</span> AI/ML
          </p>

          <div className="h-8 flex items-center justify-center">
            <p className="text-xs sm:text-sm font-mono text-slate-400 flex items-center gap-2 transition-all duration-300">
              <Sparkles className="w-3.5 h-3.5 text-hud-amber" />
              <span>{typingSnippets[typedIndex]}</span>
            </p>
          </div>
        </div>

        {/* Concise Recruiter Context in 10-20 seconds */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
          Computer Science undergrad at <strong className="text-white">CMR University</strong> and Data Science scholar at <strong className="text-white">IIT Madras</strong>. Architecting production software with modern algorithms, clean engineering principles, and thoughtful design.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/observatory"
            onClick={() => spaceAudio.playTelemetryBeep(1200)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-hud-cyan to-blue-500 text-space-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(0,243,255,0.5)] hover:shadow-[0_0_40px_rgba(0,243,255,0.8)] transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan group"
          >
            <Orbit className="w-4 h-4 animate-spin text-space-950" style={{ animationDuration: '8s' }} />
            <span>Launch 3D Cosmos</span>
          </Link>

          <a
            href="#projects"
            onClick={() => spaceAudio.playTelemetryBeep(1000)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-space-900/90 border border-slate-700 hover:border-hud-cyan text-white font-mono font-bold text-xs uppercase tracking-wider backdrop-blur-md hover:bg-space-850 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <span>Explore My Work</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-hud-cyan" />
          </a>

          <a
            href="/resume.pdf"
            download
            onClick={() => spaceAudio.playTelemetryBeep(1150)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-space-900/90 border border-slate-700 hover:border-hud-cyan text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md hover:bg-space-850 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <FileText className="w-4 h-4 text-hud-cyan" />
            <span>Download Resume</span>
          </a>

          <a
            href="#contact"
            onClick={() => spaceAudio.playTelemetryBeep(850)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-space-900/90 border border-slate-700 hover:border-hud-cyan text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md hover:bg-space-850 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <Send className="w-4 h-4 text-slate-400" />
            <span>Contact Me</span>
          </a>
        </div>

        {/* Live NASA Deep Space Telemetry Ticker Pill */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              spaceAudio.playTelemetryBeep(1100);
              setIsNasaModalOpen(true);
            }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-space-900/80 border border-cyan-500/40 hover:border-hud-cyan text-xs font-mono text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-[0_0_15px_rgba(0,243,255,0.15)] group"
          >
            <Radio className="w-3.5 h-3.5 text-hud-cyan animate-pulse" />
            <span className="text-[11px] font-bold text-hud-cyan uppercase tracking-wider">
              NASA LIVE TELEMETRY:
            </span>
            <span className="text-slate-300 truncate max-w-[280px] sm:max-w-md text-left">
              {nasaTelemetry ? nasaTelemetry.apod.title : 'Interrogating NASA Deep Space Network...'}
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 hidden sm:inline">
              [ INSPECT DISCOVERIES ]
            </span>
          </button>
        </div>

        {/* Quick Verified Recruiter Metrics Bar */}
        <div className="pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-space-900/60 border border-slate-800/60 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-white">{stats.repos}</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Public Repos</span>
          </div>

          <div className="p-3 rounded-lg bg-space-900/60 border border-slate-800/60 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-hud-cyan">{cp.leetcode.solved}+</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">LeetCode Solved</span>
          </div>

          <div className="p-3 rounded-lg bg-space-900/60 border border-slate-800/60 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-hud-violet">{cp.codeforces.rating}</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Codeforces Rating</span>
          </div>

          <div className="p-3 rounded-lg bg-space-900/60 border border-slate-800/60 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-emerald-400">{stats.streak}d</span>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Streak</span>
          </div>
        </div>
      </div>

      {/* NASA Live Discoveries Modal */}
      <NasaDiscoveriesModal
        isOpen={isNasaModalOpen}
        onClose={() => setIsNasaModalOpen(false)}
      />
    </section>
  );
};
