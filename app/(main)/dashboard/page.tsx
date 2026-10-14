import { db } from "../../../lib/db";
import { codexes, codexMembers, users } from "../../../lib/db/schema";
import { auth, signOut } from "../../../lib/auth";
import { eq, isNull, inArray } from "drizzle-orm";
import Link from "next/link";
import CodexCard from "../../../components/codex/CodexCard";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import { Plus, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { getAccessibleCodexes } from "../../../lib/collab";
import CelestialBackground from "../../../components/ui/CelestialBackground";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const all = await getAccessibleCodexes(session.user.id);
  all.sort((a, b) => new Date(b.updatedAt as any).getTime() - new Date(a.updatedAt as any).getTime());
  const owned = all.filter((c) => c.userId === session.user.id);
  const shared = all.filter((c) => c.userId !== session.user.id);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 relative overflow-hidden flex flex-col">
      <CelestialBackground />
      
      {/* Header */}
      <header className="sticky top-0 z-20 w-full px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-display font-black text-xl tracking-[0.4em] text-[var(--color-gold)] uppercase flex items-center gap-3 drop-shadow-[0_0_10px_rgba(232,208,141,0.3)]">
            <div className="w-6 h-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45">
              <div className="w-2 h-2 bg-[var(--color-gold)]" />
            </div>
            E P O S
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/trash" className="font-display text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" /> Sampah
            </Link>
            <ThemeToggle />
            <div className="flex items-center gap-4">
              <div className="font-display text-[10px] text-[var(--color-text-muted)] tracking-widest uppercase border border-[var(--color-border)] px-4 py-1.5 bg-[var(--color-surface)]">
                {session.user.name || "Penulis"}
              </div>
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button type="submit" className="font-display font-bold text-[9px] tracking-[0.2em] text-[var(--color-crimson)] hover:text-red-400 uppercase transition-colors">
                  Segel
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent opacity-50" />
            <h1 className="font-display font-black text-4xl text-[var(--color-text)] mb-3 tracking-widest uppercase">
              Perpustakaan EPOS
            </h1>
            <p className="font-body text-xl italic text-[var(--color-text-muted)] tracking-wide">
              Koleksi kitab-kitab semesta yang telah Anda rajut.
            </p>
          </div>
          <Link
            href="/codex/new"
            className="relative px-10 py-4 tome-border overflow-hidden group flex items-center justify-center gap-4 rounded-full"
          >
            <div className="relative z-10 w-6 h-6 border border-[var(--color-gold-muted)] rounded-full flex items-center justify-center rotate-45 group-hover:rotate-180 transition-transform duration-700 bg-[var(--color-bg)]">
              <Plus className="w-3 h-3 text-[var(--color-gold)] -rotate-45 group-hover:-rotate-180 transition-transform duration-700" />
            </div>
            <span className="relative z-10 text-[var(--color-gold)] font-display text-xs font-bold tracking-[0.2em] uppercase drop-shadow-md">
              Pahat Kitab Baru
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-muted)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-0" />
          </Link>
        </div>

        {all.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 border border-[var(--color-border)] bg-[var(--color-surface)]/30">
            <h3 className="font-display font-bold text-2xl text-[var(--color-gold)] mb-4 tracking-widest uppercase">
              Rak Masih Kosong
            </h3>
            <p className="font-body text-xl text-[var(--color-text-muted)] max-w-lg text-center mb-10 italic">
              Debu menyelimuti rak ini. Mulailah mengumpulkan lore, karakter, dan lokasi dengan memahat kitab pertama Anda.
            </p>
            <Link
              href="/codex/new"
              className="px-8 py-3 border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] text-[var(--color-gold)] font-display text-xs tracking-widest uppercase transition-colors"
            >
              Pahat Sekarang
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {owned.map((codex) => (
                <CodexCard key={codex.id} codex={codex} />
              ))}
            </div>
            {shared.length > 0 && (
              <>
                <h2 className="mt-16 mb-6 font-display text-xs tracking-[0.3em] uppercase text-[var(--color-gold-muted)]">Dibagikan kepadamu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {shared.map((codex) => (
                    <CodexCard key={codex.id} codex={codex} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
