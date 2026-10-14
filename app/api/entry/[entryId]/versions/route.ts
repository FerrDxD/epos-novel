import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { entries, entryVersions } from "../../../../../lib/db/schema";
import { auth } from "../../../../../lib/auth";
import { eq, and, desc, sql } from "drizzle-orm";
import { entryVersionRestoreSchema, formatZodError } from "../../../../../lib/validators";
import { requireCanRead, requireCanWrite } from "../../../../../lib/collab";
import { sanitizeHtml } from "../../../../../lib/sanitize";

export async function GET(_req: Request, { params }: { params: { entryId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [entry] = await db.select().from(entries).where(eq(entries.id, params.entryId)).limit(1);
  if (!entry) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
  const chk = await requireCanRead(entry.codexId, session.user.id);
  if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });
  const versions = await db.select().from(entryVersions).where(eq(entryVersions.entryId, params.entryId)).orderBy(desc(entryVersions.versionNumber));
  return NextResponse.json(versions);
}

export async function POST(req: Request, { params }: { params: { entryId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [entry] = await db.select().from(entries).where(eq(entries.id, params.entryId)).limit(1);
  if (!entry) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
  const chk = await requireCanWrite(entry.codexId, session.user.id);
  if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });

  const body = await req.json().catch(() => ({}));
  const parsed = entryVersionRestoreSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });

  const [version] = await db.select().from(entryVersions).where(and(eq(entryVersions.id, parsed.data.versionId), eq(entryVersions.entryId, params.entryId))).limit(1);
  if (!version) return NextResponse.json({ error: "Versi tidak ditemukan" }, { status: 404 });

  // Save current as new version before restore (so not losing current)
  const [{ maxNum }] = await db.select({ maxNum: sql<number>`coalesce(max(${entryVersions.versionNumber}), 0)` }).from(entryVersions).where(eq(entryVersions.entryId, params.entryId));
  const nextNum = (maxNum || 0) + 1;
  await db.insert(entryVersions).values({
    entryId: entry.id,
    codexId: entry.codexId,
    userId: session.user.id,
    versionNumber: nextNum,
    title: entry.title,
    summary: entry.summary,
    content: entry.content,
    tags: entry.tags,
    metadata: entry.metadata,
  });

  const [restored] = await db
    .update(entries)
    .set({
      title: version.title,
      summary: version.summary,
      content: version.content ? sanitizeHtml(version.content) : version.content,
      tags: version.tags,
      metadata: version.metadata,
      updatedAt: new Date(),
    })
    .where(eq(entries.id, params.entryId))
    .returning();

  return NextResponse.json(restored);
}
