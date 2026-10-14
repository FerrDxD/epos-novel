import { db } from "../../../../../lib/db";
import { codexes, entries } from "../../../../../lib/db/schema";
import { auth } from "../../../../../lib/auth";
import { eq, and, desc, isNull } from "drizzle-orm";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Plus, Clock, LayoutGrid } from "lucide-react";
import ThemeToggle from "../../../../../components/ui/ThemeToggle";
import CategoryBadge, { CATEGORY_LABELS, CATEGORY_ICONS, CategoryType } from "../../../../../components/codex/CategoryBadge";
import EntryCard from "../../../../../components/entry/EntryCard";
import TimelineView from "../../../../../components/codex/TimelineView";
import { requireCanRead } from "../../../../../lib/collab";

const VALID_CATEGORIES = ["characters", "locations", "factions", "events", "concepts", "monsters"];

export default async function CategoryPage({ params, searchParams }: { params: { codexId: string, category: string }, searchParams: { view?: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { codexId, category } = params;
  const viewMode = searchParams.view === "timeline" && category === "events" ? "timeline" : "list";
  
  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const chk = await requireCanRead(codexId, session.user.id);
  if (!chk.ok) redirect("/dashboard");
  const codex = chk.acc.codex;

  const categoryEntries = await db
    .select()
    .from(entries)
    .where(and(eq(entries.codexId, codexId), eq(entries.category, category as any), isNull(entries.deletedAt)))
    .orderBy(desc(entries.updatedAt));

  const catKey = category as CategoryType;
  const label = CATEGORY_LABELS[catKey] || category;
  const Icon = CATEGORY_ICONS[catKey] || Plus;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200">
      <header className="sticky top-0 z-20 w-full px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href={`/codex/${codexId}`} className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase hidden sm:block">Tutup Gulungan</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-12 border-b border-[var(--color-border)] pb-8 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-[var(--color-gold)]" />
          
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 flex items-center justify-center border border-[var(--color-gold-muted)] bg-[var(--color-surface)] shadow-[inset_0_0_15px_rgba(194,168,120,0.1)] rotate-45">
              <Icon className="w-8 h-8 text-[var(--color-gold)] -rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-4xl text-[var(--color-text)] flex items-center gap-3 uppercase tracking-widest">
                {label}
              </h1>
              <p className="font-body italic text-lg text-[var(--color-text-muted)] mt-1">
                Terdapat <span className="font-bold text-[var(--color-gold)]">{categoryEntries.length}</span> catatan yang terukir.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {category === "events" && (
              <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-1 rounded-full">
                <Link
                  href={`/codex/${codexId}/${category}?view=list`}
                  className={`px-4 py-2 rounded-full font-display text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-2 ${viewMode === 'list' ? 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                >
                  <LayoutGrid className="w-3 h-3" /> Grid
                </Link>
                <Link
                  href={`/codex/${codexId}/${category}?view=timeline`}
                  className={`px-4 py-2 rounded-full font-display text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-[var(--color-gold-muted)] text-[var(--color-gold)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
                >
                  <Clock className="w-3 h-3" /> Garis Waktu
                </Link>
              </div>
            )}
            <Link
              href={`/codex/${codexId}/entry/new?cat=${category}`}
              className="px-6 py-4 border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] bg-[var(--color-surface-2)] text-[var(--color-gold)] font-display text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-3 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Pahat {label} Baru
            </Link>
          </div>
        </div>

        {categoryEntries.length === 0 ? (
          <div className="text-center py-24 tome-border bg-[var(--color-surface)]">
            <Icon className="w-16 h-16 text-[var(--color-gold-muted)] opacity-30 mx-auto mb-6" />
            <p className="font-body text-xl italic text-[var(--color-text-muted)] mb-8">
              Rak gulungan untuk {label.toLowerCase()} masih diselimuti debu kekosongan.
            </p>
            <Link
              href={`/codex/${codexId}/entry/new?cat=${category}`}
              className="px-8 py-4 border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] text-[var(--color-gold)] font-display text-xs font-bold uppercase tracking-widest inline-block transition-colors"
            >
              Mulailah Mengukir Sejarah
            </Link>
          </div>
        ) : (
          viewMode === "timeline" ? (
            <TimelineView codexId={codexId} entries={categoryEntries} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}
