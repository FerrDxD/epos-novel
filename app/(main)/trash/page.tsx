import { db } from "../../../lib/db";
import { codexes, entries, codexMembers } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, isNotNull, inArray, desc } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Trash2, BookOpen, FileText } from "lucide-react";
import TrashActions from "../../../components/collab/TrashActions";
import ThemeToggle from "../../../components/ui/ThemeToggle";

export default async function TrashPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const ownedCodexes = await db
    .select()
    .from(codexes)
    .where(and(eq(codexes.userId, session.user.id), isNotNull(codexes.deletedAt)))
    .orderBy(desc(codexes.deletedAt));

  const ownedIds = ownedCodexes.map((c) => c.id);
  const memberships = await db
    .select({ codexId: codexMembers.codexId })
    .from(codexMembers)
    .where(eq(codexMembers.userId, session.user.id));

  const allCodexIds = [...new Set([...ownedIds, ...memberships.map((m) => m.codexId)])];

  let trashedEntries: any[] = [];
  if (allCodexIds.length) {
    trashedEntries = await db
      .select()
      .from(entries)
      .where(and(inArray(entries.codexId, allCodexIds), isNotNull(entries.deletedAt)))
      .orderBy(desc(entries.deletedAt));
  } else {
    trashedEntries = await db
      .select()
      .from(entries)
      .where(and(eq(entries.userId, session.user.id), isNotNull(entries.deletedAt)))
      .orderBy(desc(entries.deletedAt));
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] text-xs tracking-[0.2em] uppercase font-display group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Perpustakaan</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-wider uppercase text-[var(--color-gold-muted)] border border-[var(--color-border)] px-3 py-1 bg-[var(--color-surface)] rounded-sm">
              Masa Retensi: 30 Hari
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <div className="mb-12 border-b border-[var(--color-border)] pb-8 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-[var(--color-gold)]" />
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 flex items-center justify-center border border-[var(--color-gold)] bg-[var(--color-surface)] rotate-45 shrink-0">
              <Trash2 className="w-6 h-6 text-[var(--color-gold)] -rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] uppercase tracking-wider">
                Kubah Sampah Semesta
              </h1>
              <p className="font-body italic text-lg text-[var(--color-text-muted)] mt-1">
                Peninggalan dan lembaran yang dibuang akan terhapus permanen setelah 30 hari. Anda dapat memulihkannya kembali sebelum masa tersebut usai.
              </p>
            </div>
          </div>
        </div>

        {/* Trashed Codexes Section */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[var(--color-gold)] rotate-45 shadow-[0_0_6px_var(--color-gold)]" />
            <h2 className="font-display text-xs tracking-[0.25em] uppercase text-[var(--color-gold)] font-bold">
              Kitab Terbuang ({ownedCodexes.length})
            </h2>
          </div>

          {ownedCodexes.length === 0 ? (
            <div className="tome-border rounded-xl p-8 bg-[var(--color-surface)]/60 text-center">
              <p className="font-body text-base italic text-[var(--color-text-muted)]">
                Tidak ada kitab yang berada di dalam kubah sampah saat ini.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {ownedCodexes.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-sm hover:border-[var(--color-gold-muted)] transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[var(--color-gold-muted)] shrink-0" />
                    <div>
                      <span className="font-display font-bold text-base text-[var(--color-text)] uppercase tracking-wide">
                        {c.title}
                      </span>
                      {c.deletedAt && (
                        <span className="ml-3 font-mono text-xs text-[var(--color-text-muted)]">
                          Dibuang {new Date(c.deletedAt).toLocaleDateString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
                  <TrashActions kind="codex" id={c.id} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Trashed Entries Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-[var(--color-gold)] rotate-45 shadow-[0_0_6px_var(--color-gold)]" />
            <h2 className="font-display text-xs tracking-[0.25em] uppercase text-[var(--color-gold)] font-bold">
              Lembaran Terbuang ({trashedEntries.length})
            </h2>
          </div>

          {trashedEntries.length === 0 ? (
            <div className="tome-border rounded-xl p-8 bg-[var(--color-surface)]/60 text-center">
              <p className="font-body text-base italic text-[var(--color-text-muted)]">
                Tidak ada lembaran yang berada di dalam kubah sampah saat ini.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {trashedEntries.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-sm hover:border-[var(--color-gold-muted)] transition-colors gap-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[var(--color-gold-muted)] shrink-0" />
                    <div>
                      <span className="font-mono text-xs text-[var(--color-gold)] uppercase tracking-wider mr-2 bg-[var(--color-bg)] px-2 py-0.5 border border-[var(--color-border)] rounded-sm">
                        {e.category}
                      </span>
                      <span className="font-display font-medium text-base text-[var(--color-text)]">
                        {e.title}
                      </span>
                      {e.deletedAt && (
                        <span className="ml-3 font-mono text-xs text-[var(--color-text-muted)] hidden sm:inline">
                          Dibuang {new Date(e.deletedAt).toLocaleDateString("id-ID")}
                        </span>
                      )}
                    </div>
                  </div>
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
