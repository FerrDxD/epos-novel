"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Users, MapPin, Flag, Calendar, Lightbulb, Ghost } from "lucide-react";

interface SidebarNavProps {
  codexId: string;
  counts: Record<string, number>;
  allEntriesLength: number;
}

const CATEGORY_LINKS = [
  { key: "characters", label: "Tokoh Utama", icon: Users },
  { key: "locations", label: "Peta Geografis", icon: MapPin },
  { key: "factions", label: "Bendera Faksi", icon: Flag },
  { key: "events", label: "Kronik Waktu", icon: Calendar },
  { key: "concepts", label: "Hukum Semesta", icon: Lightbulb },
  { key: "monsters", label: "Bestiary", icon: Ghost },
];

export default function SidebarNav({
  codexId,
  counts,
  allEntriesLength,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1 relative">
      <Link
        href={`/codex/${codexId}`}
        className={`relative flex items-center justify-between px-3.5 py-2.5 rounded transition-all duration-300 group border ${
          pathname === `/codex/${codexId}`
            ? "bg-[var(--color-surface-2)] border-[var(--color-gold)] text-[var(--color-gold)] shadow-[inset_0_0_15px_rgba(232,208,141,0.08)]"
            : "hover:bg-[var(--color-surface)] border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        }`}
      >
        <span className="font-display text-xs tracking-[0.18em] uppercase font-bold relative z-10">
          Semua Lembar
        </span>
        <span className="text-xs font-mono text-[var(--color-gold)] opacity-80 relative z-10">
          {allEntriesLength}
        </span>
      </Link>

      {CATEGORY_LINKS.map((link) => {
        const count = counts[link.key] || 0;
        const isActive = pathname.includes(`/codex/${codexId}/${link.key}`);
        const Icon = link.icon;

        return (
          <Link
            key={link.key}
            href={`/codex/${codexId}/${link.key}`}
            className={`relative flex items-center justify-between px-3.5 py-2.5 rounded transition-all duration-300 group border ${
              isActive
                ? "bg-[var(--color-surface-2)] border-[var(--color-gold)] text-[var(--color-gold)] shadow-[inset_0_0_15px_rgba(232,208,141,0.08)]"
                : "hover:bg-[var(--color-surface)] border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            <div className="flex items-center gap-2.5 relative z-10">
              <Icon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="font-display text-xs tracking-[0.15em] uppercase font-semibold">
                {link.label}
              </span>
            </div>
            <span
              className={`text-xs font-mono relative z-10 ${
                isActive
                  ? "text-[var(--color-gold)] opacity-100 font-bold"
                  : "text-[var(--color-gold)] opacity-60 group-hover:opacity-100"
              }`}
            >
              {count}
            </span>
          </Link>
        );
      })}

      <div className="w-full flex justify-center my-6 opacity-40">
        <div className="ornate-divider-h w-1/3" />
      </div>

      {/* Tools */}
      <Link
        href={`/codex/${codexId}/import`}
        className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded border transition-colors ${
          pathname.includes("/import")
            ? "border-[var(--color-gold)] bg-[var(--color-surface-2)] text-[var(--color-gold)]"
            : "border-[var(--color-border)] text-[var(--color-gold-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold-muted)]"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="font-display text-xs font-bold tracking-[0.18em] uppercase">
          Transmutasi Naskah
        </span>
      </Link>
    </nav>
  );
}
