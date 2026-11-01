import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bezaleel Paul N — Software Developer | Flutter | Full-Stack | AI/ML',
  description: 'Digital Resume & Professional Portfolio of Bezaleel Paul N (BezForge). Software Developer, Flutter engineer, AI/ML builder, and Computer Science & Data Science scholar at CMR University and IIT Madras.',
  keywords: [
    'Bezaleel Paul',
    'BezForge',
    'Software Developer',
    'Flutter Developer',
    'Full-Stack Developer',
    'AI ML Engineer',
    'IIT Madras',
    'CMR University',
    'Bangalore'
  ],
  authors: [{ name: 'Bezaleel Paul N', url: 'https://github.com/BezaleelPaul' }],
  openGraph: {
    title: 'Bezaleel Paul N — Portfolio & Digital Resume',
    description: 'Software Developer · Flutter · Full-Stack · AI/ML · Bangalore, India',
    url: 'https://bezaleelpaul.github.io/',
    siteName: 'Bezaleel Paul Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%2302040a'/><circle cx='50' cy='50' r='20' fill='%2300f3ff'/><circle cx='70' cy='35' r='6' fill='%2338bdf8'/></svg>" />
      </head>
      <body className="antialiased bg-[#02040a] text-white overflow-x-hidden selection:bg-[#00f3ff] selection:text-[#02040a]">
        {children}
      </body>
    </html>
  );
}
