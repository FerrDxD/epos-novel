import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { entries, entryRelations } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and } from "drizzle-orm";
import { relationCreateSchema, formatZodError } from "../../../lib/validators";
import { checkRateLimit } from "../../../lib/rate-limit";
import { requireCanWrite, getCodexAccess } from "../../../lib/collab";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rl = checkRateLimit(`relation:create:${session.user.id}`, 60, 60 * 1000);
    if (!rl.success) {
      const retryAfter = Math.ceil(rl.resetMs / 1000);
      return NextResponse.json({ error: `Rate limit. Coba lagi dalam ${retryAfter} detik.` }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
    }

    const body = await req.json();
    const parsed = relationCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { codexId, sourceEntryId, targetEntryId, relationLabel } = parsed.data;

    if (sourceEntryId === targetEntryId) {
      return NextResponse.json({ error: "Entri tidak bisa berelasi dengan dirinya sendiri" }, { status: 400 });
    }

    const chkW = await requireCanWrite(codexId, session.user.id);
    if (!chkW.ok) return NextResponse.json({ error: chkW.error }, { status: chkW.status });

    // Both entries must be in the same codex
    const [src, tgt] = await Promise.all([
      db.select({ id: entries.id, codexId: entries.codexId }).from(entries).where(eq(entries.id, sourceEntryId)).limit(1),
      db.select({ id: entries.id, codexId: entries.codexId }).from(entries).where(eq(entries.id, targetEntryId)).limit(1),
    ]);
    if (!src[0] || !tgt[0]) return NextResponse.json({ error: "Entri tidak ditemukan" }, { status: 404 });
    if (src[0].codexId !== codexId || tgt[0].codexId !== codexId) {
      return NextResponse.json({ error: "Kedua entri harus dalam codex yang sama" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(entryRelations)
      .where(
        and(
          eq(entryRelations.codexId, codexId),
          eq(entryRelations.sourceEntryId, sourceEntryId),
          eq(entryRelations.targetEntryId, targetEntryId),
          eq(entryRelations.relationLabel, relationLabel)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: "Relasi ini sudah ada" }, { status: 400 });
    }

    const [newRelation] = await db
      .insert(entryRelations)
      .values({ codexId, sourceEntryId, targetEntryId, relationLabel })
      .returning();

    return NextResponse.json(newRelation, { status: 201 });
  } catch (error) {
    console.error("POST Relation error:", error);
    return NextResponse.json({ error: "Gagal membuat relasi" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { relationId } = body;
    if (!relationId) return NextResponse.json({ error: "relationId is required" }, { status: 400 });

    // Must have write access to the relation's codex
    const [row] = await db.select().from(entryRelations).where(eq(entryRelations.id, relationId)).limit(1);
    if (!row) return NextResponse.json({ error: "Relasi tidak ditemukan" }, { status: 404 });

    const chkW = await requireCanWrite(row.codexId, session.user.id);
    if (!chkW.ok) return NextResponse.json({ error: chkW.error }, { status: chkW.status });

    const [deleted] = await db.delete(entryRelations).where(eq(entryRelations.id, relationId)).returning();
    if (!deleted) return NextResponse.json({ error: "Relasi tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Relation error:", error);
    return NextResponse.json({ error: "Gagal menghapus relasi" }, { status: 500 });
  }
}
