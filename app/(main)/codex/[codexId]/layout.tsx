import Sidebar from "../../../../components/ui/Sidebar";
import MobileNav from "../../../../components/ui/MobileNav";
import CommandPalette from "../../../../components/ui/CommandPalette";
import { db } from "../../../../lib/db";
import { codexes, entries } from "../../../../lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";

export default async function CodexLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { codexId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [codex] = await db
    .select()
    .from(codexes)
    .where(and(eq(codexes.id, params.codexId), eq(codexes.userId, session.user.id)))
    .limit(1);

  if (!codex) notFound();

  // Fetch all entries for Command Palette
  const allEntries = await db
    .select({ id: entries.id, title: entries.title, category: entries.category })
    .from(entries)
    .where(eq(entries.codexId, params.codexId));

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] flex-col md:flex-row">
      <CommandPalette codexId={codex.id} entries={allEntries} />
      
      {/* Desktop Sidebar */}
      <div className="w-64 shrink-0 hidden md:block border-r border-[var(--color-border)]">
        <Sidebar codexId={codex.id} codexTitle={codex.title} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-full overflow-x-hidden relative flex flex-col">
        {/* Mobile Navigation */}
        <MobileNav codexId={codex.id} codexTitle={codex.title} />
        
        {children}
      </div>
    </div>
  );
}
