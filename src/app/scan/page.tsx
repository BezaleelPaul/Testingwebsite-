import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Linkedin, FolderGit2, FileText, Mail, Orbit, ScanLine } from 'lucide-react';

const site = 'https://bezaleelpaul-portfolio-demo.vercel.app';
const destinations = [
  { slug: 'projects', title: 'Project archive', detail: 'Projects, engineering notes, demos and source repositories.', icon: FolderGit2, path: '/go/projects/' },
  { slug: 'github', title: 'GitHub profile', detail: 'Public repositories, source code and open-source work.', icon: Github, path: '/go/github/' },
  { slug: 'drishti', title: 'Drishti-AI', detail: 'The explainable AI screening project source repository.', icon: ScanLine, path: '/go/drishti/' },
  { slug: 'resume', title: 'Résumé', detail: 'A concise overview of experience, education and skills.', icon: FileText, path: '/go/resume/' },
  { slug: 'linkedin', title: 'LinkedIn', detail: 'Professional profile and networking.', icon: Linkedin, path: '/go/linkedin/' },
  { slug: 'contact', title: 'Contact', detail: 'Jump directly to the portfolio contact section.', icon: Mail, path: '/go/contact/' },
  { slug: 'portfolio', title: 'Full portfolio', detail: 'Explore the complete portfolio and selected work.', icon: Orbit, path: '/go/portfolio/' },
];

function qrImageUrl(value: string) {
  const encoded = encodeURIComponent(value);
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&format=svg&data=${encoded}`;
}

export default function ScanDirectoryPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-5 pb-24 pt-10 text-[#f7f8f2] sm:px-8 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/45 transition hover:text-[#d7ff00]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to portfolio
        </Link>
        <header className="mt-12 grid gap-8 border-b border-white/15 pb-10 md:grid-cols-[1fr_300px] md:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#d7ff00]">Signal directory // 07 destinations</p>
            <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[0.88] tracking-tight sm:text-8xl">SCAN THE<br /><span className="text-[#d7ff00]">PORTFOLIO.</span></h1>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/55 md:justify-self-end">
            A set of stable QR destinations for a printed résumé, project cards, event badges and professional introductions. Scan any code to open its destination.
          </p>
        </header>

        <section className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3" aria-label="QR code destinations">
          {destinations.map((item, index) => {
            const Icon = item.icon;
            const target = `${site}${item.path}`;
            return (
              <article key={item.slug} className="group flex min-h-full flex-col border border-white/12 bg-white/[0.025] p-5 transition-colors hover:border-[#d7ff00]/50 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/35">Signal 0{index + 1}</span>
                  <Icon className="h-4 w-4 text-[#d7ff00]" />
                </div>
                <div className="mt-5 flex items-center gap-5">
                  <div className="shrink-0 rounded-sm bg-white p-2">
                    <img src={qrImageUrl(target)} alt={`QR code for ${item.title}`} width="116" height="116" loading="lazy" className="block h-[116px] w-[116px]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-2xl leading-none">{item.title}</h2>
                    <p className="mt-3 text-xs leading-relaxed text-white/50">{item.detail}</p>
                  </div>
                </div>
                <a href={item.path} className="mt-6 inline-flex min-h-10 items-center justify-between border-t border-white/10 pt-4 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-white/65 transition hover:text-[#d7ff00]">
                  Open destination <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <p className="mt-2 break-all font-mono text-[8px] text-white/30">{target}</p>
              </article>
            );
          })}
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-[10px] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>BEZALEEL PAUL N. // BUILD WITH INTENT</span>
          <span>QR DESTINATIONS // PORTFOLIO SIGNAL ARCHIVE</span>
        </footer>
      </div>
    </main>
  );
}
