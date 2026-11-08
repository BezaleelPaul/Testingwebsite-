import * as THREE from 'three';
import { RenderHost } from './RenderHost';

export type MechJoint = 'shoulder' | 'elbow' | 'wrist' | 'hip' | 'knee';
export type MechLabOptions = { accent?: THREE.ColorRepresentation; onJointChange?: (joint: MechJoint, degrees: number) => void };

/** Procedural ATLAS-style articulated mech. Geometry is generated locally; no model downloads. */
export class MechLab {
  readonly host: RenderHost;
  readonly joints = new Map<MechJoint, THREE.Group>();
  private powered = true;
  private accent: THREE.ColorRepresentation;

  constructor(canvas: HTMLCanvasElement, options: MechLabOptions = {}) {
    this.accent = options.accent ?? '#d7ff35';
    this.host = new RenderHost(canvas, { cameraPosition: [6, 4.2, 8], fov: 38, maxPixelRatio: 1.4 });
    this.build();
  }

  private material(color: THREE.ColorRepresentation, metalness = 0.72) {
    return new THREE.MeshStandardMaterial({ color, metalness, roughness: 0.28 });
  }
  private box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], color: THREE.ColorRepresentation) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), this.material(color));
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.userData.isMechPart = true;
    parent.add(mesh);
    return mesh;
  }
  private joint(parent: THREE.Object3D, name: MechJoint, position: [number, number, number], radius = 0.18) {
    const pivot = new THREE.Group();
    pivot.position.set(...position);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 20), this.material(this.accent, 0.9));
    pivot.add(mesh);
    parent.add(pivot);
    this.joints.set(name, pivot);
    return pivot;
  }

  private build() {
    const scene = this.host.scene;
    scene.add(new THREE.HemisphereLight('#dce8ff', '#182333', 2.1));
    const key = new THREE.DirectionalLight('#ffffff', 3.2); key.position.set(4, 8, 6); scene.add(key);
    const rim = new THREE.PointLight(this.accent, 22, 12); rim.position.set(-3, 3, -3); scene.add(rim);
    const floor = new THREE.GridHelper(16, 32, '#596778', '#202c3b'); floor.position.y = -0.05; scene.add(floor);

    const root = new THREE.Group(); root.position.y = -1.55; scene.add(root);
    this.box(root, [1.2, 1.45, 0.68], [0, 1.8, 0], '#344457');
    this.box(root, [1.55, 0.28, 0.82], [0, 2.35, 0], '#77879a');
    this.box(root, [0.62, 0.58, 0.55], [0, 2.9, 0], '#9ba9b8');
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.09, 0.08), new THREE.MeshBasicMaterial({ color: this.accent }));
    visor.position.set(0, 2.9, 0.3); root.add(visor);

    const shoulder = this.joint(root, 'shoulder', [0.82, 2.2, 0], 0.23);
    this.box(shoulder, [0.38, 0.9, 0.42], [0, -0.48, 0], '#687a8d');
    const elbow = this.joint(shoulder, 'elbow', [0, -0.92, 0], 0.18);
    this.box(elbow, [0.3, 0.78, 0.34], [0, -0.4, 0], '#a5b1bf');
    const wrist = this.joint(elbow, 'wrist', [0, -0.8, 0], 0.14);
    this.box(wrist, [0.38, 0.24, 0.42], [0, -0.12, 0], this.accent);

    const leftShoulder = new THREE.Group(); leftShoulder.position.set(-0.82, 2.2, 0); root.add(leftShoulder);
    this.box(leftShoulder, [0.38, 1.2, 0.42], [0, -0.45, 0], '#687a8d');
    const hipL = this.joint(root, 'hip', [-0.34, 1.12, 0], 0.18);
    this.box(hipL, [0.4, 0.82, 0.48], [0, -0.42, 0], '#526477');
    const kneeL = this.joint(hipL, 'knee', [0, -0.82, 0], 0.15);
    this.box(kneeL, [0.42, 0.78, 0.55], [0, -0.4, 0.08], '#9ba9b8');
    this.box(kneeL, [0.58, 0.2, 0.82], [0, -0.82, 0.18], this.accent);

    const hipR = new THREE.Group(); hipR.position.set(0.34, 1.12, 0); root.add(hipR);
    this.box(hipR, [0.4, 0.82, 0.48], [0, -0.42, 0], '#526477');
    const kneeR = this.joint(hipR, 'knee', [0, -0.82, 0], 0.15);
    this.box(kneeR, [0.42, 0.78, 0.55], [0, -0.4, 0.08], '#9ba9b8');
    this.box(kneeR, [0.58, 0.2, 0.82], [0, -0.82, 0.18], this.accent);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.22, 48), this.material('#202b39'));
    base.position.y = -0.02; scene.add(base);
  }

  setJoint(joint: MechJoint, degrees: number) {
    const pivot = this.joints.get(joint);
    if (!pivot) return;
    const limits: Record<MechJoint, [number, number]> = { shoulder: [-100, 100], elbow: [-135, 135], wrist: [-90, 90], hip: [-65, 65], knee: [-110, 10] };
    const value = THREE.MathUtils.clamp(degrees, ...limits[joint]);
    pivot.rotation.z = THREE.MathUtils.degToRad(value);
  }
  setPowered(powered: boolean) {
    this.powered = powered;
    this.joints.forEach((pivot) => pivot.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material instanceof THREE.MeshStandardMaterial) mesh.material.emissive.set(powered ? this.accent : '#000000');
      if (mesh.material instanceof THREE.MeshStandardMaterial) mesh.material.emissiveIntensity = powered ? 0.28 : 0;
    }));
  }
  reset() { this.joints.forEach((joint) => joint.rotation.set(0, 0, 0)); }
  dispose() { this.host.dispose(); }
}
