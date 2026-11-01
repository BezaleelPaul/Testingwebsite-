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
  elapsedDays?: number;
  isSelected: boolean;
  onSelect: (body: CelestialBodyData) => void;
  onPositionUpdate?: (id: string, pos: THREE.Vector3) => void;
}

export const CelestialBody: React.FC<CelestialBodyProps> = ({
  data,
  parentPosition,
  elapsedDays,
  isSelected,
  onSelect,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const coronaRef = useRef<THREE.Mesh>(null);

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

  useFrame((_, delta) => {
    // 1. Orbital motion if elapsedDays is explicitly passed by observatory simulator
    if (elapsedDays !== undefined) {
      const relPos = calculateOrbitPosition(data, elapsedDays);
      const absPos = parentPosition ? relPos.add(parentPosition) : relPos;
      if (groupRef.current) {
        groupRef.current.position.copy(absPos);
      }
      if (onPositionUpdate) {
        onPositionUpdate(data.id, absPos);
      }
    }

    // 2. Axial rotation
    if (meshRef.current) {
      const rotSpeed = data.rotationPeriodHours !== 0
        ? (2 * Math.PI) / (Math.abs(data.rotationPeriodHours) * 3600)
        : 0;
      meshRef.current.rotation.y += (data.rotationPeriodHours < 0 ? -1 : 1) * rotSpeed * delta * 86400 * 0.05;
    }

    // 3. Earth independent cloud drift
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.035;
      cloudsRef.current.rotation.x = Math.sin(delta * 0.1) * 0.02;
    }

    // 4. Sun corona pulsation
    if (coronaRef.current) {
      const pulse = 1.0 + Math.sin(Date.now() * 0.002) * 0.04;
      coronaRef.current.scale.set(pulse, pulse, pulse);
    }

    // 5. Saturn rings alignment
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.x = Math.PI / 2;
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
        {/* Core Body Geometry based on Type */}
        {data.type === 'station' ? (
          /* International Space Station (ISS) 3D Model */
          <group onClick={handleClick} scale={[1.8, 1.8, 1.8]}>
            {/* Central Pressurized Module Truss */}
            <mesh>
              <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Integrated Truss Structure */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 1.6, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Left Solar Array Wings */}
            <mesh position={[-0.9, 0, 0]}>
              <boxGeometry args={[0.55, 0.02, 0.95]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.5}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            {/* Right Solar Array Wings */}
            <mesh position={[0.9, 0, 0]}>
              <boxGeometry args={[0.55, 0.02, 0.95]} />
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.5}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
            {/* Radiator Panels */}
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 4, 0, 0]}>
              <boxGeometry args={[0.4, 0.01, 0.3]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.4} />
            </mesh>
          </group>
        ) : data.type === 'telescope' ? (
          /* James Webb Space Telescope (JWST) 3D Model */
          <group onClick={handleClick} scale={[1.8, 1.8, 1.8]}>
            {/* Diamond-Shaped Multi-Layer Sunshield */}
            <mesh rotation={[Math.PI / 8, 0, 0]}>
              <boxGeometry args={[1.2, 0.02, 0.8]} />
              <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Iconic Hexagonal Gold Primary Mirror Array */}
            <mesh position={[0, 0.28, -0.05]} rotation={[-Math.PI / 5, 0, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.03, 6]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#d97706"
                emissiveIntensity={0.35}
                metalness={0.98}
                roughness={0.05}
              />
            </mesh>
            {/* Secondary Mirror Support Struts */}
            <mesh position={[0, 0.45, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
              <coneGeometry args={[0.15, 0.4, 3]} />
              <meshStandardMaterial color="#334155" wireframe />
            </mesh>
          </group>
        ) : data.type === 'spacecraft' ? (
          /* Voyager 1 Interstellar Probe Model */
          <group onClick={handleClick} scale={[1.8, 1.8, 1.8]}>
            {/* High-Gain Parabolic Radio Dish */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#f8fafc" side={THREE.DoubleSide} metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Electronics Equipment Bay Bus */}
            <mesh position={[0, -0.22, 0]}>
              <boxGeometry args={[0.28, 0.28, 0.28]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Golden Record Plate */}
            <mesh position={[0.15, -0.22, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.1, 16]} />
              <meshStandardMaterial color="#eab308" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Magnetometer Science Boom */}
            <mesh position={[-0.4, -0.6, 0]} rotation={[0, 0, -Math.PI / 6]}>
              <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
          </group>
        ) : (
          /* Primary Planet / Star Spherical Mesh */
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
                roughness={data.id === 'earth' ? 0.6 : 0.75}
                metalness={data.id === 'earth' ? 0.2 : 0.1}
              />
            )}
          </mesh>
        )}

        {/* Earth Atmospheric Cloud Deck */}
        {data.id === 'earth' && (
          <mesh ref={cloudsRef} scale={[1.026, 1.026, 1.026]}>
            <sphereGeometry args={[data.radius, 48, 48]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.36}
              roughness={0.9}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Sun Multi-Layer Solar Corona & Energetic Flares */}
        {data.emissive && (
          <>
            <mesh ref={coronaRef} scale={[1.15, 1.15, 1.15]}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshBasicMaterial
                color="#ffaa00"
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            {sunCoronaMaterial && (
              <mesh material={sunCoronaMaterial}>
                <sphereGeometry args={[data.radius * 1.35, 32, 32]} />
              </mesh>
            )}
          </>
        )}

        {/* Planetary Rayleigh Atmospheric Scattering */}
        {data.atmosphere && atmosphereMaterial && (
          <mesh material={atmosphereMaterial}>
            <sphereGeometry args={[data.radius * 1.15, 32, 32]} />
          </mesh>
        )}

        {/* Saturn Concentric Double Rings with Cassini Division */}
        {data.hasRings && (
          <group ref={ringGroupRef}>
            {/* Main Inner Rings (Ring A & B) */}
            <mesh>
              <ringGeometry args={[data.radius * 1.35, data.radius * 2.05, 64]} />
              <meshStandardMaterial
                color="#e2ca76"
                side={THREE.DoubleSide}
                transparent
                opacity={0.85}
                roughness={0.7}
              />
            </mesh>
            {/* Cassini Division Gap & Outer Ring C */}
            <mesh>
              <ringGeometry args={[data.radius * 2.14, data.radius * 2.55, 64]} />
              <meshStandardMaterial
                color="#cbb262"
                side={THREE.DoubleSide}
                transparent
                opacity={0.45}
                roughness={0.8}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* Target Reticle & Interactive HUD Label */}
      <Html distanceFactor={45} position={[0, data.radius * 1.5, 0]} center>
        <div
          onClick={handleClick}
          className={`cursor-pointer px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider transition-all select-none whitespace-nowrap flex items-center gap-1.5 backdrop-blur-sm ${
            isSelected
              ? 'bg-hud-cyan text-space-900 font-bold border border-hud-cyan shadow-[0_0_15px_#00f3ff]'
              : data.type === 'station' || data.type === 'telescope' || data.type === 'spacecraft'
              ? 'bg-cyan-950/90 text-hud-cyan border border-cyan-500/60 hover:bg-hud-cyan hover:text-space-950 shadow-[0_0_8px_rgba(0,243,255,0.3)]'
              : 'bg-space-900/80 text-gray-300 border border-hud-cyan/30 hover:border-hud-cyan hover:text-hud-cyan'
          }`}
        >
          {data.type === 'station' && <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan animate-ping" />}
          {data.type === 'telescope' && <span className="text-[10px] text-amber-400">🔭</span>}
          {data.type === 'spacecraft' && <span className="text-[10px] text-purple-400">🛸</span>}
          <span>{isSelected ? `[ TARGET: ${data.name.toUpperCase()} ]` : data.name}</span>
        </div>
      </Html>
    </group>
  );
};
