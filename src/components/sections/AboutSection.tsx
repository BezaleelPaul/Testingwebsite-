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
    { cmd: 'whoami', output: 'Bezaleel Paul N (@BezForge) — Software Developer & CS / Data Science Double Degree Scholar.' },
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
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800 bg-[#070b14]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            [ 01 // PROFESSIONAL IDENTITY ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            ABOUT & ACADEMIC JOURNEY
          </h2>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>

        {/* Narrative & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Biography Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-xl space-y-5">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2.5">
                <Compass className="w-6 h-6 text-cyan-400" />
                <span>The Convergence of Rigor & Imagination</span>
              </h3>
              {profile.bio.map((paragraph, idx) => (
                <p key={idx} className="text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Core Engineering Philosophy
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {profile.approach.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-200 font-mono">
                      <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Degrees Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-xl space-y-6">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2.5">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
                <span>Academic Dual-Track Journey</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-[#111827] border-2 border-slate-700 hover:border-cyan-400 transition-colors space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-700">
                        {edu.badge || 'Degree'}
                      </span>
                      <span className="text-xs font-mono text-slate-300 font-semibold">{edu.period}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white leading-snug">{edu.institution}</h4>
                    <p className="text-sm font-mono text-cyan-300 font-bold">{edu.degree} · {edu.field}</p>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1 font-sans">{edu.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal & Quick Specs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interactive Terminal */}
            <div className="rounded-2xl bg-[#0a0e1a] border-2 border-slate-700 shadow-xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 bg-[#111827] border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-slate-300 flex items-center gap-1.5 font-bold">
                  <TerminalIcon className="w-4 h-4 text-cyan-400" />
                  <span>bezforge@terminal ~</span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-700">
                  ONLINE
                </span>
              </div>

              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                <p className="text-slate-400 text-xs">
                  BezForge Terminal v3.0. Type <span className="text-cyan-400 font-bold">help</span> for commands.
                </p>

                {terminalLogs.map((log, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-slate-300 font-bold">
                      <span className="text-cyan-400">$</span> {log.cmd}
                    </p>
                    <p className="text-slate-100 pl-3 border-l-2 border-cyan-500/50 text-xs leading-relaxed">
                      {log.output}
                    </p>
                  </div>
                ))}

                <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
                  <span className="text-cyan-400 font-bold">$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type command (whoami, education, stack)..."
                    className="flex-1 bg-transparent text-white focus:outline-none placeholder-slate-500 font-mono text-xs font-medium"
                  />
                </form>
              </div>

              <div className="px-4 py-3 bg-[#111827] border-t border-slate-700 flex flex-wrap gap-2">
                {['whoami', 'education', 'philosophy', 'stack', 'socials', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTerminalInput(cmd);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 hover:text-white font-medium border border-slate-700 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Profile Summary Card */}
            <div className="p-6 rounded-2xl bg-[#0c1220] border-2 border-slate-700/80 shadow-xl space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Engineering Snapshot
              </h4>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-slate-750">
                  <span className="text-slate-300">Location:</span>
                  <span className="text-white font-bold">Bengaluru, India (UTC+5:30)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-750">
                  <span className="text-slate-300">Primary Focus:</span>
                  <span className="text-cyan-300 font-bold">Flutter · Full-Stack · AI/ML</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-750">
                  <span className="text-slate-300">Academic Standing:</span>
                  <span className="text-white font-bold">Dual Degree Undergrad (2022–2027)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-300">Active Status:</span>
                  <span className="text-emerald-400 font-bold">Available for Hiring & Research</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
