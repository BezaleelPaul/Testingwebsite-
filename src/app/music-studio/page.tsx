'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, AudioLines, Guitar, Headphones, Music2, SlidersHorizontal, Upload, Waves } from 'lucide-react';
import Link from 'next/link';

export default function MusicStudioPage() {
  const [audioUrl, setAudioUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [activeLane, setActiveLane] = useState('all');
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const handleFile = (file?: File) => {
    if (!file || !file.type.startsWith('audio/')) return;
    setAudioUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setFileName(file.name);
  };

  const lanes = [
    { id: 'electric', title: 'Electric guitar', detail: 'Riffs · leads · tone experiments', icon: Guitar, number: '01' },
    { id: 'acoustic', title: 'Acoustic guitar', detail: 'Fingerstyle · progressions · covers', icon: Music2, number: '02' },
    { id: 'production', title: 'Production', detail: 'Original compositions · beats · scores', icon: AudioLines, number: '03' },
    { id: 'post', title: 'Post-production', detail: 'Raw vs processed · mix decisions · mastering', icon: SlidersHorizontal, number: '04' },
  ];

  return (
    <main className="studio-page">
      <div className="studio-topbar">
        <Link href="/" className="studio-back"><ArrowLeft size={16} /> Back to portfolio</Link>
        <span className="studio-status"><span /> PERSONAL AUDIO ARCHIVE / 001</span>
      </div>

      <section className="studio-hero">
        <p className="studio-kicker">OFF THE CLOCK / ON THE FREQUENCY</p>
        <h1>THE<br /><span>SOUND</span> ROOM<span className="studio-period">.</span></h1>
        <div className="studio-intro">
          <p>A space for guitar recordings, musical ideas and the craft behind the sound. Separate from the code, but built with the same curiosity.</p>
          <span className="studio-index">AUDIO / VISUAL JOURNAL<br />EST. 2026</span>
        </div>
        <div className="studio-rule"><span>LISTEN CLOSELY</span><span>01 — 04</span></div>
      </section>

      <section className="studio-player" aria-labelledby="studio-player-title">
        <div className="studio-player-heading">
          <div><p className="studio-kicker">LISTENING DECK / LOCAL PREVIEW</p><h2 id="studio-player-title">Your listening session</h2></div>
          <Headphones size={26} strokeWidth={1.2} />
        </div>
        <div className="studio-player-body">
          <div className="studio-disc" aria-hidden="true"><div><Waves size={32} /></div></div>
          <div className="studio-audio-controls">
            <p className="studio-track-label">CURRENT FILE</p>
            <h3>{fileName || 'No recording loaded yet'}</h3>
            <p className="studio-muted">{fileName ? 'Playing from your device — nothing is uploaded.' : 'Choose an audio file to preview it here. Your file stays in this browser session.'}</p>
            {audioUrl ? <audio controls preload="metadata" src={audioUrl} className="studio-audio" /> : <button className="studio-upload" type="button" onClick={() => fileInput.current?.click()}><Upload size={17} /> Load a recording</button>}
            <input ref={fileInput} className="studio-file-input" type="file" accept="audio/*" aria-label="Choose an audio recording" onChange={(event) => handleFile(event.target.files?.[0])} />
            {audioUrl && <button className="studio-change-file" type="button" onClick={() => fileInput.current?.click()}>Choose another file</button>}
          </div>
        </div>
        <p className="studio-privacy">LOCAL PREVIEW ONLY <span>·</span> NO FILES ARE SENT TO A SERVER</p>
      </section>

      <section className="studio-lanes" aria-labelledby="studio-lanes-title">
        <div className="studio-section-head"><div><p className="studio-kicker">THE COLLECTION</p><h2 id="studio-lanes-title">Four ways into sound.</h2></div><p>Choose a lane to explore. Recordings and production breakdowns will appear here as they are added.</p></div>
        <div className="studio-filter" role="group" aria-label="Filter music categories">
          {['all', 'electric', 'acoustic', 'production', 'post'].map((lane) => <button key={lane} type="button" aria-pressed={activeLane === lane} onClick={() => setActiveLane(lane)}>{lane === 'all' ? 'All' : lane === 'post' ? 'Post-production' : lane}</button>)}
        </div>
        <div className="studio-lane-grid">
          {lanes.filter((lane) => activeLane === 'all' || lane.id === activeLane).map((lane) => {
            const Icon = lane.icon;
            return <article className="studio-lane" key={lane.id}><div className="studio-lane-top"><span>{lane.number} / 04</span><Icon size={25} strokeWidth={1.3} /></div><h3>{lane.title}</h3><p>{lane.detail}</p><span className="studio-coming">RECORDINGS TO BE ADDED</span></article>;
          })}
        </div>
      </section>

      <section className="studio-process">
        <div><p className="studio-kicker">BEHIND THE SOUND</p><h2>From first take<br />to final mix.</h2></div>
        <p>Recording setup, instruments, DAW sessions and processing decisions belong here too — not just the finished track. Each release can include a raw take, a processed version and notes on what changed.</p>
      </section>

      <footer className="studio-footer"><span>BP / SOUND ROOM</span><Link href="/">RETURN TO ORBIT <span aria-hidden="true">↗</span></Link><span>MADE BETWEEN TAKES.</span></footer>
    </main>
  );
}
