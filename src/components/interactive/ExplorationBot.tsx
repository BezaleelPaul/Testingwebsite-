'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  Pause, 
  MapPin, 
  GraduationCap, 
  Code, 
  Cpu, 
  Award, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface JourneyStep {
  id: string;
  stepNumber: number;
  phase: string;
  title: string;
  period: string;
  targetSectionId: string;
  narration: string;
  highlightStats: string;
  skills: string[];
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'academics',
    stepNumber: 1,
    phase: 'PHASE 01: DUAL-TRACK FOUNDATION',
    title: 'Dual Academic Degrees in CSE & Data Science',
    period: '2023 — Present',
    targetSectionId: 'about',
    narration: 'Bezaleel embarked on a rigorous dual-degree trajectory, pursuing B.Tech in Computer Science at CMR University and BS in Data Science at IIT Madras, blending theoretical computational mathematics with practical software engineering.',
    highlightStats: 'CMR University · IIT Madras Premier BS Program',
    skills: ['Data Structures', 'Statistics', 'Linear Algebra', 'Operating Systems']
  },
  {
    id: 'algorithms',
    stepNumber: 2,
    phase: 'PHASE 02: COMPUTATIONAL RIGOR',
    title: 'Competitive Algorithmic Specialization',
    period: '2023 — Present',
    targetSectionId: 'github',
    narration: 'To build relentless problem-solving discipline, he tackled over 270+ algorithmic challenges on LeetCode across dynamic programming, trees, and graphs, alongside rated competitive programming rounds on Codeforces.',
    highlightStats: '270+ LeetCode Solved · Peak 959 Codeforces Rating',
    skills: ['Dynamic Programming', 'Graph Theory', 'C++', 'Asymptotic Optimization']
  },
  {
    id: 'systems',
    stepNumber: 3,
    phase: 'PHASE 03: LOCAL-FIRST SYSTEMS',
    title: 'Mise: File Organizer & Cross-Platform Utilities',
    period: '2024',
    targetSectionId: 'projects',
    narration: 'He engineered Mise (File Organizer), a local-first, transactional filesystem workstation with selective undo logs and disk intelligence treemaps, deploying it across Windows, macOS, Linux, and Android via Flutter.',
    highlightStats: 'Cross-Platform Flutter & Python Architecture',
    skills: ['Flutter', 'Dart', 'Python', 'Filesystem Transactions', 'Desktop & Mobile']
  },
  {
    id: 'biomedical-ai',
    stepNumber: 4,
    phase: 'PHASE 04: AI & PREDICTIVE MODELING',
    title: 'NADICARE Twin Engine (Biomedical Digital Twin)',
    period: '2024 — 2025',
    targetSectionId: 'projects',
    narration: 'Venturing into physiological simulation, he architected the NADICARE Twin Engine: an AI-driven digital twin combining XGBoost regression models with real-time Plotly telemetry to forecast heart rate recovery curves under strain.',
    highlightStats: 'XGBoost · Streamlit Telemetry · Dynamic Plotly Dashboards',
    skills: ['Machine Learning', 'XGBoost', 'Predictive Modeling', 'Python']
  },
  {
    id: 'space-astrophysics',
    stepNumber: 5,
    phase: 'PHASE 05: 3D COSMIC ENGINE & NASA TELEMETRY',
    title: 'Orbital Observatory & Keplerian Physics Simulator',
    period: '2025 — 2026',
    targetSectionId: 'projects',
    narration: 'Bridging high-performance 3D WebGL with real astrophysics, he engineered a 3D Solar System simulator solving Keplerian conic equations and streaming live telemetry from NASA Open APIs (APOD cosmic discoveries & Near-Earth Asteroid radar feeds).',
    highlightStats: 'Three.js / R3F · NASA Deep Space Network API · Keplerian Physics',
    skills: ['WebGL', 'Three.js', 'Astrophysics Simulation', 'REST APIs', 'GLSL']
  },
  {
    id: 'leadership',
    stepNumber: 6,
    phase: 'PHASE 06: TECHNICAL LEADERSHIP',
    title: 'IEEE EXCOM Member & Webmaster',
    period: '2023 — 2024',
    targetSectionId: 'experience',
    narration: 'Beyond independent engineering, he stepped into organizational leadership as an Executive Committee member and Webmaster for the IEEE Student Branch, directing digital portals, registration pipelines, and peer workshops.',
    highlightStats: 'Executive Committee Member · Webmaster · Peer Mentorship',
    skills: ['Web Architecture', 'Technical Mentorship', 'Community Leadership']
  },
  {
    id: 'frontiers',
    stepNumber: 7,
    phase: 'PHASE 07: ACTIVE FRONTIERS',
    title: '34 Repositories & Open to Opportunities',
    period: 'Active Horizon',
    targetSectionId: 'contact',
    narration: 'Today, with 34 active repositories, an automated CI/CD pipeline, and continuous learning in machine learning and full-stack systems, Bezaleel is actively open to engineering roles and ambitious collaborations.',
    highlightStats: '34 Public Repos · Bangalore Ground Station · Ready for Dispatch',
    skills: ['Full-Stack', 'Flutter', 'AI/ML Engineering', 'Clean Architecture']
  }
];

