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

  // References to groups for smooth direct transform updates without React state re-renders
  const bodyGroups = useRef<{ [id: string]: THREE.Group | null }>({});

  useFrame((state, delta) => {
    // Advance simulation time smoothly
    timeRef.current += delta * 2.2;
    const t = timeRef.current;

    // Cache parent positions calculated mathematically
    const parentPositions: { [id: string]: THREE.Vector3 } = {};

    // 1. Update primary planet positions
    primaryBodies.forEach((body) => {
      const pos = calculateOrbitPosition(body, t);
      parentPositions[body.id] = pos;
      const grp = bodyGroups.current[body.id];
      if (grp) {
        grp.position.copy(pos);
      }
    });

    // 2. Update satellite / moon positions relative to their parent
    moonBodies.forEach((moon) => {
      const parentPos = moon.parentBodyId ? parentPositions[moon.parentBodyId] : undefined;
      const relPos = calculateOrbitPosition(moon, t);
      const absPos = parentPos ? relPos.add(parentPos) : relPos;
      const grp = bodyGroups.current[moon.id];
      if (grp) {
        grp.position.copy(absPos);
      }
    });

    // 3. Subtle gentle camera parallax drift responding to mouse
    if (rigGroupRef.current) {
      const mouseX = state.pointer.x * 0.14;
      const mouseY = state.pointer.y * 0.10;
      rigGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.y,
        mouseX + 0.12,
        0.04
      );
      rigGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.x,
        -mouseY - 0.28,
        0.04
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

      {/* Atmospheric depth vignette */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-space-950 via-transparent to-space-950/70"
        aria-hidden="true"
      />
    </div>
  );
};
