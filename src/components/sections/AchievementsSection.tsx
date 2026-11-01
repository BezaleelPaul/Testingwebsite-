'use client';

import React from 'react';
import { AchievementItem } from '@/types/portfolio';
import { Award, ExternalLink, Code, Terminal, BookOpen, GitBranch } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const getBadgeIcon = (cat: string) => {
    switch (cat) {
      case 'Competitive Programming': return <Code className="w-4 h-4 text-hud-cyan" />;
      case 'Academic': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'Hackathon': return <GitBranch className="w-4 h-4 text-hud-violet" />;
      default: return <Award className="w-4 h-4 text-hud-amber" />;
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-space-950/70 border-t border-slate-900">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
            [ 05 // VERIFIED MILESTONES ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
            ACHIEVEMENTS & CONTRIBUTIONS
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400 font-sans">
            Quantified competitive programming rankings, institutional admissions, and open-source contributions.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-hud-cyan to-transparent mt-2" />
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-6 sm:p-7 rounded-2xl bg-space-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-hud-cyan bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800 font-semibold">
                    {getBadgeIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">{item.date}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-display text-white">{item.title}</h3>
                  <p className="text-xs font-mono text-hud-amber mt-0.5">{item.issuer}</p>
                </div>

                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 italic">{item.metrics}</span>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-hud-cyan hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Verify Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
