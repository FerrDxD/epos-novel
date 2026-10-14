import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { codexes, entries, entryRelations } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, and } from "drizzle-orm";
import { codexPatchSchema, formatZodError } from "../../../../lib/validators";

export async function GET(
  req: Request,
  { params }: { params: { codexId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { codexId } = params;

    const [codex] = await db
      .select()
      .from(codexes)
      .where(and(eq(codexes.id, codexId), eq(codexes.userId, session.user.id)))
      .limit(1);

    if (!codex) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });

    const codexEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.codexId, codexId));

    const relations = await db
      .select()
      .from(entryRelations)
      .where(eq(entryRelations.codexId, codexId));

    return NextResponse.json({ codex, entries: codexEntries, relations });
  } catch (error) {
    console.error("GET Codex detail error:", error);
    return NextResponse.json({ error: "Gagal mengambil detail codex" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { codexId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = codexPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const patch = parsed.data;
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Tidak ada field untuk diupdate" }, { status: 400 });
    }

    const [updatedCodex] = await db
      .update(codexes)
      .set({ ...patch, updatedAt: new Date() })
      .where(and(eq(codexes.id, params.codexId), eq(codexes.userId, session.user.id)))
      .returning();

    if (!updatedCodex) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });

    return NextResponse.json(updatedCodex);
  } catch (error) {
    console.error("PATCH Codex error:", error);
    return NextResponse.json({ error: "Gagal mengupdate codex" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { codexId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { codexId } = params;

    const [deletedCodex] = await db
      .delete(codexes)
      .where(and(eq(codexes.id, codexId), eq(codexes.userId, session.user.id)))
      .returning();

    if (!deletedCodex) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Codex error:", error);
    return NextResponse.json({ error: "Gagal menghapus codex" }, { status: 500 });
  }
}
