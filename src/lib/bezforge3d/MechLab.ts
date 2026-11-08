import * as THREE from 'three';
import { RenderHost } from './RenderHost';

export type MechJoint =
  | 'leftShoulder' | 'rightShoulder'
  | 'leftElbow' | 'rightElbow'
  | 'leftWrist' | 'rightWrist'
  | 'leftHip' | 'rightHip'
  | 'leftKnee' | 'rightKnee';

export type MechLabOptions = {
  accent?: THREE.ColorRepresentation;
  onJointChange?: (joint: MechJoint, degrees: number) => void;
};

/** Procedural, locally generated ATLAS-style mech with independently addressable bilateral joints. */
export class MechLab {
  readonly host: RenderHost;
  readonly joints = new Map<MechJoint, THREE.Group>();
  private readonly accent: THREE.ColorRepresentation;
  private readonly accentMaterials = new Set<THREE.MeshStandardMaterial>();
  private readonly onJointChange?: MechLabOptions['onJointChange'];
  private powered = true;

  constructor(canvas: HTMLCanvasElement, options: MechLabOptions = {}) {
    this.accent = options.accent ?? '#d7ff35';
    this.onJointChange = options.onJointChange;
    this.host = new RenderHost(canvas, {
      background: '#050811',
      cameraPosition: [6, 4.2, 8],
      fov: 38,
      maxPixelRatio: 1.35,
    });
    this.build();
    this.setPowered(true);
  }

  private material(color: THREE.ColorRepresentation, metalness = 0.72) {
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness,
      roughness: 0.3,
    });
    if (new THREE.Color(color).getHex() === new THREE.Color(this.accent).getHex()) {
      material.emissive.set(this.accent);
      material.emissiveIntensity = this.powered ? 0.32 : 0;
      this.accentMaterials.add(material);
    }
    return material;
  }

  private box(
    parent: THREE.Object3D,
    size: [number, number, number],
    position: [number, number, number],
    color: THREE.ColorRepresentation,
  ) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), this.material(color));
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.userData.isMechPart = true;
    parent.add(mesh);
    return mesh;
  }

  private joint(
    parent: THREE.Object3D,
    name: MechJoint,
    position: [number, number, number],
    radius = 0.18,
  ) {
    const pivot = new THREE.Group();
    pivot.position.set(...position);
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 24, 20),
      this.material(this.accent, 0.9),
    );
    pivot.add(mesh);
    parent.add(pivot);
    this.joints.set(name, pivot);
    return pivot;
  }

  private build() {
    const scene = this.host.scene;
    scene.add(new THREE.HemisphereLight('#dce8ff', '#182333', 1.8));

    const key = new THREE.DirectionalLight('#ffffff', 2.8);
    key.position.set(4, 8, 6);
    scene.add(key);

    const rim = new THREE.PointLight(this.accent, 18, 14);
    rim.position.set(-3, 3, -3);
    scene.add(rim);

    const fill = new THREE.PointLight('#4e8dff', 7, 12);
    fill.position.set(4, 2, 4);
    scene.add(fill);

    const floor = new THREE.GridHelper(16, 32, '#596778', '#202c3b');
    floor.position.y = -0.05;
    scene.add(floor);

    const root = new THREE.Group();
    root.position.y = -1.55;
    scene.add(root);

    this.box(root, [1.2, 1.45, 0.68], [0, 1.8, 0], '#344457');
    this.box(root, [1.55, 0.28, 0.82], [0, 2.35, 0], '#77879a');
    this.box(root, [0.62, 0.58, 0.55], [0, 2.9, 0], '#9ba9b8');
    this.box(root, [0.42, 0.09, 0.08], [0, 2.9, 0.3], this.accent);

    const buildArm = (side: -1 | 1) => {
      const prefix = side < 0 ? 'left' : 'right';
      const shoulder = this.joint(root, `${prefix}Shoulder`, [side * 0.82, 2.2, 0], 0.23);
      this.box(shoulder, [0.38, 0.9, 0.42], [0, -0.48, 0], '#687a8d');

      const elbow = this.joint(shoulder, `${prefix}Elbow`, [0, -0.92, 0], 0.18);
      this.box(elbow, [0.3, 0.78, 0.34], [0, -0.4, 0], '#a5b1bf');

      const wrist = this.joint(elbow, `${prefix}Wrist`, [0, -0.8, 0], 0.14);
      this.box(wrist, [0.38, 0.24, 0.42], [0, -0.12, 0], this.accent);
    };

    const buildLeg = (side: -1 | 1) => {
      const prefix = side < 0 ? 'left' : 'right';
      const hip = this.joint(root, `${prefix}Hip`, [side * 0.34, 1.12, 0], 0.19);
      this.box(hip, [0.4, 0.82, 0.48], [0, -0.42, 0], '#526477');

      const knee = this.joint(hip, `${prefix}Knee`, [0, -0.82, 0], 0.15);
      this.box(knee, [0.42, 0.78, 0.55], [0, -0.4, 0.08], '#9ba9b8');
      this.box(knee, [0.58, 0.2, 0.82], [0, -0.82, 0.18], this.accent);
    };

    buildArm(-1);
    buildArm(1);
    buildLeg(-1);
    buildLeg(1);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 1.05, 0.22, 48),
      this.material('#202b39'),
    );
    base.position.y = -0.02;
    scene.add(base);
  }

  setJoint(joint: MechJoint, degrees: number) {
    const pivot = this.joints.get(joint);
    if (!pivot || !Number.isFinite(degrees)) return;

    const limits: Record<MechJoint, [number, number]> = {
      leftShoulder: [-100, 100],
      rightShoulder: [-100, 100],
      leftElbow: [-135, 135],
      rightElbow: [-135, 135],
      leftWrist: [-90, 90],
      rightWrist: [-90, 90],
      leftHip: [-65, 65],
      rightHip: [-65, 65],
      leftKnee: [-110, 10],
      rightKnee: [-110, 10],
    };
    const value = THREE.MathUtils.clamp(degrees, ...limits[joint]);
    pivot.rotation.z = THREE.MathUtils.degToRad(value);
    this.onJointChange?.(joint, value);
  }

  setPowered(powered: boolean) {
    this.powered = powered;
    this.accentMaterials.forEach((material) => {
      material.emissive.set(powered ? this.accent : '#000000');
      material.emissiveIntensity = powered ? 0.32 : 0;
    });
  }

  reset() {
    this.joints.forEach((joint) => joint.rotation.set(0, 0, 0));
  }

  dispose() {
    this.host.dispose();
    this.accentMaterials.clear();
    this.joints.clear();
  }
}
