'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PUBLIC_REPOSITORY_ARCHIVE } from '@/data/publicRepositoryArchive';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredRepositories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return PUBLIC_REPOSITORY_ARCHIVE.filter((repo) => repo.name.toLowerCase().includes(query));
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main className="pb-24 pt-32 sm:pt-36">
        <div className="section-shell">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45 transition-colors hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
          </Link>

          <header className="mt-12 grid gap-8 border-b border-ink/15 pb-12 lg:grid-cols-12 lg:items-end" data-reveal>
            <div className="lg:col-span-8">
              <p className="eyebrow text-ink/45">Public GitHub archive</p>
              <h1 className="serif-display mt-5 max-w-3xl text-6xl text-ink sm:text-8xl">The workbench.</h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/55 lg:col-span-4 lg:ml-auto">
              A browsable index of public repositories. Open a project to inspect its source, history,
              documentation, and releases.
            </p>
          </header>

          <div className="border-b border-ink/15 py-7" data-reveal data-reveal-delay="80">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/35" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                aria-label="Search public repositories"
                placeholder="Search public repositories"
                className="w-full rounded-full border border-ink/20 bg-paper-bright py-3 pl-10 pr-4 font-mono text-[10px] text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
              />
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40" aria-live="polite">
                Showing {filteredRepositories.length} of {PUBLIC_REPOSITORY_ARCHIVE.length} public repositories
              </p>
              {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="link-underline font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/55 hover:text-ink">Clear search</button>}
            </div>
          </div>

          {filteredRepositories.length ? (
            <div className="grid gap-7 py-9 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRepositories.map((repo, index) => (
                <article key={repo.name} className="group overflow-hidden border border-ink/12 bg-paper-bright transition-colors hover:border-ink/40">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                      <img
                        src={repo.image}
                        alt={`GitHub preview for ${repo.name}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        onError={(event) => {
                          event.currentTarget.src = `https://github.com/BezaleelPaul/${repo.name}.png`;
                        }}
                      />
                      <span className="absolute left-3 top-3 bg-paper/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-ink/65">Public repository</span>
                      <span className="absolute bottom-3 right-3 bg-paper/90 px-2 py-1 font-mono text-[8px] text-ink/55">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </a>
                  <div className="p-5">
                    <h2 className="break-words font-display text-xl leading-tight text-ink">{repo.name}</h2>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.08em] text-ink/38">Branch: {repo.branch}{repo.archived ? ' · Archived' : ''}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-ink/12 pt-4">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink/60 hover:text-ink">
                        <Github className="h-3.5 w-3.5" /> Source
                      </a>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${repo.name} on GitHub`} className="text-ink/45 transition-colors hover:text-ink">
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="eyebrow text-ink/35">No results</p>
              <h2 className="serif-display mt-4 text-5xl text-ink">No matching repositories.</h2>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
