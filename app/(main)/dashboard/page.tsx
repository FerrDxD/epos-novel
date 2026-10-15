import { db } from "../../../lib/db";
import { codexes, codexMembers, users } from "../../../lib/db/schema";
import { auth, signOut } from "../../../lib/auth";
import { eq, isNull, inArray } from "drizzle-orm";
import Link from "next/link";
import CodexCard from "../../../components/codex/CodexCard";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import { Plus, Trash2, BookOpen } from "lucide-react";
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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300 relative overflow-hidden flex flex-col">
      <CelestialBackground />
      
      {/* Header Bar */}
      <header className="sticky top-0 z-30 w-full px-6 sm:px-10 py-5 border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3.5 group">
            <div className="w-7 h-7 flex items-center justify-center border border-[var(--color-gold)] rotate-45 transition-transform group-hover:rotate-90 duration-500 bg-[var(--color-surface)]">
              <div className="w-2 h-2 bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
            </div>
            <span className="font-display font-black text-xl tracking-[0.35em] text-[var(--color-gold)] uppercase">
              E P O S
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/trash" 
              className="font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kubah Sampah</span>
            </Link>

            <ThemeToggle />

            <div className="flex items-center gap-3 pl-2 border-l border-[var(--color-border)]">
              <div className="font-display text-xs text-[var(--color-text)] font-semibold tracking-wider uppercase border border-[var(--color-border)] px-3.5 py-1.5 bg-[var(--color-surface)] rounded-sm">
                {session.user.name || "Penulis"}
              </div>
              <form action={async () => {
                "use server";
                await signOut();
              }}>
                <button 
                  type="submit" 
                  className="font-display font-bold text-xs tracking-[0.2em] text-[var(--color-crimson)] hover:text-red-400 uppercase transition-colors px-2 py-1"
                >
                  Segel
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-14 flex-1 w-full z-10 relative">
        
        {/* Dashboard Title & CTA Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-14 gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent opacity-60" />
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[var(--color-text)] mb-2 tracking-widest uppercase">
              Perpustakaan Semesta
            </h1>
            <p className="font-body text-xl italic text-[var(--color-text-muted)] tracking-wide">
              Koleksi kitab-kitab suci yang telah Anda rajut di dalam keabadian.
            </p>
          </div>

          <Link
            href="/codex/new"
            className="relative px-8 py-4 tome-border rounded-full overflow-hidden group flex items-center justify-center gap-3.5 shadow-[0_0_20px_rgba(232,208,141,0.15)] hover:shadow-[0_0_30px_rgba(232,208,141,0.25)] hover:scale-[1.02] transition-all shrink-0"
          >
            <div className="relative z-10 w-5 h-5 border border-[var(--color-gold)] rounded-full flex items-center justify-center rotate-45 group-hover:rotate-180 transition-transform duration-500 bg-[var(--color-bg)]">
              <Plus className="w-3 h-3 text-[var(--color-gold)] -rotate-45 group-hover:-rotate-180 transition-transform duration-500" />
            </div>
            <span className="relative z-10 text-[var(--color-gold)] font-display text-xs font-bold tracking-[0.25em] uppercase">
              Pahat Kitab Baru
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-muted)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-0" />
          </Link>
        </div>

        {/* Empty State */}
        {all.length === 0 ? (
          <div className="tome-border rounded-xl p-12 sm:p-20 text-center bg-[var(--color-surface)]/90 shadow-2xl relative overflow-hidden">
            <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45 bg-[var(--color-bg)]">
              <BookOpen className="w-7 h-7 text-[var(--color-gold)] -rotate-45" />
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--color-text)] mb-3 tracking-widest uppercase">
              Rak Kitab Masih Lengang
            </h3>
            <p className="font-body text-xl text-[var(--color-text-muted)] max-w-lg mx-auto mb-10 italic leading-relaxed">
              Debu bintang menyelimuti lembaran kosong ini. Mulailah mengabadikan garis keturunan, faksi, dan hukum sihir dengan memahat semesta pertama Anda.
            </p>
            <Link
              href="/codex/new"
              className="inline-flex items-center gap-3 px-10 py-4 tome-border rounded-full font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] shadow-[0_0_20px_rgba(232,208,141,0.2)] hover:scale-105 transition-all"
            >
              <span>Mulai Memahat Sekarang</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
            </Link>
          </div>
        ) : (
          <>
            {/* Owned Codex Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {owned.map((codex) => (
                <CodexCard key={codex.id} codex={codex} />
              ))}
            </div>

            {/* Shared With You Section */}
            {shared.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2.5 h-2.5 bg-[var(--color-gold)] rotate-45 shadow-[0_0_8px_var(--color-gold)]" />
                  <h2 className="font-display text-sm tracking-[0.25em] uppercase text-[var(--color-gold)] font-bold">
                    Kitab yang Dibagikan kepada Anda
                  </h2>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--color-gold-muted)] to-transparent ml-4 opacity-40" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {shared.map((codex) => (
                    <CodexCard key={codex.id} codex={codex} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer watermark */}
      <footer className="w-full py-6 text-center z-10 relative border-t border-[var(--color-border)]/50">
        <span className="font-mono text-xs text-[var(--color-gold-muted)] tracking-widest uppercase opacity-60">
          EPOS • SISTEM MANAJEMEN DUNIA FIKSI TINGKAT LANJUT
        </span>
      </footer>
    </div>
  );
}
