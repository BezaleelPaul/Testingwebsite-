import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { OrbitalMarquee } from '@/components/sections/OrbitalMarquee';
import { OrbitalAbout } from '@/components/sections/OrbitalAbout';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ProofSection } from '@/components/sections/ProofSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { EngineeringLabSection } from '@/components/sections/EngineeringLabSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FrontierSection } from '@/components/sections/FrontierSection';
import { MotionTicker } from '@/components/sections/MotionTicker';
import { INITIAL_PROFILE, INITIAL_SKILLS } from '@/data/profileData';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <MotionTicker />
        <OrbitalMarquee />
        <OrbitalAbout />
        <SelectedWork />
        <ExperienceTimeline />
        <ProofSection />
        <SkillsSection skills={INITIAL_SKILLS} />
        <EngineeringLabSection />
        <ContactSection profile={INITIAL_PROFILE} />
        <FrontierSection />
      </main>
    </>
  );
}
