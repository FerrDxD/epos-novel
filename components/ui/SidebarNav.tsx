"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarNavProps {
  codexId: string;
  counts: Record<string, number>;
  allEntriesLength: number;
}

const CATEGORY_LINKS = [
  { key: "characters", label: "Tokoh Utama" },
  { key: "locations", label: "Peta Geografis" },
  { key: "factions", label: "Bendera Faksi" },
  { key: "events", label: "Kronik Waktu" },
  { key: "concepts", label: "Hukum Semesta" },
  { key: "monsters", label: "Bestiary" },
];

export default function SidebarNav({ codexId, counts, allEntriesLength }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 relative">
      <Link
        href={`/codex/${codexId}`}
        className={`relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
          pathname === `/codex/${codexId}` ? "bg-gradient-to-r from-[var(--color-surface-2)] to-transparent border border-[var(--color-gold-muted)] shadow-[inset_0_0_15px_rgba(212,175,55,0.05)]" : "hover:bg-[var(--color-surface)] border border-transparent"
        }`}
      >
        <span className={`font-display text-xs tracking-[0.2em] uppercase font-bold relative z-10 ${pathname === `/codex/${codexId}` ? 'text-[var(--color-gold)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
          Semua Lembar
        </span>
        <span className="text-[10px] font-mono text-[var(--color-gold)] opacity-70 relative z-10">
          {allEntriesLength}
        </span>
      </Link>

      {CATEGORY_LINKS.map((link) => {
        const count = counts[link.key] || 0;
        const isActive = pathname.includes(`/codex/${codexId}/${link.key}`);
        
        return (
          <Link
            key={link.key}
            href={`/codex/${codexId}/${link.key}`}
            className={`relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
              isActive ? "bg-gradient-to-r from-[var(--color-surface-2)] to-transparent border border-[var(--color-gold-muted)] shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "hover:bg-[var(--color-surface)] border border-transparent"
            }`}
          >
            <span className={`font-display text-xs tracking-[0.15em] uppercase relative z-10 ${isActive ? 'text-[var(--color-gold)] font-bold' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]'}`}>
              {link.label}
            </span>
            <span className={`text-[10px] font-mono relative z-10 ${isActive ? 'text-[var(--color-gold)] opacity-100 font-bold' : 'text-[var(--color-gold)] opacity-50 group-hover:opacity-100'}`}>
              {count}
            </span>
          </Link>
        );
      })}

      <div className="w-full flex justify-center my-8 opacity-50">
        <div className="ornate-divider-h w-1/3" />
      </div>

      {/* Tools */}
      <Link
        href={`/codex/${codexId}/import`}
        className={`flex items-center justify-center gap-3 px-3 py-3 rounded-xl border transition-colors ${pathname.includes('/import') ? 'border-[var(--color-gold)] bg-[var(--color-surface-2)] text-[var(--color-gold)]' : 'border-[var(--color-border)] text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold-muted)]'}`}
      >
        <span className="font-display text-[10px] font-bold tracking-[0.2em] uppercase">Transmutasi Naskah</span>
      </Link>
    </nav>
  );
}
