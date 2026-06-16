"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Book, User, Map, Flag, Clock, Lightbulb, Ghost } from "lucide-react";
import { CATEGORY_LABELS } from "../codex/CategoryBadge";

interface CommandPaletteProps {
  codexId: string;
  entries: { id: string; title: string; category: string }[];
}

const CATEGORY_ICONS: Record<string, any> = {
  characters: User,
  locations: Map,
  factions: Flag,
  events: Clock,
  concepts: Lightbulb,
  monsters: Ghost,
};

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

  if (!isOpen) return null;

  const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8);

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/codex/${codexId}/entry/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(212,175,55,0.05)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
          <Search className="w-5 h-5 text-[var(--color-gold-muted)]" />
          <input
            autoFocus
            className="w-full bg-transparent border-none text-[var(--color-text)] placeholder-[var(--color-text-muted)] font-display text-lg py-4 px-4 focus:outline-none focus:ring-0"
            placeholder="Cari karakter, tempat, faksi... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="font-mono text-[10px] uppercase text-[var(--color-text-muted)] border border-[var(--color-border)] px-2 py-1 rounded bg-[var(--color-bg)]">ESC</kbd>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-10 font-body text-lg italic text-[var(--color-text-muted)]">
              Tak ada catatan yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const Icon = CATEGORY_ICONS[entry.category] || Book;
              return (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--color-surface-2)] rounded-lg group transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded border border-[var(--color-gold-muted)] flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-gold)] group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">{entry.title}</h4>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-gold-muted)] opacity-70">
                        {CATEGORY_LABELS[entry.category as keyof typeof CATEGORY_LABELS] || entry.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">Buka</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
