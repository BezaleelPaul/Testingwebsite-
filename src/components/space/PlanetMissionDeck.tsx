'use client';

import { useMemo, useState } from 'react';
import { Check, ChevronRight, Crosshair, Radio, Rocket, Sparkles } from 'lucide-react';

const destinations = [
  { id: 'mercury', name: 'Mercury', type: 'TERRESTRIAL', distance: '57.9M KM', year: '88 EARTH DAYS', moons: '0', color: 'mercury', fact: 'A world of extremes: temperatures swing from scorching daylight to freezing nights.', objective: 'Map the cratered northern hemisphere and study the Caloris basin.' },
  { id: 'venus', name: 'Venus', type: 'TERRESTRIAL', distance: '108.2M KM', year: '225 EARTH DAYS', moons: '0', color: 'venus', fact: 'A dense carbon-dioxide atmosphere traps heat, making Venus the hottest planet.', objective: 'Probe the cloud layers and chart the volcanic surface.' },
  { id: 'earth', name: 'Earth', type: 'TERRESTRIAL', distance: '149.6M KM', year: '365.25 DAYS', moons: '1', color: 'earth', fact: 'Our pale blue home: the only known world with stable surface liquid water and life.', objective: 'Return a clean signal packet to mission control.' },
  { id: 'mars', name: 'Mars', type: 'TERRESTRIAL', distance: '227.9M KM', year: '687 EARTH DAYS', moons: '2', color: 'mars', fact: 'A cold desert with ancient river valleys, giant volcanoes and evidence of a wetter past.', objective: 'Scout Jezero Crater and identify a safe sample-return corridor.' },
  { id: 'jupiter', name: 'Jupiter', type: 'GAS GIANT', distance: '778.6M KM', year: '11.86 EARTH YEARS', moons: '95+', color: 'jupiter', fact: 'The so¶»§q«^