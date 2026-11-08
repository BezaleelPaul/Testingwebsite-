import * as THREE from 'three';
import { RenderHost } from './RenderHost';

export type OrbitBody = {
  id: string; name: string; radius: number; orbitRadius: number; color: THREE.ColorRepresentation;
  period: number; eccentricity?: number; tilt?: number; emissive?: boolean; ring?: boolean;
};

export const DEFAULT_ORBIT_BODIES: OrbitBody[] = [
  { id: 'mercury', name: 'Mercury', radius: 0.55, orbitRadius: 8, color: '#aaa6a0', period: 0.24 },
  { id: 'venus', name: 'Venus', radius: 0.92, orbitRadius: 12, color: '#d9a56c', period: 0.62 },
  { id: 'earth', name: 'Earth', radius: 1, orbitRadius: 17, color: '#2879d8', period: 1, tilt: 23.4 },
  { id: 'mars', name: 'Mars', radius: 0.72, orbitRadius: 22, color: '#c65b43', period: 1.88 },
  { id: 'jupiter', name: 'Jupiter', radius: 3.1, orbitRadius: 31, color: '#c99a70', period: 11.86 },
  { id: 'saturn', name: 'Saturn', radius: 2.55, orbitRadius: 41, color: '#d8c18a', period: 29.4, ring: true },
  { id: 'uranus', name: 'Uranus', radius: 1.7, orbitRadius: 50, color: '#79cbd0', period: 84 },
  { id: 'neptune', name: 'Neptune', radius: 1.65, orbitRadius: 59, color: '#416ed4', period: 164.8 },
];

export type OrbitLabOptions = { speed?: number; onSelect?: (body: OrbitBody | null) => void };

// Official JPL/Caltech Solar System Simulator equirectangular maps.
// Bodies without a suitable global map retain their physically-inspired base color.
const NASA_JPL_TEXTURES: Record<string, string> = {
  mercury: 'https://space.jpl.nasa.gov/tmaps/pix/mer0muu2.jpg',
  earth: 'https://space.jpl.nasa.gov/tmaps/pix/ear0xuu2.jpg',
  mars: 'https://space.jpl.nasa.gov/tmaps/pix/mar0kuu2.jpg',
  jupiter: 'https://space.jpl.nasa.gov/tmaps/pix/jup0vss1.jpg',
};

