'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface VoxelPlanetProps {
  seed: string;
  roughness?: number; // 0.5 to 2.5
  radius?: number; // 6 to 9 (voxel radius)
  palette?: string; // 'auto' | 'overworld' | 'nether' | 'aether' | 'cyber' | 'glacius'
  rotationSpeed?: number;
  showRings?: boolean;
  onBlockSelect?: (info: { type: string; position: [number, number, number]; biome: string } | null) => void;
}

// Deterministic Pseudo-Random Number Generator (Mulberry32)
function createPrng(seedStr: string) {
  let h = 0xefc8249d;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 0x5bd1e995);
    h ^= h >>> 15;
  }
  let a = h >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 3D pseudo noise using trigonometric harmonics
function pseudoNoise(x: number, y: number, z: number, s: number) {
  const f1 = 0.35;
  const f2 = 0.7;
  return (
    Math.sin(x * f1 + s * 1.3) * Math.cos(y * f1 + s * 0.7) +
    Math.sin(y * f2 + s * 2.1) * Math.cos(z * f2 + s * 1.1) +
    Math.sin(z * f1 + x * f2 + s * 3.7)
  ) / 3;
}

// Voxel color palettes
const PALETTES = {
  overworld: {
    name: 'Verdant Overworld',
    surface: '#3b7d23', // Grass green
    subSurface: '#694a2b', // Dirt brown
    deep: '#4a4e52', // Stone slate
    core: '#1e2124', // Bedrock
    special: '#00e5ff', // Diamond ore
    specialAlt: '#ffd54f', // Gold ore
    water: '#1e88e5', // River water
    clouds: '#ffffff', // Cloud white
    atmosphere: '#4fc3f7',
  },
  nether: {
    name: 'Volcanic Nether Core',
    surface: '#8b0000', // Netherrack red
    subSurface: '#4a0e17', // Soul soil
    deep: '#2c1e21', // Basalt
    core: '#ff3d00', // Magma glow
    special: '#ff9100', // Blazing quartz / gold
    specialAlt: '#9c27b0', // Crying obsidian
    water: '#ff5722', // Lava ocean
    clouds: '#3e2723', // Ash cloud
    atmosphere: '#ff3d00',
  },
  aether: {
    name: 'Bioluminescent Aether',
    surface: '#00e676', // Glowing cyan-emerald
    subSurface: '#00838f', // Teal stone
    deep: '#004d40', // Deep oceanite
    core: '#e040fb', // Aether heart
    special: '#76ff03', // Lime spore
    specialAlt: '#b388ff', // Celestial amethyst
    water: '#00b0ff', // Pure spring
    clouds: '#e1f5fe', // Mist
    atmosphere: '#80d8ff',
  },
  cyber: {
    name: 'Cybernetic Matrix Core',
    surface: '#00f0ff', // Cyber cyan
    subSurface: '#0d1b2a', // Obsidian dark
    deep: '#1b263b', // Titanium alloy
    core: '#7928ca', // Violet singularity
    special: '#00ff66', // Matrix neon
    specialAlt: '#ff007f', // Synthwave pink
    water: '#10172a', // Liquid silicon
    clouds: '#00e5ff', // Holo-grids
    atmosphere: '#00f0ff',
  },
  glacius: {
    name: 'Sub-Zero Glacius',
    surface: '#e0f7fa', // Packed snow
    subSurface: '#80deea', // Glacier blue
    deep: '#26c6da', // Deep permafrost
    core: '#006064', // Abyssal ice
    special: '#00bcd4', // Lapis lazuli
    specialAlt: '#b2ebf2', // Aurora crystal
    water: '#0288d1', // Cold brine
    clouds: '#ffffff', // Blizzard mist
    atmosphere: '#b2ebf2',
  },
};

interface BlockInstance {
  pos: [number, number, number];
  color: THREE.Color;
  type: string;
}

