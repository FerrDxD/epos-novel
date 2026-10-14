import { db } from "../../../lib/db";
import { codexes, entries, codexMembers } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, isNotNull, inArray, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import TrashActions from "../../../components/collab/TrashActions";
export default async function TrashPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const ownedCodexes = await db.select().from(codexes).where(and(eq(codexes.userId, session.user.id), isNotNull(codexes.deletedAt))).orderBy(desc(codexes.deletedAt));
  const ownedIds = ownedCodexes.map((c) => c.id);
  const memberships = await db.select({ codexId: codexMembers.codexId }).from(codexMembers).where(eq(codexMembers.userId, session.user.id));
  const allCodexIds = [...new Set([...ownedIds, ...memberships.map((m) => m.codexId)])];
  let trashedEntries: any[] = [];
  if (allCodexIds.length) {
    trashedEntries = await db.select().from(entries).where(and(inArray(entries.codexId, allCodexIds), isNotNull(entries.deletedAt))).orderBy(desc(entries.deletedAt));
  } else {
    trashedEntries = await db.select().from(entries).where(and(eq(entries.userId, session.user.id), isNotNull(entries.deletedAt))).orderBy(desc(entries.deletedAt));
  }
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] text-xs tracking-[0.2em] uppercase font-display"><ArrowLeft className="w-4 h-4" /> Perpustakaan</Link>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-gold)]">Sampah · 30 hari</span>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display font-black text-3xl tracking-widest uppercase text-[var(--color-text)] flex items-center gap-3"><Trash2 className="w-6 h-6 text-[var(--color-gold)]" /> Tempat Sampah</h1>
        <p className="font-body italic text-[var(--color-text-muted)] mt-2">Item yang dihapus akan hilang permanen setelah 30 hari. Restore kapan saja sebelum itu.</p>
        <section className="mt-10">
          <h2 className="font-display text-xs tracking-[0.25em] uppercase text-[var(--color-gold-muted)] mb-4">Kitab ({ownedCodexes.length})</h2>
          {ownedCodexes.length === 0 ? <p className="text-sm italic text-[var(--color-text-muted)]">Tidak ada kitab di sampah.</p> : (
            <ul className="space-y-3">
              {ownedCodexes.map((c) => (
                <li key={c.id} className="flex items-center justify-between p-4 border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <span className="font-display text-sm">{c.title} <span className="ml-2 font-mono text-[11px] opacity-60">{c.deletedAt ? new Date(c.deletedAt).toLocaleString("id-ID") : ""}</span></span>
                  <TrashActions kind="codex" id={c.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="mt-10">
          <h2 className="font-display text-xs tracking-[0.25em] uppercase text-[var(--color-gold-muted)] mb-4">Lembaran ({trashedEntries.length})</h2>
          {trashedEntries.length === 0 ? <p className="text-sm italic text-[var(--color-text-muted)]">Tidak ada lembaran di sampah.</p> : (
            <ul className="space-y-3">
              {trashedEntries.map((e) => (
                <li key={e.id} className="flex items-center justify-between p-4 border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <span className="text-sm"><span className="font-mono text-[11px] opacity-60 mr-2">[{e.category}]</span>{e.title}</span>
                  <TrashActions kind="entry" id={e.id} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
