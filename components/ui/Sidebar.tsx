import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SidebarNav from "./SidebarNav";
import { db } from "../../lib/db";
import { entries } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { auth, signOut } from "../../lib/auth";

const CATEGORY_LINKS = [
  { key: "characters", label: "Tokoh Utama" },
  { key: "locations", label: "Peta Geografis" },
  { key: "factions", label: "Bendera Faksi" },
  { key: "events", label: "Kronik Waktu" },
  { key: "concepts", label: "Hukum Semesta" },
  { key: "monsters", label: "Bestiary" },
];

export default async function Sidebar({ codexId, codexTitle }: { codexId: string, codexTitle: string }) {
  const session = await auth();
  
  const allEntries = await db
    .select({ category: entries.category })
    .from(entries)
    .where(eq(entries.codexId, codexId));
  
  const counts = allEntries.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <aside className="h-screen sticky top-0 flex flex-col bg-[var(--color-bg)] border-r border-[var(--color-border)] py-8 px-6">
      {/* App Logo */}
      <Link href="/dashboard" className="flex items-center justify-center mb-10 group">
        <span className="font-display font-black text-2xl tracking-[0.3em] text-[var(--color-gold)] uppercase group-hover:glow-gold transition-all">
          E P O S
        </span>
      </Link>

      <div className="w-full flex justify-center mb-8 opacity-50">
        <div className="ornate-divider-h w-full" />
      </div>

      {/* Codex Title */}
      <div className="mb-6 text-center">
        <h2 className="font-mono text-[9px] text-[var(--color-text-muted)] uppercase tracking-[0.3em] mb-3">
          Kitab Terbuka
        </h2>
        <Link href={`/codex/${codexId}`} className="font-display font-bold text-lg text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors block leading-tight tracking-wide">
          {codexTitle}
        </Link>
      </div>

      <div className="w-full flex justify-center mb-8 opacity-50">
        <div className="ornate-divider-h w-2/3" />
      </div>

      <SidebarNav codexId={codexId} counts={counts} allEntriesLength={allEntries.length} />

      <div className="w-full flex justify-center my-6 opacity-50">
        <div className="ornate-divider-h w-full" />
      </div>

      {/* Footer / User */}
      <div className="mt-auto flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <span className="font-mono text-[9px] tracking-widest text-[var(--color-text-muted)] uppercase">Lentera</span>
          <ThemeToggle />
        </div>
        
        <div className="flex items-center justify-between border border-[var(--color-border)] p-3 bg-[var(--color-surface)]">
          <span className="font-display text-xs font-bold text-[var(--color-text)] tracking-widest uppercase truncate px-2">
            {session?.user?.name || "Penulis"}
          </span>
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <button type="submit" className="font-display font-bold text-[9px] tracking-[0.2em] text-[var(--color-crimson)] hover:text-red-400 uppercase transition-colors px-2">
              Segel
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
