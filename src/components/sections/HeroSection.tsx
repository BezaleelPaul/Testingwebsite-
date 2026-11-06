'use client';

const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '';

export function HeroSection() {
  return (
    <section id="top" className="hero space-texture" data-hero-scroll aria-labelledby="hero-title">
      <div className="site-shell hero-topline">
        <span>01 / Independent software developer</span>
        <span>Bengaluru, India · 2026</span>
      </div>

      <div className="site-shell hero-main">
        <div className="hero-orbit" aria-hidden="true"><span className="hero-orbit-dot" /></div>

        <div className="hero-copy" data-hero-copy>
          <p className="hero-kicker hero-reveal">Software Developer / Flutter / Full-Stack / AI &amp; ML</p>
          <h1 id="hero-title" className="display hero-title hero-reveal">
            <span>BEZALEEL</span>
            <span className="second-line outline-text">PAUL.</span>
          </h1>
          <p className="hero-subtitle hero-reveal">
            I build software across mobile, web, and applied AI. Studying Computer Science at CMR University and Data Science through the IIT Madras BS programme.
          </p>
          <div className="hero-actions hero-reveal">
            <a className="action-button primary" href="https://github.com/BezaleelPaul" target="_blank" rel="noreferrer">
              View Work <span aria-hidden="true">↗</span>
            </a>
            <a className="action-button secondary" href={`${basePath}/resume.pdf`} download>
              Download Résumé <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-stats hero-reveal" aria-label="Developer statistics">
            <a className="hero-stat" href="https://github.com/BezaleelPaul" target="_blank" rel="noreferrer">
              <strong>34</strong><span>GitHub repositories</span>
            </a>
            <a className="hero-stat" href="https://leetcode.com/u/BezaleelPaulN/" target="_blank" rel="noreferrer">
              <strong>135</strong><span>LeetCode solved</span>
            </a>
            <a className="hero-stat" href="https://codeforces.com/profile/BezaleelPaulN" target="_blank" rel="noreferrer">
              <strong>959</strong><span>Codeforces rating</span>
            </a>
          </div>
        </div>

        <div className="hero-portrait-wrap" aria-hidden="true">
          <img className="hero-portrait" src={`${basePath}/assets/portrait-processed.webp`} alt="" fetchPriority="high" />
        </div>
        <span className="hero-index">ORBITAL PROFILE / EARTH SECTOR</span>
      </div>

      <div className="site-shell hero-bottomline">
        <span>BUILD WITH INTENT</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
}
