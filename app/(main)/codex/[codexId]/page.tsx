import { db } from "../../../../lib/db";
import { codexes, entries, entryRelations, codexMembers, users } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, desc, and, isNull } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Plus, Upload, LayoutGrid, Network, Users as UsersIcon, Download } from "lucide-react";
import CategoryBadge, { CATEGORY_COLORS, CategoryType } from "../../../../components/codex/CategoryBadge";
import EntryGrid from "../../../../components/entry/EntryGrid";
import CodexGraph from "../../../../components/codex/CodexGraph";
import SharePanel from "../../../../components/collab/SharePanel";
import ExportPanel from "../../../../components/collab/ExportPanel";
import { getCodexAccess } from "../../../../lib/collab";

export default async function CodexDetailPage({ params, searchParams }: { params: { codexId: string }, searchParams: { view?: string } }) {
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
    members = await Promise.all(raw.map(async (m) => {
      const [u] = await db.select({ id: users.id, name: users.name, email: users.email, image: users.image, username: users.username }).from(users).where(eq(users.id, m.userId)).limit(1);
      return { ...m, user: u || null };
    }));
    const [ou] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, codex.userId)).limit(1);
    ownerUser = ou || null;
  } else {
    const [ou] = await db.select({ id: users.id, name: users.name, email: users.email }).from(users).where(eq(users.id, codex.userId)).limit(1);
    ownerUser = ou || null;
  }
  // Calculate stats
  const stats = codexEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase hidden sm:block">Perpustakaan</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/codex/${codexId}/import`}
              className="px-5 py-2.5 bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-text)] font-display text-xs tracking-widest uppercase transition-colors flex items-center gap-3 border border-[var(--color-border)] hover:border-[var(--color-gold-muted)]"
            >
              <Upload className="w-4 h-4 opacity-70" />
              <span className="hidden sm:inline">Transmutasi Naskah</span>
            </Link>
            <Link
              href={`/codex/${codexId}/entry/new`}
              className="px-5 py-2.5 bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] hover:bg-[var(--color-surface)] text-[var(--color-gold)] font-display text-xs tracking-widest font-bold uppercase transition-all flex items-center gap-3"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Pahat Lembar Baru</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Codex Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 items-start justify-between border-b border-[var(--color-border)] pb-10 relative">
          {/* Subtle decoration */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rotate-45 bg-[var(--color-bg)] border border-[var(--color-border)]" />
          
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1.5 h-12"
                style={{ backgroundColor: codex.coverColor }}
              />
              <h1 className="font-display font-black text-4xl md:text-5xl text-[var(--color-text)] tracking-wide">
                {codex.title}
              </h1>
              {!isOwner && (
                <span className="ml-2 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-mono border border-[var(--color-gold-muted)] text-[var(--color-gold)] bg-[var(--color-surface)]">
                  {acc.role === "editor" ? "Editor" : "Viewer"} · milik {ownerUser?.name || ownerUser?.email}
                </span>
              )}
            </div>
            {codex.description && (
              <p className="font-body text-xl italic text-[var(--color-text-muted)] max-w-3xl mb-6">
                {codex.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              {codex.genre && (
                <span className="px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.2em] bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] shadow-sm">
                  Era: {codex.genre}
                </span>
              )}
              <span className="font-mono text-xs text-[var(--color-gold-muted)] tracking-widest uppercase">
                {codexEntries.length} Lembaran Terukir
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 shrink-0">
            {/* Edit / Delete Placeholder */}
            <button className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] bg-[var(--color-surface)] transition-all">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-crimson)] border border-[var(--color-border)] hover:border-[var(--color-crimson)] bg-[var(--color-surface)] transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collab bars */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <SharePanel codexId={codexId} isOwner={isOwner} owner={ownerUser} members={members} />
          <ExportPanel codexId={codexId} canWrite={canWrite} />
        </div>

        {/* Stats Bar (Tome Style) */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {Object.entries(CATEGORY_COLORS).map(([catKey, color]) => {
            const count = stats[catKey] || 0;
            return (
              <Link key={catKey} href={`/codex/${codexId}/${catKey}`} className="flex items-center gap-3 px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] hover:shadow-[0_0_15px_rgba(194,168,120,0.1)] transition-all group">
                <CategoryBadge category={catKey} className="border-none bg-transparent px-0" />
                <div className="w-[1px] h-6 bg-[var(--color-border)]" />
                <span className="font-mono text-sm font-bold text-[var(--color-gold)] group-hover:glow-gold">{count}</span>
              </Link>
            );
          })}
        </div>

        {/* View Toggles */}
        <div className="flex items-center justify-center gap-6 mb-10">
          <Link 
            href={`/codex/${codexId}?view=list`}
            className={`flex items-center gap-3 px-6 py-3 font-display text-xs font-bold tracking-[0.2em] uppercase transition-all ${viewMode === 'list' ? 'text-[var(--color-gold)] border border-[var(--color-gold)] bg-[var(--color-surface-2)] shadow-[inset_0_0_10px_rgba(194,168,120,0.1)]' : 'text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)]'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Gulungan Teks
          </Link>
          <Link 
            href={`/codex/${codexId}?view=graph`}
            className={`flex items-center gap-3 px-6 py-3 font-display text-xs font-bold tracking-[0.2em] uppercase transition-all ${viewMode === 'graph' ? 'text-[var(--color-gold)] border border-[var(--color-gold)] bg-[var(--color-surface-2)] shadow-[inset_0_0_10px_rgba(194,168,120,0.1)]' : 'text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-gold-muted)]'}`}
          >
            <Network className="w-4 h-4" />
            Jaring Takdir
          </Link>
        </div>

        {/* Content */}
        {viewMode === "graph" ? (
          <div className="relative">
            <CodexGraph codexId={codexId} entries={codexEntries} relations={relations} />
          </div>
        ) : (
          <EntryGrid codexId={codexId} initialEntries={codexEntries as any} totalCount={codex.entryCount} />
        )}
      </main>
    </div>
  );
}
