'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { MathUtils, type Group } from 'three';
import { Activity, ArrowDownRight, ArrowLeftRight, Cpu, Gauge, RotateCcw, ShieldCheck, Zap } from 'lucide-react';

type JointAngles = { shoulder: number; elbow: number; wrist: number };
type Form = 'mech' | 'rover';

const initialAngles: JointAngles = { shoulder: -18, elbow: 34, wrist: -8 };

function Armor({ position, scale = [1, 1, 1], color = '#344253', accent = false, rotation = [0, 0, 0] }: {
  position: [number, number, number]; scale?: [number, number, number]; color?: string; accent?: boolean; rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={accent ? '#cfff27' : color} metalness={0.82} roughness={0.24} emissive={accent ? '#8eaa12' : '#101a28'} emissiveIntensity={accent ? 0.45 : 0.22} />
    </mesh>
  );
}

function Joint({ position, radius = 0.17 }: { position: [number, number, number]; radius?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial color="#cfff27" metalness={0.75} roughness={0.2} emissive="#8fae12" emissiveIntensity={0.7} />
    </mesh>
  );
}

function MechPrototy¶»§q«^