'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { GenerativeProceduralPlanet } from '@/components/canvas/GenerativeProceduralPlanet';
import { 
  Globe, 
  Sparkles, 
  Shuffle, 
  Compass, 
  Layers, 
  Sliders, 
  ZoomIn,
  ZoomOut,
  Orbit,
  Flame,
  Droplets,
  Wind
} from 'lucide-react';

interface RepoPreset {
  name: string;
  seed: string;
  palette: 'terrestrial' | 'volcanic' | 'ocean' | 'gas_giant' | 'glacius';
  description: string;
  icon: string;
}

const REPO_PRESETS: RepoPreset[] = [
  {
    name: 'file_organizer_flutter',
    seed: 'file_organizer_flutter_v2',
    palette: 'terrestrial',
    description: 'Class-M temperate garden world with azure oceans, rich continents, and polar ice caps',
    icon: '🌍',
  },
  {
    name: 'bnmit-nadicare-health',
    seed: 'bnmit_nadicare_biomed_heart',
    palette: 'ocean',
    description: 'Bioluminescent ocean world with deep saltwater abysses and glowing coral archipelagos',
    icon: '🌊',
  },
  {
    name: 'BESCOM-Calculator',
    seed: 'BESCOM_energy_grid_matrix_2026',
    palette: 'volcanic',
    description: 'High-energy volcanic world with incandescent magma fissures and pyroclastic plains',
    icon: '🌋',
  },
  {
    name: 'NASA-Space-Flight',
    seed: 'NASA_JPL_Horizons_DeepSpace',
    palette: 'gas_giant',
    description: 'Jovian banded gas giant with atmospheric jet streams and majestic translucent rings',
    icon: '🪐',
  },
  {
    name: 'IIT-Madras-Quantum',
    seed: 'IITM_DualDegree_DataScience_BS',
    palette: 'glacius',
    description: 'Sub-zero permafrost citadel world formed by methane glaciers and sapphire ice',
    icon: '❄️',
  },
];

