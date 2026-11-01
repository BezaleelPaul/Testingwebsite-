'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { CelestialBody } from './CelestialBody';
import { OrbitLine } from './OrbitLine';
import { AsteroidBelt } from './AsteroidBelt';
import { Starfield } from './Starfield';
import { CelestialBodyData } from '@/types/simulation';
import { calculateOrbitPosition } from '@/lib/kepler';

interface HeroCosmosProps {
  selectedBodyId?: string;
  onSelectBody?: (body: CelestialBodyData) => void;
}

function SolarSystemRig({ selectedBodyId, onSelectBody }: HeroCosmosProps) {
  const rigGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Split primary bodies vs satellites
  const primaryBodies = CELESTIAL_BODIES.filter((b) => !b.parentBodyId);
  const moonBodies = CELESTIAL_BODIES.filter((b) => !!b.parentBodyId);

  // Direct group refs for 60+ FPS zero-state transform updates
  const bodyGroups = useRef<{ [id: string]: THREE.Group | null }>({});

  useFrame((state, delta) => {
    // Majestic, serene celestial time clock
    timeRef.current += delta * 1.8;
    const t = timeRef.current;

    // Cache parent positions calculated mathematically
    const parentPositions: { [id: string]: THREE.Vector3 } = {};

    // 1. Update primary planet positions with Keplerian physics
    primaryBodies.forEach((body) => {
      const pos = calculateOrbitPosition(body, t);
      parentPositions[body.id] = pos;
      const grp = bodyGroups.current[body.id];
      if (grp) {
        grp.position.copy(pos);
      }
    });

    // 2. Update satellite & moon positions with calibrated real-world orbital pacing
    moonBodies.forEach((moon) => {
      const parentPos = moon.parentBodyId ? parentPositions[moon.parentBodyId] : undefined;

      // Realistic, serene orbital period calibration:
      // Prevents satellites from spinning at 35 revs/second, creating graceful, physically realistic orbits
      let calibratedPeriod = moon.orbitalPeriodDays;
      if (moon.id === 'iss') calibratedPeriod = 24.0; // ~13s smooth visible Earth satellite pass
      if (moon.id === 'europa') calibratedPeriod = 32.0; // ~18s smooth Jovian moon orbit
      if (moon.id === 'jwst') calibratedPeriod = 80.0; // Serene L2 Lagrangian station-keeping

      const calibratedMoon = { ...moon, orbitalPeriodDays: calibratedPeriod };
      const relPos = calculateOrbitPosition(calibratedMoon, t);
      const absPos = parentPos ? relPos.add(parentPos) : relPos;
      const grp = bodyGroups.current[moon.id];
      if (grp) {
        grp.position.copy(absPos);
      }
    });

    // 3. Subtle gentle camera parallax drift responding to mouse
    if (rigGroupRef.current) {
      const mouseX = state.pointer.x * 0.12;
      const mouseY = state.pointer.y * 0.08;
      rigGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.y,
        mouseX + 0.12,
        0.035
      );
      rigGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.x,
        -mouseY - 0.26,
        0.035
      );
    }
  });

  return (
    <group ref={rigGroupRef} position={[0, -2, 0]} rotation={[-0.35, 0.2, 0]}>
      {/* Central Sun Light Source */}
      <pointLight
        position={[0, 0, 0]}
        intensity={950}
        color="#fff5e0"
        distance={1400}
        decay={1.2}
      />
      <ambientLight intensity={0.16} color="#94a3b8" />

      {/* Trajectory Orbit Lines for all primary planets */}
      {primaryBodies.map((body) => (
        <OrbitLine
          key={`orbit-${body.id}`}
          body={body}
          isSelected={selectedBodyId === body.id}
        />
      ))}

      {/* Primary Celestial Bodies */}
      {primaryBodies.map((body) => (
        <group
          key={body.id}
          ref={(el) => {
            bodyGroups.current[body.id] = el;
          }}
        >
          <CelestialBody
            data={body}
            isSelected={selectedBodyId === body.id}
            onSelect={(b) => onSelectBody?.(b)}
          />
        </group>
      ))}

      {/* Secondary Satellites & Moons (Luna, ISS, JWST, Europa) */}
      {moonBodies.map((moon) => (
        <group
          key={moon.id}
          ref={(el) => {
            bodyGroups.current[moon.id] = el;
          }}
        >
          <CelestialBody
            data={moon}
            isSelected={selectedBodyId === moon.id}
            onSelect={(b) => onSelectBody?.(b)}
          />
        </group>
      ))}

      {/* Instanced Asteroid Belt (Mars - Jupiter corridor) */}
      <AsteroidBelt innerRadius={39} outerRadius={48} count={1300} />
    </group>
  );
}

export const HeroCelestialHorizon: React.FC<HeroCosmosProps> = ({ selectedBodyId, onSelectBody }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-space-950/90 to-space-950"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-auto select-none"
      aria-label="Interactive 3D Solar System and Celestial Cosmos"
    >
      <Canvas
        camera={{ position: [0, 34, 68], fov: 46, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        {/* Deep Cosmic Starfield & Nebula Gas Clouds */}
        <Starfield count={6500} />

        {/* Orbiting Solar System & Spacecraft */}
        <SolarSystemRig selectedBodyId={selectedBodyId} onSelectBody={onSelectBody} />
      </Canvas>

      {/* Soft Cinematic Background Blur & Dark Vignette Scrim (Guarantees website texts are seen first with crystal clarity) */}
      <div
        className="absolute inset-0 pointer-events-none backdrop-blur-[3px] bg-space-950/50"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-space-950 via-space-950/30 to-space-950/80"
        aria-hidden="true"
      />
    </div>
  );
};
