'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { CelestialBodyData, SpacecraftState } from '@/types/simulation';
import { NavigationHUD } from '@/components/hud/NavigationHUD';
import { TelemetryPanel } from '@/components/hud/TelemetryPanel';
import { FlightControls } from '@/components/hud/FlightControls';
import { MissionLogModal } from '@/components/hud/MissionLogModal';
import { spaceAudio } from '@/lib/audio';

// Dynamically import SpaceCanvas with SSR disabled for Three.js WebGL compatibility
const SpaceCanvas = dynamic(
  () => import('@/components/canvas/SpaceCanvas').then((mod) => mod.SpaceCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#02040a] font-mono text-hud-cyan">
        <div className="w-12 h-12 border-2 border-hud-cyan border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_#00f3ff]" />
        <p className="tracking-widest text-sm animate-pulse">[ INITIALIZING ORBITAL SIMULATION ENGINE ]</p>
        <p className="text-xs text-gray-500 mt-2">CALCULATING KEPLERIAN TRAJECTORIES & HORIZONS DATA...</p>
      </div>
    ),
  }
);

export default function SpaceSimulationApp() {
  const [elapsedDays, setElapsedDays] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(
    CELESTIAL_BODIES.find((b) => b.id === 'earth') || CELESTIAL_BODIES[0]
  );
  const [cameraMode, setCameraMode] = useState<'free' | 'orbit' | 'flight' | 'cockpit'>('orbit');
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [spacecraftState, setSpacecraftState] = useState<SpacecraftState>({
    position: [0, 2, 28],
    velocity: [0, 0, 0],
    rotation: [0, 0, 0],
    throttle: 0,
    isBoosting: false,
    speedKms: 0,
    fuelPercent: 100,
    targetId: null,
    mode: 'orbit',
  });

  // Orbital simulation time progression loop
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (timeScale > 0) {
        // Base rate: 1 second of real time = 0.5 simulated days at 1x
        setElapsedDays((prev) => prev + dt * 0.5 * timeScale);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [timeScale]);

  // Audio start on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      spaceAudio.startAmbience();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleSelectBody = useCallback((body: CelestialBodyData) => {
    setSelectedBody(body);
    setCameraMode('orbit');
  }, []);

  const handleToggleSound = useCallback(() => {
    const muted = spaceAudio.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleSpacecraftUpdate = useCallback((state: SpacecraftState) => {
    setSpacecraftState(state);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#02040a]">
      {/* 3D WebGL Space Canvas */}
      <SpaceCanvas
        elapsedDays={elapsedDays}
        selectedBody={selectedBody}
        onSelectBody={handleSelectBody}
        cameraMode={cameraMode}
        onSpacecraftUpdate={handleSpacecraftUpdate}
        spacecraftState={spacecraftState}
      />

      {/* Top Telemetry & Control Navigation Bar */}
      <NavigationHUD
        elapsedDays={elapsedDays}
        timeScale={timeScale}
        onSetTimeScale={setTimeScale}
        selectedBody={selectedBody}
        onSelectBody={handleSelectBody}
        cameraMode={cameraMode}
        onSetCameraMode={setCameraMode}
        onOpenDossier={() => setIsDossierOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Real NASA / JPL Horizons Telemetry Data Panel */}
      <TelemetryPanel
        body={selectedBody}
        onClose={() => setSelectedBody(null)}
      />

      {/* Spacecraft Flight Telemetry & Controls */}
      <FlightControls
        state={spacecraftState}
        cameraMode={cameraMode}
        onSetCameraMode={setCameraMode}
      />

      {/* Commander Dossier / Missions Portfolio Modal */}
      <MissionLogModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Subtle Retro-Futuristic CRT Scanline Overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none opacity-40 z-10" />
    </main>
  );
}
