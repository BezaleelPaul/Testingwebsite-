'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Cpu,
  Github,
  Home,
  Mail,
  Search,
  Sparkles,
  X,
} from 'lucide-react';

const destinations = [
  { label: 'Home', detail: 'Return to the opening transmission', href: '#top', group: 'NAVIGATE', icon: Home },
  { label: 'Selected work', detail: 'Explore featured engineering projects', href: '#work', group: 'NAVIGATE', icon: BriefcaseBusiness },
  { label: 'Experience', detail: 'Roles, teams, and timeline', href: '#experience', group: 'NAVIGATE', icon: BookOpen },
  { label: 'Skills', detail: 'Tools, technologies, and capabilities', href: '#skills', group: 'NAVIGATE', icon: Cpu },
  { label: 'Contact', detail: 'Open a direct communication channel', href: '#contact', group: 'NAVIGATE', icon: Mail },
  { label: 'Project archive', detail: 'Browse the complete project index', href: '/projects/', group: 'DESTINATIONS', icon: Github },
  { label: 'Work Atlas', detail: 'Explore the project constellation', href: '/atlas/', group: 'DESTINATIONS', icon: Sparkles },
  { label: 'Résumé dossier', detail: 'Open the recruiter-ready résumé', href: '/resume/', group: 'DESTINATIONS', icon: BookOpen },
];

export function CommandDeck() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return destinations;
    return destinations.filter((item) =>
      `${item.label} ${item.detail} ${item.group}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
      return;
    }
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const selectDestination = (href: string) => {
    setOpen(false);
    if (href.startsWith('#')) {
      if (pathname !== '/') {
        router.push(`/${href}`);
        return;
      }
      const target = document.querySelector(href);
      target?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      window.history.replaceState(window.history.state, '', href);
      return;
    }
    router.push(href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && filtered[activeIndex]) {
      event.preventDefault();
      selectDestination(filtered[activeIndex].href);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        className="command-deck-trigger"
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="command-deck-dialog"
      >
        <span className="command-deck-trigger-icon"><Sparkles size={14} /></span>
        <span className="command-deck-trigger-label">COMMAND DECK</span>
        <kbd>⌘ K</kbd>
      </button>

      {open && (
        <div
          className="command-deck-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            id="command-deck-dialog"
            className="command-deck-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-deck-title"
          >
            <header className="command-deck-header">
              <div>
                <p className="command-deck-eyebrow"><span /> BP / NAVIGATION SYSTEM</p>
                <h2 id="command-deck-title">Where to <em>next?</em></h2>
              </div>
              <button className="command-deck-close" type="button" onClick={() => setOpen(false)} aria-label="Close command deck">
                <X size={18} />
              </button>
            </header>

            <label className="command-deck-search">
              <Search size={17} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search destinations, projects, sections…"
                aria-label="Search command deck"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd>ESC</kbd>
            </label>

            <div className="command-deck-results" role="listbox" aria-label="Navigation destinations">
              {filtered.length ? filtered.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    className={`command-deck-item${index === activeIndex ? ' is-active' : ''}`}
                    key={item.label}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectDestination(item.href)}
                  >
                    <span className="command-deck-item-icon"><Icon size={17} /></span>
                    <span className="command-deck-item-copy">
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </span>
                    <span className="command-deck-item-arrow"><ArrowUpRight size={15} /></span>
                  </button>
                );
              }) : (
                <p className="command-deck-empty">NO DESTINATIONS FOUND — TRY ANOTHER SEARCH.</p>
              )}
            </div>

            <footer className="command-deck-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> TO NAVIGATE</span>
              <span><kbd>↵</kbd> TO OPEN</span>
              <span>ESC TO CLOSE</span>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
