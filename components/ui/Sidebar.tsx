import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import SidebarNav from "./SidebarNav";
import { db } from "../../lib/db";
import { entries } from "../../lib/db/schema";
import { eq } from "drizzle-orm";
import { auth, signOut } from "../../lib/auth";
import { BookOpen } from "lucide-react";

export default async function Sidebar({
  codexId,
  codexTitle,
}: {
  codexId: string;
  codexTitle: string;
}) {
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
    <aside className="h-screen sticky top-0 flex flex-col bg-[var(--color-bg)] border-r border-[var(--color-border)] py-7 px-5">
      {/* App Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 justify-center mb-8 group">
        <div className="w-6 h-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45 transition-transform group-hover:rotate-90 duration-500 bg-[var(--color-surface)]">
          <div className="w-1.5 h-1.5 bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
        </div>
        <span className="font-display font-black text-xl tracking-[0.3em] text-[var(--color-gold)] uppercase group-hover:glow-gold transition-all">
          E P O S
        </span>
      </Link>

      <div className="w-full flex justify-center mb-6 opacity-40">
        <div className="ornate-divider-h w-full" />
      </div>

      {/* Codex Title Badge */}
      <div className="mb-6 text-center px-2">
        <span className="font-mono text-xs text-[var(--color-gold-muted)] uppercase tracking-[0.25em] block mb-2 opacity-80">
          Kitab Terbuka
        </span>
        <Link
          href={`/codex/${codexId}`}
          className="font-display font-bold text-base text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors block leading-snug tracking-wide uppercase line-clamp-2"
        >
          {codexTitle}
        </Link>
      </div>

      <div className="w-full flex justify-center mb-6 opacity-40">
        <div className="ornate-divider-h w-2/3" />
      </div>

      {/* Sidebar Nav Links */}
      <SidebarNav
        codexId={codexId}
        counts={counts}
        allEntriesLength={allEntries.length}
      />

      <div className="w-full flex justify-center my-6 opacity-40">
        <div className="ornate-divider-h w-full" />
      </div>

      {/* Footer / User / Theme */}
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="font-mono text-xs tracking-widest text-[var(--color-text-muted)] uppercase">
            Lentera
          </span>
          <ThemeToggle />
        </div>

        <div className="flex items-center justify-between border border-[var(--color-border)] p-3 bg-[var(--color-surface)] rounded-sm">
          <span className="font-display text-xs font-bold text-[var(--color-text)] tracking-wider uppercase truncate px-1">
            {session?.user?.name || "Penulis"}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button
              type="submit"
              className="font-display font-bold text-xs tracking-[0.2em] text-[var(--color-crimson)] hover:text-red-400 uppercase transition-colors px-2 py-1"
            >
              Segel
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
