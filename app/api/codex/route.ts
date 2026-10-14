import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { codexes } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { desc } from "drizzle-orm";
import { codexCreateSchema, formatZodError } from "../../../lib/validators";
import { getAccessibleCodexes } from "../../../lib/collab";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCodexes = await getAccessibleCodexes(session.user.id);
    userCodexes.sort((a, b) => new Date(b.updatedAt as any).getTime() - new Date(a.updatedAt as any).getTime());

    return NextResponse.json(userCodexes);
  } catch (error) {
    console.error("GET Codex error:", error);
    return NextResponse.json({ error: "Gagal mengambil daftar codex" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = codexCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { title, description, genre, coverColor } = parsed.data;

    const [newCodex] = await db
      .insert(codexes)
      .values({
        userId: session.user.id,
        title,
        description: description ?? null,
        genre: genre ?? null,
        coverColor: coverColor || "#7B2FBE",
      })
      .returning();

    return NextResponse.json(newCodex, { status: 201 });
  } catch (error) {
    console.error("POST Codex error:", error);
    return NextResponse.json({ error: "Gagal membuat codex baru" }, { status: 500 });
  }
}
