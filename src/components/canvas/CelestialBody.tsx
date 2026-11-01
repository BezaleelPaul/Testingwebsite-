'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CelestialBodyData } from '@/types/simulation';
import { calculateOrbitPosition } from '@/lib/kepler';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { spaceAudio } from '@/lib/audio';

interface CelestialBodyProps {
  data: CelestialBodyData;
  parentPosition?: THREE.Vector3;
  elapsedDays: number;
  isSelected: boolean;
  onSelect: (body: CelestialBodyData) => void;
  onPositionUpdate?: (id: string, pos: THREE.Vector3) => void;
}

export const CelestialBody: React.FC<CelestialBodyProps> = ({
  data,
  parentPosition = new THREE.Vector3(0, 0, 0),
  elapsedDays,
  isSelected,
  onSelect,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Atmosphere shader material
  const atmosphereMaterial = useMemo(() => {
    if (data.atmosphere && data.atmosphereColor) {
      return createAtmosphereMaterial(data.atmosphereColor, 0.6, 2.8);
    }
    return null;
  }, [data.atmosphere, data.atmosphereColor]);

  // Sun corona material
  const sunCoronaMaterial = useMemo(() => {
    if (data.emissive) {
      return createAtmosphereMaterial('#ff9900', 0.5, 2.0);
    }
    return null;
  }, [data.emissive]);

  // Saturn ring geometry
  const ringGeometry = useMemo(() => {
    if (!data.hasRings) return null;
    return new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.5, 64);
  }, [data.hasRings, data.radius]);

  // Saturn ring material
  const ringMaterial = useMemo(() => {
    if (!data.hasRings) return null;
    return new THREE.MeshStandardMaterial({
      color: '#e2ca76',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      roughness: 0.8,
    });
  }, [data.hasRings]);

  useFrame((_, delta) => {
    // 1. Calculate orbital position
    const relPos = calculateOrbitPosition(data, elapsedDays);
    const absPos = relPos.add(parentPosition);

    if (groupRef.current) {
      groupRef.current.position.copy(absPos);
    }

    if (onPositionUpdate) {
      onPositionUpdate(data.id, absPos);
    }

    // 2. Axial rotation
    if (meshRef.current) {
      const rotSpeed = data.rotationPeriodHours !== 0 ? (2 * Math.PI) / (Math.abs(data.rotationPeriodHours) * 3600) : 0;
      meshRef.current.rotation.y += (data.rotationPeriodHours < 0 ? -1 : 1) * rotSpeed * delta * 86400 * 0.05;
    }

    // 3. Saturn ring rotation alignment
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    spaceAudio.playTelemetryBeep(1200);
    onSelect(data);
  };

  return (
    <group ref={groupRef}>
      {/* Axial tilt container */}
      <group rotation={[0, 0, (data.axialTiltDeg * Math.PI) / 180]}>
        {/* Core Body Mesh */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          castShadow={!data.emissive}
          receiveShadow={!data.emissive}
        >
          <sphereGeometry args={[data.radius, 48, 48]} />
          {data.emissive ? (
            <meshBasicMaterial color={data.color} />
          ) : (
            <meshStandardMaterial
              color={data.color}
              roughness={0.7}
              metalness={0.1}
            />
          )}
        </mesh>

        {/* Sun corona glow */}
        {data.emissive && sunCoronaMaterial && (
          <mesh material={sunCoronaMaterial}>
            <sphereGeometry args={[data.radius * 1.25, 32, 32]} />
          </mesh>
        )}

        {/* Planetary Rayleigh Atmosphere */}
        {data.atmosphere && atmosphereMaterial && (
          <mesh material={atmosphereMaterial}>
            <sphereGeometry args={[data.radius * 1.15, 32, 32]} />
          </mesh>
        )}

        {/* Saturn Rings */}
        {data.hasRings && ringGeometry && ringMaterial && (
          <mesh ref={ringRef} geometry={ringGeometry} material={ringMaterial} />
        )}
      </group>

      {/* Target Reticle & HUD Label */}
      <Html distanceFactor={45} position={[0, data.radius * 1.5, 0]} center>
        <div
          onClick={handleClick}
          className={`cursor-pointer px-2 py-0.5 rounded text-[11px] font-mono tracking-wider transition-all select-none whitespace-nowrap ${
            isSelected
              ? 'bg-hud-cyan text-space-900 font-bold border border-hud-cyan shadow-[0_0_15px_#00f3ff]'
              : 'bg-space-900/80 text-gray-300 border border-hud-cyan/30 hover:border-hud-cyan hover:text-hud-cyan'
          }`}
        >
          {isSelected ? `[ TARGET: ${data.name.toUpperCase()} ]` : data.name}
        </div>
      </Html>
    </group>
  );
};
