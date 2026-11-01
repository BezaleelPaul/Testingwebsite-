'use client';

import React, { useState } from 'react';
import { GitHubAnalyticsData } from '@/types/portfolio';
import { Star, Flame, Clock, ExternalLink, Code } from 'lucide-react';

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
    <section id="github" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#060a12] border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            [ 06 // ACTIVE REPOSITORY TELEMETRY ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            GITHUB & COMPUTATIONAL ACTIVITY
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Real-time contribution frequency, 30-day commit density, and competitive algorithmic records.
          </p>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mt-2" />
        </div>

        {/* High-Level Stat Cells Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 text-center shadow-lg">
            <span className="block text-3xl font-extrabold font-display text-white">{data.stats.repos}</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Public Repos</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 text-center shadow-lg">
            <span className="block text-3xl font-extrabold font-display text-amber-400">{data.stats.stars}</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Stars Earned</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 text-center shadow-lg">
            <span className="block text-3xl font-extrabold font-display text-emerald-400">{data.stats.streak}d</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Active Streak</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 text-center shadow-lg">
            <span className="block text-3xl font-extrabold font-display text-cyan-400">{data.stats.total30d}</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">30d Commits</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 text-center shadow-lg">
            <span className="block text-3xl font-extrabold font-display text-indigo-300">{data.cp.leetcode.solved}+</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">LeetCode Solved</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 text-center shadow-lg">
            <span className="block text-3xl font-extrabold font-display text-sky-400">{data.cp.codeforces.rating}</span>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Codeforces</span>
          </div>
        </div>

        {/* Main Analytics Layout: Chart & Competitive Platforms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 30-Day Activity Area Chart (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-4">
                <div>
                  <h3 className="font-extrabold font-display text-white text-lg flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>30-Day Commit Cadence</span>
                  </h3>
                  <p className="text-xs font-mono text-slate-300 font-medium">Daily code pushes and active repository synchronizations</p>
                </div>
                <div className="text-right font-mono text-xs text-cyan-400 font-bold">
                  {hoveredPoint ? (
                    <span><strong>{hoveredPoint.date}</strong>: {hoveredPoint.count} commit{hoveredPoint.count === 1 ? '' : 's'}</span>
                  ) : (
                    <span className="text-slate-400 font-medium">Hover over nodes for daily counts</span>
                  )}
                </div>
              </div>

              {/* Dynamic SVG Area Spline */}
              <div className="w-full overflow-x-auto py-2">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44 overflow-visible">
                  <defs>
                    <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Shaded Area */}
                  <polygon points={areaStr} fill="url(#commitGrad)" />

                  {/* Trendline */}
                  <polyline
                    points={polylineStr}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />

                  {/* Interactive Points */}
                  {points.map((p, idx) => (
                    <circle
                      key={idx}
                      cx={p.x}
                      cy={p.y}
                      r={p.count > 0 ? 4.5 : 2.5}
                      className="cursor-pointer transition-all duration-200"
                      fill={p.count > 0 ? '#22d3ee' : '#64748b'}
                      onMouseEnter={() => setHoveredPoint({ date: p.date, count: p.count })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </svg>
              </div>

              {/* Contribution Heatmap Tiles */}
              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2.5">
                  Daily Contribution Matrix
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {data.series.map((s, idx) => {
                    const bg = s.count === 0 
                      ? 'bg-[#070b14] border border-slate-700'
                      : s.count <= 2 
                      ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                      : s.count <= 5
                      ? 'bg-emerald-600'
                      : 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_#22d3ee]';
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

            {/* Featured Repositories Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-xl space-y-4">
              <h3 className="font-extrabold font-display text-white text-lg flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                <span>Featured Open Source Repositories</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {data.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={`https://github.com/BezaleelPaul/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#070b14] border border-slate-700 hover:border-cyan-400 transition-colors space-y-2 group block shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {repo.name}
                      </span>
                      <span className="text-xs font-mono text-slate-300 flex items-center gap-1 font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-400" /> {repo.stars}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                    <span className="inline-block text-xs font-mono text-cyan-400 font-semibold">
                      ● {repo.language}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Competitive Programming Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* LeetCode Card */}
            <div className="p-6 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h4 className="font-extrabold font-display text-white text-base flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>LeetCode Verification</span>
                </h4>
                <a
                  href={`https://leetcode.com/u/${data.cp.leetcode.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline text-xs font-mono font-bold flex items-center gap-1"
                >
                  Profile <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-center py-2">
                <span className="block text-4xl font-extrabold font-display text-white">
                  {data.cp.leetcode.solved}
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-widest">
                  Challenges Solved
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-700">
                  <span className="block font-bold text-emerald-400 text-sm">{data.cp.leetcode.easy}</span>
                  <span className="text-xs text-slate-400 font-medium">Easy</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-700">
                  <span className="block font-bold text-amber-400 text-sm">{data.cp.leetcode.medium}</span>
                  <span className="text-xs text-slate-400 font-medium">Medium</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-700">
                  <span className="block font-bold text-rose-400 text-sm">{data.cp.leetcode.hard}</span>
                  <span className="text-xs text-slate-400 font-medium">Hard</span>
                </div>
              </div>

              <p className="text-xs font-mono text-slate-300 text-center pt-1 font-medium">
                Global Ranking: <strong className="text-cyan-300 font-bold">#{data.cp.leetcode.ranking}</strong>
              </p>
            </div>

            {/* Codeforces Card */}
            <div className="p-6 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h4 className="font-extrabold font-display text-white text-base">Codeforces Rating</h4>
                <span className="text-xs font-mono text-cyan-400 font-bold">@{data.cp.codeforces.handle}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-3xl font-extrabold font-display text-indigo-300">
                    {data.cp.codeforces.rating}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">Current Rating</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-200 bg-[#070b14] px-3 py-1.5 rounded-lg border border-slate-700">
                    [{data.cp.codeforces.rank}]
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Public Activity Feed Card */}
            <div className="p-6 rounded-2xl bg-[#0d1424] border-2 border-slate-700/80 shadow-xl space-y-4">
              <h4 className="font-extrabold font-display text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Recent Event Logs</span>
              </h4>

              <div className="space-y-2.5 text-xs font-mono">
                {data.recentActivity.slice(0, 5).map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-slate-200 py-1.5 border-b border-slate-750 last:border-none">
                    <span>{act.emoji}</span>
                    <div className="flex-1 font-medium">
                      <span>{act.action} </span>
                      <strong className="text-cyan-300 font-bold">{act.repo}</strong>
                    </div>
                    <span className="text-slate-400 text-xs shrink-0 font-semibold">{act.time}</span>
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
