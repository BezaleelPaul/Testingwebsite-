import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { OrbitalMarquee } from '@/components/sections/OrbitalMarquee';
import { OrbitalAbout } from '@/components/sections/OrbitalAbout';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <OrbitalMarquee />
        <OrbitalAbout />
      </main>
    </>
  );
}
