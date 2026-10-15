"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Book, User, Map, Flag, Clock, Lightbulb, Ghost } from "lucide-react";
import { CATEGORY_LABELS } from "../codex/CategoryBadge";

interface CommandPaletteProps {
  codexId: string;
  entries: {
    id: string;
    title: string;
    category: string;
    summary?: string | null;
    tags?: string[];
  }[];
}

const CATEGORY_ICONS: Record<string, any> = {
  characters: User,
  locations: Map,
  factions: Flag,
  events: Clock,
  concepts: Lightbulb,
  monsters: Ghost,
};

function score(entry: CommandPaletteProps["entries"][number], q: string): number {
  const t = entry.title.toLowerCase();
  const s = (entry.summary || "").toLowerCase();
  const tags = (entry.tags || []).join(" ").toLowerCase();
  const query = q.toLowerCase();

  // Exact title match wins
  if (t === query) return 100;
  if (t.startsWith(query)) return 80;
  if (t.includes(query)) return 60;
  if (tags.includes(query)) return 40;
  if (s.includes(query)) return 20;

  // Fuzzy: characters appear in order
  let ti = 0,
    qi = 0;
  while (ti < t.length && qi < query.length) {
    if (t[ti] === query[qi]) qi++;
    ti++;
  }
  if (qi === query.length) return 10;
  return -1;
}

export default function CommandPalette({ codexId, entries }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return entries.slice(0, 8);
    const scored = entries
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.e);
    return scored;
  }, [entries, query]);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/codex/${codexId}/entry/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-gold)] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(232,208,141,0.05)] overflow-hidden animate-in fade-in zoom-in-95 duration-200 tome-border">
        <div className="flex items-center px-4 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <Search className="w-5 h-5 text-[var(--color-gold)]" />
          <input
            autoFocus
            className="w-full bg-transparent border-none text-[var(--color-text)] placeholder-[var(--color-text-muted)] font-display text-lg py-4 px-4 focus:outline-none focus:ring-0"
            placeholder="Cari tokoh, wilayah, faksi... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="font-mono text-xs uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-1 rounded bg-[var(--color-bg)]">
            ESC
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 font-body text-lg italic text-[var(--color-text-muted)]">
              Tak ada catatan yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            filtered.map((entry) => {
              const Icon = CATEGORY_ICONS[entry.category] || Book;
              return (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-2)] rounded group transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded border border-[var(--color-gold-muted)] flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-gold)] group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors uppercase tracking-wide">
                        {entry.title}
                      </h4>
                      <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-gold-muted)] opacity-80">
                        {CATEGORY_LABELS[entry.category as keyof typeof CATEGORY_LABELS] ||
                          entry.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                    Buka →
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
