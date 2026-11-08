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

function MechPrototype({ form, angles, powered }: { form: Form; angles: JointAngles; powered: boolean }) {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const wheels = useRef<Group>(null);
  const fins = useRef<Group>(null);
  const rightForearm = useRef<Group>(null);
  const rightHand = useRef<Group>(null);
  const progress = useRef(form === 'rover' ? 1 : 0);

  useFrame((state, delta) => {
    const folded = form === 'rover' ? 1 : 0;
    progress.current = MathUtils.damp(progress.current, folded, 2.8, delta);
    const p = progress.current;
    const mix = (a: number, b: number) => MathUtils.lerp(a, b, p);
    if (body.current) {
      body.current.scale.set(mix(1, 1.34), mix(1, 0.62), mix(1, 1.2));
      body.current.rotation.x = mix(0, -0.1);
      body.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.28) * 0.025;
    }
    if (head.current) {
      head.current.position.set(0, mix(2.18, 0.82), mix(0, 0.08));
      head.current.rotation.x = mix(0, -0.22);
    }
    if (leftArm.current) {
      leftArm.current.position.set(mix(-0.78, -0.46), mix(1.42, 0.98), mix(0, 0.2));
      leftArm.current.rotation.z = mix(0.12, -1.12);
    }
    if (rightArm.current) {
      rightArm.current.position.set(mix(0.78, 0.46), mix(1.42, 0.98), mix(0, 0.2));
      rightArm.current.rotation.z = mix(-0.12, 1.12) + MathUtils.degToRad(angles.shoulder) * (1 - p);
    }
    if (rightForearm.current) {
      rightForearm.current.rotation.z = MathUtils.degToRad(angles.elbow) * (1 - p);
    }
    if (rightHand.current) {
      rightHand.current.rotation.z = MathUtils.degToRad(angles.wrist) * (1 - p);
    }
    if (leftLeg.current) {
      leftLeg.current.position.set(mix(-0.34, -0.54), mix(0.48, 0.24), 0);
      leftLeg.current.rotation.z = mix(0, -0.92);
    }
    if (rightLeg.current) {
      rightLeg.current.position.set(mix(0.34, 0.54), mix(0.48, 0.24), 0);
      rightLeg.current.rotation.z = mix(0, 0.92);
    }
    if (wheels.current) wheels.current.scale.setScalar(p);
    if (fins.current) fins.current.scale.setScalar(p);
  });

  return (
    <group position={[0, -0.18, 0]}>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.88, 1.02, 0.28, 48]} />
        <meshStandardMaterial color="#202a37" metalness={0.86} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.58, 0.72, 0.12, 40]} />
        <meshStandardMaterial color="#cfff27" metalness={0.7} roughness={0.22} emissive="#cfff27" emissiveIntensity={powered ? 1.2 : 0.08} />
      </mesh>
      <group ref={body} position={[0, 1.15, 0]}>
        <Armor position={[0, 0, 0]} scale={[1.22, 1.32, 0.72]} color="#283748" />
        <Armor position={[0, 0.56, 0.04]} scale={[1.55, 0.34, 0.82]} color="#45576b" />
        <Armor position={[-0.68, 0.48, 0.02]} scale={[0.28, 0.58, 0.72]} color="#a7b5c5" rotation={[0, 0, -0.12]} />
        <Armor position={[0.68, 0.48, 0.02]} scale={[0.28, 0.58, 0.72]} color="#a7b5c5" rotation={[0, 0, 0.12]} />
        <mesh position={[0, 0.02, 0.39]}>
          <circleGeometry args={[0.27, 48]} />
          <meshBasicMaterial color={powered ? '#d9ff43' : '#425166'} />
        </mesh>
        <mesh position={[0, 0.02, 0.405]}>
          <circleGeometry args={[0.16, 48]} />
          <meshBasicMaterial color="#101820" />
        </mesh>
        <Armor position={[0, -0.63, 0]} scale={[0.88, 0.3, 0.7]} color="#647487" />
      </group>
      <group ref={head} position={[0, 2.18, 0]}>
        <Armor position={[0, 0.04, 0]} scale={[0.58, 0.54, 0.52]} color="#667789" />
        <Armor position={[0, -0.1, 0.27]} scale={[0.42, 0.13, 0.12]} color="#1b2634" />
        <mesh position={[-0.12, 0.04, 0.335]}>
          <boxGeometry args={[0.12, 0.055, 0.035]} />
          <meshBasicMaterial color="#cfff27" />
        </mesh>
        <mesh position={[0.12, 0.04, 0.335]}>
          <boxGeometry args={[0.12, 0.055, 0.035]} />
          <meshBasicMaterial color="#cfff27" />
        </mesh>
        <Armor position={[-0.34, 0.18, 0]} scale={[0.12, 0.34, 0.16]} color="#cfff27" rotation={[0, 0, -0.28]} />
        <Armor position={[0.34, 0.18, 0]} scale={[0.12, 0.34, 0.16]} color="#cfff27" rotation={[0, 0, 0.28]} />
      </group>
      <group ref={leftArm} position={[-0.78, 1.42, 0]}>
        <Armor position={[0, -0.32, 0]} scale={[0.38, 0.76, 0.48]} color="#53677c" />
        <Joint position={[0, -0.72, 0]} radius={0.2} />
        <Armor position={[0, -1.04, 0]} scale={[0.31, 0.64, 0.38]} color="#8d9aab" />
        <Armor position={[0, -1.42, 0.06]} scale={[0.34, 0.22, 0.42]} accent />
      </group>
      <group ref={rightArm} position={[0.78, 1.42, 0]}>
        <Armor position={[0, -0.32, 0]} scale={[0.38, 0.76, 0.48]} color="#53677c" />
        <Joint position={[0, -0.72, 0]} radius={0.2} />
        <group ref={rightForearm} position={[0, -0.72, 0]}>
          <Armor position={[0, -0.34, 0]} scale={[0.31, 0.66, 0.38]} color="#8d9aab" />
          <group ref={rightHand} position={[0, -0.72, 0.06]}>
            <Armor position={[0, 0, 0]} scale={[0.34, 0.22, 0.42]} accent />
            <Joint position={[0, -0.06, 0.06]} radius={0.11} />
          </group>
        </group>
      </group>
      <group ref={leftLeg} position={[-0.34, 0.48, 0]}>
        <Armor position={[0, -0.34, 0]} scale={[0.42, 0.76, 0.5]} color="#526579" />
        <Joint position={[0, -0.76, 0]} radius={0.18} />
        <Armor position={[0, -1.06, 0.08]} scale={[0.42, 0.64, 0.62]} color="#9aa9b9" />
        <Armor position={[0, -1.42, 0.22]} scale={[0.58, 0.2, 0.86]} color="#cfff27" />
      </group>
      <group ref={rightLeg} position={[0.34, 0.48, 0]}>
        <Armor position={[0, -0.34, 0]} scale={[0.42, 0.76, 0.5]} color="#526579" />
        <Joint position={[0, -0.76, 0]} radius={0.18} />
        <Armor position={[0, -1.06, 0.08]} scale={[0.42, 0.64, 0.62]} color="#9aa9b9" />
        <Armor position={[0, -1.42, 0.22]} scale={[0.58, 0.2, 0.86]} color="#cfff27" />
      </group>
      <group ref={wheels}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.86, 0.3, 0.04]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.34, 0.34, 0.2, 32]} />
              <meshStandardMaterial color="#101820" metalness={0.35} roughness={0.72} />
            </mesh>
            <mesh position={[0, 0.11, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.025, 24]} />
              <meshStandardMaterial color="#cfff27" metalness={0.7} roughness={0.24} emissive="#8eaa12" emissiveIntensity={0.4} />
            </mesh>
          </group>
        ))}
      </group>
      <group ref={fins}>
        <Armor position={[-0.86, 1.52, -0.18]} scale={[0.14, 0.72, 0.92]} color="#9aa9b9" rotation={[0.3, 0, -0.55]} />
        <Armor position={[0.86, 1.52, -0.18]} scale={[0.14, 0.72, 0.92]} color="#9aa9b9" rotation={[0.3, 0, 0.55]} />
      </group>
      <Sparkles count={powered ? 34 : 12} scale={[3.5, 4.2, 2.2]} size={2.2} speed={0.18} color="#cfff27" opacity={powered ? 0.68 : 0.2} />
    </group>
  );
}

