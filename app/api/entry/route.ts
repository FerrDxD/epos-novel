import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { entries, codexes } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { generateEntrySummary } from "../../../lib/gemini";
import { entryCreateSchema, categoryEnum, formatZodError } from "../../../lib/validators";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const codexId = searchParams.get("codexId");
    const category = searchParams.get("category");

    if (!codexId) return NextResponse.json({ error: "codexId is required" }, { status: 400 });

    // Validate category if provided
    if (category) {
      const catParsed = categoryEnum.safeParse(category);
      if (!catParsed.success) return NextResponse.json({ error: formatZodError(catParsed.error) }, { status: 400 });
    }

    const conditions = [eq(entries.codexId, codexId), eq(entries.userId, session.user.id)];
    if (category) conditions.push(eq(entries.category, category as any));

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
    const parsed = entryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    let { codexId, category, title, summary, content, tags, metadata } = parsed.data;

    if (!summary) {
      summary = await generateEntrySummary({ title, content: content || "" }, category);
    }

    const [newEntry] = await db
      .insert(entries)
      .values({
        codexId,
        userId: session.user.id,
        category,
        title,
        summary: summary || "",
        content: content || "",
        tags: tags || [],
        metadata: metadata || {},
      })
      .returning();

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
