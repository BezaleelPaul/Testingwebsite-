'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  ArrowUpRight, 
  X, 
  FolderGit2,
  Code2,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';
import { INITIAL_PROJECTS, INITIAL_PROFILE } from '@/data/profileData';
import { ProjectItem, ProjectCategory } from '@/types/portfolio';
import { spaceAudio } from '@/lib/audio';
import { Navbar } from '@/components/layout/Navbar';

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories: ProjectCategory[] = [
    'All',
    'Flutter & Mobile',
    'AI / ML',
    'Full-Stack',
    'Web Development',
    'Open Source'
  ];

  const filteredProjects = useMemo(() => {
    return INITIAL_PROJECTS.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-hud-cyan selection:text-space-950 font-sans antialiased overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => spaceAudio.playTelemetryBeep(900)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 font-mono text-xs font-bold transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Portfolio</span>
          </Link>

          <span className="text-xs font-mono text-slate-400">
            Total Projects: <strong className="text-cyan-400 font-bold">{INITIAL_PROJECTS.length}</strong>
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider shadow-sm">
            <FolderGit2 className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Verified Systems, Frameworks & Tooling</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Complete Projects Archive
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Deep-dive technical architectures, algorithmic problem solvers, predictive machine learning pipelines, and cross-platform utilities engineered by Bezaleel Paul N.
          </p>
        </div>

        {/* Filter and Search Controls Card */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-xl">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  spaceAudio.playTelemetryBeep(900);
                  setActiveCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all whitespace-nowrap font-bold ${
                  activeCategory === cat
                    ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-600 hover:border-cyan-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack, language, keywords..."
              className="w-full bg-[#070b14] border-2 border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl bg-[#0c1220] border-2 border-slate-700/80 p-7 sm:p-9 space-y-6 flex flex-col justify-between hover:border-cyan-400 transition-all shadow-2xl relative group"
            >
              <div className="space-y-4">
                {/* Header Tag & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-700/80 px-3 py-1 rounded-md uppercase tracking-wider">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-300 bg-amber-950/80 border border-amber-600/70 px-2.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-400" /> FEATURED
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400">
                      [{project.status}]
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm font-mono text-cyan-400/90 font-medium leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Problem & Solution Architecture Card */}
                <div className="bg-[#070b14] p-4 rounded-xl border border-slate-800 space-y-3 font-sans text-xs">
                  <div>
                    <span className="font-mono font-bold text-amber-400 uppercase tracking-wide block mb-1">
                      CHALLENGE & PROBLEM:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">{project.problem}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="font-mono font-bold text-emerald-400 uppercase tracking-wide block mb-1">
                      ENGINEERED SOLUTION:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">{project.solution}</p>
                  </div>
                </div>

                {/* Key Technical Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                      Key Highlights:
                    </span>
                    <ul className="space-y-1.5">
                      {project.highlights.map((hl, hIdx) => (
                        <li key={hIdx} className="text-xs text-slate-200 font-sans flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Stack & Links Footer */}
              <div className="pt-5 border-t border-slate-700/80 space-y-4">
                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-slate-800/90 text-slate-200 text-xs font-mono font-medium rounded-md border border-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => spaceAudio.playTelemetryBeep(1100)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold border border-slate-600 transition-all hover:border-cyan-400"
                      >
                        <Github className="w-4 h-4 text-cyan-400" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target={project.demoUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        onClick={() => spaceAudio.playTelemetryBeep(1200)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-md"
                      >
                        <ExternalLink className="w-4 h-4 text-slate-950" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      spaceAudio.playTelemetryBeep(950);
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for In-Depth Project Inspection */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#0c1220] border-2 border-cyan-400 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    [ PROJECT ARCHITECTURE SPEC ]
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {selectedProject.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm font-mono text-cyan-300 font-medium">
                {selectedProject.tagline}
              </p>

              <div className="bg-[#070b14] p-5 rounded-2xl border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Problem Context:
                  </h4>
                  <p className="text-sm text-slate-300 font-sans leading-relaxed">
                    {selectedProject.problem}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Engineered Solution & Architecture:
                  </h4>
                  <p className="text-sm text-slate-200 font-sans leading-relaxed">
                    {selectedProject.solution}
                  </p>
                </div>
                {selectedProject.metrics && (
                  <div className="pt-3 border-t border-slate-800">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      Verified Metrics & Performance:
                    </h4>
                    <p className="text-sm text-slate-200 font-sans leading-relaxed">
                      {selectedProject.metrics}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Technology Stack & Tools:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 text-xs font-mono font-medium border border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                {selectedProject.repoUrl && (
                  <a
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold border border-slate-600"
                  >
                    <Github className="w-4 h-4 text-cyan-400" />
                    <span>View GitHub Repository</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target={selectedProject.demoUrl.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono text-xs font-bold shadow-md"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-950" />
                    <span>Launch Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center font-mono text-xs text-slate-500">
        <p>© 2026 Bezaleel Paul N · Complete Projects Archive · Bangalore, India</p>
      </footer>
    </div>
  );
}