/** Procedural solar-system renderer. Distances and radii are intentionally compressed for legibility. */
export class OrbitLab {
  readonly host: RenderHost;
  readonly bodies = new Map<string, THREE.Group>();
  private orbitData: OrbitBody[];
  private speed: number;
  private paused = false;
  private raycaster = new THREE.Raycaster();
  private textureLoader = new THREE.TextureLoader();
  private pointer = new THREE.Vector2();
  private clickHandler: (event: MouseEvent) => void;
  private pointerStart: { x: number; y: number } | null = null;
  private dragged = false;
  private readonly pointerDownHandler = (event: PointerEvent) => { this.pointerStart = { x: event.clientX, y: event.clientY }; this.dragged = false; };
  private readonly pointerUpHandler = (event: PointerEvent) => {
    if (!this.pointerStart) return;
    this.dragged = Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y) > 5;
    this.pointerStart = null;
  };

  constructor(canvas: HTMLCanvasElement, options: OrbitLabOptions = {}) {
    this.orbitData = DEFAULT_ORBIT_BODIES;
    this.speed = options.speed ?? 1;
    this.host = new RenderHost(canvas, { cameraPosition: [0, 38, 78], maxPixelRatio: 1.35, onFrame: (delta) => this.update(delta) });
    this.build();
    this.clickHandler = (event) => {
      if (this.dragged) { this.dragged = false; return; }
      const rect = canvas.getBoundingClientRect();
      this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      this.raycaster.setFromCamera(this.pointer, this.host.camera);
      const hits = this.raycaster.intersectObjects([...this.bodies.values()].flatMap((group) => group.children), true);
      const id = hits[0]?.object.userData.bodyId as string | undefined;
      options.onSelect?.(this.orbitData.find((body) => body.id === id) ?? null);
    };
    canvas.addEventListener('pointerdown', this.pointerDownHandler);
    canvas.addEventListener('pointerup', this.pointerUpHandler);
    canvas.addEventListener('pointercancel', this.pointerUpHandler);
    canvas.addEventListener('click', this.clickHandler);
  }

  private build() {
    const scene = this.host.scene;
    scene.add(new THREE.AmbientLight('#9eabc7', 0.65));
    const sunLight = new THREE.PointLight('#fff0ce', 1800, 260, 1.35);
    scene.add(sunLight);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(3.7, 48, 32), new THREE.MeshBasicMaterial({ color: '#ffca65' }));
    scene.add(sun);
    const glow = new THREE.Mesh(new THREE.SphereGeometry(4.5, 32, 24), new THREE.MeshBasicMaterial({ color: '#ff8b32', transparent: true, opacity: 0.12, side: THREE.BackSide }));
    scene.add(glow);
    const starsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(2400 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 420;
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: '#c9d8ff', size: 0.42, sizeAttenuation: true })));

    this.orbitData.forEach((data, index) => {
      const orbit = new THREE.EllipseCurve(0, 0, data.orbitRadius, data.orbitRadius * (1 - (data.eccentricity ?? 0)), 0, Math.PI * 2, false, 0);
      const points = orbit.getPoints(180).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: '#68758d', transparent: true, opacity: 0.32 }));
      scene.add(line);
      const pivot = new THREE.Group();
      scene.add(pivot);
      const body = new THREE.Group();
      const material = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.82, metalness: 0.02 });
      const textureUrl = NASA_JPL_TEXTURES[data.id];
      if (textureUrl) {
        this.textureLoader.setCrossOrigin('anonymous');
        this.textureLoader.load(
          textureUrl,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(4, this.host.renderer.capabilities.getMaxAnisotropy());
            material.map = texture;
            material.color.set('#ffffff');
            material.needsUpdate = true;
          },
          undefined,
          () => {
            // Keep the body visible with its fallback color if the remote map is unavailable.
          },
        );
      }
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 32, 24), material);
      sphere.userData.bodyId = data.id;
      body.add(sphere);
      if (data.ring) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(data.radius * 1.35, data.radius * 2.15, 96), new THREE.MeshStandardMaterial({ color: '#c7ae82', side: THREE.DoubleSide, transparent: true, opacity: 0.78, roughness: 0.9 }));
        ring.rotation.x = -Math.PI / 2.35;
        body.add(ring);
      }
      pivot.add(body);
      this.bodies.set(data.id, pivot);
      pivot.userData.orbitData = { ...data, body };
      const phase = index * 0.7;
      pivot.userData.phase = phase;
      body.position.set(data.orbitRadius * Math.cos(phase), 0, data.orbitRadius * Math.sin(phase));
    });
  }

  private update(delta: number) {
    if (this.paused) return;
    this.bodies.forEach((pivot) => {
      const data = pivot.userData.orbitData as OrbitBody & { body: THREE.Group };
      const phase = ((pivot.userData.phase as number) + delta * this.speed * (0.32 / Math.sqrt(data.period))) % (Math.PI * 2);
      pivot.userData.phase = phase;
      // Move the planet itself around the star. Rotating both the pivot and its offset
      // would apply the orbital angle twice and distort the intended orbit.
      data.body.position.set(
        data.orbitRadius * (1 - (data.eccentricity ?? 0)) * Math.cos(phase),
        Math.sin(phase * 0.7) * (data.tilt ?? 0) * 0.012,
        data.orbitRadius * Math.sin(phase),
      );
      data.body.traverse((object) => { if (object instanceof THREE.Mesh) object.userData.bodyId = data.id; });
    });
  }

  setSpeed(speed: number) { this.speed = THREE.MathUtils.clamp(speed, 0, 8); }
  pause() { this.paused = true; }
  play() { this.paused = false; }
  toggle() { this.paused = !this.paused; return this.paused; }
  dispose() {
    this.host.canvas.removeEventListener('pointerdown', this.pointerDownHandler);
    this.host.canvas.removeEventListener('pointerup', this.pointerUpHandler);
    this.host.canvas.removeEventListener('pointercancel', this.pointerUpHandler);
    this.host.canvas.removeEventListener('click', this.clickHandler);
    this.host.dispose();
  }
}
