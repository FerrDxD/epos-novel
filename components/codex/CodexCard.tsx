import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Codex {
  id: string;
  title: string;
  description: string | null;
  genre: string | null;
  coverColor: string;
  entryCount: number;
  updatedAt: Date;
}

export default function CodexCard({ codex }: { codex: Codex }) {
  const timeAgo = formatDistanceToNow(new Date(codex.updatedAt), {
    addSuffix: true,
    locale: localeId,
  });

  return (
    <Link
      href={`/codex/${codex.id}`}
      className="block group relative bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-gold)] transition-all duration-500 min-h-[260px] flex flex-col shadow-lg hover:shadow-[0_0_30px_rgba(194,168,120,0.15)] hover:-translate-y-1"
    >
      {/* Decorative Book Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--color-gold)] opacity-0 group-hover:opacity-50 transition-opacity" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--color-gold)] opacity-0 group-hover:opacity-50 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--color-gold)] opacity-0 group-hover:opacity-50 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--color-gold)] opacity-0 group-hover:opacity-50 transition-opacity" />

      {/* Ornate Spine / Cover block layout */}
      <div className="flex h-full flex-1 relative z-10">
        
        {/* Book Spine Simulation */}
        <div 
          className="w-8 shrink-0 relative flex flex-col items-center py-6 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.5)] border-r border-[var(--color-border)] transition-colors duration-500 group-hover:brightness-110"
          style={{ backgroundColor: codex.coverColor }}
        >
          {/* Spine ribbed texture */}
          <div className="w-full h-[1px] bg-[var(--color-bg)] opacity-30 mt-4 shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
          <div className="w-full h-[1px] bg-[var(--color-bg)] opacity-30 mt-1 shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
          
          <div className="w-full h-[1px] bg-[var(--color-bg)] opacity-30 mt-auto mb-1 shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
          <div className="w-full h-[1px] bg-[var(--color-bg)] opacity-30 mb-4 shadow-[0_1px_2px_rgba(255,255,255,0.2)]" />
        </div>
        
        {/* Inner Content (Parchment Paper Feel) */}
        <div className="p-8 flex-1 flex flex-col h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-display font-black text-2xl text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors tracking-widest leading-tight uppercase relative inline-block">
              {codex.title}
              <div className="absolute -bottom-2 left-0 w-1/2 h-[1px] bg-gradient-to-r from-[var(--color-gold)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </h3>
          </div>

          <p className="font-body text-lg text-[var(--color-text-muted)] line-clamp-3 mb-8 flex-1 italic relative pl-4 border-l border-[var(--color-gold-muted)]">
            {codex.description || "Sebuah kisah yang belum memiliki prolog."}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between pt-5 border-t border-[var(--color-border)] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 -translate-y-1/2 bg-[var(--color-surface)] rotate-45 border border-[var(--color-border)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[var(--color-gold-muted)] rounded-full" />
              </div>
              
              <div className="font-display text-[10px] text-[var(--color-gold)] font-bold tracking-[0.3em] uppercase bg-[var(--color-bg)] px-3 py-1 border border-[var(--color-border)]">
                {codex.entryCount} Lembar
              </div>
              {codex.genre && (
                <div className="font-mono text-[9px] text-[var(--color-text-muted)] tracking-[0.2em] uppercase bg-[var(--color-surface-2)] px-2 py-1">
                  [ {codex.genre} ]
                </div>
              )}
            </div>
            
            <div className="font-mono text-[9px] text-[var(--color-text-muted)] tracking-widest mt-4 opacity-50 uppercase text-center w-full">
              Terakhir diukir {timeAgo}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
