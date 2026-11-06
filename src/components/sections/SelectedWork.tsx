'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INITIAL_PROJECTS } from '@/data/profileData';

const featured = INITIAL_PROJECTS.filter((project) => project.featured).slice(0, 3);
const visualClasses = ['work-visual-observatory', 'work-visual-nadicare', 'work-visual-mise'];
const visualLabels = ['ORBITAL MECHANICS / 01', 'PHYSIOLOGICAL MODEL / 02', 'LOCAL-FIRST SYSTEM / 03'];

export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !stageRef.current || !trackRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top+=82',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="selected-work" aria-labelledby="selected-work-title">
      <div className="site-shell">
        <header className="selected-work-heading">
          <div>
            <p className="orbital-eyebrow"><span>02</span> / SELECTED WORK</p>
            <h2 id="selected-work-title" className="selected-work-title">
              BUILT TO <span>MOVE</span><br />IDEAS FORWARD.
            </h2>
          </div>
          <div className="selected-work-intro">
            <p>Three projects. Three different problem spaces. A shared focus on making useful systems work well.</p>
            <span className="selected-work-hint"><ArrowDownRight size={15} /> SCROLL TO EXPLORE</span>
          </div>
        </header>
      </div>

      <div ref={stageRef} className="selected-work-stage">
        <div ref={trackRef} className="selected-work-track">
          {featured.map((project, index) => (
            <article className="selected-work-card" key={project.id}>
              <div className={`selected-work-visual ${visualClasses[index]}`} aria-hidden="true">
                <span className="work-visual-index">0{index + 1} / 03</span>
                <span className="work-visual-label">{visualLabels[index]}</span>
                {index === 0 && <div className="work-planet-system"><i /><i /><i /><b /></div>}
                {index === 1 && <div className="work-vitals"><span>HR</span><strong>↗</strong><svg viewBox="0 0 520 150" role="presentation"><path d="M0 92 H82 L105 92 L128 34 L154 127 L180 70 L203 92 H286 L309 92 L330 51 L351 110 L372 78 L395 92 H520" /></svg><small>MODEL / RECOVERY RESPONSE</small></div>}
                {index === 2 && <div className="work-mise-mark"><span>MISE</span><i /><i /><i /><small>LOCAL-FIRST · CROSS-PLATFORM</small></div>}
                <span className="work-visual-caption">CONCEPTUAL PROJECT VISUAL · NOT A PRODUCT SCREENSHOT</span>
              </div>

              <div className="selected-work-detail">
                <div className="selected-work-meta">
                  <span>0{index + 1} / 03</span>
                  <span>{project.category}</span>
                  <span className="work-status"><i /> {project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="selected-work-tagline">{project.tagline}</p>
                <div className="selected-work-outcome">
                  <span className="orbital-eyebrow">ENGINEERING FOCUS</span>
                  <p>{project.metrics || project.description}</p>
                </div>
                <div className="selected-work-stack">
                  {project.stack.slice(0, 7).map((tech) => <span key={tech}>{tech}</span>)}
                </div>
                <div className="selected-work-links">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github size={15} /> SOURCE CODE <ArrowUpRight size={13} /></a>
                  {project.demoUrl && <Link href={project.demoUrl}>LIVE EXPERIENCE <ArrowUpRight size={13} /></Link>}
                  <a href={project.repoUrl + '#readme'} target="_blank" rel="noopener noreferrer">CASE NOTES <ArrowUpRight size={13} /></a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="site-shell selected-work-footer">
        <span>SCROLL / DRAG THROUGH THE PROJECTS</span>
        <Link href="/projects">EXPLORE THE PROJECT ARCHIVE <ArrowUpRight size={14} /></Link>
      </div>
    </section>
  );
}
