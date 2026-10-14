import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { entries, codexes, entryRelations, entryVersions } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, and, or, sql, isNull } from "drizzle-orm";
import { entryPatchSchema, formatZodError } from "../../../../lib/validators";
import { sanitizeHtml } from "../../../../lib/sanitize";
import { requireCanRead, requireCanWrite } from "../../../../lib/collab";

export async function GET(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [entry] = await db.select().from(entries).where(eq(entries.id, params.entryId)).limit(1);
    if (!entry) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
    const chk = await requireCanRead(entry.codexId, session.user.id);
    if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });
    if (entry.deletedAt && chk.acc.role !== "owner" && entry.userId !== session.user.id) {
      // allow owner/editor to view trashed via includeDeleted flow; regular GET hides trash
    }

    const relations = await db
      .select()
      .from(entryRelations)
      .where(or(eq(entryRelations.sourceEntryId, entry.id), eq(entryRelations.targetEntryId, entry.id)));

    return NextResponse.json({ entry, relations });
  } catch (error) {
    console.error("GET Entry detail error:", error);
    return NextResponse.json({ error: "Gagal mengambil detail entri" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Support restore (?restore=1)
    const { searchParams } = new URL(req.url);
    const isRestore = searchParams.get("restore") === "1";
    const [existing] = await db.select().from(entries).where(eq(entries.id, params.entryId)).limit(1);
    if (!existing) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
    if (isRestore) {
      if (!existing.deletedAt) return NextResponse.json({ error: "Entri tidak di trash" }, { status: 400 });
      const chkR = await requireCanWrite(existing.codexId, session.user.id);
      if (!chkR.ok) return NextResponse.json({ error: chkR.error }, { status: chkR.status });
      const [restored] = await db.update(entries).set({ deletedAt: null, updatedAt: new Date() } as any).where(eq(entries.id, params.entryId)).returning();
      await db.update(codexes).set({ entryCount: sql`${codexes.entryCount} + 1` }).where(eq(codexes.id, existing.codexId));
      return NextResponse.json(restored);
    }

    const body = await req.json();
    const parsed = entryPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const chk = await requireCanWrite(existing.codexId, session.user.id);
    if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });
    if (existing.deletedAt) return NextResponse.json({ error: "Entri di trash, restore dulu" }, { status: 400 });

    // Sanitize content if present
    const patch: Record<string, unknown> = { ...parsed.data };
    if (typeof patch.content === "string") {
      patch.content = sanitizeHtml(patch.content);
    }

    // M4: save version before mutate (keep last 50 versions per entry)
    const [{ maxNum }] = await db.select({ maxNum: sql<number>`coalesce(max(${entryVersions.versionNumber}), 0)` }).from(entryVersions).where(eq(entryVersions.entryId, params.entryId));
    const nextNum = (maxNum || 0) + 1;
    try {
      await db.insert(entryVersions).values({
        entryId: existing.id,
        codexId: existing.codexId,
        userId: session.user.id,
        versionNumber: nextNum,
        title: existing.title,
        summary: existing.summary,
        content: existing.content,
        tags: existing.tags,
        metadata: existing.metadata,
      });
    } catch {}

    const [updated] = await db
      .update(entries)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(entries.id, params.entryId))
      .returning();

    if (!updated) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH Entry error:", error);
    return NextResponse.json({ error: "Gagal mengupdate entri" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [existing] = await db.select().from(entries).where(eq(entries.id, params.entryId)).limit(1);
    if (!existing) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
    const chk = await requireCanWrite(existing.codexId, session.user.id);
    if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });
    if (existing.deletedAt) return NextResponse.json({ error: "Sudah di trash" }, { status: 400 });

    const { searchParams } = new URL(req.url);
    const hard = searchParams.get("hard") === "1";
    if (hard) {
      if (!existing.deletedAt) return NextResponse.json({ error: "Harus soft-delete dulu" }, { status: 400 });
      const [deleted] = await db.delete(entries).where(eq(entries.id, params.entryId)).returning();
      return NextResponse.json({ success: true, hard: true });
    }

    const [soft] = await db.update(entries).set({ deletedAt: new Date(), updatedAt: new Date() } as any).where(eq(entries.id, params.entryId)).returning();
    if (!soft) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
    await db.update(codexes).set({ entryCount: sql`${codexes.entryCount} - 1` }).where(eq(codexes.id, existing.codexId));
    return NextResponse.json({ success: true, soft: true });
  } catch (error) {
    console.error("DELETE Entry error:", error);
    return NextResponse.json({ error: "Gagal menghapus entri" }, { status: 500 });
  }
}