function MechScene({ form, angles, powered }: { form: Form; angles: JointAngles; powered: boolean }) {
  return (
    <>
      <color attach="background" args={['#080c13']} />
      <fog attach="fog" args={['#080c13', 8, 18]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 6]} intensity={2.4} color="#dce7ff" />
      <pointLight position={[-4, 3, -3]} intensity={2.4} color="#cfff27" />
      <pointLight position={[3, 2, 4]} intensity={1.2} color="#4e8dff" />
      <Stars radius={45} depth={22} count={500} factor={3} saturation={0} fade speed={0.2} />
      <gridHelper args={[14, 28, '#384653', '#17232f']} position={[0, -0.28, 0]} />
      <MechPrototype form={form} angles={angles} powered={powered} />
      <ContactShadows position={[0, -0.265, 0]} opacity={0.48} scale={7} blur={2.4} far={4} />
      <OrbitControls enablePan={false} minDistance={4.6} maxDistance={10} minPolarAngle={0.55} maxPolarAngle={Math.PI / 2.02} target={[0, 1.05, 0]} />
      <Environment preset="city" />
    </>
  );
}

export function RobotArmLab() {
  const [angles, setAngles] = useState<JointAngles>(initialAngles);
  const [form, setForm] = useState<Form>('mech');
  const [powered, setPowered] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [calibrated, setCalibrated] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const calibration = useMemo(() => {
    const target: JointAngles = { shoulder: -18, elbow: 34, wrist: -8 };
    const error = Math.abs(angles.shoulder - target.shoulder) + Math.abs(angles.elbow - target.elbow) + Math.abs(angles.wrist - target.wrist);
    return Math.max(0, Math.round(100 - error / 1.2));
  }, [angles]);

  const updateJoint = (joint: keyof JointAngles, value: number) => {
    setAngles((current) => ({ ...current, [joint]: value }));
    setCalibrated(false);
  };

  const reset = () => {
    setAngles(initialAngles);
    setForm('mech');
    setPowered(true);
    setCalibrated(false);
  };

  return (
    <div className="robot-lab-experience">
      <div className="robot-lab-workspace">
        <div className="robot-lab-viewport">
          <div className="robot-lab-viewport-meta">
            <span><i className="robot-status-light" /> ATLAS-01 / SHIFTER PROTOTYPE</span>
            <span>{powered ? 'CORE ONLINE' : 'STANDBY MODE'} · {form === 'mech' ? 'BIPEDAL CONFIG' : 'ROVER CONFIG'}</span>
          </div>
          <Canvas camera={{ position: [4.6, 3.2, 6.3], fov: 38 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
            <MechScene form={form} angles={angles} powered={powered && !reducedMotion} />
          </Canvas>
          <div className="robot-lab-scanline" />
          <p className="robot-lab-hint">DRAG TO ORBIT / SCROLL TO ZOOM</p>
          <div className="robot-lab-viewport-corner">BP // R&amp;D DIVISION<br />UNIT 001</div>
        </div>

        <aside className="robot-lab-controls" aria-label="ATLAS prototype controls">
          <div className="robot-lab-controls-heading">
            <div>
              <span className="engineering-lab-eyebrow"><Cpu size={12} /> PROTOTYPE CONTROL</span>
              <h2>ATLAS-01</h2>
              <p className="robot-lab-subtitle">Adaptive Transformable Locomotion &amp; Assembly System</p>
            </div>
            <button type="button" onClick={reset} aria-label="Reset prototype"><RotateCcw size={14} /></button>
          </div>

          <div className="robot-lab-power-row">
            <span><i className={powered ? 'robot-status-light' : 'robot-status-light is-off'} /> REACTOR</span>
            <button type="button" className={powered ? 'robot-power-toggle is-on' : 'robot-power-toggle'} onClick={() => setPowered((value) => !value)}>{powered ? 'ONLINE' : 'POWER UP'}</button>
          </div>

          <div className="robot-form-switch" aria-label="Transformation mode">
            <button type="button" className={form === 'mech' ? 'is-active' : ''} onClick={() => setForm('mech')}><Activity size={14} /> MECH FORM</button>
            <button type="button" className={form === 'rover' ? 'is-active' : ''} onClick={() => setForm('rover')}><ArrowLeftRight size={14} /> ROVER FORM</button>
          </div>
          <button type="button" className="robot-transform-button" onClick={() => setForm((current) => current === 'mech' ? 'rover' : 'mech')}>
            <Zap size={15} /> INITIATE TRANSFORMATION <ArrowDownRight size={15} />
          </button>

          <div className="robot-control-divider" />
          <div className="robot-control-title"><span>MANIPULATOR JOINTS</span><span>3-DOF / LIVE</span></div>
          {([
            ['shoulder', 'SHOULDER PITCH', -70, 70],
            ['elbow', 'ELBOW ROTATION', -80, 80],
            ['wrist', 'WRIST TILT', -60, 60],
          ] as const).map(([joint, label, min, max]) => (
            <label className="robot-joint-control" key={joint}>
              <span>{label}<output>{angles[joint]}°</output></span>
              <input type="range" aria-label={joint === "shoulder" ? "Shoulder joint angle" : joint === "elbow" ? "Elbow joint angle" : "Wrist joint angle"} min={min} max={max} value={angles[joint]} onChange={(event) => updateJoint(joint, Number(event.target.value))} />
            </label>
          ))}

          <div className="robot-calibration">
            <div className="robot-calibration-heading"><span><Gauge size={13} /> CORE ALIGNMENT</span><strong>{calibration}%</strong></div>
            <div className="robot-calibration-track"><span style={{ width: `${calibration}%` }} /></div>
            <p>{calibrated ? 'CALIBRATION LOCKED — NICE WORK.' : 'Return all three joints to their green reference marks to lock calibration.'}</p>
            <button type="button" onClick={() => { setAngles(initialAngles); setCalibrated(true); }}>AUTO-CALIBRATE <ShieldCheck size={13} /></button>
          </div>
        </aside>
      </div>

      <div className="robot-lab-lower">
        <div><span className="robot-lab-lower-index">01 / SYSTEMS</span><strong>TRANSFORMABLE CHASSIS</strong><p>Articulated armor, folding fins and deployable wheel assemblies.</p></div>
        <div><span className="robot-lab-lower-index">02 / CONTROL</span><strong>3-DOF MANIPULATOR</strong><p>Adjust the shoulder, elbow and wrist to explore joint kinematics.</p></div>
        <div><span className="robot-lab-lower-index">03 / OBJECTIVE</span><strong>CALIBRATE THE CORE</strong><p>Complete the alignment sequence and bring the reactor to full sync.</p></div>
      </div>
    </div>
  );
}
