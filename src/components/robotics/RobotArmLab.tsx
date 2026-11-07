'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Group } from 'three';

type JointAngles = { shoulder: number; elbow: number; wrist: number };

function RobotArmModel({ angles, idle }: { angles: JointAngles; idle: boolean }) {
  const baseRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (idle && baseRef.current) baseRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={baseRef}>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.72, 0.86, 0.28, 40]} />
        <meshStandardMaterial color="#303a4a" metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.34, 0.42, 0.2, 32]} />
        <meshStandardMaterial color="#d7ff00" metalness={0.62} roughness={0.25} />
      </mesh>

      <group position={[0, 0.18, 0]} rotation={[0, 0, (angles.shoulder * Math.PI) / 180]}>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.14, 0.19, 1.22, 24]} />
          <meshStandardMaterial color="#aab5c4" metalness={0.86} roughness={0.24} />
        </mesh>
        <mesh position={[0, 1.24, 0]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color="#d7ff00" metalness={0.7} roughness={0.22} />
        </mesh>

        <group position={[0, 1.24, 0]} rotation={[0, 0, (angles.elbow * Math.PI) / 180]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.105, 0.14, 1, 24]} />
            <meshStandardMaterial color="#7f8b9d" metalness={0.84} roughness={0.27} />
          </mesh>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.19, 24, 24]} />
            <meshStandardMaterial color="#d7ff00" metalness={0.68} roughness={0.24} />
          </mesh>

          <group position={[0, 1, 0]} rotation={[0, 0, (angles.wrist * Math.PI) / 180]}>
            <mesh position={[0, 0.18, 0]}>
              <boxGeometry args={[0.34, 0.2, 0.3]} />
              <meshStandardMaterial color="#c4ccd6" metalness={0.8} roughness={0.24} />
            </mesh>
            <mesh position={[-0.14, 0.45, 0]} rotation={[0, 0, -0.16]}>
              <boxGeometry args={[0.075, 0.42, 0.1]} />
              <meshStandardMaterial color="#d7ff00" metalness={0.65} roughness={0.24} />
            </mesh>
            <mesh position={[0.14, 0.45, 0]} rotation={[0, 0, 0.16]}>
              <boxGeometry args={[0.075, 0.42, 0.1]} />
              <meshStandardMaterial color="#d7ff00" metalness={0.65} roughness={0.24} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

const initialAngles: JointAngles = { shoulder: 18, elbow: -42, wrist: 12 };

export function RobotArmLab() {
  const [angles, setAngles] = useState<JointAngles>(initialAngles);
  const [idleMotion, setIdleMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIdleMotion(!media.matches);
    const update = () => setIdleMotion(!media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const updateJoint = (joint: keyof JointAngles, value: number) => {
    setAngles((current) => ({ ...current, [joint]: value }));
  };

  return (
    <div className="robot-lab-workspace">
      <div className="robot-lab-viewport">
        <div className="robot-lab-viewport-meta">
          <span>3-AXIS ARTICULATED ARM</span>
          <span><i /> LIVE KINEMATIC PREVIEW</span>
        </div>
        <Canvas
          camera={{ position: [4.4, 3.4, 5.6], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'low-power' }}
        >
          <color attach="background" args={['#080b11']} />
          <ambientLight intensity={0.65} />
          <directionalLight position={[4, 7, 5]} intensity={2.1} />
          <pointLight position={[-4, 2, -3]} intensity={1.1} color="#8ba7ff" />
          <gridHelper args={[12, 24, '#344054', '#1b2534']} position={[0, -0.28, 0]} />
          <RobotArmModel angles={angles} idle={idleMotion} />
          <OrbitControls enablePan={false} minDistance={4} maxDistance={11} target={[0, 1.25, 0]} />
        </Canvas>
        <p className="robot-lab-hint">DRAG TO ORBIT / SCROLL TO ZOOM</p>
      </div>

      <aside className="robot-lab-controls" aria-label="Robot joint controls">
        <div className="robot-lab-controls-heading">
          <div>
            <span className="engineering-lab-eyebrow">MANUAL INPUT / JOINT CONTROL</span>
            <h2>Move the arm.</h2>
          </div>
          <button type="button" onClick={() => setAngles(initialAngles)}>RESET</button>
        </div>

        {([
          ['shoulder', 'Shoulder', -70, 70],
          ['elbow', 'Elbow', -110, 110],
          ['wrist', 'Wrist', -90, 90],
        ] as const).map(([joint, label, min, max]) => (
          <label className="robot-joint-control" key={joint}>
            <span><strong>{label}</strong><output>{angles[joint]}°</output></span>
            <input
              type="range"
              min={min}
              max={max}
              step="1"
              value={angles[joint]}
              onChange={(event) => updateJoint(joint, Number(event.target.value))}
              aria-label={`${label} joint angle`}
            />
            <span className="robot-joint-range"><small>{min}°</small><small>{max}°</small></span>
          </label>
        ))}

        <div className="robot-lab-readout">
          <span>FORWARD KINEMATICS</span>
          <strong>3 ACTIVE JOINTS</strong>
          <p>Each slider changes a joint angle in the articulated chain. The base continues a slow idle rotation when motion is allowed.</p>
        </div>
        <p className="robot-lab-disclaimer">Interactive educational visualization — not a calibrated hardware controller or a physics-accurate industrial simulator.</p>
      </aside>
    </div>
  );
}
