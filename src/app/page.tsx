import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { OrbitalMarquee } from '@/components/sections/OrbitalMarquee';
import { OrbitalAbout } from '@/components/sections/OrbitalAbout';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ProofSection } from '@/components/sections/ProofSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { OrbitalTransition } from '@/components/motion/OrbitalTransition';
import { CosmicScrollScenes } from '@/components/motion/CosmicScrollScenes';
import { INITIAL_PROFILE, INITIAL_SKILLS } from '@/data/profileData';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <CosmicScrollScenes />
      <main id="main-content">
        <HeroSection />
        <OrbitalTransition />
        <OrbitalMarquee />
        <OrbitalTransition />
        <OrbitalAbout />
        <OrbitalTransition />
        <SelectedWork />
        <OrbitalTransition />
        <ExperienceTimeline />
        <OrbitalTransition />
        <ProofSection />
        <OrbitalTransition />
        <SkillsSection skills={INITIAL_SKILLS} />
        <OrbitalTransition />
        <ContactSection profile={INITIAL_PROFILE} />
      </main>
    </>
  );
}
