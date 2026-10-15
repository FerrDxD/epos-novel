import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { importLogs } from "../../../../lib/db/schema";
import { auth } from "../../../../lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [row] = await db.select().from(importLogs).where(and(eq(importLogs.id, params.id), eq(importLogs.userId, session.user.id))).limit(1);
  if (!row) return NextResponse.json({ error: "Import tidak ditemukan" }, { status: 404 });
  return NextResponse.json(row);
}

// Background worker: POST with { importLogId } to process (called internally after upload or via polling fallback)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // This endpoint is the polling/completion hook — real processing happens inline in /api/import already.
  // Kept for M3 compat: clients can POST to trigger retry if status=failed.
  const [row] = await db.select().from(importLogs).where(and(eq(importLogs.id, params.id), eq(importLogs.userId, session.user.id))).limit(1);
  if (!row) return NextResponse.json({ error: "Import tidak ditemukan" }, { status: 404 });
  return NextResponse.json(row);
}
