'use client';

import { useEffect, useRef, useState } from 'react';

type SpacekitRenderer = {
  setAnimationLoop?: (callback: null) => void;
  dispose?: () => void;
};

type SpacekitSimulation = {
  createSkybox: (preset: unknown) => unknown;
  createStars?: (options?: { minSize?: number }) => unknown;
  createObject: (name: string, preset: unknown) => unknown;
  getRenderer?: () => SpacekitRenderer;
};

type SpacekitApi = {
  Simulation: new (
    container: HTMLElement,
    options: {
      basePath: string;
      camera: { initialPosition: number[]; enableDrift: boolean };
      debug: { showAxes: boolean; showGrid: boolean; showStats: boolean };
    }
  ) => SpacekitSimulation;
  SkyboxPresets: { NASA_TYCHO: unknown };
  SpaceObjectPresets: Record<string, unknown>;
};

declare global {
  interface Window {
    Spacekit?: SpacekitApi;
  }
}

type SceneStatus = 'loading' | 'ready' | 'fallback';

export function SpacekitUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<SpacekitSimulation | null>(null);
  const [status, setStatus] = useState<SceneStatus>('loading');

  useEffect(() => {
    let disposed = false;
    let script: HTMLScriptElement | null = null;
    let fallbackTimer: number | undefined;

    const fail = () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      if (!disposed) setStatus('fallback');
    };

    const initialise = () => {
      const Spacekit = window.Spacekit;
      if (disposed || !containerRef.current || !Spacekit) {
        fail();
        return;
      }

      try {
        const simulation = new Spacekit.Simulation(containerRef.current, {
          basePath: 'https://typpo.github.io/spacekit',
          camera: { initialPosition: [0, -34, 17], enableDrift: true },
          debug: { showAxes: false, showGrid: false, showStats: false },
        });

        simulation.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);
        simulation.createStars?.({ minSize: 0.7 });

        const presets = Spacekit.SpaceObjectPresets;
        const bodies = [
          ['sun', 'SUN'],
          ['mercury', 'MERCURY'],
          ['venus', 'VENUS'],
          ['earth', 'EARTH'],
          ['mars', 'MARS'],
          ['jupiter', 'JUPITER'],
          ['saturn', 'SATURN'],
          ['uranus', 'URANUS'],
          ['neptune', 'NEPTUNE'],
        ] as const;

        bodies.forEach(([name, preset]) => {
          const objectPreset = presets[preset];
          if (objectPreset) simulation.createObject(name, objectPreset);
        });

        simulationRef.current = simulation;
        if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
        setStatus('ready');
      } catch {
        fail();
      }
    };

    fallbackTimer = window.setTimeout(fail, 12000);
    if (window.Spacekit) {
      initialise();
    } else {
      script = document.querySelector<HTMLScriptElement>('script[data-spacekit-engine]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://typpo.github.io/spacekit/build/spacekit.js';
        script.async = true;
        script.dataset.spacekitEngine = 'true';
      }

      script.addEventListener('load', initialise);
      script.addEventListener('error', fail);
      if (!script.isConnected) document.head.appendChild(script);
    }

    return () => {
      disposed = true;
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      script?.removeEventListener('load', initialise);
      script?.removeEventListener('error', fail);
      const renderer = simulationRef.current?.getRenderer?.();
      renderer?.setAnimationLoop?.(null);
      renderer?.dispose?.();
      simulationRef.current = null;
      containerRef.current?.replaceChildren();
    };
  }, []);

  return (
    <div className="spacekit-experience">
      <div className="spacekit-toolbar">
        <span><i className={status === 'ready' ? 'spacekit-status-live' : ''} /> {status === 'ready' ? 'SIMULATION ONLINE' : status === 'fallback' ? 'FALLBACK MODE' : 'LOADING CELESTIAL DATA'}</span>
        <span>SPACEKIT.JS / WEBGL 2</span>
      </div>
      <div className="spacekit-viewport" ref={containerRef} aria-label="Interactive Spacekit solar system visualization">
        {status !== 'ready' && (
          <div className="spacekit-fallback" role="status">
            <div className="spacekit-fallback-sun" />
            <div className="spacekit-fallback-orbit orbit-mercury"><i /></div>
            <div className="spacekit-fallback-orbit orbit-earth"><i /></div>
            <div className="spacekit-fallback-orbit orbit-jupiter"><i /></div>
            <p>{status === 'fallback' ? 'The external astronomy engine could not load. The orbital preview remains available.' : 'Initialising the solar system…'}</p>
          </div>
        )}
      </div>
      <div className="spacekit-caption">
        <span>PLANETARY PRESETS / ORBITAL MOTION / STARFIELD</span>
        <span>{status === 'ready' ? 'DRIFT ENABLED' : 'CSS ORBIT PREVIEW'}</span>
      </div>
    </div>
  );
}
