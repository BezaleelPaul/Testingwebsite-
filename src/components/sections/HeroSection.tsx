'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  ArrowDown, 
  FileText, 
  Send, 
  Sparkles, 
  MapPin, 
  Orbit, 
  Radio, 
  Compass, 
  Globe,
  ChevronRight,
  Zap
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';
import { PilotProfile, GitHubAnalyticsData } from '@/types/portfolio';
import { CelestialBodyData } from '@/types/simulation';
import { generateProceduralStarSystem, StarSystem } from '@/lib/proceduralUniverse';
import { CosmicJourneyScreen } from '../interactive/CosmicJourneyScreen';

// Dynamic import of 3D Hero Horizon with SSR disabled for WebGL stability
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
  const [currentSeed, setCurrentSeed] = useState<string>('sol');
  const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(null);
  const [sectorCounter, setSectorCounter] = useState<number>(1);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [isJourneyActive, setIsJourneyActive] = useState<boolean>(false);

  // Generate star system deterministically using astrophysical formulas
  const starSystem: StarSystem = useMemo(() => {
    return generateProceduralStarSystem(currentSeed);
  }, [currentSeed]);

  // Keep selected body in sync if system changes
  useEffect(() => {
    if (starSystem.bodies.length > 1) {
      const defaultTarget = starSystem.bodies.find((b) => b.id === 'earth') || starSystem.bodies[1];
      setSelectedBody(defaultTarget);
    } else {
      setSelectedBody(starSystem.bodies[0]);
    }
  }, [starSystem]);

  // Listen for hash change (#cosmos-journey) from Navbar
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#cosmos-journey') {
        setIsJourneyActive(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleWarp = (newSeed: string) => {
    setIsWarping(true);
    spaceAudio.playTelemetryBeep(1400);
    setCurrentSeed(newSeed);
    setTimeout(() => {
      setIsWarping(false);
    }, 600);
  };

  const handleRandomSystem = () => {
    const randomSeeds = [
      'kepler_452b',
      'proxima_prime',
      'andromeda_spire',
      'gliese_667c',
      'quantum_singularity',
      'pulsar_sector_9',
      'minecraft_seed_104',
      'interstellar_frontier',
      'cygnus_x1',
      'orion_nebula_core',
    ];
    const picked = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + '_' + Math.floor(Math.random() * 900 + 100);
    handleWarp(picked);
  };

  const handleNextSector = () => {
    const nextIdx = sectorCounter + 1;
    setSectorCounter(nextIdx);
    handleWarp(`sector_${nextIdx}_deepspace`);
  };

  const handlePrevSector = () => {
    const prevIdx = Math.max(1, sectorCounter - 1);
    setSectorCounter(prevIdx);
    if (prevIdx === 1) {
      handleWarp('sol');
    } else {
      handleWarp(`sector_${prevIdx}_deepspace`);
    }
  };

  return (
    <section id="cosmos" className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 3D Celestial Solar System Canvas (Non-blocking background with realistic physics & textures) */}
      <HeroCelestialHorizon
        system={starSystem}
        selectedBodyId={selectedBody?.id}
        onSelectBody={(body) => setSelectedBody(body)}
        isWarping={isWarping}
        isFullJourney={false}
      />

      {/* Full-Screen Interactive Cosmic Journey Screen Modal */}
      <CosmicJourneyScreen
        isOpen={isJourneyActive}
        onClose={() => {
          setIsJourneyActive(false);
          if (window.location.hash === '#cosmos-journey') {
            window.history.replaceState(null, '', ' ');
          }
        }}
        system={starSystem}
        currentSeed={currentSeed}
        onWarp={handleWarp}
        onNextSector={handleNextSector}
        onPrevSector={handlePrevSector}
        onRandomSystem={handleRandomSystem}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        isWarping={isWarping}
      />

      {/* Main Portfolio Content Card with High-Contrast Solid Editorial Design */}
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
                🎓 CMR University (B.Tech CSE '25–'29)
              </span>
              <span className="px-3 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-mono font-medium">
                🎓 IIT Madras (BS Data Science '26–Present)
              </span>
              <span className="px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium">
                ⚡ IEEE Webmaster & EXCOM ('25–'26)
              </span>
            </div>
          </div>

          {/* Professional Summary (High-contrast, crystal clear readability) */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
            Crafting high-throughput mobile, desktop, and machine learning systems with architectural elegance, clean design, and algorithmic rigor. <strong className="text-white font-semibold">270+ LeetCode problems solved</strong> with active competitive engineering experience.
          </p>

          {/* Action Buttons: Clean & Prominent with Start Journey CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Primary Journey CTA */}
            <button
              onClick={() => {
                spaceAudio.playTelemetryBeep(1400);
                setIsJourneyActive(true);
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-mono font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-cyan-300"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
              <span>Start Cosmic Journey 🚀</span>
            </button>

            {/* View Resume Button */}
            <Link
              href="/resume"
              onClick={() => spaceAudio.playTelemetryBeep(1150)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Resume</span>
            </Link>

            {/* Explore Projects Button */}
            <a
              href="#projects"
              onClick={() => spaceAudio.playTelemetryBeep(1000)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-mono font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-4 h-4 text-cyan-400" />
            </a>

            {/* Contact Button */}
            <a
              href="#contact"
              onClick={() => spaceAudio.playTelemetryBeep(850)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 hover:text-white font-mono font-bold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Contact</span>
            </a>
          </div>

          {/* Verified Engineering Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
            <div className="bg-[#070b14] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono text-slate-400 block mb-1">PUBLIC REPOS</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{stats.repos}</span>
            </div>
            <div className="bg-[#070b14] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono text-slate-400 block mb-1">LEETCODE</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{cp.leetcode.solved}+</span>
            </div>
            <div className="bg-[#070b14] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono text-slate-400 block mb-1">CODEFORCES</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{cp.codeforces.rating}</span>
            </div>
            <div className="bg-[#070b14] border border-slate-800 p-3.5 rounded-xl">
              <span className="text-xs font-mono text-slate-400 block mb-1">ACTIVE STREAK</span>
              <span className="text-2xl font-bold font-mono text-sky-400">{stats.streak} Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="relative z-10 flex justify-center pt-8">
        <a
          href="#about"
          className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors font-mono text-xs tracking-widest uppercase"
        >
          <span>Scroll to Explore Orbit</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </a>
      </div>
    </section>
  );
};
