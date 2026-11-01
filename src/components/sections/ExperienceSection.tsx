'use client';

import React from 'react';
import { ExperienceItem } from '@/types/portfolio';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070b14] border-t border-slate-800">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            [ 03 // PROFESSIONAL EXPEDITIONS ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            EXPERIENCE & CONTRIBUTIONS
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Chronological engineering milestones, technical leadership, and collaborative open-source contributions.
          </p>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>

        {/* Constellation Timeline */}
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-1 before:bg-gradient-to-b before:from-cyan-400 before:via-sky-500 before:to-indigo-600">
          {experience.map((item) => (
            <div key={item.id} className="relative group">
              {/* Node Joint */}
              <div className="absolute -left-[27px] sm:-left-[35px] top-2 w-5 h-5 rounded-full bg-[#070b14] border-2 border-cyan-400 group-hover:bg-cyan-400 group-hover:shadow-[0_0_15px_#22d3ee] transition-all" />

              {/* Experience Solid Card */}
              <div className="rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 p-6 sm:p-8 space-y-5 hover:border-cyan-400 transition-colors shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                  <div>
                    <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider bg-cyan-950/90 px-3 py-1 rounded-md border border-cyan-700 inline-block mb-2">
                      {item.type}
                    </span>
                    <h3 className="text-2xl font-extrabold text-white leading-tight">
                      {item.role}
                    </h3>
                    <p className="text-base font-mono text-cyan-400 font-bold">
                      {item.organization}
                    </p>
                  </div>

                  <div className="text-left sm:text-right font-mono text-xs text-slate-300 space-y-1 font-medium">
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center sm:justify-end gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-base text-slate-200 font-sans leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Responsibilities */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Verified Outcomes & Responsibilities:
                  </h4>
                  <ul className="space-y-2">
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="text-sm text-slate-200 font-sans flex items-start gap-2.5">
                        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Applied Skills */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-800 text-slate-200 text-xs font-mono font-medium rounded-md border border-slate-600"
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
