import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { codexes, entries, entryRelations } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, and, isNull } from "drizzle-orm";
import { codexPatchSchema, formatZodError } from "../../../../lib/validators";
import { getCodexAccess, requireCanRead, requireCanWrite } from "../../../../lib/collab";

export async function GET(
  req: Request,
  { params }: { params: { codexId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { codexId } = params;

    const chk = await requireCanRead(codexId, session.user.id);
    if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });
    const codex = chk.acc.codex;
    const { searchParams } = new URL(req.url);
    const includeDeleted = searchParams.get("includeDeleted") === "1";

    const codexEntries = await db
      .select()
      .from(entries)
      .where(includeDeleted ? eq(entries.codexId, codexId) : and(eq(entries.codexId, codexId), isNull(entries.deletedAt)));

    const relations = await db
      .select()
      .from(entryRelations)
      .where(eq(entryRelations.codexId, codexId));

    return NextResponse.json({ codex, entries: codexEntries, relations, role: chk.acc.role, isOwner: chk.acc.isOwner });
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

    // Support restore (?restore=1) from trash — only owner
    const { searchParams } = new URL(req.url);
    const isRestore = searchParams.get("restore") === "1";
    if (isRestore) {
      const chk2 = await getCodexAccess(params.codexId, session.user.id);
      if (!chk2 || !chk2.codex.deletedAt) return NextResponse.json({ error: "Codex tidak di trash" }, { status: 404 });
      if (chk2.codex.userId !== session.user.id) return NextResponse.json({ error: "Hanya owner bisa restore" }, { status: 403 });
      const [restored] = await db.update(codexes).set({ deletedAt: null, updatedAt: new Date() }).where(eq(codexes.id, params.codexId)).returning();
      return NextResponse.json(restored);
    }

    const chk = await requireCanWrite(params.codexId, session.user.id);
    if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });

    const [updatedCodex] = await db
      .update(codexes)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(codexes.id, params.codexId))
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
    const { searchParams } = new URL(req.url);
    const hard = searchParams.get("hard") === "1";

    const acc = await getCodexAccess(codexId, session.user.id);
    if (!acc) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });
    if (!acc.isOwner) return NextResponse.json({ error: "Hanya owner bisa hapus kitab" }, { status: 403 });

    if (hard) {
      // permanent delete — must be already soft-deleted
      if (!acc.codex.deletedAt) return NextResponse.json({ error: "Harus soft-delete dulu (hapus tanpa ?hard=1)" }, { status: 400 });
      const [deletedCodex] = await db.delete(codexes).where(eq(codexes.id, codexId)).returning();
      if (!deletedCodex) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });
      return NextResponse.json({ success: true, hard: true });
    }

    // soft delete
    const [soft] = await db.update(codexes).set({ deletedAt: new Date(), updatedAt: new Date() }).where(eq(codexes.id, codexId)).returning();
    if (!soft) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true, soft: true });
  } catch (error) {
    console.error("DELETE Codex error:", error);
    return NextResponse.json({ error: "Gagal menghapus codex" }, { status: 500 });
  }
}
