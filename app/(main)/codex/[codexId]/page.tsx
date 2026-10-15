import { db } from "../../../../lib/db";
import { codexes, entries, entryRelations, codexMembers, users } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, desc, and, isNull } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Upload,
  LayoutGrid,
  Network,
  Users as UsersIcon,
  Download,
  Sparkles,
} from "lucide-react";
import CategoryBadge, { CATEGORY_COLORS, CategoryType } from "../../../../components/codex/CategoryBadge";
import EntryGrid from "../../../../components/entry/EntryGrid";
import CodexGraph from "../../../../components/codex/CodexGraph";
import SharePanel from "../../../../components/collab/SharePanel";
import ExportPanel from "../../../../components/collab/ExportPanel";
import ThemeToggle from "../../../../components/ui/ThemeToggle";
import { getCodexAccess } from "../../../../lib/collab";

export default async function CodexDetailPage({
  params,
  searchParams,
}: {
  params: { codexId: string };
  searchParams: { view?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { codexId } = params;
  const viewMode = searchParams.view === "graph" ? "graph" : "list";

  const acc = await getCodexAccess(codexId, session.user.id);
  if (!acc || !acc.canRead) redirect("/dashboard");
  const codex = acc.codex;
  const isOwner = acc.isOwner;
  const canWrite = acc.canWrite;

  const codexEntries = await db
    .select()
    .from(entries)
    .where(and(eq(entries.codexId, codexId), isNull(entries.deletedAt)))
    .orderBy(desc(entries.updatedAt))
    .limit(12); // initial page; rest via infinite scroll

  const relations = await db
    .select()
    .from(entryRelations)
    .where(eq(entryRelations.codexId, codexId));

  let members: any[] = [];
  let ownerUser: any = null;
  if (isOwner) {
    const raw = await db.select().from(codexMembers).where(eq(codexMembers.codexId, codexId));
    members = await Promise.all(
      raw.map(async (m) => {
        const [u] = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
            image: users.image,
            username: users.username,
          })
          .from(users)
          .where(eq(users.id, m.userId))
          .limit(1);
        return { ...m, user: u || null };
      })
    );
    const [ou] = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, codex.userId))
      .limit(1);
    ownerUser = ou || null;
  } else {
    const [ou] = await db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, codex.userId))
      .limit(1);
    ownerUser = ou || null;
  }

  // Calculate stats
  const stats = codexEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase hidden sm:block">
              Perpustakaan Semesta
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={`/codex/${codexId}/import`}
              className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text)] font-display text-xs tracking-widest uppercase transition-colors flex items-center gap-2 border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] rounded-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold)]" />
              <span className="hidden sm:inline">Transmutasi Naskah</span>
            </Link>

            <Link
              href={`/codex/${codexId}/entry/new`}
              className="px-5 py-2 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] hover:bg-[var(--color-surface)] text-[var(--color-gold)] font-display text-xs tracking-widest font-bold uppercase transition-all flex items-center gap-2 rounded-full shadow-[0_0_15px_rgba(232,208,141,0.12)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pahat Lembar Baru</span>
            </Link>

            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {/* Codex Hero & Identity Block */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-start justify-between border-b border-[var(--color-border)] pb-10 relative">
          <div className="flex gap-5 items-start">
            {/* Codex Spine Ribbon */}
            <div
              className="w-2.5 self-stretch min-h-[90px] rounded-full shadow-md shrink-0 border border-[var(--color-border)]"
              style={{ backgroundColor: codex.coverColor }}
            />

            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] tracking-wider uppercase">
                  {codex.title}
                </h1>
                {!isOwner && (
                  <span className="px-2.5 py-1 text-xs tracking-wider uppercase font-mono border border-[var(--color-gold-muted)] text-[var(--color-gold)] bg-[var(--color-surface)] rounded-sm">
                    {acc.role === "editor" ? "Editor" : "Penyimak"} · milik {ownerUser?.name || ownerUser?.email}
                  </span>
                )}
              </div>

              {codex.description && (
                <p className="font-body text-xl italic text-[var(--color-text-muted)] max-w-3xl mb-5 leading-relaxed">
                  {codex.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {codex.genre && (
                  <span className="px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.18em] bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-sm">
                    Era: {codex.genre}
                  </span>
                )}
                <span className="font-mono text-xs text-[var(--color-gold-muted)] tracking-widest uppercase bg-[var(--color-surface-2)] px-3 py-1 border border-[var(--color-border)]/60 rounded-sm">
                  {codex.entryCount} Lembaran Terpahat
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5 shrink-0 self-end md:self-start">
            <Link
              href={`/codex/${codexId}/import`}
              className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] bg-[var(--color-surface)] transition-all rounded-sm"
              title="Transmutasi Naskah"
            >
              <Upload className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 6-Pillar Categorized Ledger Bar */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[var(--color-gold)] rotate-45 shadow-[0_0_6px_var(--color-gold)]" />
            <h2 className="font-display text-xs tracking-[0.25em] uppercase text-[var(--color-gold)] font-bold">
              Enam Pilar Semesta
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(CATEGORY_COLORS).map(([catKey, color]) => {
              const count = stats[catKey] || 0;
              return (
                <Link
                  key={catKey}
                  href={`/codex/${codexId}/${catKey}`}
                  className="flex items-center justify-between p-3 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:shadow-[0_0_15px_rgba(232,208,141,0.1)] transition-all group rounded-sm"
                >
                  <CategoryBadge category={catKey} className="border-none bg-transparent px-0 py-0" />
                  <span className="font-mono text-xs font-bold text-[var(--color-gold)] group-hover:glow-gold pl-2">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* View Mode Switchers */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href={`/codex/${codexId}?view=list`}
              className={`flex items-center gap-2 px-4 py-2 font-display text-xs font-bold tracking-[0.18em] uppercase transition-all rounded-sm ${
                viewMode === "list"
                  ? "text-[var(--color-gold)] border border-[var(--color-gold)] bg-[var(--color-surface-2)] shadow-[inset_0_0_10px_rgba(232,208,141,0.1)]"
                  : "text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Gulungan Naskah</span>
            </Link>

            <Link
              href={`/codex/${codexId}?view=graph`}
              className={`flex items-center gap-2 px-4 py-2 font-display text-xs font-bold tracking-[0.18em] uppercase transition-all rounded-sm ${
                viewMode === "graph"
                  ? "text-[var(--color-gold)] border border-[var(--color-gold)] bg-[var(--color-surface-2)] shadow-[inset_0_0_10px_rgba(232,208,141,0.1)]"
                  : "text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)]"
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Jaring Takdir</span>
            </Link>
          </div>

          <div className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider hidden sm:block">
            {codexEntries.length} dari {codex.entryCount} Lembaran Ditampilkan
          </div>
        </div>

        {/* Main Content: Graph or Grid */}
        <div className="mb-14">
          {viewMode === "graph" ? (
            <div className="relative">
              <CodexGraph codexId={codexId} entries={codexEntries} relations={relations} />
            </div>
          ) : (
            <EntryGrid
              codexId={codexId}
              initialEntries={codexEntries as any}
              totalCount={codex.entryCount}
            />
          )}
        </div>

        {/* Collaboration & Portability Grid */}
        <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-[var(--color-border)]">
          <SharePanel
            codexId={codexId}
            isOwner={isOwner}
            owner={ownerUser}
            members={members}
          />
          <ExportPanel codexId={codexId} canWrite={canWrite} />
        </div>
      </main>
    </div>
  );
}
