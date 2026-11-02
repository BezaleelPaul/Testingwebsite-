import React from 'react';
import Link from 'next/link';
import { ArrowUp, ArrowUpRight, Download } from 'lucide-react';
import { PilotProfile } from '@/types/portfolio';

interface ContactSectionProps {
  profile: PilotProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const primarySocials = profile.socials.filter((social) => social.primary);
  const email = profile.socials.find((social) => social.icon === 'mail')?.handle || 'bezaleel321@gmail.com';

  return (
    <footer id="contact" className="dark-surface border-t border-paper/10 bg-ink px-0 pb-8 pt-24 text-paper sm:pt-32">
      <div className="section-shell">
        <div
          className="grid gap-12 border-b border-paper/15 pb-16 lg:grid-cols-12 lg:gap-16"
          data-reveal
        >
          <div className="lg:col-span-8">
            <p className="eyebrow text-signal">07 / Contact</p>
            <h2 className="serif-display mt-5 max-w-4xl text-[clamp(3.6rem,8vw,7.5rem)] text-paper">
              Have a problem worth <span className="italic text-signal">building?</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-paper/55">
              I am open to software engineering internships, collaborative products, and
              interesting open-source work. Email is the fastest way to reach me.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-3 lg:col-span-4">
            <a
              href={`mailto:${email}`}
              className="group flex items-center justify-between gap-4 rounded-full bg-signal px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-ink"
            >
              <span className="truncate">{email}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/resume"
              className="flex items-center justify-between gap-4 rounded-full border border-paper/25 px-5 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:border-paper"
            >
              <span>View résumé</span>
              <Download className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-x-6 gap-y-3 border-b border-paper/15 py-7"
          data-reveal
        >
          {primarySocials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target={social.url.startsWith('http') ? '_blank' : undefined}
              rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/48 transition-colors hover:text-paper"
            >
              {social.name}
              <ArrowUpRight className="h-3 w-3" />
            </a>
          ))}
        </div>

        <div
          className="flex flex-col justify-between gap-8 pt-8 sm:flex-row sm:items-end"
          data-reveal
        >
          <div>
            <p className="font-display text-2xl tracking-tight text-paper">Bezaleel Paul N</p>
            <p className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-paper/32">
              © {new Date().getFullYear()} · Bangalore, India · Built with care
            </p>
          </div>
          <a
            href="#main-content"
            className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-paper/40 transition-colors hover:text-paper"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
