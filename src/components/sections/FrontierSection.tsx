

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Orbit, Sparkles } from 'lucide-react';
import { AnimatedWords } from '@/components/motion/AnimatedWords';

const destinations = [
  { number: '01', title: 'Build for people', detail: 'Flutter, mobile and full-stack products', href: '#projects', orbit: 'orbit-a' },
  { number: '02', title: 'Explore intelligence', detail: 'Machine learning, data and computer vision', href: '#skills', orbit: 'orbit-b' },
  { number: '03', title: 'Map the unknown', detail: '3D systems, simulations and experiments', href: '/observatory', orbit: 'orbit-c' },
  { number: '04', title: 'Leave a signal', detail: 'Open source, GitHub and collaboration', href: '/atlas', orbit: 'orbit-d' },
];

export const FrontierSection: React.FC = () => (
  <section id="frontier" className="frontier-section dark-surface relative isolate overflow-hidden border-y border-paper/10 bg-ink py-24 text-paper sm:py-32">
    <div className="frontier-stars" aria-hidden="true" />
    <div className="section-shell relative z-10">
      <header className="grid gap-8 lg:grid-cols-12 lg:items-end" data-reveal>
        <div className="lg:col-span-8">
          <p className="eyebrow text-signal">03 / The frontier</p>
          <h2 className="serif-display mt-6 max-w-4xl text-5xl leading-[0.92] sm:text-7xl" data-word-group>
            <AnimatedWords text="Every project is a" />{' '}
            <span className="italic text-signal"><AnimatedWords text="new world." accentWords={['world.']} /></span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-paper/55 lg:col-span-4 lg:ml-auto">
          Different problems need different tools. Pick a direction and explore the work,
          the systems behind it, and the experiments that are still evolving.
        </p>
      </header>

      <div className="relative mt-16 grid gap-0 border-y border-paper/15 sm:grid-cols-2" data-reveal-group>
        {destinations.map((item) => (
          <Link key={item.number} href={item.href} className="frontier-destination group relative flex min-h-[190px] items-center gap-6 border-b border-paper/15 p-6 transition-colors hover:bg-paper/[0.045] sm:min-h-[220px] sm:p-8 sm:border-r sm:border-paper/15" data-reveal-item>
            <span className={`frontier-orbit ${item.orbit}`} aria-hidden="true"><span /></span>
            <span className="relative z-10 flex-1">
              <span className="eyebrow text-paper/35">{item.number} / Destination</span>
              <span className="mt-3 block font-display text-3xl tracking-tight text-paper sm:text-4xl">{item.title}</span>
              <span className="mt-2 block max-w-xs text-sm leading-relaxed text-paper/50">{item.detail}</span>
            </span>
            <ArrowUpRight className="relative z-10 h-5 w-5 shrink-0 text-signal transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <div className="frontier-log relative mt-20 grid gap-10 overflow-hidden border border-paper/15 bg-paper/[0.035] p-7 sm:p-10 lg:grid-cols-12 lg:items-center" data-reveal>
        <div className="relative z-10 lg:col-span-7">
          <p className="eyebrow flex items-center gap-2 text-signal"><Sparkles className="h-3.5 w-3.5" /> Flight recorder / lessons in progress</p>
          <h3 className="serif-display mt-5 max-w-2xl text-4xl text-paper sm:text-5xl">Not every launch reaches orbit.</h3>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/60 sm:text-base">
            Experiments fail, assumptions break, and prototypes change direction. I keep the
            useful evidence: what the constraints were, which trade-offs mattered, and what
            I would test next. The project case notes are where those decisions belong.
          </p>
          <Link href="/projects" className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-signal hover:text-paper">
            Read the engineering case notes <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="frontier-wreckage relative mx-auto h-44 w-full max-w-sm lg:col-span-5" aria-hidden="true">
          <div className="frontier-ship"><span /></div>
          <div className="wreckage-ring" />
          <div className="wreckage-hull" />
          <div className="wreckage-wing wreckage-wing-left" />
          <div className="wreckage-wing wreckage-wing-right" />
          <span className="wreckage-spark wreckage-spark-one" />
          <span className="wreckage-spark wreckage-spark-two" />
          <span className="absolute bottom-0 right-0 font-mono text-[9px] uppercase tracking-[0.16em] text-paper/25">Signal recovered · lessons retained</span>
        </div>
      </div>

      <div className="mt-20 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-end sm:justify-between" data-reveal>
        <div>
          <p className="eyebrow text-paper/35">Beyond the known universe</p>
          <p className="serif-display mt-4 max-w-3xl text-4xl text-paper sm:text-6xl">Yet to learn. <span className="italic text-signal">Yet to explore.</span></p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/45">The map ends here. The work does not.</p>
        </div>
        <Link href="/atlas" className="inline-flex shrink-0 items-center gap-3 rounded-full border border-paper/25 px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:border-signal hover:text-signal">
          <Orbit className="h-4 w-4" /> Continue exploring <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);
