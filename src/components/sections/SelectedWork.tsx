'use client';

import Link from 'next/link';
import { ArrowUpRight, Github } from 'lucide-react';
import { INITIAL_PROJECTS } from '@/data/profileData';

const featured = INITIAL_PROJECTS.filter((project) => project.featured).slice(0, 3);
const visuals = ['orbit', 'signal', 'mise'];

export function SelectedWork() {
  return (
    <section id="work" className="portfolio-work" aria-labelledby="portfolio-work-title">
      <div className="site-shell">
        <header className="portfolio-section-heading">
          <div>
            <p className="portfolio-eyebrow">01 / SELECTED WORK</p>
            <h2 id="portfolio-work-title">THOUGHTFULLY<br /><span>BUILT.</span></h2>
          </div>
          <p>Three projects across different problem spaces. Focused on useful ideas, considered engineering, and software that works beyond the demo.</p>
        </header>

        <div className="portfolio-project-grid">
          {featured.map((project, index) => (
            <article className="portfolio-project" key={project.id}>
              <div className={`portfolio-project-visual portfolio-project-visual-${visuals[index]}`} aria-hidden="true">
                <span className="portfolio-project-visual-label">PROJECT / 0{index + 1}</span>
                {index === 0 && <div className="portfolio-orbit-art"><i /><i /><i /><b /></div>}
                {index === 1 && <div className="portfolio-signal-art"><span>HR</span><strong>↗</strong><svg viewBox="0 0 420 110"><path d="M0 65 H62 L84 65 L105 20 L128 91 L151 48 L174 65 H235 L257 65 L278 34 L300 83 L321 54 L343 65 H420" /></svg><small>PHYSIOLOGICAL MODEL</small></div>}
                {index === 2 && <div className="portfolio-mise-art"><strong>MISE</strong><span>LOCAL-FIRST / CROSS-PLATFORM</span></div>}
                <span className="portfolio-project-visual-index">0{index + 1} / 03</span>
              </div>

              <div className="portfolio-project-content">
                <div className="portfolio-project-meta">
                  <span>{project.category}</span>
                  <span>{project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="portfolio-project-summary">{project.tagline}</p>
                <div className="portfolio-project-stack">
                  {project.stack.slice(0, 5).map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <div className="portfolio-project-links">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github size={15} /> SOURCE <ArrowUpRight size={13} /></a>
                  {project.demoUrl && <Link href={project.demoUrl}>LIVE PROJECT <ArrowUpRight size={13} /></Link>}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="portfolio-work-footer">
          <span>SELECTED PROJECTS / 03</span>
          <Link href="/projects">VIEW PROJECT ARCHIVE <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
}