export function GenerativeCosmosSection() {
  const [seed, setSeed] = useState<string>('file_organizer_flutter_v2');
  const [inputVal, setInputVal] = useState<string>('file_organizer_flutter_v2');
  const [roughness, setRoughness] = useState<number>(1.0);
  const [radius, setRadius] = useState<number>(4.2);
  const [palette, setPalette] = useState<string>('auto');
  const [showRings, setShowRings] = useState<boolean>(true);
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(false);

  const handleRandomize = () => {
    const randomSeeds = [
      'Kepler_452b_Prime',
      'Quantum_Singularity_X9',
      'Flutter_Dart_Engine',
      'IEEE_Global_Network',
      'Bengaluru_Silicon_Frontier',
      'Trappist_1e_Exoplanet',
      'Andromeda_Spire_Odyssey',
    ];
    const picked = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + '_' + Math.floor(Math.random() * 9999);
    setSeed(picked);
    setInputVal(picked);
    setPalette('auto');
  };

  const handleApplyPreset = (preset: RepoPreset) => {
    setSeed(preset.seed);
    setInputVal(preset.seed);
    setPalette(preset.palette);
  };

  return (
    <section id="procedural-planets" className="relative py-24 bg-space-950 border-t border-space-800/60 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-hud-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hud-cyan/10 border border-hud-cyan/30 text-hud-cyan text-xs font-mono tracking-widest uppercase mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Procedural Planetary Synthesizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Procedural Seed Exoplanets
          </h2>
          <p className="text-space-300 text-sm sm:text-base leading-relaxed">
            Inspired by deterministic seed world generation. Enter any cryptographic seed or explore Bezaleel&apos;s repositories synthesized into high-fidelity 3D exoplanets featuring procedural terrain textures, dynamic cloud layers, atmospheric scattering, and planetary rings.
          </p>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: 3D Viewport */}
          <div className="lg:col-span-8 bg-space-900/60 border border-space-700/60 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl relative">
            {/* Viewport Overlay Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              <span className="px-2.5 py-1 rounded-md bg-space-950/80 border border-space-700 text-hud-cyan text-xs font-mono flex items-center gap-1.5 backdrop-blur-sm">
                <Globe className="w-3.5 h-3.5" />
                Seed: <span className="text-white font-semibold">{seed.slice(0, 20)}{seed.length > 20 ? '...' : ''}</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-space-950/80 border border-space-700 text-space-300 text-xs font-mono flex items-center gap-1.5 backdrop-blur-sm">
                <Orbit className="w-3.5 h-3.5 text-hud-cyan" />
                Atmospheric Glow
              </span>
              <span className="px-2.5 py-1 rounded-md bg-space-950/80 border border-space-700 text-emerald-400 text-xs font-mono flex items-center gap-1.5 backdrop-blur-sm">
                60 FPS Procedural
              </span>
            </div>

            {/* Scroll Zoom Toggle Control */}
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setZoomEnabled(!zoomEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
                  zoomEnabled
                    ? 'bg-hud-cyan text-space-950 font-bold border-hud-cyan shadow-[0_0_12px_#00f3ff]'
                    : 'bg-space-950/80 text-slate-300 border-space-700 hover:border-hud-cyan hover:text-white'
                }`}
                title="Toggle scroll wheel zoom (off by default to permit natural page scrolling)"
              >
                {zoomEnabled ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span>{zoomEnabled ? 'Zoom: On' : 'Zoom: Off'}</span>
              </button>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
              <span className="text-[11px] font-mono text-space-400 bg-space-950/80 px-2 py-1 rounded border border-space-800">
                🖱️ Left click + drag to rotate • {zoomEnabled ? 'Scroll to zoom' : 'Toggle Zoom button to zoom'}
              </span>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="h-[480px] sm:h-[560px] w-full cursor-grab active:cursor-grabbing bg-space-950/90">
              <Canvas
                camera={{ position: [0, 2, 14], fov: 45 }}
                gl={{ antialias: true, alpha: false }}
              >
                <color attach="background" args={['#030712']} />
                
                {/* Lighting System */}
                <ambientLight intensity={0.25} />
                <directionalLight position={[14, 8, 10]} intensity={2.2} castShadow />
                <pointLight position={[-12, -6, -10]} intensity={0.4} color="#38bdf8" />
                
                <Suspense fallback={null}>
                  <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.25}>
                    <GenerativeProceduralPlanet
                      seed={seed}
                      roughness={roughness}
                      radius={radius}
                      palette={palette}
                      showRings={showRings}
                    />
                  </Float>
                </Suspense>

                <OrbitControls
                  enableDamping
                  enableZoom={zoomEnabled}
                  dampingFactor={0.05}
                  minDistance={7}
                  maxDistance={30}
                  maxPolarAngle={Math.PI / 1.1}
                />
              </Canvas>
            </div>
          </div>

          {/* Right: Interactive Configuration Dock */}
          <div className="lg:col-span-4 space-y-6">
            {/* Seed Controller Card */}
            <div className="bg-space-900/60 border border-space-700/60 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-hud-cyan" />
                  Cosmic Seed Synthesizer
                </h3>
                <button
                  onClick={handleRandomize}
                  title="Generate Random Seed"
                  className="p-1.5 rounded-lg bg-space-800 border border-space-700 text-space-300 hover:text-hud-cyan hover:border-hud-cyan/50 transition-all flex items-center gap-1.5 text-xs font-mono"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Random</span>
                </button>
              </div>

              {/* Seed Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputVal.trim()) setSeed(inputVal.trim());
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-mono text-space-400 mb-1">
                    Enter any seed, word, or concept:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="e.g. Flutter, Apollo11, Quantum, Voyager"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-space-950/80 border border-space-700 text-white font-mono text-sm focus:outline-none focus:border-hud-cyan focus:ring-1 focus:ring-hud-cyan transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-hud-cyan text-space-950 font-semibold text-sm hover:bg-cyan-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-hud-cyan/20"
                >
                  <Globe className="w-4 h-4" />
                  Synthesize Exoplanet
                </button>
              </form>
            </div>

            {/* Bezaleel Repo Worlds Preset Picker */}
            <div className="bg-space-900/60 border border-space-700/60 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-xs font-mono uppercase tracking-widest text-space-400 mb-3 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-hud-cyan" />
                Repository Seeds (Bezaleel Paul)
              </h3>
              <p className="text-xs text-space-300 mb-4">
                Click any of Bezaleel&apos;s verified software repositories to synthesize its procedural planetary manifestation:
              </p>

              <div className="space-y-2.5">
                {REPO_PRESETS.map((preset) => {
                  const isActive = seed === preset.seed;
                  return (
                    <button
                      key={preset.seed}
                      onClick={() => handleApplyPreset(preset)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                        isActive
                          ? 'bg-hud-cyan/15 border-hud-cyan text-white shadow-md shadow-hud-cyan/10'
                          : 'bg-space-950/50 border-space-800 hover:border-space-700 text-space-300 hover:text-white'
                      }`}
                    >
                      <span className="text-xl p-1 bg-space-800 rounded-lg">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-mono font-bold truncate text-white">
                            {preset.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase ${
                            preset.palette === 'terrestrial' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            preset.palette === 'volcanic' ? 'bg-red-950 text-red-400 border border-red-800' :
                            preset.palette === 'ocean' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                            preset.palette === 'gas_giant' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {preset.palette}
                          </span>
                        </div>
                        <p className="text-[11px] text-space-400 line-clamp-1 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geological Modifiers & Sliders */}
            <div className="bg-space-900/60 border border-space-700/60 rounded-2xl p-6 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-space-400 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-hud-cyan" />
                Planetary Modifiers
              </h3>

              {/* Roughness Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-space-300 mb-1">
                  <span>Terrain Relief:</span>
                  <span className="text-hud-cyan font-bold">{roughness.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full accent-hud-cyan cursor-pointer"
                />
              </div>

              {/* Radius Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-space-300 mb-1">
                  <span>Planetary Radius:</span>
                  <span className="text-hud-cyan font-bold">{radius.toFixed(1)} units</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="5.5"
                  step="0.2"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full accent-hud-cyan cursor-pointer"
                />
              </div>

              {/* Ring Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-space-300">Planetary Ring System:</span>
                <button
                  type="button"
                  onClick={() => setShowRings(!showRings)}
                  className={`px-3 py-1 rounded-md text-xs font-mono border transition-all ${
                    showRings
                      ? 'bg-hud-cyan/20 border-hud-cyan text-hud-cyan'
                      : 'bg-space-800 border-space-700 text-space-400'
                  }`}
                >
                  {showRings ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Biome Palette Override */}
              <div className="pt-2">
                <span className="block text-xs font-mono text-space-400 mb-2">Climate Classification:</span>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                  {['auto', 'terrestrial', 'ocean', 'volcanic', 'gas_giant', 'glacius'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPalette(p)}
                      className={`py-1.5 px-2 rounded-lg border text-center capitalize transition-all ${
                        palette === p
                          ? 'bg-hud-cyan/20 border-hud-cyan text-white font-bold'
                          : 'bg-space-950/60 border-space-800 text-space-400 hover:text-white'
                      }`}
                    >
                      {p.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
