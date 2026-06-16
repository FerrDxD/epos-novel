import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { entryRelations } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { codexId, sourceEntryId, targetEntryId, relationLabel } = body;

    if (!codexId || !sourceEntryId || !targetEntryId || !relationLabel) {
      return NextResponse.json({ error: "Semua field relasi wajib diisi" }, { status: 400 });
    }

    if (sourceEntryId === targetEntryId) {
      return NextResponse.json({ error: "Entri tidak bisa berelasi dengan dirinya sendiri" }, { status: 400 });
    }

    // Cek duplikat
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
      .values({
        codexId,
        sourceEntryId,
        targetEntryId,
        relationLabel,
      })
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

    const [deleted] = await db
      .delete(entryRelations)
      .where(eq(entryRelations.id, relationId))
      .returning();

    if (!deleted) return NextResponse.json({ error: "Relasi tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Relation error:", error);
    return NextResponse.json({ error: "Gagal menghapus relasi" }, { status: 500 });
  }
}
