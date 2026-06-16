import Link from "next/link";
import CategoryBadge, { CATEGORY_COLORS, CategoryType } from "../codex/CategoryBadge";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface Entry {
  id: string;
  codexId: string;
  category: string;
  title: string;
  summary: string | null;
  tags: string[];
  updatedAt: Date;
}

export default function EntryCard({ entry }: { entry: Entry }) {
  const timeAgo = formatDistanceToNow(new Date(entry.updatedAt), {
    addSuffix: true,
    locale: localeId,
  });

  const catKey = entry.category as CategoryType;
  const color = CATEGORY_COLORS[catKey] || "var(--color-gold)";

  return (
    <Link
      href={`/codex/${entry.codexId}/entry/${entry.id}`}
      className="block group tome-border bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] p-6 transition-all duration-500 relative overflow-hidden"
    >
      {/* Top Border Accent (simulating bookmark ribbon) */}
      <div 
        className="absolute top-0 left-6 w-8 h-1"
        style={{ backgroundColor: color }}
      />

      <div className="flex justify-between items-start mb-4 mt-1">
        <CategoryBadge category={entry.category} />
      </div>

      <h3 className="font-display font-bold text-xl text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-1 mb-2 tracking-wide">
        {entry.title}
      </h3>

      <p className="font-body text-base italic text-[var(--color-text-muted)] line-clamp-2 min-h-[44px] mb-6">
        {entry.summary || "Lembaran kosong yang belum diukir."}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {entry.tags?.slice(0, 3).map((tag, i) => (
          <span key={i} className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-[var(--color-border)] text-[var(--color-text-muted)]">
            {tag}
          </span>
        ))}
        {entry.tags?.length > 3 && (
          <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-[var(--color-border)] text-[var(--color-text-muted)]">
            +{entry.tags.length - 3}
          </span>
        )}
      </div>

      <div className="font-mono text-[9px] text-[var(--color-text-muted)] tracking-widest pt-4 border-t border-[var(--color-border)] opacity-50 uppercase">
        Pahatan Terakhir {timeAgo}
      </div>
    </Link>
  );
}
