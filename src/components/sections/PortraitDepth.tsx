'use client';

import React, { useEffect, useRef, useState } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uPortrait;
  uniform vec2 uPointer;
  uniform float uAspect;

  void main() {
    // Sample base luminance for pseudo-depth map estimation
    vec4 baseSample = texture2D(uPortrait, vUv);
    float lum = dot(baseSample.rgb, vec3(0.299, 0.587, 0.114));
    
    // Foreground (face/features) have higher luminance and pop forward,
    // darker background shifts with inverse parallax.
    float depth = clamp(lum * 0.85 + 0.15, 0.0, 1.0);
    vec2 displacement = uPointer * (0.016 * (depth - 0.42));
    
    // Clamp sample coordinates to avoid texture edge bleeding
    vec2 sampleUv = clamp(vUv + displacement, vec2(0.002), vec2(0.998));
    vec4 finalColor = texture2D(uPortrait, sampleUv);

    // Subtle orbital ambient lighting responding to cursor location
    vec2 lightSource = uPointer * 0.5 + vec2(0.5);
    float dist = distance(vUv * vec2(uAspect, 1.0), lightSource * vec2(uAspect, 1.0));
    float subtleGlow = smoothstep(0.85, 0.0, dist) * 0.06;
    
    // Very gentle brand accent glow (#D7FF00) on facial highlights
    vec3 accentColor = vec3(0.843, 1.0, 0.0);
    finalColor.rgb += accentColor * subtleGlow * lum;

    gl_FragColor = vec4(finalColor.rgb, finalColor.a);
  }
`;

interface PortraitDepthProps {
  className?: string;
}

export function PortraitDepth({ className = 'hero-portrait' }: PortraitDepthProps) {
  const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || '';
  const portraitSrc = `${basePath}/assets/portrait-processed.webp`;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [glReady, setGlReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!container || !canvas || !img) return;

    // Capability detection: Desktop mouse/trackpad fine pointer only
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

    // Graceful fallback for mobile, low-power devices, or reduced motion
    if (!hasFinePointer || prefersReducedMotion || (deviceMemory !== undefined && deviceMemory <= 2)) {
      return;
    }

    // Try WebGL context
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
        depth: false,
      }) || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    } catch {
      return;
    }

    if (!gl) return;

    let animationFrameId = 0;
    let isIntersecting = true;
    let texture: WebGLTexture | null = null;
    let program: WebGLProgram | null = null;

    // Smoothed pointer coordinates (lerped)
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    try {
      const vert = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const frag = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vert || !frag) return;

      program = gl.createProgram();
      if (!program) return;

      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        return;
      }

      gl.useProgram(program);

      // Fullscreen quad geometry
      const quadBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      // Create texture
      texture = gl.createTexture();
      if (!texture) return;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const uPointer = gl.getUniformLocation(program, 'uPointer');
      const uAspect = gl.getUniformLocation(program, 'uAspect');
      const uPortrait = gl.getUniformLocation(program, 'uPortrait');
      gl.uniform1i(uPortrait, 0);

      // Upload texture image when ready
      const uploadTexture = () => {
        if (!gl || !texture || !img.complete || !img.naturalWidth) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        setGlReady(true);
      };

      if (img.complete && img.naturalWidth) {
        uploadTexture();
      } else {
        img.addEventListener('load', uploadTexture, { once: true });
      }

      // Pointer event listener on window for expansive, continuous tracking
      const onPointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        
        // Relative coordinates from center: -1.0 to +1.0
        const normX = ((e.clientX - (rect.left + rect.width * 0.5)) / (window.innerWidth * 0.5));
        const normY = (((rect.top + rect.height * 0.5) - e.clientY) / (window.innerHeight * 0.5));
        
        targetX = Math.max(-1.0, Math.min(1.0, normX));
        targetY = Math.max(-1.0, Math.min(1.0, normY));
      };

      const onPointerLeave = () => {
        // Smoothly drift back to neutral center
        targetX = 0;
        targetY = 0;
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('mouseleave', onPointerLeave, { passive: true });

      // Pause rendering when Hero is not visible to protect battery and framerate
      const observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      // Animation & Draw loop
      const render = () => {
        animationFrameId = 0;
        if (!isIntersecting || !gl || !program) return;

        // Smooth spring interpolation (LERP)
        currentX += (targetX - currentX) * 0.07;
        currentY += (targetY - currentY) * 0.07;

        // Dynamic resize & DPR clamp (max 1.5 for performance)
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }

        gl.uniform2f(uPointer, currentX, currentY);
        gl.uniform1f(uAspect, rect.width / Math.max(1, rect.height));

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        animationFrameId = requestAnimationFrame(render);
      };

      animationFrameId = requestAnimationFrame(render);

      // Clean cleanup on unmount
      return () => {
        observer.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('mouseleave', onPointerLeave);
        img.removeEventListener('load', uploadTexture);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (gl) {
          if (texture) gl.deleteTexture(texture);
          if (program) gl.deleteProgram(program);
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      };
    } catch {
      // Fallback: stay with static image
      setGlReady(false);
    }
  }, [portraitSrc]);

  return (
    <div
      ref={containerRef}
      className={`hero-portrait-container ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {/* 
        Static portrait image: 
        Always mounted, provides instant LCP with high fetchPriority.
        Remains completely visible whenever WebGL is unsupported or disabled.
      */}
      <img
        ref={imgRef}
        className="hero-portrait"
        src={portraitSrc}
        alt="Bezaleel Paul"
        fetchPriority="high"
        loading="eager"
        crossOrigin="anonymous"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          filter: 'contrast(1.04)',
          opacity: glReady ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* 
        WebGL canvas:
        Overlays the image seamlessly with identical dimensions and object-position.
        Fades in only once shaders and texture are compiled and ready.
      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          opacity: glReady ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
}
