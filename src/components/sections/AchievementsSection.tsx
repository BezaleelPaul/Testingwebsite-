'use client';

import React from 'react';
import { AchievementItem } from '@/types/portfolio';
import { Award, ExternalLink, Code, BookOpen, GitBranch } from 'lucide-react';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  const getBadgeIcon = (cat: string) => {
    switch (cat) {
      case 'Competitive Programming': return <Code className="w-4 h-4 text-cyan-400" />;
      case 'Academic': return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'Hackathon': return <GitBranch className="w-4 h-4 text-indigo-400" />;
      default: return <Award className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060a12] border-t border-slate-800">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            [ 05 // VERIFIED MILESTONES ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            ACHIEVEMENTS & CONTRIBUTIONS
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Quantified competitive programming rankings, institutional admissions, and open-source contributions.
          </p>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-7 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 hover:border-cyan-400 transition-colors space-y-5 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-cyan-950/90 px-3 py-1.5 rounded-lg border border-cyan-700 font-bold">
                    {getBadgeIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">{item.date}</span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-white">{item.title}</h3>
                  <p className="text-xs font-mono text-amber-400 font-bold mt-1">{item.issuer}</p>
                </div>

                <p className="text-base text-slate-200 font-sans leading-relaxed">
                  {item.summary}
                </p>
              </div>

              {item.link && (
                <div className="pt-4 border-t border-slate-700">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-white font-bold"
                  >
                    <span>View Verification Credential</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
