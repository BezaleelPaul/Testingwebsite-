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
  onSelectBody?: (body: CelestialBodyData) => void;
}

function SolarSystemRig({ onSelectBody }: HeroCosmosProps) {
  const [positions, setPositions] = useState<{ [id: string]: THREE.Vector3 }>({});
  const [elapsedDays, setElapsedDays] = useState(0);
  const rigGroupRef = useRef<THREE.Group>(null);

  // Smooth orbital simulation clock
  useFrame((state, delta) => {
    // Progress simulated days smoothly
    setElapsedDays((prev) => prev + delta * 2.5);

    // Subtle gentle camera parallax drift responding to mouse
    if (rigGroupRef.current) {
      const mouseX = state.pointer.x * 0.15;
      const mouseY = state.pointer.y * 0.12;
      rigGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.y,
        mouseX + 0.1,
        0.03
      );
      rigGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.x,
        -mouseY - 0.25,
        0.03
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
        intensity={900}
        color="#fff5e0"
        distance={1200}
        decay={1.2}
      />
      <ambientLight intensity={0.12} color="#94a3b8" />

      {/* Trajectory Orbit Lines for all primary planets */}
      {primaryBodies.map((body) => (
        <OrbitLine key={`orbit-${body.id}`} body={body} isSelected={false} />
      ))}

      {/* Orbiting Celestial Bodies (Sol, Mercury, Venus, Earth, Mars, Jupiter, Saturn) */}
      {primaryBodies.map((body) => (
        <CelestialBody
          key={body.id}
          data={body}
          elapsedDays={elapsedDays}
          isSelected={false}
          onSelect={(b) => onSelectBody?.(b)}
          onPositionUpdate={handlePositionUpdate}
        />
      ))}

      {/* Moons orbiting parent planets (Luna, Europa) */}
      {moonBodies.map((moon) => {
        const parentPos = moon.parentBodyId ? positions[moon.parentBodyId] : undefined;
        return (
          <React.Fragment key={moon.id}>
            {parentPos && (
              <OrbitLine
                body={moon}
                parentPosition={parentPos}
                isSelected={false}
              />
            )}
            <CelestialBody
              data={moon}
              parentPosition={parentPos}
              elapsedDays={elapsedDays}
              isSelected={false}
              onSelect={(b) => onSelectBody?.(b)}
              onPositionUpdate={handlePositionUpdate}
            />
          </React.Fragment>
        );
      })}

      {/* Asteroid Belt */}
      <AsteroidBelt innerRadius={39} outerRadius={48} count={1200} />
    </group>
  );
}

export const HeroCelestialHorizon: React.FC<HeroCosmosProps> = ({ onSelectBody }) => {
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
        camera={{ position: [0, 32, 65], fov: 46, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        {/* Deep Cosmic Starfield */}
        <Starfield count={6000} />

        {/* Orbiting Solar System */}
        <SolarSystemRig onSelectBody={onSelectBody} />
      </Canvas>

      {/* Film grain and atmospheric overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-space-950 via-transparent to-space-950/70"
        aria-hidden="true"
      />
    </div>
  );
};