export function GenerativeVoxelPlanet({
  seed,
  roughness = 1.0,
  radius = 7,
  palette = 'auto',
  rotationSpeed = 0.003,
  showRings = true,
  onBlockSelect,
}: VoxelPlanetProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const ringsRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  // Determine active biome from seed or override
  const activePalette = useMemo(() => {
    if (palette !== 'auto' && PALETTES[palette as keyof typeof PALETTES]) {
      return PALETTES[palette as keyof typeof PALETTES];
    }
    const prng = createPrng(seed);
    const keys = Object.keys(PALETTES) as Array<keyof typeof PALETTES>;
    const index = Math.floor(prng() * keys.length);
    return PALETTES[keys[index]];
  }, [seed, palette]);

  // Generate voxel blocks based on seed and radius
  const { blocks, ringBlocks, totalBlocks } = useMemo(() => {
    const prng = createPrng(seed);
    const seedOffset = prng() * 100;
    const generated: BlockInstance[] = [];

    const effectiveR = Math.max(5, Math.min(10, radius));
    const bound = Math.ceil(effectiveR * 1.5);

    const tempCol = new THREE.Color();
    const surfaceCol = new THREE.Color(activePalette.surface);
    const subCol = new THREE.Color(activePalette.subSurface);
    const deepCol = new THREE.Color(activePalette.deep);
    const coreCol = new THREE.Color(activePalette.core);
    const specialCol = new THREE.Color(activePalette.special);
    const specialAltCol = new THREE.Color(activePalette.specialAlt);
    const waterCol = new THREE.Color(activePalette.water);

    // Voxel 3D grid scan
    for (let x = -bound; x <= bound; x++) {
      for (let y = -bound; y <= bound; y++) {
        for (let z = -bound; z <= bound; z++) {
          const dist = Math.sqrt(x * x + y * y + z * z);
          if (dist === 0) continue;

          // Height perturbation via noise
          const noise = pseudoNoise(x, y, z, seedOffset) * (roughness * 1.8);
          const surfaceThreshold = effectiveR + noise;

          if (dist <= surfaceThreshold) {
            let blockType = 'stone';
            let blockColor = deepCol;

            const depthFromSurface = surfaceThreshold - dist;

            if (depthFromSurface < 0.8) {
              // Surface layer
              if (dist < effectiveR - 0.5) {
                // Ocean / Liquid level depression
                blockType = 'ocean';
                blockColor = waterCol;
              } else {
                blockType = 'surface';
                blockColor = surfaceCol;

                // Rare flora or crystal sprout on surface
                if (prng() > 0.92) {
                  blockColor = specialCol;
                  blockType = 'crystal_flora';
                }
              }
            } else if (depthFromSurface < 2.0) {
              // Sub-surface
              blockType = 'sub_stratum';
              blockColor = subCol;

              // Rare ore vein
              const oreRoll = prng();
              if (oreRoll > 0.93) {
                blockType = 'special_ore';
                blockColor = specialCol;
              } else if (oreRoll > 0.88) {
                blockType = 'amber_ore';
                blockColor = specialAltCol;
              }
            } else if (dist < effectiveR * 0.45) {
              // Planetary Core
              blockType = 'core_singularity';
              blockColor = coreCol;
            } else {
              // Deep Mantle
              blockType = 'deep_mantle';
              blockColor = deepCol;
            }

            // Slight color variation for texture look
            const jitter = (prng() - 0.5) * 0.1;
            tempCol.copy(blockColor);
            tempCol.offsetHSL(0, 0, jitter);

            generated.push({
              pos: [x, y, z],
              color: tempCol.clone(),
              type: blockType,
            });
          }
        }
      }
    }

    // Procedural Asteroid Voxel Rings
    const rings: BlockInstance[] = [];
    if (showRings) {
      const ringInner = effectiveR * 1.6;
      const ringOuter = effectiveR * 2.3;
      const ringCount = Math.floor(180 + prng() * 120);

      for (let i = 0; i < ringCount; i++) {
        const angle = prng() * Math.PI * 2;
        const rad = ringInner + prng() * (ringOuter - ringInner);
        const rx = Math.cos(angle) * rad;
        const rz = Math.sin(angle) * rad;
        const ry = (prng() - 0.5) * 1.2; // Flat ring plane with slight wobble

        const rType = prng() > 0.7 ? 'ore_fragment' : 'space_debris';
        const rCol = rType === 'ore_fragment' ? specialCol : deepCol;

        tempCol.copy(rCol).offsetHSL(0, 0, (prng() - 0.5) * 0.15);

        rings.push({
          pos: [Math.round(rx), Math.round(ry), Math.round(rz)],
          color: tempCol.clone(),
          type: rType,
        });
      }
    }

    return { blocks: generated, ringBlocks: rings, totalBlocks: generated.length + rings.length };
  }, [seed, roughness, radius, activePalette, showRings]);

  // Update InstancedMesh matrices and colors
  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    const mesh = meshRef.current;

    blocks.forEach((block, idx) => {
      dummy.position.set(...block.pos);
      dummy.scale.set(0.96, 0.96, 0.96); // Micro gap for crisp voxel block definition
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
      mesh.setColorAt(idx, block.color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blocks]);

  // Update Ring InstancedMesh
  useEffect(() => {
    if (!ringsRef.current || ringBlocks.length === 0) return;
    const dummy = new THREE.Object3D();
    const rings = ringsRef.current;

    ringBlocks.forEach((block, idx) => {
      dummy.position.set(...block.pos);
      const s = 0.7 + Math.random() * 0.4;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      rings.setMatrixAt(idx, dummy.matrix);
      rings.setColorAt(idx, block.color);
    });

    rings.instanceMatrix.needsUpdate = true;
    if (rings.instanceColor) rings.instanceColor.needsUpdate = true;
  }, [ringBlocks]);

  // Continuous subtle planet rotation & ring counter-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * (delta * 60);
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y += rotationSpeed * 0.5 * (delta * 60);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Voxel Planet Core Body */}
      {blocks.length > 0 && (
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, blocks.length]}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            if (e.instanceId !== undefined && blocks[e.instanceId]) {
              const b = blocks[e.instanceId];
              setHoveredBlock(`${b.type} at [${b.pos.join(', ')}]`);
              if (onBlockSelect) {
                onBlockSelect({
                  type: b.type,
                  position: b.pos,
                  biome: activePalette.name,
                });
              }
            }
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            roughness={0.7}
            metalness={0.15}
            vertexColors
          />
        </instancedMesh>
      )}

      {/* Orbiting Voxel Debris & Ring Asteroids */}
      {showRings && ringBlocks.length > 0 && (
        <instancedMesh
          ref={ringsRef}
          args={[undefined, undefined, ringBlocks.length]}
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            roughness={0.8}
            metalness={0.2}
            vertexColors
          />
        </instancedMesh>
      )}

      {/* Atmospheric Glow Shell */}
      <mesh scale={[radius * 1.55, radius * 1.55, radius * 1.55]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={activePalette.atmosphere}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