export const ExplorationBot: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [botPos, setBotPos] = useState({ x: -100, y: -100 });
  const [gestureAlert, setGestureAlert] = useState(false);

  // Mouse gesture tracking: detects smooth circular motion
  const pathHistory = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const animFrameRef = useRef<number | null>(null);

  // Smooth bot floating interpolation towards cursor
  useEffect(() => {
    let currentX = botPos.x;
    let currentY = botPos.y;

    const smoothFollow = () => {
      if (isActive) {
        // Target offset slightly to the top-right of cursor
        const targetX = mousePos.x + 28;
        const targetY = mousePos.y - 28;
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        setBotPos({ x: currentX, y: currentY });
      }
      animFrameRef.current = requestAnimationFrame(smoothFollow);
    };

    animFrameRef.current = requestAnimationFrame(smoothFollow);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, mousePos]);

  // Circular gesture detection algorithm
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    setMousePos({ x, y });

    // Track last 35 points (approx 0.5s - 1.0s of motion)
    pathHistory.current.push({ x, y, time: now });
    if (pathHistory.current.length > 35) {
      pathHistory.current.shift();
    }

    if (pathHistory.current.length >= 25 && !isActive) {
      // Check if path forms a closed loop (start and end close together, with centroid in middle)
      const pts = pathHistory.current;
      const first = pts[0];
      const last = pts[pts.length - 1];
      const distStartEnd = Math.hypot(last.x - first.x, last.y - first.y);

      // Centroid
      let avgX = 0, avgY = 0;
      pts.forEach(p => { avgX += p.x; avgY += p.y; });
      avgX /= pts.length;
      avgY /= pts.length;

      // Average radius
      let avgRadius = 0;
      pts.forEach(p => { avgRadius += Math.hypot(p.x - avgX, p.y - avgY); });
      avgRadius /= pts.length;

      // If loop completed with decent radius (40px - 180px) and closed endpoints
      if (distStartEnd < 50 && avgRadius > 35 && avgRadius < 180) {
        setIsActive(true);
        setGestureAlert(true);
        spaceAudio.playWarpSwoosh();
        spaceAudio.playTelemetryBeep(1200);
        setTimeout(() => setGestureAlert(false), 3000);
        pathHistory.current = [];
      }
    }
  }, [isActive]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Navigate to current waypoint step & smooth scroll to target section
  const goToStep = useCallback((stepIdx: number) => {
    if (stepIdx < 0 || stepIdx >= JOURNEY_STEPS.length) return;
    setCurrentStep(stepIdx);
    spaceAudio.playTelemetryBeep(1000 + stepIdx * 100);

    const step = JOURNEY_STEPS[stepIdx];
    const targetEl = document.getElementById(step.targetSectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Auto-tour progression timer
  useEffect(() => {
    if (!isAutoTour || !isActive) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < JOURNEY_STEPS.length - 1) {
          const next = prev + 1;
          goToStep(next);
          return next;
        } else {
          setIsAutoTour(false);
          return prev;
        }
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoTour, isActive, goToStep]);

  const step = JOURNEY_STEPS[currentStep];

  return (
    <>
      {/* Gesture Notification Pop-up */}
      {gestureAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-space-900/95 border border-hud-cyan text-white text-xs font-mono shadow-[0_0_25px_rgba(0,243,255,0.6)] backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Bot className="w-4 h-4 text-hud-cyan animate-spin" />
          <span>[ EXPLORATION BOT AWAKENED VIA MOUSE GESTURE ]</span>
        </div>
      )}

      {/* Discreet Summon Trigger in Bottom Right (for easy discovery) */}
      {!isActive && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
          <button
            onClick={() => {
              setIsActive(true);
              goToStep(0);
              spaceAudio.playWarpSwoosh();
            }}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-space-900/90 border border-cyan-500/40 hover:border-hud-cyan text-xs font-mono text-slate-300 hover:text-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:-translate-y-0.5"
            title="Click or draw a circle with your mouse to summon the Journey Bot"
          >
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-hud-cyan group-hover:animate-ping" />
              <Bot className="w-3.5 h-3.5 text-hud-cyan absolute" />
            </div>
            <span>Summon Journey Bot</span>
            <span className="text-[10px] text-slate-500 bg-space-950 px-1.5 py-0.5 rounded border border-slate-800 hidden sm:inline">
              draw circle ◯
            </span>
          </button>
        </div>
      )}

      {/* Floating Exploration Companion Drone */}
      {isActive && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out hidden md:block"
          style={{
            transform: `translate3d(${botPos.x}px, ${botPos.y}px, 0)`,
          }}
        >
          {/* Holographic Drone Eye */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Outer Scanning Ring */}
            <div className="w-10 h-10 rounded-full border border-hud-cyan/40 animate-ping absolute" />
            <div className="w-8 h-8 rounded-full border border-cyan-400 animate-spin-slow absolute" />

            {/* Glowing Core */}
            <div className="w-5 h-5 rounded-full bg-hud-cyan shadow-[0_0_15px_#00f3ff] flex items-center justify-center">
              <Bot className="w-3 h-3 text-space-950 font-bold" />
            </div>

            {/* Trailing scanning beam */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-hud-cyan to-transparent absolute left-5 -rotate-12" />
          </div>
        </div>
      )}

      {/* Interactive Waypoint Hologram Modal Card */}
      {isActive && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-space-900/95 border-2 border-hud-cyan/60 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,243,255,0.35)] backdrop-blur-xl font-mono text-xs select-none animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-hud-cyan animate-ping" />
              <span className="font-bold text-white tracking-widest text-[11px] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-hud-cyan" />
                <span>EXPLORATION BOT // WAYPOINT {step.stepNumber}/6</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsAutoTour(!isAutoTour)}
                title={isAutoTour ? 'Pause Auto-Tour' : 'Start Auto-Tour'}
                className={`p-1 rounded border text-[10px] transition-colors ${
                  isAutoTour
                    ? 'bg-hud-cyan text-space-950 border-hud-cyan font-bold'
                    : 'bg-space-950 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {isAutoTour ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  spaceAudio.playTelemetryBeep(700);
                  setIsActive(false);
                }}
                className="p-1 rounded bg-space-950 hover:bg-space-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Dismiss Exploration Bot"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Waypoint Phase Tag */}
          <div className="mb-2">
            <span className="text-[10px] font-bold text-hud-amber bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              {step.phase}
            </span>
          </div>

          {/* Title & Timeline */}
          <div className="mb-3">
            <h4 className="text-sm font-bold text-white leading-tight font-display">
              {step.title}
            </h4>
            <span className="text-[10px] text-slate-400">{step.period}</span>
          </div>

          {/* Chronological Narration */}
          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4 bg-space-950/80 p-3 rounded-xl border border-slate-850">
            {step.narration}
          </p>

          {/* Verified Highlights */}
          <div className="mb-3 text-[11px] text-hud-cyan font-mono flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-hud-amber shrink-0" />
            <span className="truncate">{step.highlightStats}</span>
          </div>

          {/* Action Link for 3D Cosmos */}
          {step.id === 'space-astrophysics' && (
            <div className="mb-3">
              <a
                href="/observatory"
                className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-hud-cyan to-blue-500 text-space-950 font-mono font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:brightness-110 transition-all"
              >
                <span>🪐 Launch 3D Cosmos Observatory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Step Progress Dots */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-850">
            <div className="flex items-center gap-1.5">
              {JOURNEY_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToStep(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentStep === idx
                      ? 'bg-hud-cyan scale-125 shadow-[0_0_8px_#00f3ff]'
                      : 'bg-space-950 border border-slate-700 hover:border-hud-cyan'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            {/* Controls: Prev & Next */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="p-1 rounded bg-space-950 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Waypoint"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => goToStep(currentStep + 1)}
                disabled={currentStep === JOURNEY_STEPS.length - 1}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-hud-cyan text-space-950 font-bold hover:bg-cyan-300 disabled:opacity-30 disabled:pointer-events-none transition-colors text-[10px]"
                title="Next Waypoint"
              >
                <span>NEXT</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
