'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Orbit, Sparkles } from 'lucide-react';
import { PilotProfile, GitHubAnalyticsData } from '@/types/portfolio';
import { CelestialBodyData } from '@/types/simulation';
import { generateProceduralStarSystem, StarSystem } from '@/lib/proceduralUniverse';
import { spaceAudio } from '@/lib/audio';
import { CosmicJourneyScreen } from '@/components/interactive/CosmicJourneyScreen';
import { HeroSignalVisual } from '@/components/sections/HeroSignalVisual';
import { AnimatedWords } from '@/components/motion/AnimatedWords';

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

  // Listen for hash change (#cosmos-journey) from Navbar or URL
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
    <section className="dark-surface relative isolate flex min-h-[92svh] flex-col justify-between overflow-hidden bg-ink px-0 pb-8 pt-28 text-paper sm:min-h-screen sm:pb-10 sm:pt-32">
      {/* Lightweight signal visual on load; the full 3D system mounts only inside the user-opened journey. */}
      <HeroSignalVisual />

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

      {/* Atmospheric ambient vignette */}
      <div
        data-parallax="0.035" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(217,255,99,0.06),transparent_45%),linear-gradient(90deg,rgba(17,20,17,0.88)_0%,rgba(17,20,17,0.65)_48%,rgba(17,20,17,0.2)_100%)]"
        aria-hidden="true"
      />

      <div
        className="section-shell relative z-10 flex items-center justify-between gap-4 border-b border-paper/15 pb-5"
        data-reveal
        data-reveal-delay="20"
      >
        <span className="eyebrow flex items-center gap-2 text-paper/70">
          <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
          <span className="text-signal font-semibold">Signal Core</span> / Independent software exploration
        </span>
        <span className="eyebrow hidden text-paper/50 sm:block font-mono">
          {profile.location} · Bengaluru, India
        </span>
      </div>

      <div className="section-shell relative z-10 grid flex-1 items-center gap-12 py-14 lg:grid-cols-12 lg:py-18 pointer-events-none">
        <div className="lg:col-span-8 pointer-events-auto">
          <p className="eyebrow mb-6 text-signal" data-reveal data-reveal-delay="90">
            Second-year CS student.
          </p>
          <h1
            className="font-display max-w-5xl text-[clamp(4rem,12.5vw,10.5rem)] font-extrabold uppercase tracking-[-0.085em] text-paper leading-[0.82]"
            data-word-group
            data-gsap-reveal
            data-reveal-delay="150"
          >
            <AnimatedWords text="Bezaleel Paul." accentWords={['Paul.']} />
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/85 sm:text-xl font-normal drop-shadow-sm"
            data-reveal
            data-reveal-delay="230"
          >
            I build practical software for mobile, web, and machine learning. Currently studying
            computer science at CMR University and data science at IIT Madras.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            data-reveal
            data-reveal-delay="310"
          >
            {/* Primary 3D Journey Button */}
            <button
              type="button"
              onClick={() => {
                spaceAudio.playTelemetryBeep(1400);
                setIsJourneyActive(true);
              }}
              data-magnetic className="group inline-flex items-center gap-3 rounded-full bg-signal px-6 py-3.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink transition-all hover:bg-signal-soft hover:shadow-[0_0_30px_rgba(217,255,99,0.45)] hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4 animate-spin text-ink" />
              <span>Explore 3D Solar System</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>

            {/* Work Atlas Button */}
            <Link
              href="/atlas"
              data-magnetic className="group inline-flex items-center gap-2.5 rounded-full border border-paper/40 bg-paper/10 backdrop-blur-md px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-paper transition-all hover:border-paper hover:bg-paper hover:text-ink"
            >
              <Orbit className="h-4 w-4 text-signal" />
              <span>Open Work Atlas</span>
            </Link>

            {/* Projects Archive */}
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/80 transition-colors hover:border-paper hover:text-paper"
            >
              <span>Selected Work</span>
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>

            {/* Resume Link */}
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 px-3 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60 transition-colors hover:text-paper"
            >
              <span>Read résumé</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-4 lg:self-end pointer-events-auto" data-reveal-group data-reveal-delay="360">
          <div className="grid grid-cols-3 gap-4 border-t border-paper/20 pt-5 lg:grid-cols-1 lg:gap-0 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0 backdrop-blur-sm bg-ink/20 lg:bg-transparent rounded-xl p-3 lg:p-0">
            <div className="lg:border-b lg:border-paper/15 lg:py-4 lg:first:pt-0" data-reveal-item>
              <span className="block font-mono text-2xl font-medium text-paper" data-count={stats.repos}>{stats.repos}</span>
              <span className="eyebrow text-[9px] text-paper/50">Public repositories</span>
            </div>
            <div className="lg:border-b lg:border-paper/15 lg:py-4" data-reveal-item>
              <span className="block font-mono text-2xl font-medium text-paper" data-count={cp.leetcode.solved}>{cp.leetcode.solved}</span>
              <span className="eyebrow text-[9px] text-paper/50">LeetCode solved</span>
            </div>
            <div className="lg:py-4 lg:last:pb-0" data-reveal-item>
              <span className="block font-mono text-2xl font-medium text-paper" data-count={cp.codeforces.rating}>{cp.codeforces.rating}</span>
              <span className="eyebrow text-[9px] text-paper/50">Codeforces rating</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="section-shell relative z-10 flex flex-col gap-4 border-t border-paper/15 pt-5 sm:flex-row sm:items-center sm:justify-between pointer-events-none" data-reveal data-reveal-delay="440">
        <p className="max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-paper/50 pointer-events-auto">
          A portfolio of systems, experiments, and things still worth exploring
        </p>
        <span className="eyebrow flex items-center gap-2 text-paper/50 pointer-events-auto">
          Scroll to explore
          <ArrowDown className="h-3.5 w-3.5" />
        </span>
      </div>
    </section>
  );
};
