import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { OrbitalAbout } from '@/components/sections/OrbitalAbout';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ContactSection } from '@/components/sections/ContactSection';
import { INITIAL_PROFILE } from '@/data/profileData';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="portfolio-home">
        <HeroSection />
        <SelectedWork />
        <OrbitalAbout />
        <ExperienceTimeline />
        <ContactSection profile={INITIAL_PROFILE} />
      </main>
    </>
  );
}
