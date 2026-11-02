'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ProjectItem } from '@/types/portfolio';
import { 
  ExternalLink, 
  Github, 
  Sparkles, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowRight,
  X, 
  FolderGit2,
  Layers,
  Code2
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Focus on top flagship featured projects for home showcase
  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.featured);
  }, [projects]);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060a12] border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/60 border border-cyan-800/80 px-3 py-1 rounded-full">
            [ 02 // ENGINEERING SHOWCASE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            FLAGSHIP ARCHITECTURES & SYSTEMS
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Featured production software, predictive machine learning engines, and cross-platform utilities.
          </p>
          
          <div className="pt-2">
            <Link
              href="/projects"
              onClick={() => spaceAudio.playTelemetryBeep(960)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border-2 border-cyan-500/50 text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-slate-850 font-mono text-xs font-bold transition-all shadow-md group"
            >
              <FolderGit2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Explore Dedicated Projects Archive ({projects.length} Total Systems)</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Featured Projects Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono uppercase tracking-widest text-cyan-300 flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" /> Flagship Spotlights
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Showing <strong className="text-cyan-400">{featuredProjects.length}</strong> core systems
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-[#0d1424] border-2 border-slate-700/90 p-6 space-y-5 hover:border-cyan-400 transition-all duration-300 shadow-xl group relative overflow-hidden flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/90 border border-cyan-700 px-2.5 py-1 rounded-md">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
                      <CheckCircle className="w-3.5 h-3.5" /> {project.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-display font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs font-mono text-cyan-400 mt-1 font-semibold line-clamp-2">{project.tagline}</p>
                  </div>

                  {/* Problem & Solution Breakdown */}
                  <div className="space-y-2.5 bg-[#070b14] p-3.5 rounded-xl border border-slate-700/80 text-xs">
                    <div>
                      <span className="font-mono uppercase tracking-wider text-amber-400 font-bold">
                        Challenge:
                      </span>
                      <p className="text-slate-200 mt-0.5 line-clamp-2 leading-relaxed font-sans">{project.problem}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="font-mono uppercase tracking-wider text-cyan-400 font-bold">
                        Architecture:
                      </span>
                      <p className="text-slate-200 mt-0.5 line-clamp-2 leading-relaxed font-sans">{project.solution}</p>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px] font-mono font-medium border border-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-850 text-slate-400 text-[11px] font-mono">
                        +{project.stack.length - 4}
                      </span>
                    )}
                  </div>
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
                    <span>Full Specs</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-colors shadow-md"
                      >
                        <span>Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs font-bold transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Full Projects Directory Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0c162d] via-[#091224] to-[#0c162d] border-2 border-cyan-500/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700 text-cyan-300 font-mono text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Engineering Catalog</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Looking for all projects, civic tools & math visualizers?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base font-sans leading-relaxed">
              Explore the dedicated archive containing all {projects.length}+ production applications, civic calculators (BESCOM), Taylor/Maclaurin series visualizers, algorithmic tooling, and open-source packages with live search and category filtering.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/projects"
              onClick={() => spaceAudio.playTelemetryBeep(1000)}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-cyan-400 text-slate-950 font-mono text-sm font-extrabold hover:bg-cyan-300 shadow-[0_0_25px_rgba(0,243,255,0.45)] transition-all transform hover:-translate-y-1 hover:scale-105"
            >
              <span>View Complete Projects Page</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
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

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <Link
                  href="/projects"
                  className="text-xs font-mono text-cyan-400 hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Go to Projects Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3">
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
          </div>
        )}
      </div>
    </section>
  );
};
