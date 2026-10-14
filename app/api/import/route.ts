import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { codexes, importLogs, entries } from "../../../lib/db/schema";
import { auth } from "../../../lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { extractLoreFromText } from "../../../lib/gemini";
import { parseDocx } from "../../../lib/parsers/docx";
import { parsePdf } from "../../../lib/parsers/pdf";
import { parseMarkdown } from "../../../lib/parsers/markdown";
import { parseJson } from "../../../lib/parsers/json";
import { fetchGoogleDoc, fetchGoogleDrive } from "../../../lib/parsers/gdocs";
import { sanitizeHtml } from "../../../lib/sanitize";
import { checkRateLimit } from "../../../lib/rate-limit";

const ALLOWED_SOURCE_TYPES = ["docx", "pdf", "md", "json", "gdocs", "gdrive"] as const;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit: 5 imports per user per hour (generous for beta, tighten to 3/day at M5 paywall)
    const rl = checkRateLimit(`import:${session.user.id}`, 5, 60 * 60 * 1000);
    if (!rl.success) {
      const retryAfter = Math.ceil(rl.resetMs / 1000);
      return NextResponse.json(
        { error: `Batas import tercapai. Coba lagi dalam ${Math.ceil(retryAfter / 60)} menit.` },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const formData = await req.formData();
    const codexId = formData.get("codexId") as string;
    const sourceType = formData.get("sourceType") as string;
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    if (!codexId || !sourceType) {
      return NextResponse.json({ error: "codexId dan sourceType wajib diisi" }, { status: 400 });
    }
    if (!(ALLOWED_SOURCE_TYPES as readonly string[]).includes(sourceType)) {
      return NextResponse.json({ error: `sourceType harus salah satu: ${ALLOWED_SOURCE_TYPES.join(", ")}` }, { status: 400 });
    }

    // SSRF/host allowlist for URL-based imports
    if (url) {
      try {
        const u = new URL(url);
        const h = u.hostname.toLowerCase();
        const isGDocs = sourceType === "gdocs" && (h.endsWith("google.com") || h.endsWith("googleusercontent.com"));
        const isGDrive = sourceType === "gdrive" && (h.endsWith("google.com") || h.endsWith("googleusercontent.com"));
        const isOther = !["gdocs", "gdrive"].includes(sourceType);
        if ((sourceType === "gdocs" && !isGDocs) || (sourceType === "gdrive" && !isGDrive)) {
          return NextResponse.json({ error: `URL tidak valid untuk sourceType ${sourceType}` }, { status: 400 });
        }
        // block private/internal hosts outright
        if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h.startsWith("10.") || h.startsWith("192.168.") || h.startsWith("172.")) {
          return NextResponse.json({ error: "Host tidak diizinkan" }, { status: 400 });
        }
        void isOther;
      } catch {
        return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
      }
    }

    if ((sourceType === "gdocs" || sourceType === "gdrive") && !url) {
      return NextResponse.json({ error: "URL wajib untuk gdocs/gdrive" }, { status: 400 });
    }

    const [codex] = await db
      .select()
      .from(codexes)
      .where(and(eq(codexes.id, codexId), eq(codexes.userId, session.user.id)))
      .limit(1);

    if (!codex) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });

    const sourceName = file ? file.name : url ? new URL(url).hostname : "Unknown Source";
    
    const [log] = await db.insert(importLogs).values({
      userId: session.user.id,
      codexId,
      sourceType,
      sourceName,
      status: "processing",
    }).returning();

    try {
      let parsedText = "";
      if (file) {
        if (file.size > 10 * 1024 * 1024) throw new Error("File melebihi batas 10MB");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (sourceType === "docx") parsedText = await parseDocx(buffer);
        else if (sourceType === "pdf") parsedText = await parsePdf(buffer);
        else if (sourceType === "md") parsedText = await parseMarkdown(buffer.toString("utf-8"));
        else if (sourceType === "json") parsedText = await parseJson(buffer.toString("utf-8"));
        else throw new Error(`sourceType ${sourceType} butuh URL, bukan file`);
      } else if (url) {
        if (sourceType === "gdocs") parsedText = await fetchGoogleDoc(url);
        else if (sourceType === "gdrive") parsedText = await fetchGoogleDrive(url);
        else throw new Error(`sourceType ${sourceType} butuh file upload, bukan URL`);
      }

      if (!parsedText.trim()) throw new Error("Gagal mengekstrak teks atau teks kosong");

      const extractedLore = await extractLoreFromText(parsedText, codex.title, codex.genre || "Fiksi");

      let totalExtracted = 0;
      const categories = ["characters", "locations", "factions", "events", "concepts", "monsters"] as const;
      
      const insertPromises = [];

      for (const cat of categories) {
        const categoryEntries = extractedLore[cat] || [];
        for (const entry of categoryEntries) {
          if (!entry.title) continue;
          
          const cleanContent = entry.content ? sanitizeHtml(entry.content) : "";
          const cleanSummary = entry.summary ? sanitizeHtml(entry.summary) : "";

          insertPromises.push(
            db.insert(entries).values({
              codexId,
              userId: session.user.id,
              category: cat,
              title: entry.title.slice(0, 150),
              summary: cleanSummary.slice(0, 500),
              content: cleanContent.slice(0, 100000),
              tags: (entry.tags || []).slice(0, 20).map((t: string) => String(t).slice(0, 30)),
              metadata: entry.metadata || {},
            })
          );
          totalExtracted++;
        }
      }

      if (insertPromises.length > 0) {
        await Promise.all(insertPromises);
        
        await db.update(codexes)
          .set({ entryCount: sql`${codexes.entryCount} + ${totalExtracted}` })
          .where(eq(codexes.id, codexId));
      }

      await db.update(importLogs)
        .set({ status: "done", entriesExtracted: totalExtracted })
        .where(eq(importLogs.id, log.id));

      return NextResponse.json({
        importLogId: log.id,
        extractedCount: totalExtracted,
        message: `Berhasil mengekstrak ${totalExtracted} entri`
      });

    } catch (parseExtractError: any) {
      console.error("Import processing error:", parseExtractError);
      
      await db.update(importLogs)
        .set({ status: "failed" })
        .where(eq(importLogs.id, log.id));

      return NextResponse.json({ error: parseExtractError.message || "Gagal memproses file/URL" }, { status: 500 });
    }

  } catch (error) {
    console.error("POST Import error:", error);
    return NextResponse.json({ error: "Gagal mem-parsing request import" }, { status: 500 });
  }
}
