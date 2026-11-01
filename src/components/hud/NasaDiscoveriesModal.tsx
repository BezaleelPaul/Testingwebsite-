'use client';

import React, { useEffect, useState } from 'react';
import { fetchNasaDiscoveries, NasaLiveTelemetry } from '@/lib/nasaApi';
import { Globe, Orbit, ShieldAlert, Sparkles, ExternalLink, RefreshCw, X, Radio } from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface NasaDiscoveriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTargetAsteroid?: (name: string) => void;
}

export const NasaDiscoveriesModal: React.FC<NasaDiscoveriesModalProps> = ({
  isOpen,
  onClose,
  onTargetAsteroid,
}) => {
  const [data, setData] = useState<NasaLiveTelemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'apod' | 'asteroids'>('apod');

  const loadData = async () => {
    setLoading(true);
    try {
      const telemetry = await fetchNasaDiscoveries();
      setData(telemetry);
    } catch {
      // Handled internally in fetchNasaDiscoveries
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-space-950 border-2 border-hud-cyan/60 rounded-xl shadow-[0_0_60px_rgba(0,243,255,0.25)] overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-space-900 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-hud-cyan animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-widest text-white uppercase">
                  NASA DEEP SPACE TELEMETRY // LIVE DISCOVERIES
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    data?.source === 'live'
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                      : 'bg-cyan-950/80 text-hud-cyan border-cyan-800'
                  }`}
                >
                  {data?.source === 'live' ? 'LIVE NASA FEED' : 'CACHED ORBITAL DATA'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Data Source: NASA Open APIs (APOD & JPL NeoWs Asteroid Tracker)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                spaceAudio.playTelemetryBeep(900);
                loadData();
              }}
              className="p-1.5 text-gray-400 hover:text-hud-cyan hover:bg-space-800 rounded border border-slate-800 transition-colors"
              title="Refresh NASA Feed"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-hud-cyan' : ''}`} />
            </button>
            <button
              onClick={() => {
                spaceAudio.playTelemetryBeep(700);
                onClose();
              }}
              className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-space-800 rounded border border-slate-700 text-xs transition-colors"
            >
              [ ✕ ESC ]
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-space-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('apod')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'apod'
                ? 'border-hud-cyan text-hud-cyan bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Cosmic Discovery of the Day (APOD)
          </button>
          <button
            onClick={() => setActiveTab('asteroids')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'asteroids'
                ? 'border-hud-cyan text-hud-cyan bg-cyan-950/20'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            Near-Earth Asteroid Trackers ({data?.asteroids.length || 0})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading && !data ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-hud-cyan border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Interrogating NASA Deep Space Network API...</p>
            </div>
          ) : activeTab === 'apod' && data ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-black max-h-96 flex items-center justify-center group">
                <img
                  src={data.apod.url}
                  alt={data.apod.title}
                  className="w-full h-full object-cover max-h-96 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-hud-cyan uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded border border-cyan-900">
                      Observation Date: {data.apod.date}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1 drop-shadow-md">
                      {data.apod.title}
                    </h3>
                  </div>
                  {data.apod.hdurl && (
                    <a
                      href={data.apod.hdurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-hud-cyan text-space-900 font-bold text-xs rounded hover:bg-cyan-300 transition-colors flex items-center gap-1 shadow-lg"
                    >
                      <span>Full HD</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-space-900/80 p-4 rounded-lg border border-slate-800 text-xs leading-relaxed text-gray-300 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-slate-800 pb-2">
                  <span>CREDIT / SOURCE: {data.apod.copyright || 'NASA / JPL'}</span>
                  <span>SPECTRAL CLASSIFICATION: {data.apod.media_type.toUpperCase()}</span>
                </div>
                <p>{data.apod.explanation}</p>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-space-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">RADAR TRACKING STATION</span>
                  <span className="text-white font-bold">NASA JPL NEO OBSERVATION NETWORK</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px]">TARGETS TRACKED TODAY</span>
                  <span className="text-hud-amber font-bold text-sm">{data.asteroids.length} CLOSE APPROACH BODIES</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.asteroids.map((ast) => (
                  <div
                    key={ast.id}
                    className="p-3.5 rounded-lg bg-space-900/90 border border-slate-800 hover:border-hud-cyan/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Orbit className="w-3.5 h-3.5 text-hud-cyan" />
                          {ast.name}
                        </span>
                        {ast.isPotentiallyHazardous ? (
                          <span className="text-[10px] text-hud-crimson bg-red-950/60 px-2 py-0.5 rounded border border-red-800 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> HAZARDOUS
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            NOMINAL
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] my-2">
                        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
                          <span className="text-gray-400 text-[10px] block">EST. DIAMETER</span>
                          <span className="text-hud-amber font-bold">
                            {(ast.estimatedDiameterKm.min * 1000).toFixed(0)}m -{' '}
                            {(ast.estimatedDiameterKm.max * 1000).toFixed(0)}m
                          </span>
                        </div>
                        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
                          <span className="text-gray-400 text-[10px] block">VELOCITY</span>
                          <span className="text-hud-cyan font-bold">
                            {ast.relativeVelocityKmh.toLocaleString()} km/h
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Close Approach Date:</span>
                          <span className="text-gray-200">{ast.closeApproachDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Miss Distance:</span>
                          <span className="text-hud-cyan">
                            {(ast.missDistanceKm / 1_000_000).toFixed(2)} Million km
                          </span>
                        </div>
                      </div>
                    </div>

                    {onTargetAsteroid && (
                      <button
                        onClick={() => {
                          spaceAudio.playTelemetryBeep(1200);
                          onTargetAsteroid(ast.name);
                          onClose();
                        }}
                        className="mt-3 w-full py-1 text-[11px] bg-space-800 hover:bg-hud-cyan hover:text-space-950 text-cyan-300 font-bold rounded border border-cyan-800/60 transition-colors"
                      >
                        [ TRACK IN 3D ORBIT ]
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-space-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-cyan animate-ping" />
            Synchronized with NASA Jet Propulsion Laboratory / Open Science API
          </span>
          <span>Timestamp: {data ? new Date(data.timestamp).toLocaleTimeString() : '---'}</span>
        </div>
      </div>
    </div>
  );
};
