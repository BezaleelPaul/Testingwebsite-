'use client';

import { ArrowUpRight, GraduationCap, GitBranch, BrainCircuit, Code2 } from 'lucide-react';

const proofItems = [
  {
    number: '01',
    type: 'PROBLEM SOLVING',
    title: 'Consistent practice in algorithms and problem solving.',
    detail: 'A visible competitive-programming trail across LeetCode and Codeforces.',
    metric: 'DSA',
    metricLabel: 'ongoing problem-solving practice',
    extra: 'LeetCode · Codeforces',
    href: 'https://leetcode.com/u/BezaleelPaulN/',
    link: 'VIEW LEETCODE PROFILE',
    icon: Code2,
  },
  {
    number: '02',
    type: 'ACADEMIC PATH',
    title: 'Two complementary learning tracks.',
    detail: 'Pursuing computer science engineering at CMR University alongside the IIT Madras BS programme in Data Science and Applications.',
    metric: '2',
    metricLabel: 'degree programmes',
    extra: 'CMR University · IIT Madras',
    href: 'https://study.iitm.ac.in/ds/',
    link: 'IIT MADRAS PROGRAMME',
    icon: GraduationCap,
  },
  {
    number: '03',
    type: 'APPLIED AI',
    title: 'Building for a real-world screening workflow.',
    detail: 'Project lead for Drishti-AI, a Smart India Hackathon prototype exploring explainable diabetic-retinopathy screening and clinician review. Offline deployment remains a validation goal.',
    metric: 'SIH',
    metricLabel: 'software prototype',
    extra: 'Project leadership · 2026',
    href: 'https://github.com/BezaleelPaul/Drishti-AI',
    link: 'EXPLORE DRISHTI-AI',
    icon: BrainCircuit,
  },
  {
    number: '04',
    type: 'COMMUNITY',
    title: 'Technical contribution beyond coursework.',
    detail: 'Former Webmaster and Executive Committee volunteer with the IEEE CMR University Student Branch, supporting its digital presence and technical community.',
    metric: 'IEEE',
    metricLabel: 'student branch',
    extra: 'Webmaster / EXCOM · Dec 2025 — Sep 2026',
    href: 'https://www.ieee.org/',
    link: 'ABOUT IEEE',
    icon: GitBranch,
  },
];

export function ProofSection() {
  return (
    <section id="proof" className="proof-section" aria-labelledby="proof-title">
      <div className="site-shell">
        <div className="proof-heading">
          <div>
            <p className="orbital-eyebrow"><span>05</span> / PROOF OF WORK</p>
            <h2 id="proof-title">LESS CLAIM.<br /><span>MORE EVIDENCE.</span></h2>
          </div>
          <p className="proof-intro">A few concrete signals of how I learn, build, and contribute. No inflated rankings or invented awards — just work and commitments that can be explored.</p>
        </div>

        <div className="proof-grid">
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="proof-card" key={item.number} data-reveal>
                <div className="proof-card-top">
                  <span>{item.number} / 04</span>
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="proof-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p className="proof-detail">{item.detail}</p>
                <div className="proof-metric">
                  <strong data-count={item.metric}>{item.metric}</strong>
                  <span>{item.metricLabel}</span>
                </div>
                <p className="proof-extra">{item.extra}</p>
                {item.href && item.link && (
                  <a className="proof-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.link} <ArrowUpRight size={13} />
                  </a>
                )}
              </article>
            );
          })}
        </div>
        <div className="proof-foot">
          <span>VERIFIABLE SIGNALS / NOT TROPHIES</span>
          <span>CONTINUOUSLY LEARNING ↗</span>
        </div>
      </div>
    </section>
  );
}
