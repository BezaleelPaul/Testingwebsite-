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
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060a12] border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            [ 02 // ENGINEERING SHOWCASE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            FEATURED DISCOVERIES & SYSTEMS
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Production systems, algorithmic frameworks, and open-source software built with verifiable real-world utility.
          </p>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>

        {/* Filter and Search Controls Card */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-md">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  spaceAudio.playTelemetryBeep(900);
                  setActiveCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all whitespace-nowrap font-bold ${
                  activeCategory === cat
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
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
              placeholder="Search stack, project, keyword..."
              className="w-full bg-[#070b14] border-2 border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors font-medium"
            />
          </div>
        </div>

        {/* Featured Projects (Editorial Spotlight) */}
        {featuredProjects.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-300 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" /> Flagship Architectural Spotlights
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-[#0d1424] border-2 border-slate-700/90 p-7 space-y-6 hover:border-cyan-400 transition-all duration-300 shadow-xl group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/90 border border-cyan-700 px-3 py-1 rounded-md">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
                      <CheckCircle className="w-3.5 h-3.5" /> {project.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-display font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-sm font-mono text-cyan-400 mt-1 font-semibold">{project.tagline}</p>
                  </div>

                  {/* Problem & Solution Breakdown */}
                  <div className="space-y-3 bg-[#070b14] p-4 rounded-xl border border-slate-700">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                        The Challenge:
                      </span>
                      <p className="text-sm text-slate-200 mt-1 leading-relaxed font-sans">{project.problem}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        The Architectural Solution:
                      </span>
                      <p className="text-sm text-slate-200 mt-1 leading-relaxed font-sans">{project.solution}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-mono font-medium border border-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Links */}
                  <div className="pt-4 border-t border-slate-750 flex items-center justify-between">
                    <button
                      onClick={() => {
                        spaceAudio.playTelemetryBeep(1100);
                        setSelectedProject(project);
                      }}
                      className="text-xs font-mono text-cyan-400 hover:text-white font-bold underline decoration-cyan-500/50 underline-offset-4 flex items-center gap-1"
                    >
                      <span>Read Full Specs</span>
                    </button>

                    <div className="flex items-center gap-2.5">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-colors shadow-md"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs font-bold transition-colors"
                      >
                        <Github className="w-4 h-4" />
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
          <h3 className="text-sm font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold">
            <Layers className="w-4 h-4 text-cyan-400" /> Complete Engineering Library ({filteredProjects.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 hover:border-cyan-400 p-6 space-y-4 transition-all duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      {project.category}
                    </span>
                    <span className="text-slate-400 font-medium">{project.status}</span>
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h4>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="px-2 py-0.5 rounded bg-slate-850 text-slate-400 text-xs font-mono">
                        +{project.stack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-750 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => {
                      spaceAudio.playTelemetryBeep(1100);
                      setSelectedProject(project);
                    }}
                    className="text-cyan-400 hover:text-white font-bold"
                  >
                    Details
                  </button>
                  <div className="flex items-center gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-white font-bold flex items-center gap-0.5"
                      >
                        Demo <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 hover:text-white font-medium flex items-center gap-0.5"
                    >
                      Repo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[#0d1424] border-2 border-cyan-400 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    {selectedProject.category} · {selectedProject.status}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{selectedProject.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm font-sans text-slate-200 leading-relaxed">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-amber-400 mb-1 font-bold">
                    Problem Definition
                  </h4>
                  <p className="bg-[#070b14] p-3.5 rounded-xl border border-slate-700 leading-relaxed">{selectedProject.problem}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-cyan-400 mb-1 font-bold">
                    Architectural Solution
                  </h4>
                  <p className="bg-[#070b14] p-3.5 rounded-xl border border-slate-700 leading-relaxed">{selectedProject.solution}</p>
                </div>

                {selectedProject.highlights && (
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-white mb-2 font-bold">
                      Key Highlights & Milestones
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside font-mono text-xs text-slate-300">
                      {selectedProject.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-slate-300 mb-2 font-bold">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.stack.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-md bg-[#070b14] text-cyan-300 text-xs font-mono font-bold border border-cyan-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <span>Launch Live Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={selectedProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold border border-slate-600 transition-colors flex items-center gap-1.5"
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
