import Link from 'next/link';
import { ArrowUpRight, Bot, Orbit, Radar } from 'lucide-react';

const destinations = [
  {
    number: '01',
    eyebrow: 'ASTRONOMY / SPACEKIT.JS',
    title: 'The universe',
    detail: 'Explore a live solar-system scene with orbital motion, planetary presets, and real star data.',
    href: '/universe/',
    icon: Orbit,
    visual: 'engineering-visual-universe',
    action: 'ENTER THE UNIVERSE',
  },
  {
    number: '02',
    eyebrow: 'ROBOTICS / THREE.JS',
    title: 'Robotics lab',
    detail: 'Move a multi-joint robotic arm, inspect its geometry, and experiment with forward kinematics.',
    href: '/lab/',
    icon: Bot,
    visual: 'engineering-visual-robot',
    action: 'OPEN THE LAB',
  },
  {
    number: '03',
    eyebrow: 'SIMULATION / FLIGHT SYSTEMS',
    title: 'Orbital observatory',
    detail: 'Switch camera modes and inspect a separate interactive solar-system simulation.',
    href: '/observatory/',
    icon: Radar,
    visual: 'engineering-visual-observatory',
    action: 'VIEW THE OBSERVATORY',
  },
];

export function EngineeringLabSection() {
  return (
    <section id="engineering-lab" className="engineering-lab-section" aria-labelledby="engineering-lab-title">
      <div className="site-shell">
        <header className="engineering-lab-heading" data-reveal>
          <div>
            <p className="orbital-eyebrow"><span>07</span> / INTERACTIVE ENGINEERING</p>
            <h2 id="engineering-lab-title">NOT JUST A PORTFOLIO.<br /><span>A PLACE TO EXPLORE.</span></h2>
          </div>
          <p>
            Space, robotics, and simulation are not decorative props here. They are small,
            working experiments that let you interact with the ideas behind the work.
          </p>
        </header>

        <div className="engineering-lab-grid">
          {destinations.map((item) => {
            const Icon = item.icon;
            return (
              <article className="engineering-lab-card" key={item.number} data-reveal>
                <Link href={item.href} className="engineering-lab-card-link" aria-label={`${item.action}: ${item.title}`}>
                  <div className={`engineering-lab-visual ${item.visual}`} aria-hidden="true">
                    <span className="engineering-lab-index">{item.number} / 03</span>
                    <span className="engineering-lab-visual-orbit engineering-orbit-one" />
                    <span className="engineering-lab-visual-orbit engineering-orbit-two" />
                    <span className="engineering-lab-visual-core"><Icon size={28} strokeWidth={1.2} /></span>
                    <span className="engineering-lab-visual-signal" />
                  </div>
                  <div className="engineering-lab-card-copy">
                    <span className="engineering-lab-eyebrow">{item.eyebrow}</span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                    <span className="engineering-lab-action">{item.action} <ArrowUpRight size={15} /></span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
        <div className="engineering-lab-foot">
          <span>LIVE EXPERIMENTS / BROWSER-BASED / BUILT TO BE TOUCHED</span>
          <span>SCROLLING IS NOT THE ONLY WAY TO EXPLORE ↗</span>
        </div>
      </div>
    </section>
  );
}
