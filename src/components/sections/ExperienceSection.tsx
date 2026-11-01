'use client';

import React from 'react';
import { ExperienceItem } from '@/types/portfolio';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-space-950/60 border-t border-slate-900">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
            [ 03 // PROFESSIONAL EXPEDITIONS ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
            EXPERIENCE & CONTRIBUTIONS
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400 font-sans">
            Chronological engineering milestones, technical leadership, and collaborative open-source contributions.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-hud-cyan to-transparent mt-2" />
        </div>

        {/* Constellation Orbital Timeline */}
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-hud-cyan before:via-sky-500 before:to-indigo-600/30">
          {experience.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Glowing Orbital Node Joint */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-4 h-4 rounded-full bg-space-950 border-2 border-hud-cyan group-hover:bg-hud-cyan group-hover:shadow-[0_0_12px_#00f3ff] transition-all" />

              {/* Experience Card */}
              <div className="rounded-xl bg-space-900/80 border border-slate-800 p-6 sm:p-8 space-y-4 hover:border-slate-700 transition-colors shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-wider bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 inline-block mb-1">
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {item.role}
                    </h3>
                    <p className="text-sm font-mono text-cyan-300 font-medium">
                      {item.organization}
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono text-xs text-slate-400 space-y-1">
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-hud-amber" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Responsibilities */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Verified Outcomes & Responsibilities:
                  </h4>
                  <ul className="space-y-1.5">
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="text-xs text-slate-300 font-sans flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-hud-cyan shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Applied Skills */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-850">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-space-950 text-slate-400 text-[11px] font-mono rounded border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
