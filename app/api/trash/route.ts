import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { codexes, entries, codexMembers } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, isNotNull, inArray } from "drizzle-orm";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ownedCodexes = await db.select().from(codexes).where(and(eq(codexes.userId, session.user.id), isNotNull(codexes.deletedAt)));
  const ownedCodexIds = ownedCodexes.map((c) => c.id);
  const memberships = await db.select({ codexId: codexMembers.codexId }).from(codexMembers).where(eq(codexMembers.userId, session.user.id));
  const memberCodexIds = memberships.map((m) => m.codexId);
  const allCodexIds = [...new Set([...ownedCodexIds, ...memberCodexIds])];
  let trashedEntries: any[] = [];
  if (allCodexIds.length) {
    trashedEntries = await db.select().from(entries).where(and(inArray(entries.codexId, allCodexIds), isNotNull(entries.deletedAt)));
  } else {
    trashedEntries = await db.select().from(entries).where(and(eq(entries.userId, session.user.id), isNotNull(entries.deletedAt)));
  }
  return NextResponse.json({ codexes: ownedCodexes, entries: trashedEntries });
}
