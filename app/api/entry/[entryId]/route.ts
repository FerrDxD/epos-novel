import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { entries, codexes, entryRelations } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, and, or, sql } from "drizzle-orm";
import { entryPatchSchema, formatZodError } from "../../../../lib/validators";
import { sanitizeHtml } from "../../../../lib/sanitize";

export async function GET(
  req: Request,
  { params }: { params: { entryId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.id, params.entryId), eq(entries.userId, session.user.id)))
      .limit(1);

    if (!entry) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });

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

    const body = await req.json();
    const parsed = entryPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    // Sanitize content if present
    const patch: Record<string, unknown> = { ...parsed.data };
    if (typeof patch.content === "string") {
      patch.content = sanitizeHtml(patch.content);
    }

    const [updated] = await db
      .update(entries)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(entries.id, params.entryId), eq(entries.userId, session.user.id)))
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

    const [deleted] = await db
      .delete(entries)
      .where(and(eq(entries.id, params.entryId), eq(entries.userId, session.user.id)))
      .returning();

    if (!deleted) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });

    await db
      .update(codexes)
      .set({ entryCount: sql`${codexes.entryCount} - 1` })
      .where(eq(codexes.id, deleted.codexId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Entry error:", error);
    return NextResponse.json({ error: "Gagal menghapus entri" }, { status: 500 });
  }
}
