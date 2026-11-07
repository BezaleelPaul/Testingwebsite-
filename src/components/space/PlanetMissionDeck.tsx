'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronRight, Crosshair, Radio, Rocket, Sparkles } from 'lucide-react';

const destinations = [
  { id: 'mercury', name: 'Mercury', type: 'TERRESTRIAL', distance: '57.9M KM', year: '88 EARTH DAYS', moons: '0', color: 'mercury', fact: 'A world of extremes: temperatures swing from scorching daylight to freezing nights.', objective: 'Map the cratered northern hemisphere and study the Caloris basin.' },
  { id: 'venus', name: 'Venus', type: 'TERRESTRIAL', distance: '108.2M KM', year: '225 EARTH DAYS', moons: '0', color: 'venus', fact: 'A dense carbon-dioxide atmosphere traps heat, making Venus the hottest planet.', objective: 'Probe the cloud layers and chart the volcanic surface.' },
  { id: 'earth', name: 'Earth', type: 'TERRESTRIAL', distance: '149.6M KM', year: '365.25 DAYS', moons: '1', color: 'earth', fact: 'Our pale blue home: the only known world with stable surface liquid water and life.', objective: 'Return a clean signal packet to mission control.' },
  { id: 'mars', name: 'Mars', type: 'TERRESTRIAL', distance: '227.9M KM', year: '687 EARTH DAYS', moons: '2', color: 'mars', fact: 'A cold desert with ancient river valleys, giant volcanoes and evidence of a wetter past.', objective: 'Scout Jezero Crater and identify a safe sample-return corridor.' },
  { id: 'jupiter', name: 'Jupiter', type: 'GAS GIANT', distance: '778.6M KM', year: '11.86 EARTH YEARS', moons: '95+', color: 'jupiter', fact: 'The solar system’s largest planet hosts colossal storms and a powerful magnetic field.', objective: 'Trace the Great Red Spot and scan the Galilean moon system.' },
  { id: 'saturn', name: 'Saturn', type: 'GAS GIANT', distance: '1.43B KM', year: '29.4 EARTH YEARS', moons: '146+', color: 'saturn', fact: 'Its spectacular rings are made mostly of countless fragments of water ice and rock.', objective: 'Survey the rings and plot a safe pass near Enceladus.' },
  { id: 'uranus', name: 'Uranus', type: 'ICE GIANT', distance: '2.87B KM', year: '84 EARTH YEARS', moons: '28', color: 'uranus', fact: 'An ice giant that rotates almost on its side, producing unusually extreme seasons.', objective: 'Measure the tilted magnetic field and map the upper atmosphere.' },
  { id: 'neptune', name: 'Neptune', type: 'ICE GIANT', distance: '4.50B KM', year: '164.8 EARTH YEARS', moons: '16', color: 'neptune', fact: 'A distant blue world with supersonic winds and a dynamic, stormy atmosphere.', objective: 'Track atmospheric storms before the long-range signal window closes.' },
];

export function PlanetMissionDeck() {
  const [selected, setSelected] = useState('earth');
  const [logged, setLogged] = useState<string[]>([]);
  const active = useMemo(() => destinations.find((planet) => planet.id === selected) ?? destinations[2], [selected]);
  const progress = Math.round((logged.length / destinations.length) * 100);

  return (
    <section className="planet-mission-deck" aria-labelledby="planet-mission-title">
      <div className="planet-deck-heading">
        <div>
          <p className="orbital-eyebrow"><span>02</span> / DEEP-SPACE WAYPOINTS</p>
          <h2 id="planet-mission-title">PICK YOUR <span>NEXT WORLD.</span></h2>
          <p>Choose a destination to open its mission dossier. Log waypoints as you explore the system.</p>
        </div>
        <div className="planet-deck-progress">
          <span><Radio size={13} /> WAYPOINTS LOGGED</span>
          <strong>{logged.length.toString().padStart(2, '0')} <small>/ 08</small></strong>
          <div><i style={{ width: progress + '%' }} /></div>
        </div>
      </div>

      <div className="planet-destination-grid">
        {destinations.map((planet, index) => (
          <button type="button" key={planet.id} className={'planet-destination-card ' + (selected === planet.id ? 'is-selected' : '')} onClick={() => setSelected(planet.id)} aria-pressed={selected === planet.id}>
            <span className="planet-card-index">0{index + 1}</span>
            <span className={'planet-card-orb planet-' + planet.color} />
            <span className="planet-card-name">{planet.name}</span>
            <span className="planet-card-type">{planet.type}</span>
            {logged.includes(planet.id) && <span className="planet-card-check"><Check size={11} /></span>}
          </button>
        ))}
      </div>

      <div className="planet-dossier">
        <div className="planet-dossier-visual">
          <span className="planet-dossier-orbit" />
          <span className={'planet-dossier-world planet-' + active.color} />
          <span className="planet-dossier-label">TARGET / {active.id.toUpperCase()}</span>
        </div>
        <div className="planet-dossier-content">
          <p className="planet-dossier-kicker"><Crosshair size={13} /> DESTINATION BRIEFING / {active.type}</p>
          <h3>{active.name}<span> / SOL SYSTEM</span></h3>
          <p className="planet-dossier-fact">{active.fact}</p>
          <div className="planet-dossier-stats">
            <div><span>AVG. SUN DISTANCE</span><strong>{active.distance}</strong></div>
            <div><span>ORBITAL PERIOD</span><strong>{active.year}</strong></div>
            <div><span>KNOWN MOONS</span><strong>{active.moons}</strong></div>
          </div>
          <div className="planet-dossier-objective"><span><Sparkles size={13} /> MISSION OBJECTIVE</span><p>{active.objective}</p></div>
          <button type="button" className={logged.includes(active.id) ? 'planet-log-button is-logged' : 'planet-log-button'} onClick={() => setLogged((current) => current.includes(active.id) ? current.filter((id) => id !== active.id) : [...current, active.id])}>
            {logged.includes(active.id) ? <><Check size={15} /> WAYPOINT LOGGED</> : <><Rocket size={15} /> LOG THIS WAYPOINT</>}
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
