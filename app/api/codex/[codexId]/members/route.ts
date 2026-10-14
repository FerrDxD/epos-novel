import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { codexes, codexMembers, users } from "../../../../../lib/db/schema";
import { auth } from "../../../../../lib/auth";
import { eq, and } from "drizzle-orm";
import { shareInviteSchema, shareRoleSchema, formatZodError } from "../../../../../lib/validators";
import { getCodexAccess } from "../../../../../lib/collab";
import { checkRateLimit } from "../../../../../lib/rate-limit";

export async function GET(_req: Request, { params }: { params: { codexId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const acc = await getCodexAccess(params.codexId, session.user.id);
  if (!acc) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });
  if (!acc.canRead) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const members = await db.select().from(codexMembers).where(eq(codexMembers.codexId, params.codexId));
  // enrich with user info
  const enriched = await Promise.all(members.map(async (m) => {
    const [u] = await db.select({ id: users.id, name: users.name, email: users.email, image: users.image, username: users.username }).from(users).where(eq(users.id, m.userId)).limit(1);
    return { ...m, user: u || null };
  }));
  const [owner] = await db.select({ id: users.id, name: users.name, email: users.email, image: users.image, username: users.username }).from(users).where(eq(users.id, acc.codex.userId)).limit(1);
  return NextResponse.json({ owner, members: enriched, codex: acc.codex });
}

export async function POST(req: Request, { params }: { params: { codexId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const acc = await getCodexAccess(params.codexId, session.user.id);
  if (!acc) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });
  if (!acc.isOwner) return NextResponse.json({ error: "Hanya owner yang bisa undang kolaborator" }, { status: 403 });

  const rl = checkRateLimit(`share:invite:${session.user.id}`, 20, 60 * 60 * 1000);
  if (!rl.success) return NextResponse.json({ error: "Terlalu banyak undangan" }, { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } });

  const body = await req.json().catch(() => ({}));
  const parsed = shareInviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  const { email, role } = parsed.data;

  const [targetUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!targetUser) return NextResponse.json({ error: "User dengan email tersebut tidak ditemukan. Minta mereka daftar dulu." }, { status: 404 });
  if (targetUser.id === acc.codex.userId) return NextResponse.json({ error: "Tidak bisa undang diri sendiri (sudah owner)" }, { status: 400 });

  // upsert
  const [existing] = await db.select().from(codexMembers).where(and(eq(codexMembers.codexId, params.codexId), eq(codexMembers.userId, targetUser.id))).limit(1);
  if (existing) {
    const [updated] = await db.update(codexMembers).set({ role: role as any }).where(eq(codexMembers.id, existing.id)).returning();
    return NextResponse.json(updated);
  }
  const [created] = await db.insert(codexMembers).values({ codexId: params.codexId, userId: targetUser.id, role: role as any }).returning();
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: { codexId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const acc = await getCodexAccess(params.codexId, session.user.id);
  if (!acc) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });
  if (!acc.isOwner) return NextResponse.json({ error: "Hanya owner yang bisa ubah role" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const parsed = shareRoleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  const [updated] = await db.update(codexMembers).set({ role: parsed.data.role as any }).where(and(eq(codexMembers.codexId, params.codexId), eq(codexMembers.userId, parsed.data.userId))).returning();
  if (!updated) return NextResponse.json({ error: "Member tidak ditemukan" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { codexId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const acc = await getCodexAccess(params.codexId, session.user.id);
  if (!acc) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const { userId } = body as { userId?: string };
  if (!userId) return NextResponse.json({ error: "userId wajib" }, { status: 400 });
  // owner can remove anyone, member can leave themselves
  const isSelf = userId === session.user.id;
  if (!acc.isOwner && !isSelf) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const [deleted] = await db.delete(codexMembers).where(and(eq(codexMembers.codexId, params.codexId), eq(codexMembers.userId, userId))).returning();
  if (!deleted) return NextResponse.json({ error: "Member tidak ditemukan" }, { status: 404 });
  return NextResponse.json({ success: true });
}
