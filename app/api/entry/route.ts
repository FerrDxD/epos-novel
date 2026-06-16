import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { entries, codexes } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { generateEntrySummary } from "../../../lib/gemini";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const codexId = searchParams.get("codexId");
    const category = searchParams.get("category");

    if (!codexId) return NextResponse.json({ error: "codexId is required" }, { status: 400 });

    const conditions = [eq(entries.codexId, codexId), eq(entries.userId, session.user.id)];
    if (category) conditions.push(eq(entries.category, category));

    const results = await db
      .select()
      .from(entries)
      .where(and(...conditions));

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET Entry error:", error);
    return NextResponse.json({ error: "Gagal mengambil entri" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    let { codexId, category, title, summary, content, tags, metadata } = body;

    if (!codexId || !category || !title) {
      return NextResponse.json({ error: "codexId, category, dan title wajib diisi" }, { status: 400 });
    }

    if (!summary) {
      summary = await generateEntrySummary({ title, content }, category);
    }

    const [newEntry] = await db
      .insert(entries)
      .values({
        codexId,
        userId: session.user.id,
        category,
        title,
        summary,
        content,
        tags: tags || [],
        metadata: metadata || {},
      })
      .returning();

    // Increment entryCount di codexes
    await db
      .update(codexes)
      .set({ entryCount: sql`${codexes.entryCount} + 1` })
      .where(eq(codexes.id, codexId));

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("POST Entry error:", error);
    return NextResponse.json({ error: "Gagal membuat entri" }, { status: 500 });
  }
}
