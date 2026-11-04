import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { WorkAtlasSection } from '@/components/sections/WorkAtlasSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { GitHubAnalyticsSection } from '@/components/sections/GitHubAnalyticsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FrontierSection } from '@/components/sections/FrontierSection';
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
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main id="main-content">
        <HeroSection
          profile={INITIAL_PROFILE}
          stats={INITIAL_GITHUB_DATA.stats}
          cp={INITIAL_GITHUB_DATA.cp}
        />
        <AboutSection profile={INITIAL_PROFILE} />
        <ProjectsSection projects={INITIAL_PROJECTS} />
        <WorkAtlasSection />
        <FrontierSection />
        <ExperienceSection experience={INITIAL_EXPERIENCE} />
        <SkillsSection skills={INITIAL_SKILLS} />
        <AchievementsSection achievements={INITIAL_ACHIEVEMENTS} />
        <GitHubAnalyticsSection data={INITIAL_GITHUB_DATA} />
      </main>
      <ContactSection profile={INITIAL_PROFILE} />
    </div>
  );
}
