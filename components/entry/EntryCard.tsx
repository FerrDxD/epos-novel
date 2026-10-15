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
      className="block group tome-border bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] p-6 transition-all duration-300 relative overflow-hidden rounded-sm hover:-translate-y-1 shadow-md hover:shadow-[0_0_25px_rgba(232,208,141,0.12)]"
    >
      {/* Bookmark Ribbon */}
      <div
        className="absolute top-0 left-6 w-8 h-1 shadow-sm transition-transform duration-300 group-hover:h-1.5"
        style={{ backgroundColor: color }}
      />

      {/* Decorative Book Corners */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--color-gold)] opacity-0 group-hover:opacity-60 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--color-gold)] opacity-0 group-hover:opacity-60 transition-opacity" />

      <div className="flex justify-between items-start mb-4 mt-1">
        <CategoryBadge category={entry.category} />
      </div>

      <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-1 mb-2 tracking-wide uppercase">
        {entry.title}
      </h3>

      <p className="font-body text-base italic text-[var(--color-text-muted)] line-clamp-2 min-h-[44px] mb-5 leading-relaxed">
        {entry.summary || "Lembaran hening yang menanti guratan pena pengarang..."}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5 min-h-[26px]">
        {entry.tags?.slice(0, 3).map((tag, i) => (
          <span
            key={i}
            className="px-2 py-0.5 text-xs font-mono tracking-wider uppercase border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] rounded-sm"
          >
            {tag}
          </span>
        ))}
        {entry.tags?.length > 3 && (
          <span className="px-2 py-0.5 text-xs font-mono tracking-wider uppercase border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] rounded-sm">
            +{entry.tags.length - 3}
          </span>
        )}
      </div>

      <div className="font-mono text-xs text-[var(--color-text-muted)] tracking-wider pt-3.5 border-t border-[var(--color-border)] opacity-70 uppercase flex items-center justify-between">
        <span>Diukir {timeAgo}</span>
        <span className="text-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
          Buka Lembar →
        </span>
      </div>
    </Link>
  );
}
