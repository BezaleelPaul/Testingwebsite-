'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  ArrowDown, 
  FileText, 
  Send, 
  Sparkles, 
  MapPin, 
  Orbit, 
  Radio, 
  Satellite, 
  Compass, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';
import { PilotProfile, GitHubAnalyticsData } from '@/types/portfolio';
import { NasaDiscoveriesModal } from '../hud/NasaDiscoveriesModal';
import { TelemetryPanel } from '../hud/TelemetryPanel';
import { fetchNasaDiscoveries, NasaLiveTelemetry } from '@/lib/nasaApi';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { CelestialBodyData } from '@/types/simulation';

// Dynamic import of 3D Hero Horizon with SSR disabled for optimal client-side WebGL rendering
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
  const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(null);

  useEffect(() => {
    fetchNasaDiscoveries().then((data) => setNasaTelemetry(data)).catch(() => {});
  }, []);

  const typingSnippets = [
    'Flutter & Cross-Platform Desktop/Mobile Architectures',
    'AI-Driven Digital Twins & Predictive ML Modeling',
    'Full-Stack Systems & High-Throughput Utilities',
    'Double Degree: CMR University B.Tech CSE & IIT Madras BS Data Science'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTypedIndex((prev) => (prev + 1) % typingSnippets.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [typingSnippets.length]);

  const quickTargets = [
    { id: 'sun', label: '☀️ Sol' },
    { id: 'earth', label: '🌍 Earth' },
    { id: 'iss', label: '🛰️ ISS Live' },
    { id: 'jwst', label: '🔭 JWST' },
    { id: 'mars', label: '🔴 Mars' },
    { id: 'saturn', label: '🪐 Saturn' },
    { id: 'voyager1', label: '🛸 Voyager 1' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Celestial Solar System Canvas (Non-blocking background) */}
      <HeroCelestialHorizon
        selectedBodyId={selectedBody?.id}
        onSelectBody={(body) => {
          setSelectedBody(body);
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-6 my-auto">
        {/* Availability & Location Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-space-900/90 border border-cyan-500/30 text-xs font-mono backdrop-blur-md shadow-[0_0_20px_rgba(0,243,255,0.15)] animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">
            {profile.status}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-hud-cyan" /> {profile.location}
          </span>
        </div>

        {/* Editorial Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
            BEZALEEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-hud-cyan via-sky-300 to-indigo-400">PAUL</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl font-mono text-cyan-300 font-semibold tracking-wide">
            Software Developer <span className="text-slate-500">/</span> Flutter <span className="text-slate-500">/</span> Full-Stack <span className="text-slate-500">/</span> AI/ML
          </p>

          <div className="h-7 flex items-center justify-center">
            <p className="text-xs sm:text-sm font-mono text-slate-400 flex items-center gap-2 transition-all duration-300">
              <Sparkles className="w-3.5 h-3.5 text-hud-amber" />
              <span>{typingSnippets[typedIndex]}</span>
            </p>
          </div>
        </div>

        {/* Professional Summary (Understood in 10-20 seconds) */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
          Computer Science scholar at <strong className="text-white">CMR University</strong> and Data Science scholar at <strong className="text-white">IIT Madras</strong>. Executive Committee member & Webmaster for IEEE. Crafting production-grade software with mathematical rigor, clean architecture, and aesthetic restraint.
        </p>

        {/* Action Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/observatory/"
            onClick={() => spaceAudio.playTelemetryBeep(1200)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-hud-cyan to-blue-500 text-space-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.7)] transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan group"
          >
            <Orbit className="w-4 h-4 animate-spin text-space-950" style={{ animationDuration: '8s' }} />
            <span>Launch 3D Cosmos</span>
          </Link>

          <a
            href="/resume.pdf"
            download
            onClick={() => spaceAudio.playTelemetryBeep(1150)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-space-900/90 border border-slate-700 hover:border-hud-cyan text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md hover:bg-space-850 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <FileText className="w-4 h-4 text-hud-cyan" />
            <span>Download Resume</span>
          </a>

          <a
            href="#projects"
            onClick={() => spaceAudio.playTelemetryBeep(1000)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-space-900/90 border border-slate-700 hover:border-hud-cyan text-slate-300 hover:text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md hover:bg-space-850 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <span>Discoveries</span>
            <ArrowDown className="w-4 h-4 text-hud-cyan" />
          </a>

          <a
            href="#voxel-cosmos"
            onClick={() => spaceAudio.playTelemetryBeep(1050)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 hover:border-hud-cyan text-hud-cyan hover:text-cyan-200 font-mono text-xs uppercase tracking-wider backdrop-blur-md hover:bg-cyan-950/90 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <Layers className="w-4 h-4 text-hud-cyan" />
            <span>Voxel Worlds</span>
          </a>

          <a
            href="#contact"
            onClick={() => spaceAudio.playTelemetryBeep(850)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-space-900/90 border border-slate-700 hover:border-hud-cyan text-slate-400 hover:text-white font-mono text-xs uppercase tracking-wider backdrop-blur-md hover:bg-space-850 transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-hud-cyan"
          >
            <Send className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact</span>
          </a>
        </div>

        {/* 3D Celestial Targets Quick Selector */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mr-1 hidden sm:inline">
            3D ORBIT FOCUS:
          </span>
          {quickTargets.map((target) => {
            const body = CELESTIAL_BODIES.find((b) => b.id === target.id);
            const isCurrent = selectedBody?.id === target.id;
            return (
              <button
                key={target.id}
                onClick={() => {
                  spaceAudio.playTelemetryBeep(1050);
                  if (body) {
                    setSelectedBody(isCurrent ? null : body);
                  }
                }}
                className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-hud-cyan text-space-950 font-bold shadow-[0_0_15px_#00f3ff]'
                    : 'bg-space-900/80 text-gray-300 border border-slate-800 hover:border-hud-cyan/60 hover:text-hud-cyan backdrop-blur-sm'
                }`}
              >
                {target.label}
              </button>
            );
          })}
          {selectedBody && (
            <button
              onClick={() => setSelectedBody(null)}
              className="px-2 py-1 text-xs font-mono text-slate-400 hover:text-white rounded bg-space-900 border border-slate-700"
            >
              [✕ Reset]
            </button>
          )}
        </div>
      </div>

      {/* Bottom Bar: Live NASA Deep Space & Telemetry Strip */}
      <div className="relative z-10 max-w-5xl mx-auto w-full pt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-space-900/80 border border-slate-800/80 backdrop-blur-md text-xs font-mono">
          {/* Left: NASA Discovery */}
          <button
            onClick={() => {
              spaceAudio.playTelemetryBeep(1100);
              setIsNasaModalOpen(true);
            }}
            className="flex items-center gap-2.5 text-slate-300 hover:text-white transition-colors group text-left min-w-0"
          >
            <Radio className="w-4 h-4 text-hud-cyan animate-pulse shrink-0" />
            <span className="text-[11px] font-bold text-hud-cyan uppercase tracking-wider shrink-0">
              NASA LIVE:
            </span>
            <span className="truncate max-w-[260px] sm:max-w-md text-white font-medium">
              {nasaTelemetry ? nasaTelemetry.apod.title : 'Interrogating NASA Deep Space Network...'}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-hud-cyan shrink-0" />
          </button>

          {/* Right: ISS Real-Time Stats */}
          <div className="flex items-center gap-3 shrink-0">
            {nasaTelemetry && (
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Satellite className="w-3.5 h-3.5 text-hud-cyan" />
                <span>ISS ALT: <strong className="text-hud-amber">{nasaTelemetry.iss.altitudeKm.toFixed(0)} km</strong></span>
                <span className="text-slate-600">·</span>
                <span>SPD: <strong className="text-hud-cyan">{nasaTelemetry.iss.velocityKmh.toLocaleString()} km/h</strong></span>
              </div>
            )}
            <button
              onClick={() => {
                spaceAudio.playTelemetryBeep(1100);
                setIsNasaModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-md bg-hud-cyan/10 border border-hud-cyan/30 text-hud-cyan hover:bg-hud-cyan hover:text-space-950 text-[10px] uppercase font-bold transition-all"
            >
              Open Radar HUD
            </button>
          </div>
        </div>

        {/* Quick Verified Metrics Bar */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-space-950/70 border border-slate-850 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-white">{stats.repos}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Public Repos</span>
          </div>

          <div className="p-3 rounded-xl bg-space-950/70 border border-slate-850 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-hud-cyan">{cp.leetcode.solved}+</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LeetCode Solved</span>
          </div>

          <div className="p-3 rounded-xl bg-space-950/70 border border-slate-850 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-hud-violet">{cp.codeforces.rating}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Codeforces Rating</span>
          </div>

          <div className="p-3 rounded-xl bg-space-950/70 border border-slate-850 backdrop-blur-sm">
            <span className="block text-2xl font-bold font-display text-emerald-400">{stats.streak}d</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Streak</span>
          </div>
        </div>
      </div>

      {/* Interactive JPL Horizons Telemetry Side Panel (shown on planet click) */}
      <TelemetryPanel
        body={selectedBody}
        onClose={() => setSelectedBody(null)}
      />

      {/* NASA Live Discoveries Modal */}
      <NasaDiscoveriesModal
        isOpen={isNasaModalOpen}
        onClose={() => setIsNasaModalOpen(false)}
      />
    </section>
  );
};
