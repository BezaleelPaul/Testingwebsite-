'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  FileCode2,
  FolderGit2,
  Printer,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import resumeJsonData from '@/data/resume.json';
import { ResumeData } from '@/types/resume';

const initialResume = (resumeJsonData as unknown) as ResumeData;

const toHref = (value: string) => {
  if (value.includes('@')) return `mailto:${value}`;
  if (/^https?:\/\//.test(value)) return value;
  if (/^[+\d][\d\s-]+$/.test(value)) return `tel:${value.replace(/\s/g, '')}`;
  return `https://${value}`;
};

const SheetHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="flex items-center gap-2 border-b border-ink/15 pb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-ink/55">
    <span className="h-1 w-1 rounded-full bg-ink" />
    {children}
  </h2>
);

const QRCodeSvg: React.FC<{ className?: string }> = ({ className = 'h-16 w-16 text-ink' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 33 33"
    shapeRendering="crispEdges"
    className={className}
    aria-label="Scan to view all projects"
  >
    <path
      d="M0,0h1v1h-1zM1,0h1v1h-1zM2,0h1v1h-1zM3,0h1v1h-1zM4,0h1v1h-1zM5,0h1v1h-1zM6,0h1v1h-1zM9,0h1v1h-1zM13,0h1v1h-1zM16,0h1v1h-1zM17,0h1v1h-1zM18,0h1v1h-1zM19,0h1v1h-1zM20,0h1v1h-1zM23,0h1v1h-1zM26,0h1v1h-1zM27,0h1v1h-1zM28,0h1v1h-1zM29,0h1v1h-1zM30,0h1v1h-1zM31,0h1v1h-1zM32,0h1v1h-1zM0,1h1v1h-1zM6,1h1v1h-1zM9,1h1v1h-1zM11,1h1v1h-1zM12,1h1v1h-1zM13,1h1v1h-1zM14,1h1v1h-1zM15,1h1v1h-1zM16,1h1v1h-1zM17,1h1v1h-1zM22,1h1v1h-1zM24,1h1v1h-1zM26,1h1v1h-1zM32,1h1v1h-1zM0,2h1v1h-1zM2,2h1v1h-1zM3,2h1v1h-1zM4,2h1v1h-1zM6,2h1v1h-1zM8,2h1v1h-1zM10,2h1v1h-1zM11,2h1v1h-1zM13,2h1v1h-1zM15,2h1v1h-1zM17,2h1v1h-1zM18,2h1v1h-1zM19,2h1v1h-1zM20,2h1v1h-1zM26,2h1v1h-1zM28,2h1v1h-1zM29,2h1v1h-1zM30,2h1v1h-1zM32,2h1v1h-1zM0,3h1v1h-1zM2,3h1v1h-1zM3,3h1v1h-1zM4,3h1v1h-1zM6,3h1v1h-1zM8,3h1v1h-1zM10,3h1v1h-1zM12,3h1v1h-1zM14,3h1v1h-1zM16,3h1v1h-1zM19,3h1v1h-1zM20,3h1v1h-1zM21,3h1v1h-1zM22,3h1v1h-1zM23,3h1v1h-1zM26,3h1v1h-1zM28,3h1v1h-1zM29,3h1v1h-1zM30,3h1v1h-1zM32,3h1v1h-1zM0,4h1v1h-1zM2,4h1v1h-1zM3,4h1v1h-1zM4,4h1v1h-1zM6,4h1v1h-1zM8,4h1v1h-1zM9,4h1v1h-1zM10,4h1v1h-1zM12,4h1v1h-1zM13,4h1v1h-1zM15,4h1v1h-1zM18,4h1v1h-1zM21,4h1v1h-1zM24,4h1v1h-1zM26,4h1v1h-1zM28,4h1v1h-1zM29,4h1v1h-1zM30,4h1v1h-1zM32,4h1v1h-1zM0,5h1v1h-1zM6,5h1v1h-1zM8,5h1v1h-1zM10,5h1v1h-1zM11,5h1v1h-1zM12,5h1v1h-1zM13,5h1v1h-1zM14,5h1v1h-1zM15,5h1v1h-1zM16,5h1v1h-1zM17,5h1v1h-1zM20,5h1v1h-1zM21,5h1v1h-1zM22,5h1v1h-1zM26,5h1v1h-1zM32,5h1v1h-1zM0,6h1v1h-1zM1,6h1v1h-1zM2,6h1v1h-1zM3,6h1v1h-1zM4,6h1v1h-1zM5,6h1v1h-1zM6,6h1v1h-1zM8,6h1v1h-1zM10,6h1v1h-1zM12,6h1v1h-1zM14,6h1v1h-1zM16,6h1v1h-1zM18,6h1v1h-1zM20,6h1v1h-1zM22,6h1v1h-1zM24,6h1v1h-1zM26,6h1v1h-1zM27,6h1v1h-1zM28,6h1v1h-1zM29,6h1v1h-1zM30,6h1v1h-1zM31,6h1v1h-1zM32,6h1v1h-1zM8,7h1v1h-1zM10,7h1v1h-1zM12,7h1v1h-1zM14,7h1v1h-1zM15,7h1v1h-1zM21,7h1v1h-1zM22,7h1v1h-1zM24,7h1v1h-1zM0,8h1v1h-1zM2,8h1v1h-1zM3,8h1v1h-1zM4,8h1v1h-1zM5,8h1v1h-1zM6,8h1v1h-1zM10,8h1v1h-1zM11,8h1v1h-1zM12,8h1v1h-1zM13,8h1v1h-1zM15,8h1v1h-1zM17,8h1v1h-1zM22,8h1v1h-1zM24,8h1v1h-1zM26,8h1v1h-1zM27,8h1v1h-1zM28,8h1v1h-1zM29,8h1v1h-1zM30,8h1v1h-1zM0,9h1v1h-1zM2,9h1v1h-1zM5,9h1v1h-1zM7,9h1v1h-1zM8,9h1v1h-1zM10,9h1v1h-1zM16,9h1v1h-1zM18,9h1v1h-1zM19,9h1v1h-1zM21,9h1v1h-1zM23,9h1v1h-1zM26,9h1v1h-1zM27,9h1v1h-1zM29,9h1v1h-1zM30,9h1v1h-1zM32,9h1v1h-1zM3,10h1v1h-1zM4,10h1v1h-1zM5,10h1v1h-1zM6,10h1v1h-1zM7,10h1v1h-1zM9,10h1v1h-1zM10,10h1v1h-1zM12,10h1v1h-1zM15,10h1v1h-1zM18,10h1v1h-1zM21,10h1v1h-1zM28,10h1v1h-1zM30,10h1v1h-1zM31,10h1v1h-1zM0,11h1v1h-1zM1,11h1v1h-1zM3,11h1v1h-1zM5,11h1v1h-1zM7,11h1v1h-1zM8,11h1v1h-1zM9,11h1v1h-1zM10,11h1v1h-1zM12,11h1v1h-1zM14,11h1v1h-1zM16,11h1v1h-1zM20,11h1v1h-1zM21,11h1v1h-1zM22,11h1v1h-1zM24,11h1v1h-1zM25,11h1v1h-1zM26,11h1v1h-1zM28,11h1v1h-1zM29,11h1v1h-1zM30,11h1v1h-1zM32,11h1v1h-1zM0,12h1v1h-1zM4,12h1v1h-1zM6,12h1v1h-1zM10,12h1v1h-1zM18,12h1v1h-1zM19,12h1v1h-1zM21,12h1v1h-1zM24,12h1v1h-1zM28,12h1v1h-1zM29,12h1v1h-1zM1,13h1v1h-1zM9,13h1v1h-1zM13,13h1v1h-1zM14,13h1v1h-1zM15,13h1v1h-1zM16,13h1v1h-1zM17,13h1v1h-1zM20,13h1v1h-1zM21,13h1v1h-1zM22,13h1v1h-1zM26,13h1v1h-1zM29,13h1v1h-1zM31,13h1v1h-1zM32,13h1v1h-1zM1,14h1v1h-1zM2,14h1v1h-1zM4,14h1v1h-1zM6,14h1v1h-1zM9,14h1v1h-1zM10,14h1v1h-1zM14,14h1v1h-1zM18,14h1v1h-1zM19,14h1v1h-1zM21,14h1v1h-1zM22,14h1v1h-1zM23,14h1v1h-1zM24,14h1v1h-1zM25,14h1v1h-1zM26,14h1v1h-1zM27,14h1v1h-1zM29,14h1v1h-1zM31,14h1v1h-1zM0,15h1v1h-1zM1,15h1v1h-1zM2,15h1v1h-1zM3,15h1v1h-1zM5,15h1v1h-1zM10,15h1v1h-1zM13,15h1v1h-1zM16,15h1v1h-1zM19,15h1v1h-1zM20,15h1v1h-1zM21,15h1v1h-1zM22,15h1v1h-1zM23,15h1v1h-1zM25,15h1v1h-1zM26,15h1v1h-1zM29,15h1v1h-1zM30,15h1v1h-1zM1,16h1v1h-1zM2,16h1v1h-1zM3,16h1v1h-1zM4,16h1v1h-1zM6,16h1v1h-1zM7,16h1v1h-1zM8,16h1v1h-1zM11,16h1v1h-1zM12,16h1v1h-1zM13,16h1v1h-1zM14,16h1v1h-1zM17,16h1v1h-1zM19,16h1v1h-1zM22,16h1v1h-1zM23,16h1v1h-1zM24,16h1v1h-1zM25,16h1v1h-1zM27,16h1v1h-1zM28,16h1v1h-1zM32,16h1v1h-1zM5,17h1v1h-1zM7,17h1v1h-1zM8,17h1v1h-1zM14,17h1v1h-1zM17,17h1v1h-1zM19,17h1v1h-1zM20,17h1v1h-1zM23,17h1v1h-1zM26,17h1v1h-1zM27,17h1v1h-1zM29,17h1v1h-1zM30,17h1v1h-1zM31,17h1v1h-1zM32,17h1v1h-1zM2,18h1v1h-1zM3,18h1v1h-1zM5,18h1v1h-1zM6,18h1v1h-1zM7,18h1v1h-1zM8,18h1v1h-1zM10,18h1v1h-1zM13,18h1v1h-1zM15,18h1v1h-1zM17,18h1v1h-1zM20,18h1v1h-1zM22,18h1v1h-1zM24,18h1v1h-1zM25,18h1v1h-1zM26,18h1v1h-1zM27,18h1v1h-1zM28,18h1v1h-1zM30,18h1v1h-1zM31,18h1v1h-1zM0,19h1v1h-1zM7,19h1v1h-1zM9,19h1v1h-1zM10,19h1v1h-1zM11,19h1v1h-1zM14,19h1v1h-1zM17,19h1v1h-1zM18,19h1v1h-1zM20,19h1v1h-1zM23,19h1v1h-1zM24,19h1v1h-1zM25,19h1v1h-1zM26,19h1v1h-1zM27,19h1v1h-1zM28,19h1v1h-1zM29,19h1v1h-1zM30,19h1v1h-1zM0,20h1v1h-1zM1,20h1v1h-1zM4,20h1v1h-1zM5,20h1v1h-1zM6,20h1v1h-1zM7,20h1v1h-1zM8,20h1v1h-1zM12,20h1v1h-1zM15,20h1v1h-1zM16,20h1v1h-1zM20,20h1v1h-1zM21,20h1v1h-1zM22,20h1v1h-1zM23,20h1v1h-1zM28,20h1v1h-1zM29,20h1v1h-1zM0,21h1v1h-1zM3,21h1v1h-1zM7,21h1v1h-1zM10,21h1v1h-1zM11,21h1v1h-1zM12,21h1v1h-1zM13,21h1v1h-1zM14,21h1v1h-1zM15,21h1v1h-1zM18,21h1v1h-1zM24,21h1v1h-1zM32,21h1v1h-1zM0,22h1v1h-1zM2,22h1v1h-1zM3,22h1v1h-1zM4,22h1v1h-1zM6,22h1v1h-1zM9,22h1v1h-1zM15,22h1v1h-1zM16,22h1v1h-1zM20,22h1v1h-1zM21,22h1v1h-1zM22,22h1v1h-1zM28,22h1v1h-1zM31,22h1v1h-1zM0,23h1v1h-1zM3,23h1v1h-1zM5,23h1v1h-1zM9,23h1v1h-1zM11,23h1v1h-1zM14,23h1v1h-1zM15,23h1v1h-1zM18,23h1v1h-1zM21,23h1v1h-1zM24,23h1v1h-1zM26,23h1v1h-1zM27,23h1v1h-1zM29,23h1v1h-1zM30,23h1v1h-1zM0,24h1v1h-1zM2,24h1v1h-1zM3,24h1v1h-1zM4,24h1v1h-1zM5,24h1v1h-1zM6,24h1v1h-1zM7,24h1v1h-1zM8,24h1v1h-1zM9,24h1v1h-1zM12,24h1v1h-1zM14,24h1v1h-1zM15,24h1v1h-1zM17,24h1v1h-1zM20,24h1v1h-1zM22,24h1v1h-1zM24,24h1v1h-1zM25,24h1v1h-1zM26,24h1v1h-1zM27,24h1v1h-1zM28,24h1v1h-1zM32,24h1v1h-1zM8,25h1v1h-1zM16,25h1v1h-1zM18,25h1v1h-1zM19,25h1v1h-1zM20,25h1v1h-1zM21,25h1v1h-1zM22,25h1v1h-1zM23,25h1v1h-1zM24,25h1v1h-1zM28,25h1v1h-1zM30,25h1v1h-1zM31,25h1v1h-1zM32,25h1v1h-1zM0,26h1v1h-1zM1,26h1v1h-1zM2,26h1v1h-1zM3,26h1v1h-1zM4,26h1v1h-1zM5,26h1v1h-1zM6,26h1v1h-1zM12,26h1v1h-1zM15,26h1v1h-1zM16,26h1v1h-1zM18,26h1v1h-1zM20,26h1v1h-1zM21,26h1v1h-1zM23,26h1v1h-1zM24,26h1v1h-1zM26,26h1v1h-1zM28,26h1v1h-1zM30,26h1v1h-1zM31,26h1v1h-1zM0,27h1v1h-1zM6,27h1v1h-1zM8,27h1v1h-1zM10,27h1v1h-1zM14,27h1v1h-1zM15,27h1v1h-1zM16,27h1v1h-1zM21,27h1v1h-1zM22,27h1v1h-1zM23,27h1v1h-1zM24,27h1v1h-1zM28,27h1v1h-1zM29,27h1v1h-1zM30,27h1v1h-1zM31,27h1v1h-1zM32,27h1v1h-1zM0,28h1v1h-1zM2,28h1v1h-1zM3,28h1v1h-1zM4,28h1v1h-1zM6,28h1v1h-1zM8,28h1v1h-1zM9,28h1v1h-1zM10,28h1v1h-1zM11,28h1v1h-1zM12,28h1v1h-1zM13,28h1v1h-1zM15,28h1v1h-1zM18,28h1v1h-1zM21,28h1v1h-1zM24,28h1v1h-1zM25,28h1v1h-1zM26,28h1v1h-1zM27,28h1v1h-1zM28,28h1v1h-1zM29,28h1v1h-1zM31,28h1v1h-1zM32,28h1v1h-1zM0,29h1v1h-1zM2,29h1v1h-1zM3,29h1v1h-1zM4,29h1v1h-1zM6,29h1v1h-1zM8,29h1v1h-1zM10,29h1v1h-1zM11,29h1v1h-1zM12,29h1v1h-1zM15,29h1v1h-1zM16,29h1v1h-1zM17,29h1v1h-1zM20,29h1v1h-1zM21,29h1v1h-1zM22,29h1v1h-1zM23,29h1v1h-1zM24,29h1v1h-1zM25,29h1v1h-1zM28,29h1v1h-1zM29,29h1v1h-1zM30,29h1v1h-1zM32,29h1v1h-1zM0,30h1v1h-1zM2,30h1v1h-1zM3,30h1v1h-1zM4,30h1v1h-1zM6,30h1v1h-1zM8,30h1v1h-1zM10,30h1v1h-1zM12,30h1v1h-1zM18,30h1v1h-1zM19,30h1v1h-1zM21,30h1v1h-1zM23,30h1v1h-1zM24,30h1v1h-1zM26,30h1v1h-1zM27,30h1v1h-1zM29,30h1v1h-1zM30,30h1v1h-1zM0,31h1v1h-1zM6,31h1v1h-1zM9,31h1v1h-1zM12,31h1v1h-1zM13,31h1v1h-1zM16,31h1v1h-1zM18,31h1v1h-1zM19,31h1v1h-1zM20,31h1v1h-1zM21,31h1v1h-1zM24,31h1v1h-1zM25,31h1v1h-1zM26,31h1v1h-1zM28,31h1v1h-1zM29,31h1v1h-1zM30,31h1v1h-1zM0,32h1v1h-1zM1,32h1v1h-1zM2,32h1v1h-1zM3,32h1v1h-1zM4,32h1v1h-1zM5,32h1v1h-1zM6,32h1v1h-1zM8,32h1v1h-1zM9,32h1v1h-1zM11,32h1v1h-1zM12,32h1v1h-1zM13,32h1v1h-1zM16,32h1v1h-1zM17,32h1v1h-1zM19,32h1v1h-1zM22,32h1v1h-1zM23,32h1v1h-1zM26,32h1v1h-1zM27,32h1v1h-1zM31,32h1v1h-1z"
      fill="currentColor"
    />
  </svg>
);

export default function ResumePage() {
  const [data] = useState<ResumeData>(initialResume);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showJsonModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowJsonModal(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showJsonModal]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="pb-20 pt-24 print:p-0">
        <div className="section-shell print:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/45 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          <header className="mt-10 grid gap-10 border-b border-ink/15 pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8" data-reveal>
              <p className="eyebrow text-ink/45">Résumé / 2026</p>
              <h1 className="serif-display mt-5 max-w-3xl text-[clamp(4rem,9vw,7.5rem)] text-ink">
                Bezaleel <span className="italic text-ink/45">Paul.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/58">
                A live, structured record of my education, engineering work, and technical
                toolkit. The web version and the PDF are generated from the same source.
              </p>
            </div>

            <div className="grid gap-2 lg:col-span-4" data-reveal data-reveal-delay="100">
              <a
                href="/resume.pdf"
                download="Bezaleel_Paul_Resume.pdf"
                className="group flex items-center justify-between gap-4 rounded-full bg-ink px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-paper transition-colors hover:bg-ink-soft"
              >
                Download PDF
                <Download className="h-4 w-4 text-signal transition-transform group-hover:translate-y-0.5" />
              </a>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center justify-between gap-4 rounded-full border border-ink/25 px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-paper-bright"
              >
                Print / Save PDF
                <Printer className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowJsonModal(true)}
                className="flex items-center justify-between gap-4 rounded-full border border-ink/25 px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-paper-bright"
              >
                Data (JSON)
                <FileCode2 className="h-4 w-4" />
              </button>
              <Link
                href="/projects"
                className="flex items-center justify-between gap-4 rounded-full border border-ink/25 px-5 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-paper-bright"
              >
                Project archive
                <FolderGit2 className="h-4 w-4" />
              </Link>
            </div>
          </header>
        </div>

        <div className="mt-12 flex justify-center px-2 sm:px-4 print:m-0 print:p-0">
          <article
            id="resume-canvas"
            className="resume-sheet grid w-full max-w-[210mm] overflow-hidden border border-ink/15 bg-paper-bright shadow-[0_30px_90px_rgba(17,20,17,0.16)] md:grid-cols-[35%_1fr] print:min-h-[297mm] print:w-[210mm] print:grid-cols-[35%_1fr] print:border-0 print:shadow-none"
          >
            <aside className="flex flex-col gap-5 border-b border-ink/12 bg-paper-warm p-6 text-[10px] leading-relaxed md:border-b-0 md:border-r print:border-b-0 print:border-r">
              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-accent bg-paper-bright shadow-sm">
                  {/* Profile photo from LinkedIn / GitHub */}
                  <img
                    src="/photo.jpg"
                    alt={`${data.name} ${data.nameAccent}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="flex h-full w-full items-center justify-center bg-ink font-display text-2xl text-paper">
                    BP
                  </div>
                </div>
                <div>
                  <p className="font-display text-[23px] leading-none tracking-tight text-ink">
                    {data.name} <span className="text-ink/45">{data.nameAccent}</span>
                  </p>
                  <p className="mt-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-ink/45">
                    {data.tagline}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {data.terminal.map((line) => (
                  <span
                    key={line}
                    className={`rounded-full border px-2 py-1 font-mono text-[7.5px] tracking-[0.02em] ${
                      line.startsWith('$')
                        ? 'border-ink/15 text-ink/40'
                        : 'border-ink/15 bg-paper-bright text-ink/65'
                    }`}
                  >
                    {line}
                  </span>
                ))}
              </div>

              <section className="space-y-2">
                <SheetHeading>Contact</SheetHeading>
                <div className="space-y-1.5">
                  {data.contact.map(([key, value]) => (
                    <div key={key}>
                      <div className="text-[7.5px] font-semibold uppercase tracking-[0.12em] text-ink/35">
                        {key}
                      </div>
                      <a
                        href={toHref(value)}
                        target={toHref(value).startsWith('http') ? '_blank' : undefined}
                        rel={toHref(value).startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="break-all text-[9.5px] font-medium text-ink/78 transition-colors hover:text-ink"
                      >
                        {value}
                      </a>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <SheetHeading>Skills</SheetHeading>
                <div className="space-y-2.5">
                  {data.skills.map(([category, items]) => (
                    <div key={category}>
                      <div className="mb-1 text-[7.5px] font-semibold uppercase tracking-[0.12em] text-ink/35">
                        {category}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {items.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-ink/16 bg-paper-bright px-1.5 py-0.5 text-[8px] font-semibold text-ink/70"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <SheetHeading>Education</SheetHeading>
                <div className="space-y-2.5">
                  {data.education.map(([degree, institution, timeline]) => (
                    <div key={degree}>
                      <b className="block text-[9.5px] font-bold text-ink">{degree}</b>
                      <span className="block text-[9px] font-semibold text-ink/60">{institution}</span>
                      <span className="block font-mono text-[7.5px] text-ink/38">{timeline}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <SheetHeading>Certifications</SheetHeading>
                <ul className="space-y-1 text-[8.5px] leading-snug text-ink/65">
                  {data.certifications.map((certification) => (
                    <li key={certification} className="flex gap-1.5">
                      <span className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-ink/35" />
                      <span>{certification}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-2">
                <SheetHeading>Languages</SheetHeading>
                <div className="space-y-1">
                  {data.languages.map(([language, level]) => (
                    <div key={language} className="flex items-baseline justify-between gap-2 text-[8.5px]">
                      <span className="font-semibold text-ink/78">{language}</span>
                      <span className="text-ink/38">{level}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                <SheetHeading>Coursework</SheetHeading>
                <ul className="space-y-1 text-[8.5px] leading-snug text-ink/65">
                  {data.coursework.map((course) => (
                    <li key={course} className="flex gap-1.5">
                      <span className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-ink/35" />
                      <span>{course}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>

            <div className="flex min-h-[297mm] flex-col p-6 sm:p-8 print:min-h-0">
              <header className="border-b border-ink/15 pb-4">
                <p className="eyebrow text-ink/35">Curriculum vitae</p>
                <h2 className="mt-2 max-w-lg font-display text-[28px] leading-[0.98] tracking-tight text-ink">
                  {data.title}
                </h2>
              </header>

              <div className="mt-5 space-y-5">
                <section>
                  <SheetHeading>Summary</SheetHeading>
                  <p className="mt-2 text-[10px] leading-relaxed text-ink/68">{data.summary}</p>
                </section>

                <section>
                  <SheetHeading>Experience & Leadership</SheetHeading>
                  <div className="mt-2.5 space-y-3">
                    {data.experience.map((experience) => (
                      <div key={`${experience.role}-${experience.org}`}>
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <b className="text-[11.5px] font-bold text-ink">{experience.role}</b>
                          <span className="font-mono text-[8px] uppercase tracking-[0.06em] text-ink/40">
                            {experience.place}
                          </span>
                        </div>
                        <p className="text-[9.5px] font-semibold text-ink/60">{experience.org}</p>
                        <ul className="mt-1.5 space-y-1 text-[9.5px] leading-relaxed text-ink/66">
                          {experience.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-2">
                              <span className="mt-[0.42rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {data.projects.length > 0 && (
                  <section>
                    <SheetHeading>Notable Projects</SheetHeading>
                    <div className="mt-2.5 space-y-3">
                      {data.projects.map((project) => (
                        <div key={project.name}>
                          <div className="flex items-baseline justify-between gap-2">
                            <b className="text-[10.5px] text-ink">{project.name}</b>
                            <span className="font-mono text-[8px] text-ink/45">{project.tech}</span>
                          </div>
                          <div className="flex gap-2 font-mono text-[8px] text-ink/40">
                            {project.links.map((link) => (
                              <a
                                key={link}
                                href={toHref(link)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-ink hover:underline"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                          <ul className="mt-1 space-y-0.5 text-[9.5px] leading-relaxed text-ink/66">
                            {project.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-2">
                                <span className="mt-[0.42rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <SheetHeading>Projects & Software Archive (Scan QR)</SheetHeading>
                  <a
                    href={data.projectsQR.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-4 rounded-xl border border-ink/20 bg-paper-warm/80 p-3.5 transition-colors hover:border-ink/50 hover:bg-paper-warm shadow-sm"
                  >
                    <div className="shrink-0 rounded-lg border border-ink/15 bg-white p-2 shadow-sm">
                      <QRCodeSvg className="h-20 w-20 text-ink" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <b className="text-[11.5px] font-bold text-ink">{data.projectsQR.label}</b>
                        <ArrowUpRight className="h-3.5 w-3.5 text-ink/50" />
                      </div>
                      <span className="mt-0.5 block font-mono text-[9.5px] font-semibold text-accent">
                        {data.projectsQR.display}
                      </span>
                      {data.projectsQR.note && (
                        <p className="mt-1 text-[8.5px] leading-relaxed text-ink/65">
                          {data.projectsQR.note}
                        </p>
                      )}
                    </div>
                  </a>
                </section>

                {data.extra?.map((section) => (
                  <section key={section.title}>
                    <SheetHeading>{section.title}</SheetHeading>
                    <div className="mt-2.5 space-y-2">
                      {section.items.map((item) => (
                        <div key={item.title}>
                          <div className="flex items-baseline justify-between gap-2">
                            <b className="text-[10px] text-ink">{item.title}</b>
                            {item.meta && (
                              <span className="font-mono text-[8px] text-ink/45">{item.meta}</span>
                            )}
                          </div>
                          {item.bullets && (
                            <ul className="mt-1 space-y-0.5 text-[9px] leading-relaxed text-ink/65">
                              {item.bullets.map((bullet) => (
                                <li key={bullet} className="flex gap-2">
                                  <span className="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <footer className="mt-auto border-t border-ink/15 pt-3 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">
                {data.footer}
              </footer>
            </div>
          </article>
        </div>
      </main>

      {showJsonModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 p-4 backdrop-blur-md print:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-json-title"
          onClick={() => setShowJsonModal(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 rounded-2xl border border-ink/15 bg-paper-bright p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-4">
              <div className="flex items-center gap-2">
                <FileCode2 className="h-5 w-5 text-ink/55" />
                <h3 id="resume-json-title" className="font-mono text-sm font-semibold text-ink">
                  Resume Data Source (resume.json)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="rounded-full border border-ink/20 p-1.5 text-ink/55 transition-colors hover:border-ink hover:text-ink"
                aria-label="Close data viewer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed text-ink/55">
              This structured data powers the web resume and the downloadable PDF. After editing
              the source, run <code className="font-mono text-ink">npm run sync:resume</code> to
              refresh the generated artifacts.
            </p>

            <div className="flex-1 overflow-auto rounded-xl border border-ink/15 bg-paper p-4">
              <pre className="font-mono text-[11px] leading-relaxed text-ink/75">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-3">
              <span className="font-mono text-[10px] text-ink/40">
                Source: <strong className="text-ink/70">src/data/resume.json</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJsonModal(false)}
                  className="rounded-full bg-ink px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-paper transition-colors hover:bg-ink-soft"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
