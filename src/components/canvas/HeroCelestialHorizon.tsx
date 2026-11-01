'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

// Rayleigh scattering atmospheric glow shader for the planetary horizon
const HorizonAtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 glowColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewCameraDir = normalize(-vPosition);
      float intensity = pow(0.72 - dot(vNormal, viewCameraDir), 3.2);
      gl_FragColor = vec4(glowColor, clamp(intensity, 0.0, 1.0) * 0.95);
    }
  `
};

function PlanetHorizon() {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Subtle planetary rotation
  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.02;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02;
    }
  });

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: HorizonAtmosphereShader.vertexShader,
      fragmentShader: HorizonAtmosphereShader.fragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color('#38bdf8') },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <group position={[0, -28, -8]}>
      {/* Massive curving planetary body */}
      <mesh ref={planetRef} rotation={[0.4, 0, 0.15]}>
        <sphereGeometry args={[26, 64, 64]} />
        <meshStandardMaterial
          color="#0b172a"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Atmospheric Rim Glow */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial} scale={[1.025, 1.025, 1.025]}>
        <sphereGeometry args={[26, 48, 48]} />
      </mesh>
    </group>
  );
}

function StarfieldParticles({ count = 1800 }) {
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#00f3ff'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#fed7aa'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 40 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export const HeroCelestialHorizon: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  // Check WebGL availability for graceful fallback
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setHasWebGL(gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    // Elegant CSS Fallback if WebGL is unavailable
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[160vw] h-[70vh] rounded-[100%] bg-gradient-to-t from-cyan-950/40 via-space-900 to-transparent border-t border-hud-cyan/30 shadow-[0_-20px_80px_rgba(0,243,255,0.15)]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 2, 14], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.15} color="#94a3b8" />
        <directionalLight position={[10, 15, 8]} intensity={1.8} color="#e0f2fe" />
        <pointLight position={[-15, 5, -5]} intensity={0.6} color="#00f3ff" />

        <PlanetHorizon />
        <StarfieldParticles count={1600} />
      </Canvas>
      {/* Subtle bottom vignette to ensure perfect text contrast */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-space-950 via-space-950/80 to-transparent" />
    </div>
  );
};
