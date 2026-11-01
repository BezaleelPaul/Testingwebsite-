'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { CelestialBody } from './CelestialBody';
import { OrbitLine } from './OrbitLine';
import { AsteroidBelt } from './AsteroidBelt';
import { Starfield } from './Starfield';
import { CelestialBodyData } from '@/types/simulation';

interface HeroCosmosProps {
  selectedBodyId?: string;
  onSelectBody?: (body: CelestialBodyData) => void;
}

function SolarSystemRig({ selectedBodyId, onSelectBody }: HeroCosmosProps) {
  const [positions, setPositions] = useState<{ [id: string]: THREE.Vector3 }>({});
  const [elapsedDays, setElapsedDays] = useState(0);
  const rigGroupRef = useRef<THREE.Group>(null);

  // Smooth orbital simulation clock
  useFrame((state, delta) => {
    setElapsedDays((prev) => prev + delta * 2.2);

    // Subtle gentle camera parallax drift responding to mouse
    if (rigGroupRef.current) {
      const mouseX = state.pointer.x * 0.16;
      const mouseY = state.pointer.y * 0.12;
      rigGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.y,
        mouseX + 0.1,
        0.035
      );
      rigGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.x,
        -mouseY - 0.28,
        0.035
      );
    }
  });

  const handlePositionUpdate = (id: string, pos: THREE.Vector3) => {
    setPositions((prev) => ({
      ...prev,
      [id]: pos.clone(),
    }));
  };

  const primaryBodies = CELESTIAL_BODIES.filter((b) => !b.parentBodyId);
  const moonBodies = CELESTIAL_BODIES.filter((b) => !!b.parentBodyId);

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
      <ambientLight intensity={0.14} color="#94a3b8" />

      {/* Trajectory Orbit Lines for all primary planets */}
      {primaryBodies.map((body) => (
        <OrbitLine
          key={`orbit-${body.id}`}
          body={body}
          isSelected={selectedBodyId === body.id}
        />
      ))}

      {/* Primary Celestial Bodies (Sol, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Voyager 1) */}
      {primaryBodies.map((body) => (
        <CelestialBody
          key={body.id}
          data={body}
          elapsedDays={elapsedDays}
          isSelected={selectedBodyId === body.id}
          onSelect={(b) => onSelectBody?.(b)}
          onPositionUpdate={handlePositionUpdate}
        />
      ))}

      {/* Secondary Satellites & Moons (Luna, Europa, ISS, JWST) */}
      {moonBodies.map((moon) => {
        const parentPos = moon.parentBodyId ? positions[moon.parentBodyId] : undefined;
        return (
          <React.Fragment key={moon.id}>
            {parentPos && (
              <OrbitLine
                body={moon}
                parentPosition={parentPos}
                isSelected={selectedBodyId === moon.id}
              />
            )}
            <CelestialBody
              data={moon}
              parentPosition={parentPos}
              elapsedDays={elapsedDays}
              isSelected={selectedBodyId === moon.id}
              onSelect={(b) => onSelectBody?.(b)}
              onPositionUpdate={handlePositionUpdate}
            />
          </React.Fragment>
        );
      })}

      {/* Instanced Asteroid Belt */}
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
