'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { GitHubAnalyticsSection } from '@/components/sections/GitHubAnalyticsSection';
import { SocialFeedSection } from '@/components/sections/SocialFeedSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { ExplorationBot } from '@/components/interactive/ExplorationBot';
import { 
  INITIAL_PROFILE, 
  INITIAL_PROJECTS, 
  INITIAL_EXPERIENCE, 
  INITIAL_SKILLS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_GITHUB_DATA 
} from '@/data/profileData';

export default function Home() {
  return (
    <div className="min-h-screen bg-space-950 text-white selection:bg-hud-cyan selection:text-space-950 font-sans antialiased overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <Navbar />

      <main>
        {/* Section 01: Hero & Infinite Procedural Star System Cosmos */}
        <HeroSection 
          profile={INITIAL_PROFILE} 
          stats={INITIAL_GITHUB_DATA.stats} 
          cp={INITIAL_GITHUB_DATA.cp} 
        />

        {/* Section 02: About - My Orbit & Education */}
        <AboutSection profile={INITIAL_PROFILE} />

        {/* Section 03: Projects - Featured Discoveries & Systems */}
        <ProjectsSection projects={INITIAL_PROJECTS} />

        {/* Section 04: Experience - Expeditions & Chronological Timeline */}
        <ExperienceSection experience={INITIAL_EXPERIENCE} />

        {/* Section 05: Skills - Technical Constellations */}
        <SkillsSection skills={INITIAL_SKILLS} />

        {/* Section 06: Achievements & Verified Contributions */}
        <AchievementsSection achievements={INITIAL_ACHIEVEMENTS} />

        {/* Section 07: GitHub - Development Activity & Telemetry */}
        <GitHubAnalyticsSection data={INITIAL_GITHUB_DATA} />

        {/* Section 07.5: Social Dispatches & Broadcasts (LinkedIn & X) */}
        <SocialFeedSection />
      </main>

      {/* Section 08: Contact - Beyond the Horizon */}
      <ContactSection profile={INITIAL_PROFILE} />

      {/* Interactive Exploration Bot Companion */}
      <ExplorationBot />
    </div>
  );
}
