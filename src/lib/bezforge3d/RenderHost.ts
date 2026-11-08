import * as THREE from 'three';

export type RenderHostOptions = {
  background?: THREE.ColorRepresentation;
  cameraPosition?: [number, number, number];
  fov?: number;
  maxPixelRatio?: number;
  onFrame?: (delta: number, elapsed: number) => void;
};

/** Small lifecycle-safe Three.js host shared by OrbitLab and MechLab. */
export class RenderHost {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  private frame = 0;
  private previous = 0;
  private elapsed = 0;
  private observer: ResizeObserver;
  private disposed = false;
  private pointer = { down: false, x: 0, y: 0, moved: false };
  private drag = { x: 0, y: 0 };
  private spherical = new THREE.Spherical();
  private target = new THREE.Vector3();
  private readonly onFrame?: RenderHostOptions['onFrame'];

  constructor(readonly canvas: HTMLCanvasElement, options: RenderHostOptions = {}) {
    this.scene.background = new THREE.Color(options.background ?? '#050811');
    this.camera = new THREE.PerspectiveCamera(options.fov ?? 42, 1, 0.1, 2000);
    this.camera.position.set(...(options.cameraPosition ?? [0, 32, 72]));
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.onFrame = options.onFrame;
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
    this.bindOrbitInput();
    this.start();
  }

  private resize() {
    if (this.disposed) return;
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private bindOrbitInput() {
    const down = (event: PointerEvent) => {
      this.pointer = { down: true, x: event.clientX, y: event.clientY, moved: false };
      this.drag = { x: event.clientX, y: event.clientY };
      this.canvas.setPointerCapture?.(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!this.pointer.down) return;
      const dx = event.clientX - this.drag.x;
      const dy = event.clientY - this.drag.y;
      if (Math.abs(event.clientX - this.pointer.x) + Math.abs(event.clientY - this.pointer.y) > 4) this.pointer.moved = true;
      this.drag = { x: event.clientX, y: event.clientY };
      this.camera.position.sub(this.target);
      this.spherical.setFromVector3(this.camera.position);
      this.spherical.theta -= dx * 0.005;
      this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + dy * 0.005, 0.12, Math.PI - 0.12);
      this.camera.position.setFromSpherical(this.spherical).add(this.target);
      this.camera.lookAt(this.target);
    };
    const up = () => { this.pointer.down = false; };
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const offset = this.camera.position.clone().sub(this.target);
      offset.multiplyScalar(THREE.MathUtils.clamp(1 + event.deltaY * 0.001, 0.82, 1.18));
      this.camera.position.copy(this.target).add(offset);
    };
    this.canvas.addEventListener('pointerdown', down);
    this.canvas.addEventListener('pointermove', move);
    this.canvas.addEventListener('pointerup', up);
    this.canvas.addEventListener('pointercancel', up);
    this.canvas.addEventListener('wheel', wheel, { passive: false });
    this.cleanupInput = () => {
      this.canvas.removeEventListener('pointerdown', down);
      this.canvas.removeEventListener('pointermove', move);
      this.canvas.removeEventListener('pointerup', up);
      this.canvas.removeEventListener('pointercancel', up);
      this.canvas.removeEventListener('wheel', wheel);
    };
  }

  private cleanupInput = () => {};
  private start() {
    const tick = (time: number) => {
      if (this.disposed) return;
      const delta = this.previous ? Math.min((time - this.previous) / 1000, 0.05) : 0;
      this.previous = time;
      this.elapsed += delta;
      this.onFrame?.(delta, this.elapsed);
      this.renderer.render(this.scene, this.camera);
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  setTarget(target: THREE.Vector3) { this.target.copy(target); this.camera.lookAt(target); }
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.observer.disconnect();
    this.cleanupInput();
    this.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => material.dispose());
      }
    });
    this.renderer.dispose();
  }
}
