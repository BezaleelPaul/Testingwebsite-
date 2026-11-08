'use client';

import { PortraitDepth } from '@/components/sections/PortraitDepth';

const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '';

export function HeroSection() {
  return (
    <section id="top" className="portfolio-hero" aria-labelledby="hero-title">
      <div className="site-shell portfolio-hero-topline">
        <span>COMPUTER SCIENCE / 02</span>
        <a href="mailto:bezaleel321@gmail.com">BEZALEEL321@GMAIL.COM ↗</a>
      </div>

      <div className="site-shell portfolio-hero-grid">
        <div className="portfolio-hero-copy">
          <p className="portfolio-eyebrow"><i /> SECOND-YEAR COMPUTER SCIENCE STUDENT</p>
          <h1 id="hero-title" className="portfolio-hero-title">
            BEZALEEL<br /><span>PAUL.</span>
          </h1>
          <p className="portfolio-hero-role">Software engineering · Applied AI · Product development</p>
          <p className="portfolio-hero-intro">
            I build useful software across mobile, web, and applied AI — combining a B.Tech in Computer Science at CMR University with the IIT Madras BS in Data Science programme.
          </p>
          <div className="portfolio-hero-actions">
            <a className="portfolio-button portfolio-button-primary" href="#work">Explore my work <span>↗</span></a>
            <a className="portfolio-button portfolio-button-secondary" href={`${basePath}/resume.pdf`} download>Download résumé <span>↓</span></a>
          </div>
          <div className="portfolio-hero-footnote">
            <span>BASED IN BENGALURU, INDIA</span>
            <span>BUILD WITH INTENT.</span>
          </div>
        </div>

        <div className="portfolio-hero-visual" aria-label="Portrait">
          <div className="portfolio-visual-index">BP / 001</div>
          <PortraitDepth />
          <span className="portfolio-visual-caption">SOFTWARE / SYSTEMS / IDEAS</span>
        </div>
      </div>

      <a className="portfolio-scroll-cue" href="#work"><span /> SCROLL TO EXPLORE</a>
    </section>
  );
}
