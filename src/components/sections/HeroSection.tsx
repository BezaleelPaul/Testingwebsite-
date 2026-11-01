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
  Eye, 
  X 
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';
import { PilotProfile, GitHubAnalyticsData } from '@/types/portfolio';
import { NasaDiscoveriesModal } from '../hud/NasaDiscoveriesModal';
import { TelemetryPanel } from '../hud/TelemetryPanel';
import { fetchNasaDiscoveries, NasaLiveTelemetry } from '@/lib/nasaApi';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { CelestialBodyData } from '@/types/simulation';

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
  const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(null);

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
    <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Celestial Solar System Canvas */}
      <HeroCelestialHorizon
        selectedBodyId={selectedBody?.id}
        onSelectBody={(body) => {
          setSelectedBody(body);
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
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
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
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
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Link
            href="/observatory/"
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

        {/* 3D Celestial Targets Quick Selector */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            3D FOCUS:
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
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-hud-cyan text-space-950 font-bold shadow-[0_0_12px_#00f3ff]'
                    : 'bg-space-900/80 text-gray-300 border border-slate-800 hover:border-hud-cyan/60 hover:text-hud-cyan'
                }`}
              >
                {target.label}
              </button>
            );
          })}
          {selectedBody && (
            <button
              onClick={() => setSelectedBody(null)}
              className="px-2 py-1 text-[10px] font-mono text-gray-400 hover:text-white rounded bg-space-900 border border-slate-700"
            >
              [✕ Reset]
            </button>
          )}
        </div>

        {/* Live NASA Deep Space Telemetry Ticker & Discoveries Preview Card */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => {
              spaceAudio.playTelemetryBeep(1100);
              setIsNasaModalOpen(true);
            }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-space-900/90 border border-cyan-500/50 hover:border-hud-cyan text-xs font-mono text-slate-300 hover:text-white backdrop-blur-md transition-all shadow-[0_0_20px_rgba(0,243,255,0.25)] group hover:scale-[1.02]"
          >
            <Radio className="w-3.5 h-3.5 text-hud-cyan animate-pulse" />
            <span className="text-[11px] font-bold text-hud-cyan uppercase tracking-wider">
              NASA LIVE TELEMETRY:
            </span>
            <span className="text-white font-medium truncate max-w-[280px] sm:max-w-md text-left">
              {nasaTelemetry ? nasaTelemetry.apod.title : 'Interrogating NASA Deep Space Network...'}
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              [ {nasaTelemetry?.asteroids.length || 3} ASTEROIDS TRACKED TODAY ]
            </span>
          </button>

          {/* NASA Discovery & ISS Live Orbit Double Banner */}
          {nasaTelemetry && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl text-left">
              {/* Card 1: NASA APOD Daily Discovery */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-space-950/85 border border-cyan-500/30 backdrop-blur-md shadow-xl hover:border-hud-cyan/50 transition-colors">
                <img
                  src={nasaTelemetry.apod.url}
                  alt={nasaTelemetry.apod.title}
                  className="w-16 h-16 rounded-lg object-cover border border-cyan-500/40 shrink-0"
                />
                <div className="space-y-1 text-xs font-mono min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-hud-cyan font-bold bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                      NASA APOD // {nasaTelemetry.apod.date}
                    </span>
                    <span className="text-[10px] text-emerald-400">● LIVE</span>
                  </div>
                  <h4 className="text-white font-bold truncate">
                    {nasaTelemetry.apod.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {nasaTelemetry.apod.explanation}
                  </p>
                </div>
                <button
                  onClick={() => {
                    spaceAudio.playTelemetryBeep(1200);
                    setIsNasaModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono text-hud-cyan hover:bg-hud-cyan hover:text-space-950 rounded border border-cyan-800 shrink-0 transition-colors"
                >
                  VIEW
                </button>
              </div>

              {/* Card 2: ISS Space Station Real-Time Telemetry */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-space-950/85 border border-blue-500/30 backdrop-blur-md shadow-xl hover:border-hud-cyan/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-600/50 flex items-center justify-center text-lg shrink-0">
                    🛰️
                  </div>
                  <div className="space-y-0.5 text-xs font-mono min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-cyan-300">ISS LIVE GPS TRACK</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="text-[11px] text-slate-300">
                      ALT: <strong className="text-hud-amber">{nasaTelemetry.iss.altitudeKm.toFixed(0)} km</strong> · SPD: <strong className="text-hud-cyan">{nasaTelemetry.iss.velocityKmh.toLocaleString()} km/h</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      POS: {nasaTelemetry.iss.latitude.toFixed(2)}°, {nasaTelemetry.iss.longitude.toFixed(2)}° ({nasaTelemetry.iss.visibility})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    spaceAudio.playTelemetryBeep(1200);
                    const issBody = CELESTIAL_BODIES.find((b) => b.id === 'iss');
                    if (issBody) setSelectedBody(issBody);
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono text-hud-cyan hover:bg-hud-cyan hover:text-space-950 rounded border border-cyan-800 shrink-0 transition-colors"
                >
                  SPECS
                </button>
              </div>
            </div>
          )}
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
