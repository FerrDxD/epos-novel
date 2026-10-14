import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { entries } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { checkLoreConsistency } from "../../../lib/gemini";
import { checkRateLimit } from "../../../lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rl = checkRateLimit(`consistency:${session.user.id}`, 10, 60 * 60 * 1000);
  if (!rl.success) {
    const retryAfter = Math.ceil(rl.resetMs / 1000);
    return NextResponse.json({ error: `Batas pengecekan tercapai. Coba lagi dalam ${Math.ceil(retryAfter / 60)} menit.` }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  }

  const body = await req.json().catch(() => ({}));
  const { codexId, entryIds } = body as { codexId?: string; entryIds?: string[] };
  if (!codexId) return NextResponse.json({ error: "codexId wajib" }, { status: 400 });

  // Fetch entries to check — cap at 30 to control cost
  const all = await db.select({ id: entries.id, title: entries.title, category: entries.category, summary: entries.summary, content: entries.content }).from(entries).where(and(eq(entries.codexId, codexId), eq(entries.userId, session.user.id))).limit(50);

  const picked = entryIds?.length
    ? all.filter((e) => entryIds.includes(e.id)).slice(0, 30)
    : all.slice(0, 30);

  if (picked.length < 2) return NextResponse.json({ error: "Butuh minimal 2 entri untuk cek konsistensi" }, { status: 400 });

  const loreJson = JSON.stringify(
    picked.map((e) => ({ id: e.id, title: e.title, category: e.category, summary: e.summary, content: (e.content || "").slice(0, 2000) }))
  );

  try {
    const findings = await checkLoreConsistency(loreJson);
    return NextResponse.json({ findings, checked: picked.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Gagal cek konsistensi" }, { status: 500 });
  }
}
