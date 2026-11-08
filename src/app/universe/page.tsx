import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { SpacekitUniverse } from '@/components/space/SpacekitUniverse';
import { PlanetMissionDeck } from '@/components/space/PlanetMissionDeck';

export default function UniversePage() {
  return (
    <div className="universe-page">
      <Navbar />
      <main className="universe-page-main">
        <div className="site-shell">
          <Link href="/" className="universe-back-link"><ArrowLeft size={14} /> RETURN TO PORTFOLIO</Link>
          <header className="universe-page-heading">
            <p className="orbital-eyebrow"><span>01</span> / CELESTIAL NAVIGATION</p>
            <h1>THE UNIVERSE<br /><span>IS STILL MOVING.</span></h1>
            <p>Explore a live solar-system visualization powered by Spacekit.js. The planets keep moving while you pause, inspect, and navigate the scene.</p>
          </header>
          <SpacekitUniverse />
          <PlanetMissionDeck />
          <div className="universe-page-footer">
            <span>AN EXPERIMENT IN ORBITAL VISUALIZATION</span>
            <Link href="/observatory/">OPEN THE FULL OBSERVATORY <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </main>
    </div>
  );
}
