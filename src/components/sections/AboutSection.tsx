'use client';

import React, { useState } from 'react';
import { PilotProfile } from '@/types/portfolio';
import { GraduationCap, Terminal as TerminalIcon, Sparkles, BookOpen, Compass, ChevronRight } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface AboutSectionProps {
  profile: PilotProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ cmd: string; output: string }>>([
    { cmd: 'whoami', output: 'Bezaleel Paul N (@BezForge) — Software Developer & CS / Data Science Undergrad.' },
    { cmd: 'education', output: 'B.Tech CSE @ CMR University · BS Data Science @ IIT Madras' }
  ]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let res = '';
    switch (cmd) {
      case 'help':
        res = 'Available commands: whoami, education, philosophy, stack, socials, clear';
        break;
      case 'whoami':
        res = `${profile.name} (${profile.callsign}) — ${profile.headline}. Located in ${profile.location}.`;
        break;
      case 'education':
        res = profile.education.map(e => `${e.degree} in ${e.field} at ${e.institution} (${e.period})`).join(' | ');
        break;
      case 'philosophy':
        res = 'First-principles design, asymptotic efficiency, and clean human-centric architecture.';
        break;
      case 'stack':
        res = 'Python, Flutter, Dart, TypeScript, React, Next.js, TensorFlow, XGBoost, C++, SQL.';
        break;
      case 'socials':
        res = 'GitHub: @BezaleelPaul | LinkedIn: bezaleel-paul | LeetCode: BezaleelPaulN';
        break;
      case 'clear':
        setTerminalLogs([]);
        setTerminalInput('');
        return;
      default:
        res = `Command '${cmd}' not recognized. Type 'help' for available commands.`;
        break;
    }

    spaceAudio.playTelemetryBeep(750);
    setTerminalLogs((prev) => [...prev, { cmd: terminalInput, output: res }]);
    setTerminalInput('');
  };

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-space-950/70">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
            [ 01 // PROFESSIONAL IDENTITY ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
            ABOUT & ACADEMIC ORBIT
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-hud-cyan to-transparent mt-2" />
        </div>

        {/* Narrative & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Biography Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-xl bg-space-900/80 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-4">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-hud-cyan" />
                <span>The Convergence of Rigor & Imagination</span>
              </h3>
              {profile.bio.map((paragraph, idx) => (
                <p key={idx} className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-mono uppercase tracking-wider text-hud-amber mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Core Development Philosophy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.approach.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                      <ChevronRight className="w-3.5 h-3.5 text-hud-cyan shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Degrees Card */}
            <div className="p-6 sm:p-8 rounded-xl bg-space-900/80 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-6">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-hud-cyan" />
                <span>Academic Dual-Track Journey</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-space-950/70 border border-slate-850 hover:border-hud-cyan/50 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                        {edu.badge || 'Degree'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{edu.period}</span>
                    </div>
                    <h4 className="text-base font-bold text-white leading-snug">{edu.institution}</h4>
                    <p className="text-xs font-mono text-cyan-300 font-medium">{edu.degree} · {edu.field}</p>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal & Quick Specs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Terminal (Homage to legacy site) */}
            <div className="rounded-xl bg-space-950 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 bg-space-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-hud-cyan" />
                  <span>bezforge@shell ~</span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800">
                  READY
                </span>
              </div>

              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                <p className="text-slate-500 text-[11px]">
                  BezForge Terminal v3.0. Type <span className="text-hud-cyan">help</span> for commands.
                </p>

                {terminalLogs.map((log, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-slate-400">
                      <span className="text-hud-cyan">$</span> {log.cmd}
                    </p>
                    <p className="text-slate-200 pl-3 border-l border-slate-800 text-[11px] leading-relaxed">
                      {log.output}
                    </p>
                  </div>
                ))}

                <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
                  <span className="text-hud-cyan font-bold">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type command..."
                    className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-600 font-mono text-xs"
                  />
                </form>
              </div>

              <div className="px-4 py-2 bg-space-900/60 border-t border-slate-850 flex flex-wrap gap-1.5">
                {['whoami', 'education', 'philosophy', 'stack', 'socials', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTerminalInput(cmd);
                    }}
                    className="px-2 py-0.5 rounded bg-space-800 hover:bg-space-700 text-[10px] text-slate-400 hover:text-white transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="p-6 rounded-xl bg-space-900/80 border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-hud-cyan" /> Engineering Snapshot
              </h4>
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white font-medium">Bangalore, India (UTC+5:30)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Primary Focus:</span>
                  <span className="text-hud-cyan font-medium">Flutter · Full-Stack · AI/ML</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-850">
                  <span className="text-slate-400">Academic Standing:</span>
                  <span className="text-white font-medium">Undergraduate (2023–2027)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Active Working State:</span>
                  <span className="text-emerald-400 font-medium">Available for Hiring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
