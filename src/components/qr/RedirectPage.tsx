'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Radio } from 'lucide-react';

type RedirectPageProps = {
  destination: string;
  label: string;
  description: string;
};

export function RedirectPage({ destination, label, description }: RedirectPageProps) {
  useEffect(() => {
    window.location.replace(destination);
  }, [destination]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 py-16 text-[#f7f8f2]">
      <div className="w-full max-w-lg border border-white/15 bg-white/[0.03] p-8 sm:p-10">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d7ff00]">
          <Radio className="h-3.5 w-3.5" /> Signal relay
        </p>
        <h1 className="mt-6 font-display text-4xl leading-none sm:text-5xl">{label}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{description}</p>
        <p className="mt-7 break-all border-l border-[#d7ff00]/60 pl-3 font-mono text-xs text-white/45">
          {destination}
        </p>
        <a
          href={destination}
          className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#d7ff00] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#0a0a0f]"
        >
          Continue to destination <ArrowUpRight className="h-4 w-4" />
        </a>
        <p className="mt-6 text-[11px] leading-relaxed text-white/35">
          If automatic forwarding does not start, use the button above.
        </p>
        <Link href="/" className="mt-8 inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-white/45 hover:text-[#d7ff00]">
          ← Return to portfolio
        </Link>
      </div>
    </main>
  );
}
