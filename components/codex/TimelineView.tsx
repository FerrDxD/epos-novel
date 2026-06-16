import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Props {
  codexId: string;
  entries: any[];
}

export default function TimelineView({ codexId, entries }: Props) {
  // Sort entries: typically by a 'date' or 'year' metadata field if exists, else by updatedAt or createdAt
  const sortedEntries = [...entries].sort((a, b) => {
    const yearA = a.metadata?.year ? parseInt(a.metadata.year) : 0;
    const yearB = b.metadata?.year ? parseInt(b.metadata.year) : 0;
    
    if (yearA !== yearB && (yearA || yearB)) {
      return yearA - yearB;
    }
    // Fallback to updated at
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });

  return (
    <div className="relative max-w-4xl mx-auto py-10">
      {/* Central Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent opacity-30" />

      <div className="space-y-16">
        {sortedEntries.map((entry, idx) => {
          const isEven = idx % 2 === 0;
          const year = entry.metadata?.year || entry.metadata?.tahun || "Masa Tak Tercatat";

          return (
            <div key={entry.id} className={`relative flex items-center justify-between w-full group ${isEven ? 'flex-row-reverse' : ''}`}>
              
              {/* Central Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 border border-[var(--color-gold)] bg-[var(--color-bg)] rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(212,175,55,0.2)] group-hover:scale-150 transition-transform">
                <div className="w-1.5 h-1.5 bg-[var(--color-gold)] rounded-full" />
              </div>

              {/* Empty Space for the other side */}
              <div className="w-5/12" />

              {/* Content Card */}
              <div className={`w-5/12 ${isEven ? 'text-right' : 'text-left'}`}>
                <div className="mb-2">
                  <span className="font-display font-bold text-lg tracking-[0.2em] text-[var(--color-gold)] uppercase drop-shadow-[0_0_5px_rgba(212,175,55,0.2)]">
                    {year}
                  </span>
                </div>
                
                <Link href={`/codex/${codexId}/entry/${entry.id}`} className="block">
                  <div className={`p-6 tome-border hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all ${isEven ? 'items-end' : 'items-start'}`}>
                    <h3 className="font-display font-black text-2xl text-[var(--color-text)] mb-3 group-hover:text-[var(--color-gold)] transition-colors">
                      {entry.title}
                    </h3>
                    <p className="font-body text-[var(--color-text-muted)] line-clamp-3 italic mb-4">
                      {entry.summary || "Peristiwa ini terekam kabur dalam ingatan semesta..."}
                    </p>
                    <div className="font-mono text-[10px] uppercase text-[var(--color-gold-muted)] tracking-widest">
                      Lihat Kronik →
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
