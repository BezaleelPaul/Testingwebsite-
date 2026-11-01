'use client';

import React, { useState } from 'react';
import { SkillCategoryGroup } from '@/types/portfolio';
import { Code, Smartphone, Brain, Server, Check, Sparkles } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface SkillsSectionProps {
  skills: SkillCategoryGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(skills[0]?.id || '');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code': return <Code className="w-4 h-4 text-hud-cyan" />;
      case 'smartphone': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'brain': return <Brain className="w-4 h-4 text-hud-violet" />;
      case 'server': return <Server className="w-4 h-4 text-hud-amber" />;
      default: return <Code className="w-4 h-4 text-hud-cyan" />;
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-space-950">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
            [ 04 // TECHNICAL CONSTELLATIONS ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
            SKILLS & ARCHITECTURAL STACK
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400 font-sans">
            Categorized technical capabilities grounded in verified project implementation and mathematical theory.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-hud-cyan to-transparent mt-2" />
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {skills.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                spaceAudio.playTelemetryBeep(920);
                setSelectedGroup(group.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all ${
                selectedGroup === group.id
                  ? 'bg-space-900 border border-hud-cyan text-white shadow-[0_0_20px_rgba(0,243,255,0.25)] font-bold'
                  : 'bg-space-950/80 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {getIcon(group.icon)}
              <span>{group.name}</span>
            </button>
          ))}
        </div>

        {/* Active Constellation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((group) => {
            const isHighlighted = selectedGroup === group.id;
            return (
              <div
                key={group.id}
                className={`rounded-2xl p-6 space-y-5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isHighlighted
                    ? 'bg-space-900 border-2 border-hud-cyan/80 shadow-[0_0_30px_rgba(0,243,255,0.15)] scale-[1.02]'
                    : 'bg-space-900/60 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-space-950 border border-slate-800">
                        {getIcon(group.icon)}
                      </div>
                      <h3 className="font-bold font-display text-white text-base">
                        {group.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {group.description}
                  </p>

                  {/* Constellation Nodes */}
                  <div className="space-y-2 pt-2">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between px-3 py-2 rounded-lg bg-space-950/80 border border-slate-850 hover:border-hud-cyan/40 transition-colors"
                      >
                        <span className="text-xs font-mono text-slate-200 flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${skill.highlight ? 'bg-hud-cyan shadow-[0_0_6px_#00f3ff]' : 'bg-slate-600'}`} />
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {skill.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{group.skills.length} Capabilities</span>
                  {isHighlighted && <span className="text-hud-cyan font-semibold">Active Focus</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
