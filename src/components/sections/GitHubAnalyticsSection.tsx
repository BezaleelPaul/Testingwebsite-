'use client';

import React, { useState } from 'react';
import { GitHubAnalyticsData } from '@/types/portfolio';
import { GitPullRequest, GitCommit, GitBranch, Star, Users, Flame, Clock, ExternalLink, Code } from 'lucide-react';

interface GitHubAnalyticsSectionProps {
  data: GitHubAnalyticsData;
}

export const GitHubAnalyticsSection: React.FC<GitHubAnalyticsSectionProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number } | null>(null);

  // SVG dimensions for 30-day commit trendline
  const W = 680;
  const H = 160;
  const padX = 15;
  const padY = 20;
  const maxVal = Math.max(...data.series.map(s => s.count), 1);
  const chartW = W - padX * 2;
  const chartH = H - padY * 2;

  const points = data.series.map((s, idx) => {
    const x = padX + (idx / (data.series.length - 1)) * chartW;
    const y = padY + chartH - (s.count / maxVal) * chartH;
    return { x, y, date: s.date, count: s.count };
  });

  const polylineStr = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaStr = `${padX},${padY + chartH} ${polylineStr} ${padX + chartW},${padY + chartH}`;

  return (
    <section id="github" className="py-24 px-4 sm:px-6 lg:px-8 bg-space-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <span className="text-xs font-mono text-hud-cyan tracking-widest uppercase">
            [ 06 // ACTIVE REPOSITORY TELEMETRY ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
            GITHUB & COMPUTATIONAL ACTIVITY
          </h2>
          <p className="max-w-2xl text-sm sm:text-base text-slate-400 font-sans">
            Real-time contribution frequency, 30-day commit density, and competitive algorithmic records.
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-hud-cyan to-transparent mt-2" />
        </div>

        {/* High-Level Stat Cells Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 text-center">
            <span className="block text-2xl font-bold font-display text-white">{data.stats.repos}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Public Repos</span>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 text-center">
            <span className="block text-2xl font-bold font-display text-hud-amber">{data.stats.stars}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Stars Earned</span>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 text-center">
            <span className="block text-2xl font-bold font-display text-emerald-400">{data.stats.streak}d</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Streak</span>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 text-center">
            <span className="block text-2xl font-bold font-display text-hud-cyan">{data.stats.total30d}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">30d Commits</span>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 text-center">
            <span className="block text-2xl font-bold font-display text-hud-violet">{data.cp.leetcode.solved}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">LeetCode Solved</span>
          </div>

          <div className="p-4 rounded-xl bg-space-900/80 border border-slate-800 text-center">
            <span className="block text-2xl font-bold font-display text-sky-400">{data.cp.codeforces.rating}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Codeforces</span>
          </div>
        </div>

        {/* Main Analytics Layout: Chart & Competitive Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 30-Day Activity Area Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-space-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-4">
                <div>
                  <h3 className="font-bold font-display text-white text-base flex items-center gap-2">
                    <Flame className="w-4 h-4 text-hud-amber" />
                    <span>30-Day Commit Cadence</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-400">Daily code pushes and active repository synchronizations</p>
                </div>
                <div className="text-right font-mono text-xs text-hud-cyan">
                  {hoveredPoint ? (
                    <span><strong>{hoveredPoint.date}</strong>: {hoveredPoint.count} commit{hoveredPoint.count === 1 ? '' : 's'}</span>
                  ) : (
                    <span className="text-slate-500">Hover over nodes for daily counts</span>
                  )}
                </div>
              </div>

              {/* Dynamic SVG Area Spline */}
              <div className="w-full overflow-x-auto py-2">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 overflow-visible">
                  <defs>
                    <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area */}
                  <polygon points={areaStr} fill="url(#commitGrad)" />

                  {/* Trendline */}
                  <polyline
                    points={polylineStr}
                    fill="none"
                    stroke="#00f3ff"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Interactive Points */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={p.count > 0 ? 4 : 2}
                      className="cursor-pointer transition-all duration-200"
                      fill={p.count > 0 ? '#00f3ff' : '#475569'}
                      onMouseEnter={() => setHoveredPoint({ date: p.date, count: p.count })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </svg>
              </div>

              {/* Contribution Heatmap Tiles */}
              <div className="pt-4 border-t border-slate-850">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Daily Contribution Matrix
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.series.map((s, idx) => {
                    const bg = s.count === 0 
                      ? 'bg-space-950 border border-slate-850'
                      : s.count <= 2 
                      ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                      : s.count <= 5
                      ? 'bg-emerald-600'
                      : 'bg-hud-cyan text-space-950 shadow-[0_0_8px_#00f3ff]';
                    return (
                      <span
                        key={idx}
                        title={`${s.date}: ${s.count} commits`}
                        className={`w-4 h-4 rounded-sm ${bg} transition-transform hover:scale-125 cursor-pointer`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Starred Repositories */}
            <div className="p-6 rounded-2xl bg-space-900/90 border border-slate-800 space-y-4">
              <h3 className="font-bold font-display text-white text-base flex items-center gap-2">
                <Star className="w-4 h-4 text-hud-amber" />
                <span>Featured Open Source Repositories</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={`https://github.com/BezaleelPaul/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-space-950/70 border border-slate-850 hover:border-hud-cyan/50 transition-colors space-y-1.5 group block"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-hud-cyan transition-colors">
                        {repo.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Star className="w-3 h-3 text-hud-amber" /> {repo.stars}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                    <span className="inline-block text-[10px] font-mono text-cyan-400">
                      ● {repo.language}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Competitive Programming & Activity (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* LeetCode Breakdown Card */}
            <div className="p-6 rounded-2xl bg-space-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="font-bold font-display text-white text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-hud-amber" />
                  <span>LeetCode Verification</span>
                </h4>
                <a
                  href={`https://leetcode.com/u/${data.cp.leetcode.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hud-cyan hover:underline text-xs font-mono flex items-center gap-1"
                >
                  Profile <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="text-center py-2">
                <span className="block text-4xl font-extrabold font-display text-white">
                  {data.cp.leetcode.solved}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Challenges Solved
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded bg-space-950 border border-slate-850">
                  <span className="block font-bold text-emerald-400 text-sm">{data.cp.leetcode.easy}</span>
                  <span className="text-[10px] text-slate-500">Easy</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-850">
                  <span className="block font-bold text-hud-amber text-sm">{data.cp.leetcode.medium}</span>
                  <span className="text-[10px] text-slate-500">Medium</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-850">
                  <span className="block font-bold text-rose-400 text-sm">{data.cp.leetcode.hard}</span>
                  <span className="text-[10px] text-slate-500">Hard</span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-slate-400 text-center pt-1">
                Global Ranking: <strong className="text-white">#{data.cp.leetcode.ranking}</strong>
              </p>
            </div>

            {/* Codeforces Card */}
            <div className="p-6 rounded-2xl bg-space-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-3">
                <h4 className="font-bold font-display text-white text-base">Codeforces Rating</h4>
                <span className="text-xs font-mono text-hud-cyan">@{data.cp.codeforces.handle}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-3xl font-extrabold font-display text-hud-violet">
                    {data.cp.codeforces.rating}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Current Rating</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-300 bg-space-950 px-2.5 py-1 rounded border border-slate-800">
                    [{data.cp.codeforces.rank}]
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Public Activity Feed */}
            <div className="p-6 rounded-2xl bg-space-900/90 border border-slate-800 space-y-4">
              <h4 className="font-bold font-display text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-hud-cyan" />
                <span>Recent Event Logs</span>
              </h4>

              <div className="space-y-2.5 text-xs font-mono">
                {data.recentActivity.slice(0, 5).map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-300 py-1 border-b border-slate-850 last:border-none">
                    <span>{act.emoji}</span>
                    <div className="flex-1">
                      <span>{act.action} </span>
                      <strong className="text-hud-cyan">{act.repo}</strong>
                    </div>
                    <span className="text-slate-500 text-[10px] shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
