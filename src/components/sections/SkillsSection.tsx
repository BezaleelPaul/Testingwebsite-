import React from 'react';
import { SkillCategoryGroup } from '@/types/portfolio';

interface SkillsSectionProps {
  skills: SkillCategoryGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <section id="skills" className="border-t border-ink/10 bg-paper py-24 sm:py-32">
      <div className="section-shell">
        <header
          className="grid gap-8 border-b border-ink/15 pb-10 lg:grid-cols-12 lg:items-end"
          data-reveal
        >
          <div className="lg:col-span-8">
            <p className="eyebrow text-ink/45">05 / Toolkit</p>
            <h2 className="serif-display mt-5 max-w-3xl text-5xl text-ink sm:text-7xl">
              Tools chosen for the problem, not the logo wall.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/55 lg:col-span-4 lg:ml-auto">
            The technologies I reach for most often across mobile, web, data, and machine
            learning.
          </p>
        </header>

        <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {skills.map((group, index) => (
            <section
              key={group.id}
              className="border-t border-ink/15 pt-6"
              data-reveal
              data-reveal-delay={(index % 2) * 70}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-3xl leading-none tracking-tight text-ink">
                  {group.name}
                </h3>
                <span className="font-mono text-[9px] text-ink/30">0{index + 1}</span>
              </div>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/52">
                {group.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2" data-reveal-group>
                {group.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.04em] ${
                      skill.highlight
                        ? 'border-ink bg-ink text-paper'
                        : 'border-ink/20 text-ink/62'
                    }`}
                    data-reveal-item
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
};
