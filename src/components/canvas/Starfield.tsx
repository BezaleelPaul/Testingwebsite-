'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export const Starfield: React.FC<{ count?: number }> = ({ count = 6000 }) => {
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Stellar spectral classification colors (O, B, A, F, G, K, M)
    const starColors = [
      new THREE.Color('#9bb0ff'), // Class O/B (Blue-white)
      new THREE.Color('#bbccff'), // Class A (White)
      new THREE.Color('#f8f9fa'), // Class F (Warm white)
      new THREE.Color('#fff4e8'), // Class G (Yellow - Sol)
      new THREE.Color('#ffd2a1'), // Class K (Orange)
      new THREE.Color('#ffcc6f'), // Class M (Red dwarf)
      new THREE.Color('#00f3ff'), // Sci-fi cyan accent
    ];

    for (let i = 0; i < count; i++) {
      // Uniform distribution on outer sphere
      const r = 250 + Math.random() * 450;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [positions, colors]);

  return (
    <group>
      <points geometry={geometry}>
        <pointsMaterial
          size={1.6}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
