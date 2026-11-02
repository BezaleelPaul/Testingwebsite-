'use client';

import React, { useState } from 'react';
import { SkillCategoryGroup } from '@/types/portfolio';
import { Code, Smartphone, Brain, Server } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface SkillsSectionProps {
  skills: SkillCategoryGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(skills[0]?.id || '');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code': return <Code className="w-5 h-5 text-cyan-400" />;
      case 'smartphone': return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'brain': return <Brain className="w-5 h-5 text-indigo-400" />;
      case 'server': return <Server className="w-5 h-5 text-amber-400" />;
      default: return <Code className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060a12] border-t border-slate-800">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            🛠️ SKILLS
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            TECHNOLOGIES I WORK WITH
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            The languages, frameworks, and tools I use to build real-world mobile, web, and ML software.
          </p>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          {skills.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                spaceAudio.playTelemetryBeep(920);
                setSelectedGroup(group.id);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs tracking-wider transition-all font-bold ${
                selectedGroup === group.id
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'bg-[#0d1424] border-2 border-slate-700 text-slate-200 hover:text-white hover:border-cyan-400'
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
                className={`rounded-2xl p-6 space-y-5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-xl ${
                  isHighlighted
                    ? 'bg-[#0f172a] border-2 border-cyan-400 scale-[1.02] shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                    : 'bg-[#0d1424] border-2 border-slate-700/80 hover:border-slate-500'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-700">
                        {getIcon(group.icon)}
                      </div>
                      <h3 className="font-extrabold font-display text-white text-lg">
                        {group.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {group.description}
                  </p>

                  {/* Constellation Nodes */}
                  <div className="space-y-2 pt-2">
                    {group.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-slate-700 hover:border-cyan-400 transition-colors"
                      >
                        <span className="text-xs font-mono text-slate-100 flex items-center gap-2 font-bold">
                          <span className={`w-2 h-2 rounded-full ${skill.highlight ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-500'}`} />
                          {skill.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {skill.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs font-mono text-slate-400 font-medium">
                  <span>{group.skills.length} Stack Items</span>
                  {isHighlighted && <span className="text-cyan-400 font-bold">Selected</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
