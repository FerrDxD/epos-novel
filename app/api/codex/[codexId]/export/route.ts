import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { entries } from "../../../../../lib/db/schema";
import { auth } from "../../../../../lib/auth";
import { eq, isNull, and } from "drizzle-orm";
import { requireCanRead, getCodexAccess } from "../../../../../lib/collab";

export async function GET(req: Request, { params }: { params: { codexId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const chk = await requireCanRead(params.codexId, session.user.id);
  if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });
  const codex = chk.acc.codex;

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "json"; // json | pdf (pdf = html printable for now)
  const category = searchParams.get("category");

  let rows = await db.select().from(entries).where(eq(entries.codexId, params.codexId));
  // exclude soft-deleted by default (unless ?includeDeleted=1)
  const includeDeleted = searchParams.get("includeDeleted") === "1";
  if (!includeDeleted) rows = rows.filter((r) => !r.deletedAt);
  if (category) rows = rows.filter((r) => r.category === category);

  if (format === "json") {
    const payload = {
      codex: { id: codex.id, title: codex.title, description: codex.description, genre: codex.genre, coverColor: codex.coverColor },
      exportedAt: new Date().toISOString(),
      entries: rows,
    };
    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"${slug(codex.title)}-epos.json\"`,
      },
    });
  }

  // printable HTML (user can Print -> Save as PDF; real PDF via puppeteer planned M6)
  const html = buildPrintableHtml(codex.title, codex.description || "", rows as any);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename=\"${slug(codex.title)}-epos.html\"`,
    },
  });
}

// POST /api/codex/[codexId]/export — import JSON backup
export async function POST(req: Request, { params }: { params: { codexId: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // import needs write
  const { requireCanWrite } = await import("../../../../../lib/collab");
  const chk = await requireCanWrite(params.codexId, session.user.id);
  if (!chk.ok) return NextResponse.json({ error: chk.error }, { status: chk.status });

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON" }, { status: 400 });
  }
  const list = Array.isArray(payload.entries) ? payload.entries : Array.isArray(payload) ? payload : null;
  if (!list) return NextResponse.json({ error: "Format JSON tidak valid: butuh { entries: [] } atau []" }, { status: 400 });

  const allowedCats = new Set(["characters", "locations", "factions", "events", "concepts", "monsters"]);
  const toInsert = list
    .filter((e: any) => e && typeof e.title === "string" && e.title.trim() && allowedCats.has(e.category))
    .slice(0, 200)
    .map((e: any) => ({
      codexId: params.codexId,
      userId: session.user.id!,
      category: e.category,
      title: String(e.title).slice(0, 150),
      summary: String(e.summary || "").slice(0, 500),
      content: String(e.content || "").slice(0, 100000),
      tags: Array.isArray(e.tags) ? e.tags.slice(0, 20).map((t: unknown) => String(t).slice(0, 30)) : [],
      metadata: e.metadata && typeof e.metadata === "object" ? e.metadata : {},
    }));

  if (toInsert.length === 0) return NextResponse.json({ error: "Tidak ada entri valid untuk diimport" }, { status: 400 });

  const inserted = await db.insert(entries).values(toInsert as any).returning();
  const { codexes } = await import("../../../../../lib/db/schema");
  const { eq: eq2, sql } = await import("drizzle-orm");
  await db.update(codexes).set({ entryCount: sql`${codexes.entryCount} + ${inserted.length}` }).where(eq2(codexes.id, params.codexId));
  return NextResponse.json({ inserted: inserted.length, entries: inserted });
}

function slug(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "codex"; }

function esc(s: string) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function buildPrintableHtml(title: string, desc: string, rows: { title: string; category: string; summary: string | null; content: string | null; tags: string[]; metadata: unknown }[]) {
  const groups: Record<string, typeof rows> = {};
  for (const r of rows) (groups[r.category] ||= []).push(r);
  const order = ["characters", "locations", "factions", "events", "concepts", "monsters"];
  const sections = order.filter((k) => groups[k]?.length).map((cat) => {
    const items = groups[cat]!.map((e) => `
      <article style="break-inside: avoid; border: 1px solid #e5d5b5; padding: 16px; margin: 12px 0; background: #fffcf5;">
        <h3 style="margin: 0 0 6px; font-family: serif; color: #7B2FBE;">${esc(e.title)}</h3>
        ${e.summary ? `<p style="font-style: italic; color: #6b6b6b;">${esc(e.summary)}</p>` : ""}
        ${e.tags?.length ? `<p style="font-size: 11px; color: #9a8a6a;">${e.tags.map(esc).join(" · ")}</p>` : ""}
        ${e.content ? `<div style="margin-top: 10px; font-size: 14px; line-height: 1.6;">${e.content.slice(0, 4000)}</div>` : ""}
      </article>`).join("");
    return `<section><h2 style="font-family: serif; text-transform: uppercase; letter-spacing: 0.15em; border-bottom: 2px solid #7B2FBE; padding-bottom: 6px;">${esc(cat)}</h2>${items}</section>`;
  }).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)} — EPOS Kitab</title><style>@media print{body{margin: 24px}}</style></head><body style="font-family: Georgia, serif; max-width: 860px; margin: 32px auto; color: #1a1a1a;">
<header style="text-align: center; border-bottom: 3px double #7B2FBE; padding-bottom: 16px; margin-bottom: 24px;"><h1 style="margin: 0; font-size: 36px; letter-spacing: 0.2em; text-transform: uppercase;">${esc(title)}</h1>${desc ? `<p style="font-style: italic; color: #6b6b6b;">${esc(desc)}</p>` : ""}<p style="font-size: 11px; color: #9a8a6a;">Diekspor dari EPOS — ${new Date().toLocaleString("id-ID")}</p></header>
${sections || "<p>Tidak ada entri.</p>"}
<footer style="margin-top: 32px; text-align: center; font-size: 11px; color: #9a8a6a; border-top: 1px solid #e5d5b5; padding-top: 12px;">EPOS — Kitab Semesta untuk Arsitek Dunia Fiksi</footer>
</body></html>`;
}
