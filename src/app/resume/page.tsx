'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  ExternalLink, 
  FileCode2, 
  Sparkles, 
  CheckCircle, 
  Globe, 
  Terminal, 
  FolderGit2, 
  Copy, 
  Check, 
  X,
  RefreshCw
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';
import resumeJsonData from '@/data/resume.json';
import { ResumeData } from '@/types/resume';

const initialResume = (resumeJsonData as unknown) as ResumeData;

export default function ResumePage() {
  const [data, setData] = useState<ResumeData>(initialResume);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    spaceAudio.playTelemetryBeep(920);
    window.print();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    spaceAudio.playTelemetryBeep(1000);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 font-sans antialiased selection:bg-teal-500 selection:text-white print:bg-white print:m-0 print:p-0">
      {/* Interactive Controls Bar - Hidden on Print */}
      <header className="print:hidden sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => spaceAudio.playTelemetryBeep(900)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span>Portfolio</span>
            </Link>

            <Link
              href="/projects"
              onClick={() => spaceAudio.playTelemetryBeep(900)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-bold transition-colors border border-slate-700"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Projects Archive</span>
            </Link>

            <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800/80 px-2.5 py-1 rounded-md">
              LIVE AUTO-ORGANIZED RESUME
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                spaceAudio.playTelemetryBeep(950);
                setShowJsonModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
              title="Inspect or auto-modify live resume schema"
            >
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Data (JSON)</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-mono font-bold transition-colors shadow-sm"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print / Save PDF</span>
            </button>

            <a
              href="/resume.pdf"
              download="Bezaleel_Paul_Resume.pdf"
              onClick={() => spaceAudio.playTelemetryBeep(1100)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Resume Sheet (A4 Layout) */}
      <div className="py-6 sm:py-10 px-2 sm:px-4 flex justify-center print:p-0 print:m-0">
        <div
          id="resume-canvas"
          className="w-full max-w-[210mm] min-h-[297mm] bg-white text-[#1e2a3a] shadow-2xl border-l-[6px] border-[#0f8f82] overflow-hidden grid grid-cols-1 md:grid-cols-[35%_1fr] print:shadow-none print:border-l-[6px] print:w-[210mm] print:h-[297mm] print:overflow-hidden print:grid-cols-[35%_1fr]"
          style={{ fontFamily: 'Inter, "Segoe UI", Arial, sans-serif' }}
        >
          {/* Left Sidebar (Aside) */}
          <aside className="bg-[#eef5fd] p-5 sm:p-6 flex flex-col gap-4 text-[10.5px] leading-relaxed border-b md:border-b-0 md:border-r border-[#dfe5ec]">
            {/* Photo Avatar */}
            {data.photo && (
              <div className="flex flex-col items-center">
                <div 
                  className="w-24 h-24 rounded-full border-4 border-[#0f8f82] bg-white bg-cover bg-center shadow-sm"
                  style={{ backgroundImage: `url('${data.photo}')` }}
                />
              </div>
            )}

            {/* Profile Identity in Sidebar */}
            <div className="text-center">
              <h2 className="font-extrabold text-[14px] text-[#1e2a3a] tracking-tight">
                {data.name} {data.nameAccent}
              </h2>
              <p className="text-[#0f8f82] font-semibold text-[11px] mt-0.5">
                {data.tagline}
              </p>
            </div>

            {/* Terminal Widget */}
            {data.terminal && data.terminal.length > 0 && (
              <div className="bg-white border border-[#dfe5ec] rounded-lg p-2.5 font-mono text-[10px] leading-relaxed shadow-xs">
                {data.terminal.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={line.startsWith('$') ? 'text-[#6b7a8c]' : 'text-[#0f8f82] font-semibold'}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

            {/* Contact Details */}
            <div>
              <h3 className="text-[#0b6f66] text-[12px] font-extrabold tracking-wider uppercase border-b border-[#dfe5ec] pb-1 mb-2">
                Contact
              </h3>
              <div className="space-y-1.5">
                {data.contact.map(([key, val]) => (
                  <div key={key}>
                    <div className="text-[9px] font-bold text-[#6b7a8c] uppercase tracking-wide">
                      {key}
                    </div>
                    <div className="text-[10.5px] text-[#1e2a3a] font-medium break-all">
                      {val.startsWith('http') || val.includes('.com') || val.includes('.io') ? (
                        <a 
                          href={val.startsWith('http') ? val : `https://${val}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-[#0f8f82] hover:underline"
                        >
                          {val}
                        </a>
                      ) : (
                        val
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Categorized Chips */}
            <div>
              <h3 className="text-[#0b6f66] text-[12px] font-extrabold tracking-wider uppercase border-b border-[#dfe5ec] pb-1 mb-2">
                Skills
              </h3>
              <div className="space-y-2">
                {data.skills.map(([category, items]) => (
                  <div key={category}>
                    <div className="text-[9px] font-bold text-[#6b7a8c] uppercase tracking-wide mb-1">
                      {category}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {items.map((skill) => (
                        <span 
                          key={skill}
                          className="bg-[#dcebfa] text-[#0b4f7a] text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-[#0b6f66] text-[12px] font-extrabold tracking-wider uppercase border-b border-[#dfe5ec] pb-1 mb-2">
                Education
              </h3>
              <div className="space-y-2">
                {data.education.map(([degree, inst, timeline]) => (
                  <div key={degree} className="text-[10px]">
                    <b className="block text-[11px] text-[#1e2a3a] font-bold">{degree}</b>
                    <span className="block text-[#0b6f66] font-medium">{inst}</span>
                    <span className="block text-[#6b7a8c] text-[9.5px]">{timeline}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-[#0b6f66] text-[12px] font-extrabold tracking-wider uppercase border-b border-[#dfe5ec] pb-1 mb-2">
                Certifications
              </h3>
              <ul className="space-y-1 text-[9px] text-[#1e2a3a] list-disc list-inside leading-snug">
                {data.certifications.map((cert, idx) => (
                  <li key={idx} className="marker:text-[#0f8f82]">
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-[#0b6f66] text-[12px] font-extrabold tracking-wider uppercase border-b border-[#dfe5ec] pb-1 mb-2">
                Languages
              </h3>
              <div className="space-y-1">
                {data.languages.map(([lang, level]) => (
                  <div key={lang} className="flex justify-between text-[9.5px]">
                    <span className="font-semibold text-[#1e2a3a]">{lang}</span>
                    <span className="text-[#6b7a8c]">{level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coursework */}
            <div>
              <h3 className="text-[#0b6f66] text-[12px] font-extrabold tracking-wider uppercase border-b border-[#dfe5ec] pb-1 mb-2">
                Coursework
              </h3>
              <ul className="space-y-1 text-[9px] text-[#1e2a3a] list-disc list-inside leading-snug">
                {data.coursework.map((course, idx) => (
                  <li key={idx} className="marker:text-[#0f8f82]">
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right Content Column (Main) */}
          <main className="p-6 sm:p-8 flex flex-col justify-between text-[10.5px] leading-relaxed">
            <div className="space-y-4">
              {/* Header Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1e2a3a] tracking-tight">
                  {data.name} <span className="text-[#0f8f82]">{data.nameAccent}</span>
                </h1>
                <div className="text-[#0f8f82] text-xs font-bold uppercase tracking-wider mt-1 pb-2 border-b border-[#dfe5ec]">
                  {data.title}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h2 className="text-[13px] font-extrabold text-[#1e2a3a] flex items-center gap-2 mb-2">
                  <span className="w-1 h-3.5 bg-[#0f8f82] rounded-xs inline-block" />
                  <span>SUMMARY</span>
                  <span className="flex-1 h-px bg-[#dfe5ec]" />
                </h2>
                <p className="text-[#2b3a4a] text-[11px] leading-relaxed">
                  {data.summary}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h2 className="text-[13px] font-extrabold text-[#1e2a3a] flex items-center gap-2 mb-2">
                  <span className="w-1 h-3.5 bg-[#0f8f82] rounded-xs inline-block" />
                  <span>EXPERIENCE & LEADERSHIP</span>
                  <span className="flex-1 h-px bg-[#dfe5ec]" />
                </h2>
                <div className="space-y-3">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-1">
                        <b className="text-[12.5px] text-[#1e2a3a] font-bold">
                          {exp.role} <span className="text-[#0f8f82] font-semibold">— {exp.org}</span>
                        </b>
                      </div>
                      <div className="text-[9.5px] text-[#6b7a8c] font-medium">
                        {exp.place}
                      </div>
                      <ul className="space-y-1 text-[10px] text-[#2b3a4a] list-disc list-inside">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="marker:text-[#0f8f82]">
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Section */}
              {data.projects && data.projects.length > 0 && (
                <div>
                  <h2 className="text-[13px] font-extrabold text-[#1e2a3a] flex items-center gap-2 mb-2">
                    <span className="w-1 h-3.5 bg-[#0f8f82] rounded-xs inline-block" />
                    <span>NOTABLE PROJECTS</span>
                    <span className="flex-1 h-px bg-[#dfe5ec]" />
                  </h2>
                  <div className="space-y-3">
                    {data.projects.map((proj, pIdx) => (
                      <div key={pIdx} className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <b className="text-[12px] text-[#1e2a3a]">{proj.name}</b>
                          <span className="text-[#0f8f82] text-[9.5px] font-semibold">{proj.tech}</span>
                        </div>
                        <div className="text-[9.5px] text-[#6b7a8c] flex gap-2">
                          {proj.links.map((l, lIdx) => (
                            <a 
                              key={lIdx} 
                              href={l.startsWith('http') ? l : `https://${l}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline hover:text-[#0f8f82]"
                            >
                              {l}
                            </a>
                          ))}
                        </div>
                        <ul className="space-y-0.5 text-[10px] text-[#2b3a4a] list-disc list-inside">
                          {proj.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="marker:text-[#0f8f82]">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects QR / Direct Link Card */}
              {data.projectsQR && (
                <div>
                  <h2 className="text-[13px] font-extrabold text-[#1e2a3a] flex items-center gap-2 mb-2">
                    <span className="w-1 h-3.5 bg-[#0f8f82] rounded-xs inline-block" />
                    <span>PROJECTS REPOSITORY & ARCHIVE</span>
                    <span className="flex-1 h-px bg-[#dfe5ec]" />
                  </h2>
                  <a
                    href={data.projectsQR.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3 rounded-lg border border-[#dfe5ec] bg-[#f8fbff] hover:border-[#0f8f82] transition-colors group text-decoration-none"
                  >
                    {/* Embedded SVG QR */}
                    <div className="w-20 h-20 flex-shrink-0 bg-white p-1 rounded border border-[#dfe5ec] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33" shapeRendering="crispEdges" className="w-full h-full fill-[#1e2a3a]">
                        <path d="M0,0h1v1h-1zM1,0h1v1h-1zM2,0h1v1h-1zM3,0h1v1h-1zM4,0h1v1h-1zM5,0h1v1h-1zM6,0h1v1h-1zM9,0h1v1h-1zM13,0h1v1h-1zM16,0h1v1h-1zM17,0h1v1h-1zM18,0h1v1h-1zM19,0h1v1h-1zM20,0h1v1h-1zM23,0h1v1h-1zM26,0h1v1h-1zM27,0h1v1h-1zM28,0h1v1h-1zM29,0h1v1h-1zM30,0h1v1h-1zM31,0h1v1h-1zM32,0h1v1h-1zM0,1h1v1h-1zM6,1h1v1h-1zM9,1h1v1h-1zM11,1h1v1h-1zM12,1h1v1h-1zM13,1h1v1h-1zM14,1h1v1h-1zM15,1h1v1h-1zM16,1h1v1h-1zM17,1h1v1h-1zM22,1h1v1h-1zM24,1h1v1h-1zM26,1h1v1h-1zM32,1h1v1h-1zM0,2h1v1h-1zM2,2h1v1h-1zM3,2h1v1h-1zM4,2h1v1h-1zM6,2h1v1h-1zM8,2h1v1h-1zM10,2h1v1h-1zM11,2h1v1h-1zM13,2h1v1h-1zM15,2h1v1h-1zM17,2h1v1h-1zM18,2h1v1h-1zM19,2h1v1h-1zM20,2h1v1h-1zM26,2h1v1h-1zM28,2h1v1h-1zM29,2h1v1h-1zM30,2h1v1h-1zM32,2h1v1h-1zM0,6h7v1h-7zM26,6h7v1h-7zM0,26h7v1h-7z" />
                      </svg>
                    </div>

                    <div className="space-y-1">
                      <b className="block text-[12.5px] text-[#1e2a3a] group-hover:text-[#0f8f82] transition-colors">
                        {data.projectsQR.label}
                      </b>
                      <span className="block text-[#0f8f82] font-semibold text-[11px]">
                        {data.projectsQR.display}
                      </span>
                      {data.projectsQR.note && (
                        <p className="text-[#6b7a8c] text-[9.5px]">
                          {data.projectsQR.note}
                        </p>
                      )}
                    </div>
                  </a>
                </div>
              )}

              {/* Extra Sections (e.g. Competitive Programming / Milestones) */}
              {data.extra && data.extra.map((sec, sIdx) => (
                <div key={sIdx}>
                  <h2 className="text-[13px] font-extrabold text-[#1e2a3a] flex items-center gap-2 mb-2">
                    <span className="w-1 h-3.5 bg-[#0f8f82] rounded-xs inline-block" />
                    <span>{sec.title}</span>
                    <span className="flex-1 h-px bg-[#dfe5ec]" />
                  </h2>
                  <div className="space-y-2">
                    {sec.items.map((item, iIdx) => (
                      <div key={iIdx} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <b className="text-[11.5px] text-[#1e2a3a]">{item.title}</b>
                          {item.meta && <span className="text-[#0f8f82] text-[9.5px]">{item.meta}</span>}
                        </div>
                        {item.bullets && (
                          <ul className="space-y-0.5 text-[10px] text-[#2b3a4a] list-disc list-inside">
                            {item.bullets.map((b, bIdx) => (
                              <li key={bIdx} className="marker:text-[#0f8f82]">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 mt-4 border-t border-[#dfe5ec] text-center text-[#6b7a8c] text-[9.5px]">
              {data.footer}
            </div>
          </main>
        </div>
      </div>

      {/* JSON Data & Auto-Sync Inspector Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  Resume Data Source (resume.json)
                </h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              This structured JSON directly powers both the online resume (<code className="text-cyan-300">/resume/</code>) and the downloadable PDF. Run the sync automation script (<code className="text-cyan-300">npm run sync:resume</code>) to auto-update certifications, skills, and experience whenever new achievements or posts are published.
            </p>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-300">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">
                Source: <strong className="text-white">resume/resume.json</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
