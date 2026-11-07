'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Search } from 'lucide-react';
import { INITIAL_PROJECTS } from '@/data/profileData';
import githubRepositoryData from '@/data/github-repositories.json';
import { ProjectCategory } from '@/types/portfolio';
import { Navbar } from '@/components/layout/Navbar';

type PublicRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
};

const publicRepositories = githubRepositoryData.repositories as PublicRepository[];

const categories: ProjectCategory[] = [
  'All',
  'Flutter & Mobile',
  'AI / ML',
  'Full-Stack',
  'Web Development',
  'Open Source',
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return INITIAL_PROJECTS.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesSearch =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.stack.some((technology) => technology.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const filteredRepositories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return publicRepositories;
    return publicRepositories.filter((repository) => {
      const searchable = [
        repository.name,
        repository.full_name,
        repository.description ?? '',
        repository.language ?? '',
        ...(repository.topics ?? []),
      ].join(' ').toLowerCase();
      return searchable.includes(query);
    });
  }, [searchQuery]);

  const resetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <main className="pb-24 pt-32 sm:pt-36">
        <div className="section-shell">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          <header
            className="mt-12 grid gap-8 border-b border-ink/15 pb-12 lg:grid-cols-12 lg:items-end"
            data-reveal
          >
            <div className="lg:col-span-8">
              <p className="eyebrow text-ink/45">Archive</p>
              <h1 className="serif-display mt-5 max-w-3xl text-6xl text-ink sm:text-8xl">
                Every project, in one place.
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/55 lg:col-span-4 lg:ml-auto">
              Mobile apps, machine-learning experiments, civic tools, and open-source utilities.
              Filter by discipline or search the stack.
            </p>
          </header>

          <div className="border-b border-ink/15 py-7" data-reveal data-reveal-delay="80">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`rounded-full border px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.06em] transition-colors ${
                      activeCategory === category
                        ? 'border-ink bg-ink text-paper'
                        : 'border-ink/20 text-ink/55 hover:border-ink hover:text-ink'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/35" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search projects by name, description, or technology"
                  placeholder="Search projects or stack"
                  className="w-full rounded-full border border-ink/20 bg-paper-bright py-2.5 pl-10 pr-4 font-mono text-[10px] text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40" aria-live="polite">
                Showing {filteredProjects.length} of {INITIAL_PROJECTS.length} projects
              </p>
              {filteredProjects.length > 0 && (activeCategory !== 'All' || searchQuery.length > 0) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="link-underline font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/55 hover:text-ink"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-x-8 md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <article
                  key={project.id}
                  className="flex flex-col border-b border-ink/15 py-9 md:py-11"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow text-ink/40">{project.category}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink/30">
                      {project.status} / {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-3xl leading-[0.98] tracking-tight text-ink sm:text-4xl">
                    {project.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/58">
                    {project.tagline}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
                    {project.stack.map((technology) => (
                      <span
                        key={technology}
                        className="font-mono text-[9px] uppercase tracking-[0.06em] text-ink/38"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex-1 border-t border-ink/12 pt-5">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-ink">
                        Engineering notes
                        <span className="relative h-3 w-3 shrink-0">
                          <span className="absolute left-0 top-1/2 h-px w-3 bg-ink" />
                          <span className="absolute left-1/2 top-0 h-3 w-px bg-ink transition-transform group-open:rotate-90" />
                        </span>
                      </summary>
                      <div className="space-y-5 pt-5">
                        <div>
                          <h3 className="eyebrow text-ink/35">The problem</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink/58">{project.problem}</p>
                        </div>
                        <div>
                          <h3 className="eyebrow text-ink/35">The approach</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-ink/58">{project.solution}</p>
                        </div>
                        {project.highlights.length > 0 && (
                          <ul className="space-y-1.5">
                            {project.highlights.map((highlight) => (
                              <li key={highlight} className="flex gap-2 text-xs leading-relaxed text-ink/50">
                                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-ink/35" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </details>
                  </div>

                  <div className="mt-6 flex items-center gap-5">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/55 hover:text-ink"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target={project.demoUrl.startsWith('http') ? '_blank' : undefined}
                        rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/55 hover:text-ink"
                      >
                        Live project
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="eyebrow text-ink/35">No results</p>
              <h2 className="serif-display mt-4 text-5xl text-ink">No matching projects.</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/50">
                Try a broader category or a different keyword.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-7 rounded-full bg-ink px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-paper"
              >
                Reset filters
              </button>
            </div>
          )}

          <section className="mt-20 border-t border-ink/15 pt-10" aria-labelledby="public-repositories-heading">
            <div className="flex flex-col gap-4 border-b border-ink/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-ink/40">GitHub // Live index</p>
                <h2 id="public-repositories-heading" className="serif-display mt-3 text-4xl text-ink sm:text-6xl">
                  Public repositories.
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/55">
                  Every public repository owned by <span className="font-mono text-ink">@BezaleelPaul</span>, including forks and archived projects. New public repositories are discovered automatically; private work stays manual and is never fetched.
                </p>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40 sm:text-right">
                <span className="block text-2xl text-ink">{githubRepositoryData.count}</span>
                Public repositories
                <span className="mt-1 block normal-case tracking-normal">
                  {githubRepositoryData.generatedAt
                    ? `Synced ${String(githubRepositoryData.generatedAt ?? '').slice(0, 10)}`
                    : 'Awaiting first sync'}
                </span>
              </div>
            </div>

            {filteredRepositories.length > 0 ? (
              <div className="grid gap-x-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredRepositories.map((repository) => (
                  <article key={repository.id} className="flex min-w-0 flex-col border-b border-ink/15 py-7">
                    <div className="flex items-start justify-between gap-3">
                      <span className="eyebrow min-w-0 break-all text-ink/40">{repository.full_name}</span>
                      <Github className="h-4 w-4 shrink-0 text-ink/35" />
                    </div>
                    <h3 className="mt-4 break-words font-display text-2xl leading-tight text-ink">
                      {repository.name}
                    </h3>
                    <p className="mt-3 min-h-12 text-xs leading-relaxed text-ink/55">
                      {repository.description || 'No description provided on GitHub.'}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.08em] text-ink/40">
                      {repository.language && <span>{repository.language}</span>}
                      <span>★ {repository.stargazers_count}</span>
                      <span>⑂ {repository.forks_count}</span>
                      {repository.fork && <span>Fork</span>}
                      {repository.archived && <span>Archived</span>}
                    </div>
                    {repository.topics.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {repository.topics.slice(0, 5).map((topic) => (
                          <span key={topic} className="rounded-full border border-ink/15 px-2 py-1 font-mono text-[8px] text-ink/45">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    <a
                      href={repository.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 border-t border-ink/10 pt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/55 transition hover:text-ink"
                    >
                      View repository <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-12 text-sm text-ink/50">
                No public repositories match “{searchQuery}”. Clear the search to see the full index.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
