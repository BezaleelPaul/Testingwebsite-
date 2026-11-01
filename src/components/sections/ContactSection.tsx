'use client';

import React from 'react';
import { PilotProfile } from '@/types/portfolio';
import { Mail, FileText, ArrowUpRight } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface ContactSectionProps {
  profile: PilotProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  return (
    <footer id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#04070f] overflow-hidden border-t border-slate-800">
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
        {/* Section Tag */}
        <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
          [ 07 // BEYOND THE HORIZON ]
        </span>

        {/* Solid Contact Card */}
        <div className="bg-[#0d1424] border-2 border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              INITIATE COLLABORATION
            </h2>
            <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-200 font-sans leading-relaxed">
              Whether for software engineering roles, full-stack architectures, AI/ML research collaborations, or open-source initiatives, my channel is open.
            </p>
          </div>

          {/* Primary Contact CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:bezaleel321@gmail.com"
              onClick={() => spaceAudio.playTelemetryBeep(1000)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:bg-cyan-300 transform hover:-translate-y-0.5 transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>Send Direct Email (bezaleel321@gmail.com)</span>
            </a>

            <a
              href="/resume.pdf"
              download
              onClick={() => spaceAudio.playTelemetryBeep(1100)}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 border-2 border-slate-600 hover:border-cyan-400 text-white font-mono text-sm font-bold uppercase tracking-wider hover:bg-slate-700 transform hover:-translate-y-0.5 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Download Resume (PDF)</span>
            </a>
          </div>

          {/* Social Links Network Grid */}
          <div className="pt-6 border-t border-slate-750 flex flex-wrap items-center justify-center gap-3">
            {profile.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#070b14] border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white font-mono text-xs font-bold transition-colors group"
              >
                <span>{social.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Memorable Closing Philosophy */}
        <div className="pt-6 space-y-4">
          <p className="text-2xl sm:text-3xl font-display italic text-slate-200 tracking-wide font-medium">
            &ldquo;Yet to learn. Yet to discover. Yet to explore.&rdquo;
          </p>

          <p className="text-xs font-mono text-slate-400 font-semibold">
            © {new Date().getFullYear()} Bezaleel Paul N · Software Developer &amp; Double Degree Scholar
          </p>
        </div>
      </div>
    </footer>
  );
};
