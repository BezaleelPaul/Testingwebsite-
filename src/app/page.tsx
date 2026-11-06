import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
      </main>
    </>
  );
}
