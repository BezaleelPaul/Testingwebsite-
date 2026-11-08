'use client';

import { useEffect, useRef } from 'react';
import { MechLab, type MechJoint } from '@/lib/bezforge3d';

/** Reusable canvas adapter for the procedural MechLab engine. */
export function MechLabCanvas({ powered = true, jointAngles = {} }: {
  powered?: boolean;
  jointAngles?: Partial<Record<MechJoint, number>>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labRef = useRef<MechLab | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let lab: MechLab | null = null;
    try {
      lab = new MechLab(canvas);
      labRef.current = lab;
      lab.setPowered(powered);
      Object.entries(jointAngles).forEach(([joint, angle]) => {
        if (typeof angle === 'number') lab?.setJoint(joint as MechJoint, angle);
      });
    } catch (error) {
      console.error('BezForge MechLab failed to initialise:', error);
    }
    return () => { lab?.dispose(); labRef.current = null; };
    // Initialise once; live props are applied by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lab = labRef.current;
    if (!lab) return;
    lab.setPowered(powered);
    Object.entries(jointAngles).forEach(([joint, angle]) => {
      if (typeof angle === 'number') lab.setJoint(joint as MechJoint, angle);
    });
  }, [powered, jointAngles]);

  return <canvas ref={canvasRef} className="mechlab-canvas" aria-label="Procedurally generated interactive ATLAS robot. Drag to orbit and scroll to zoom." />;
}
