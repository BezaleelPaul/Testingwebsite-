'use client';

import { useEffect, useRef, useState } from 'react';
import { OrbitLab, type OrbitBody } from '@/lib/bezforge3d';

export function SpacekitUniverse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labRef = useRef<OrbitLab | null>(null);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<OrbitBody | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const lab = new OrbitLab(canvas, { onSelect: setSelected });
      labRef.current = lab;
      setStatus('ready');
      return () => { lab.dispose(); labRef.current = null; };
    } catch (error) {
      console.error('BezForge OrbitLab failed to initialise:', error);
      setStatus('fallback');
    }
  }, []);

  const togglePlayback = () => {
    const next = !paused;
    setPaused(next);
    if (next) labRef.current?.pause(); else labRef.current?.play();
  };

  return (
    <div className="spacekit-experience">
      <div className="spacekit-toolbar">
        <span><i className={status === 'ready' ? 'spacekit-status-live' : ''} /> {status === 'ready' ? 'BEZFORGE ORBITLAB / ONLINE' : status === 'fallback' ? 'WEBGL UNAVAILABLE' : 'INITIALISING ORBITLAB'}</span>
        <span>PROCEDURAL THREE.JS / LOCAL ENGINE</span>
      </div>
      <div className="spacekit-viewport" aria-label="Interactive custom solar system visualization">
        <canvas ref={canvasRef} className="spacekit-canvas" aria-label="Custom interactive 3D solar system. Drag to orbit and scroll to zoom." />
        {status === 'fallback' && <div className="spacekit-fallback" role="status"><p>WebGL could not start on this device. Try enabling hardware acceleration or using a supported browser.</p></div>}
        {status === 'ready' && (
          <div className="orbitlab-overlay">
            <button type="button" onClick={togglePlayback}>{paused ? 'RESUME ORBITS' : 'PAUSE ORBITS'}</button>
            <label>SPEED <input aria-label="Orbital simulation speed" type="range" min="0" max="5" step="0.25" value={speed} onChange={(event) => { const value = Number(event.target.value); setSpeed(value); labRef.current?.setSpeed(value); }} /> {speed.toFixed(2)}×</label>
            {selected && <span>{selected.name.toUpperCase()} / ORBIT {selected.orbitRadius} AU-SCALE</span>}
          </div>
        )}
      </div>
      <div className="spacekit-caption">
        <span>PROCEDURAL PLANETS / KEPLER-INSPIRED ORBITS / STARFIELD</span>
        <span>{status === 'ready' ? 'DRAG TO ORBIT · SCROLL TO ZOOM' : 'LOCAL ENGINE'}</span>
      </div>
    </div>
  );
}
