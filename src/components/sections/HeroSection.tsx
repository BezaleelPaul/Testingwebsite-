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
  Globe,
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
      {/* 3D Celestial Solar System Canvas (Non-blocking background with soft cinematic depth) */}
      <HeroCelestialHorizon
        selectedBodyId={selectedBody?.id}
        onSelectBody={(body) => {
          setSelectedBody(body);
        }}
      />

      {/* Main Content Container with High-Contrast Solid Editorial Card */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto">
        <div className="bg-[#0b0f19]/95 border-2 border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.95)] backdrop-blur-xl text-center space-y-6">
          {/* Availability & Location Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-xs font-mono shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
              {profile.status}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200 flex items-center gap-1.5 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {profile.location}
            </span>
          </div>

          {/* Editorial Title & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-none">
              BEZALEEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">PAUL</span>
            </h1>

            <p className="text-xl sm:text-2xl font-mono text-cyan-300 font-bold tracking-wide">
              Software Developer <span className="text-slate-500">·</span> Flutter <span className="text-slate-500">·</span> Full-Stack <span className="text-slate-500">·</span> AI/ML
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-mono font-medium">
                🎓 CMR University (B.Tech CSE)
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-mono font-medium">
                🎓 IIT Madras (BS Data Science)
              </span>
              <span className="px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium">
                ⚡ IEEE Webmaster & EXCOM
              </span>
            </div>
          </div>

          {/* Professional Summary (100% readable with high contrast) */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            Crafting high-throughput mobile, desktop, and machine learning systems with architectural elegance, clean design, and algorithmic rigor. <strong className="text-white font-semibold">270+ LeetCode problems solved</strong> with active competitive engineering experience.
          </p>

          {/* Action Buttons - Large, High-Contrast, Minimalist */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/resume.pdf"
              download
              onClick={() => spaceAudio.playTelemetryBeep(1150)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-cyan-300"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>Download Resume</span>
            </a>

            <a
              href="#projects"
              onClick={() => spaceAudio.playTelemetryBeep(1000)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-4 h-4 text-cyan-400" />
            </a>

            <a
              href="#procedural-planets"
              onClick={() => spaceAudio.playTelemetryBeep(1050)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-white font-mono font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Procedural Exoplanets</span>
            </a>

            <a
              href="#contact"
              onClick={() => spaceAudio.playTelemetryBeep(850)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-mono font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4 text-slate-400" />
              <span>Contact</span>
            </a>
          </div>

          {/* 3D Celestial Targets Quick Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Explore 3D Background:
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
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-cyan-400 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  {target.label}
                </button>
              );
            })}
            {selectedBody && (
              <button
                onClick={() => setSelectedBody(null)}
                className="px-2.5 py-1.5 text-xs font-mono text-rose-300 hover:text-rose-100 rounded bg-rose-950/60 border border-rose-800/60"
              >
                Reset Focus
              </button>
            )}
          </div>
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

        {/* Quick Verified Metrics Bar with Solid High-Contrast Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-md">
            <span className="block text-3xl font-extrabold font-display text-white">{stats.repos}+</span>
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">Public Repos</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-md">
            <span className="block text-3xl font-extrabold font-display text-cyan-400">{cp.leetcode.solved}+</span>
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">LeetCode Solved</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-md">
            <span className="block text-3xl font-extrabold font-display text-indigo-300">{cp.codeforces.rating}</span>
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">Codeforces Rating</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-md">
            <span className="block text-3xl font-extrabold font-display text-emerald-400">{stats.streak} Days</span>
            <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">Active Streak</span>
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
