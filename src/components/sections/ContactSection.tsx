'use client';

import React from 'react';
import { PilotProfile } from '@/types/portfolio';
import { Mail, Github, Linkedin, FileText, ArrowUpRight, Compass, Heart } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface ContactSectionProps {
  profile: PilotProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  return (
    <footer id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-space-950 overflow-hidden border-t border-cyan-500/20">
      {/* Subtle Atmospheric Horizon Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-44 left-1/2 -translate-x-1/2 w-[140vw] h-72 rounded-[100%] bg-gradient-to-t from-cyan-900/20 via-space-900/40 to-transparent border-t border-cyan-500/25 blur-sm" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* Section Tag */}
        <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
          [ 07 // BEYOND THE HORIZON ]
        </span>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight">
            INITIATE COLLABORATION
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Whether for engineering roles, AI/ML research collaborations, or open-source initiatives, my channel is open.
          </p>
        </div>

        {/* Primary Contact CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="mailto:bezaleel321@gmail.com"
            onClick={() => spaceAudio.playTelemetryBeep(1000)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-hud-cyan text-space-950 font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(0,243,255,0.4)] hover:bg-cyan-300 transform hover:-translate-y-0.5 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Send Direct Dispatch (Email)</span>
          </a>

          <a
            href="/resume.pdf"
            download
            onClick={() => spaceAudio.playTelemetryBeep(1100)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-space-900 border border-slate-700 hover:border-hud-cyan text-white font-mono text-xs uppercase tracking-wider hover:bg-space-850 transform hover:-translate-y-0.5 transition-all"
          >
            <FileText className="w-4 h-4 text-hud-cyan" />
            <span>Download Resume (PDF)</span>
          </a>
        </div>

        {/* Social Links Network Grid */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
          {profile.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-space-900/80 border border-slate-800 hover:border-hud-cyan/50 text-slate-300 hover:text-white font-mono text-xs transition-colors group"
            >
              <span>{social.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-hud-cyan transition-colors" />
            </a>
          ))}
        </div>

        {/* Memorable Closing Philosophy */}
        <div className="pt-12 space-y-4">
          <p className="text-xl sm:text-2xl font-display italic text-slate-200 tracking-wide">
            &ldquo;Yet to learn. Yet to discover. Yet to explore.&rdquo;
          </p>

          <p className="text-xs font-mono text-slate-500">
            © {new Date().getFullYear()} Bezaleel Paul N. Crafted with Next.js, React Three Fiber &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};
