import { db } from "./db";
import { codexes, codexMembers } from "./db/schema";
import { eq, and, or, inArray } from "drizzle-orm";

export type MemberRole = "owner" | "editor" | "viewer";

export async function getCodexAccess(codexId: string, userId: string) {
  const [codex] = await db.select().from(codexes).where(eq(codexes.id, codexId)).limit(1);
  if (!codex) return null;
  // soft-deleted codex is invisible unless restore flow
  if (codex.deletedAt) return { codex, role: null as MemberRole | null, isOwner: false, canRead: false, canWrite: false, isDeleted: true } as const;
  if (codex.userId === userId) {
    return { codex, role: "owner" as MemberRole, isOwner: true, canRead: true, canWrite: true, isDeleted: false } as const;
  }
  const [member] = await db.select().from(codexMembers).where(and(eq(codexMembers.codexId, codexId), eq(codexMembers.userId, userId))).limit(1);
  if (!member) return { codex, role: null as MemberRole | null, isOwner: false, canRead: false, canWrite: false, isDeleted: false } as const;
  const role = member.role as MemberRole;
  return {
    codex,
    role,
    isOwner: false,
    canRead: true,
    canWrite: role === "editor" || role === "owner",
    isDeleted: false,
  } as const;
}

export async function requireCanRead(codexId: string, userId: string) {
  const acc = await getCodexAccess(codexId, userId);
  if (!acc) return { ok: false as const, status: 404, error: "Codex tidak ditemukan" };
  if (!acc.canRead) return { ok: false as const, status: 403, error: "Forbidden: tidak punya akses ke kitab ini" };
  return { ok: true as const, acc };
}

export async function requireCanWrite(codexId: string, userId: string) {
  const acc = await getCodexAccess(codexId, userId);
  if (!acc) return { ok: false as const, status: 404, error: "Codex tidak ditemukan" };
  if (!acc.canWrite) return { ok: false as const, status: 403, error: "Forbidden: butuh role editor/owner" };
  return { ok: true as const, acc };
}

export async function getAccessibleCodexes(userId: string) {
  const owned = await db.select().from(codexes).where(and(eq(codexes.userId, userId)));
  // filter deleted
  const ownedVisible = owned.filter((c) => !c.deletedAt);
  const memberships = await db.select().from(codexMembers).where(eq(codexMembers.userId, userId));
  if (memberships.length === 0) return ownedVisible;
  const memberCodexIds = memberships.map((m) => m.codexId);
  const shared = await db.select().from(codexes).where(inArray(codexes.id, memberCodexIds));
  const sharedVisible = shared.filter((c) => !c.deletedAt);
  // dedup (in case owner also member — shouldn't happen due to unique)
  const map = new Map<string, (typeof ownedVisible)[number]>();
  for (const c of [...ownedVisible, ...sharedVisible]) map.set(c.id, c);
  return Array.from(map.values());
}
