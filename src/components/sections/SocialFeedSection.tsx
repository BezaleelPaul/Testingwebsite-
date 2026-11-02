'use client';

import React, { useState } from 'react';
import { 
  Radio, 
  Linkedin, 
  ExternalLink, 
  Heart, 
  Repeat2, 
  MessageSquare, 
  Pin, 
  Share2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { SOCIAL_POSTS, SocialPost } from '@/data/socialPosts';
import { spaceAudio } from '@/lib/audio';

// Custom X (Twitter) Logo SVG for authentic branding
const XLogo = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const SocialFeedSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'linkedin' | 'x'>('all');

  const filteredPosts = SOCIAL_POSTS.filter((post) => {
    if (filter === 'all') return true;
    return post.platform === filter;
  });

  return (
    <section id="social-feed" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070b14] border-t border-slate-800 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Public Transmissions & Social Broadcasts</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Latest Thoughts, Updates & Milestones
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Live technical dispatches, open-source project releases, and academic milestones broadcast across my social channels.
          </p>

          {/* Direct Profile Link Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://www.linkedin.com/in/bezaleel-pauln/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => spaceAudio.playTelemetryBeep(1100)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a66c2]/20 hover:bg-[#0a66c2]/30 border border-[#0a66c2]/60 text-sky-300 hover:text-white font-mono text-xs font-bold transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              <Linkedin className="w-4 h-4 text-[#0a66c2]" />
              <span>LinkedIn: in/bezaleel-pauln</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href="https://x.com/BezaleelPaul1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => spaceAudio.playTelemetryBeep(1200)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              <XLogo className="w-4 h-4 text-white" />
              <span>X (Twitter): @BezaleelPaul1</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          {/* Platform Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              All Transmissions ({SOCIAL_POSTS.length})
            </button>
            <button
              onClick={() => setFilter('linkedin')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filter === 'linkedin'
                  ? 'bg-[#0a66c2] text-white shadow-[0_0_15px_rgba(10,102,194,0.6)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn ({SOCIAL_POSTS.filter((p) => p.platform === 'linkedin').length})</span>
            </button>
            <button
              onClick={() => setFilter('x')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filter === 'x'
                  ? 'bg-white text-slate-950 shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <XLogo className="w-3.5 h-3.5" />
              <span>X / Twitter ({SOCIAL_POSTS.filter((p) => p.platform === 'x').length})</span>
            </button>
          </div>
        </div>

        {/* Posts Grid: Solid High-Contrast Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const isLinkedIn = post.platform === 'linkedin';
            return (
              <article
                key={post.id}
                className="bg-[#0c1220] border-2 border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col justify-between space-y-5 hover:border-cyan-500/60 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Post Author & Platform Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Platform Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                        isLinkedIn ? 'bg-[#0a66c2]' : 'bg-slate-950 border border-slate-700'
                      }`}
                    >
                      {isLinkedIn ? <Linkedin className="w-5 h-5 text-white" /> : <XLogo className="w-5 h-5 text-white" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm sm:text-base tracking-wide">
                          {post.author}
                        </span>
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <a
                        href={post.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:underline block"
                      >
                        {post.handle}
                      </a>
                    </div>
                  </div>

                  {/* Pinned or Date Badge */}
                  <div className="flex items-center gap-2">
                    {post.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        <Pin className="w-3 h-3" /> PINNED
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {post.date}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-3">
                  <p className="text-slate-200 text-sm sm:text-base font-sans leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-[#070b14] border border-slate-800 text-cyan-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Post Footer & Social Metrics */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                      <Heart className="w-3.5 h-3.5 text-red-400" />
                      <strong className="text-slate-200 font-semibold">{post.metrics.likes}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                      <Repeat2 className="w-3.5 h-3.5 text-emerald-400" />
                      <strong className="text-slate-200 font-semibold">{post.metrics.reposts}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <strong className="text-slate-200 font-semibold">{post.metrics.comments}</strong>
                    </span>
                  </div>

                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => spaceAudio.playTelemetryBeep(1000)}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                  >
                    <span>{isLinkedIn ? 'View on LinkedIn' : 'View on X'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
