'use client';

import React, { useState, useMemo } from 'react';
import { ProjectItem, ProjectCategory } from '@/types/portfolio';
import { Search, ExternalLink, Github, Sparkles, Layers, CheckCircle, ArrowUpRight, X } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
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
    return projects.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  const featuredProjects = useMemo(() => {
    return filteredProjects.filter((p) => p.featured);
  }, [filteredProjects]);

  const standardProjects = useMemo(() => {
    return filteredProjects.filter((p) => !p.featured);
  }, [filteredProjects]);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-space-950">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
            [ 02 // ENGINEERING SHOWCASE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-wide">
            FEATURED DISCOVERIES & SYSTEMS
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400 font-sans">
            Production systems, algorithmic frameworks, and open-source software built with verifiable real-world utility.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-hud-cyan to-transparent mt-2" />
        </div>

        {/* Filter and Search Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-space-900/80 border border-slate-800">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  spaceAudio.playTelemetryBeep(900);
                  setActiveCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-hud-cyan text-space-950 font-bold shadow-[0_0_12px_rgba(0,243,255,0.4)]'
                    : 'bg-space-950/80 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack, project, keyword..."
              className="w-full bg-space-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-hud-cyan transition-colors"
            />
          </div>
        </div>

        {/* Featured Projects (Editorial Large Spotlight) */}
        {featuredProjects.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-hud-cyan flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-hud-amber" /> Flagship Architectural Spotlights
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-gradient-to-br from-space-900/90 to-space-950/90 border border-cyan-500/30 p-6 sm:p-8 space-y-6 hover:border-hud-cyan transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.6)] group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-hud-cyan font-bold bg-cyan-950/80 border border-cyan-800 px-2.5 py-1 rounded">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {project.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-display font-bold text-white group-hover:text-hud-cyan transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-sm font-mono text-slate-400 mt-1">{project.tagline}</p>
                  </div>

                  {/* Problem & Solution Breakdown */}
                  <div className="space-y-3 bg-space-950/60 p-4 rounded-xl border border-slate-850">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-hud-amber font-semibold">
                        The Challenge:
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{project.problem}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-hud-cyan font-semibold">
                        The Architectural Solution:
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{project.solution}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded bg-space-950 text-slate-300 text-xs font-mono border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="pt-4 border-t border-slate-850 flex items-center justify-between">
                    <button
                      onClick={() => {
                        spaceAudio.playTelemetryBeep(1100);
                        setSelectedProject(project);
                      }}
                      className="text-xs font-mono text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-4 flex items-center gap-1"
                    >
                      <span>Read Full Specs</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-hud-cyan text-space-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-colors"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 border border-slate-700 text-white font-mono text-xs transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standard Projects Grid */}
        <div className="space-y-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-hud-cyan" /> Complete Engineering Library ({filteredProjects.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl bg-space-900/70 border border-slate-800 hover:border-cyan-500/50 p-6 space-y-4 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-hud-cyan">{project.category}</span>
                    <span className="text-slate-500">{project.status}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-hud-cyan transition-colors">
                    {project.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-space-950 text-slate-400 text-[10px] font-mono border border-slate-850"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-space-950 text-slate-500 text-[10px] font-mono">
                        +{project.stack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryBeep(1100);
                      setSelectedProject(project);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Details
                  </button>
                  <div className="flex items-center gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-hud-cyan hover:underline flex items-center gap-0.5"
                      >
                        Demo <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white flex items-center gap-0.5"
                    >
                      Repo <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-space-900 border border-hud-cyan/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-hud-cyan font-bold uppercase">
                    {selectedProject.category} · {selectedProject.status}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{selectedProject.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded bg-space-800 text-slate-400 hover:text-white border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm font-sans text-slate-300 leading-relaxed">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-hud-amber mb-1 font-bold">
                    Problem Definition
                  </h4>
                  <p className="bg-space-950 p-3 rounded-lg border border-slate-850">{selectedProject.problem}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-hud-cyan mb-1 font-bold">
                    Architectural Solution
                  </h4>
                  <p className="bg-space-950 p-3 rounded-lg border border-slate-850">{selectedProject.solution}</p>
                </div>

                {selectedProject.highlights && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-white mb-2 font-bold">
                      Key Highlights & Milestones
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside font-mono text-xs text-slate-400">
                      {selectedProject.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.stack.map((t) => (
                      <span key={t} className="px-3 py-1 rounded bg-space-950 text-hud-cyan text-xs font-mono border border-cyan-900/50">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-hud-cyan text-space-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>Launch Live Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-space-800 hover:bg-space-700 text-white font-mono text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
