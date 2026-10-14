"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ codexId, codexTitle, current }: { codexId: string; codexTitle: string; current?: string }) {
  return (
    <nav className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--color-text-muted)] mb-6">
      <Link href="/dashboard" className="hover:text-[var(--color-gold)] transition-colors">Perpustakaan</Link>
      <span className="opacity-40">/</span>
      <Link href={`/codex/${codexId}`} className="hover:text-[var(--color-gold)] transition-colors truncate max-w-[160px]">{codexTitle}</Link>
      {current && (
        <>
          <span className="opacity-40">/</span>
          <span className="text-[var(--color-text)] truncate max-w-[200px]">{current}</span>
        </>
      )}
    </nav>
  );
}
