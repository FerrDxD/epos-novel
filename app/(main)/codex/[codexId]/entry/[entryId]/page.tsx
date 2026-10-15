import { db } from "../../../../../../lib/db";
import { entries, entryRelations } from "../../../../../../lib/db/schema";
import { auth } from "../../../../../../lib/auth";
import { eq, or, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import { requireCanRead } from "../../../../../../lib/collab";
import EntryDetailView from "../../../../../../components/entry/EntryDetailView";

export default async function EntryDetailPage({
  params,
}: {
  params: { codexId: string; entryId: string };
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { codexId, entryId } = params;
  const chk = await requireCanRead(codexId, session.user.id);
  if (!chk.ok) redirect("/dashboard");
  const canWrite = chk.acc.canWrite;
  const codex = chk.acc.codex;

  // Fetch target entry
  const [entry] = await db
    .select()
    .from(entries)
    .where(and(eq(entries.id, entryId), eq(entries.codexId, codexId)))
    .limit(1);

  if (!entry) notFound();
  if (entry.deletedAt) notFound();

  // Fetch all relations involving this entry
  const relations = await db
    .select()
    .from(entryRelations)
    .where(
      and(
        eq(entryRelations.codexId, codexId),
        or(
          eq(entryRelations.sourceEntryId, entryId),
          eq(entryRelations.targetEntryId, entryId)
        )
      )
    );

  // Fetch all entries in codex for the dropdown in relations panel & auto-linking
  const allEntries = await db
    .select({
      id: entries.id,
      title: entries.title,
      category: entries.category,
    })
    .from(entries)
    .where(eq(entries.codexId, codexId));

  return (
    <EntryDetailView
      codexId={codexId}
      codexTitle={codex.title}
      entry={entry}
      relations={relations}
      allEntries={allEntries}
      canWrite={canWrite}
    />
  );
}
