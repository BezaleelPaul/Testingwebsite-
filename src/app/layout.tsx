import type { Metadata } from 'next';
import { Preloader } from '@/components/motion/Preloader';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { ScrollAnimations } from '@/components/motion/ScrollAnimations';
import { SiteMotion } from '@/components/motion/SiteMotion';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bezaleel Paul — Software Developer',
  description: 'Software developer building mobile, full-stack, and applied AI products. B.Tech Computer Science at CMR University and BS Data Science at IIT Madras.',
  keywords: ['Bezaleel Paul', 'Flutter Developer', 'Software Developer', 'Full-Stack Developer', 'AI ML', 'CMR University', 'IIT Madras'],
  authors: [{ name: 'Bezaleel Paul N', url: 'https://github.com/BezaleelPaul' }],
  openGraph: {
    title: 'Bezaleel Paul — Software Developer',
    description: 'Flutter · Full-Stack · AI/ML · Computer Science · Data Science',
    url: 'https://bezaleelpaul.github.io/',
    siteName: 'Bezaleel Paul',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#0A0A0F" />
      </head>
      <body>
        <div id="scroll-progress" aria-hidden="true" />
        <div id="orbital-cursor" aria-hidden="true" />
        <div id="orbital-cursor-dot" aria-hidden="true" />
        <Preloader />
        <SmoothScroll />
        <ScrollAnimations />
        <SiteMotion />
        {children}
      </body>
    </html>
  );
}
