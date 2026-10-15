import { db } from "../../../../../lib/db";
import { codexes, entries } from "../../../../../lib/db/schema";
import { auth } from "../../../../../lib/auth";
import { eq, and, desc, isNull } from "drizzle-orm";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Plus, Clock, LayoutGrid, BookOpen } from "lucide-react";
import ThemeToggle from "../../../../../components/ui/ThemeToggle";
import CategoryBadge, {
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  CategoryType,
} from "../../../../../components/codex/CategoryBadge";
import EntryCard from "../../../../../components/entry/EntryCard";
import TimelineView from "../../../../../components/codex/TimelineView";
import { requireCanRead } from "../../../../../lib/collab";

const VALID_CATEGORIES = ["characters", "locations", "factions", "events", "concepts", "monsters"];

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { codexId: string; category: string };
  searchParams: { view?: string };
}) {
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
    .where(
      and(
        eq(entries.codexId, codexId),
        eq(entries.category, category as any),
        isNull(entries.deletedAt)
      )
    )
    .orderBy(desc(entries.updatedAt));

  const catKey = category as CategoryType;
  const label = CATEGORY_LABELS[catKey] || category;
  const Icon = CATEGORY_ICONS[catKey] || Plus;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href={`/codex/${codexId}`}
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase hidden sm:block">
              Kembali ke {codex.title}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/codex/${codexId}/entry/new?cat=${category}`}
              className="px-4 py-2 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] hover:bg-[var(--color-surface)] text-[var(--color-gold)] font-display text-xs tracking-widest font-bold uppercase transition-all flex items-center gap-2 rounded-full shadow-[0_0_15px_rgba(232,208,141,0.12)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pahat {label} Baru</span>
            </Link>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Category Header Hero */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10 border-b border-[var(--color-border)] pb-8 relative">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 flex items-center justify-center border border-[var(--color-gold)] bg-[var(--color-surface)] shadow-[0_0_15px_rgba(232,208,141,0.1)] rotate-45 shrink-0">
              <Icon className="w-7 h-7 text-[var(--color-gold)] -rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] uppercase tracking-wider">
                {label}
              </h1>
              <p className="font-body italic text-lg text-[var(--color-text-muted)] mt-1">
                Terdapat{" "}
                <span className="font-bold text-[var(--color-gold)] font-mono">
                  {categoryEntries.length}
                </span>{" "}
                lembaran terukir dalam pilar ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {category === "events" && (
              <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] p-1 rounded-full">
                <Link
                  href={`/codex/${codexId}/${category}?view=list`}
                  className={`px-3.5 py-1.5 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-[var(--color-surface-2)] text-[var(--color-gold)] border border-[var(--color-gold-muted)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </Link>
                <Link
                  href={`/codex/${codexId}/${category}?view=timeline`}
                  className={`px-3.5 py-1.5 rounded-full font-display text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 ${
                    viewMode === "timeline"
                      ? "bg-[var(--color-surface-2)] text-[var(--color-gold)] border border-[var(--color-gold-muted)]"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Garis Waktu</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        {categoryEntries.length === 0 ? (
          <div className="tome-border rounded-xl p-12 sm:p-20 text-center bg-[var(--color-surface)]/80 shadow-2xl relative overflow-hidden">
            <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45 bg-[var(--color-bg)]">
              <BookOpen className="w-6 h-6 text-[var(--color-gold)] -rotate-45" />
            </div>

            <h3 className="font-display font-black text-2xl text-[var(--color-text)] mb-3 tracking-widest uppercase">
              Rak {label} Masih Lengang
            </h3>
            <p className="font-body text-xl text-[var(--color-text-muted)] max-w-lg mx-auto mb-8 italic leading-relaxed">
              Belum ada lembaran {label.toLowerCase()} yang terpahat dalam kitab ini. Mulailah mengabadikan garis keturunan, peninggalan, atau fakta penting di semesta ini.
            </p>
            <Link
              href={`/codex/${codexId}/entry/new?cat=${category}`}
              className="inline-flex items-center gap-3 px-8 py-3.5 tome-border rounded-full font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] shadow-[0_0_15px_rgba(232,208,141,0.15)] hover:scale-105 transition-all"
            >
              <span>Pahat {label} Pertama</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
            </Link>
          </div>
        ) : viewMode === "timeline" ? (
          <TimelineView codexId={codexId} entries={categoryEntries} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
