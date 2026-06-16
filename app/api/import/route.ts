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

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const codexId = formData.get("codexId") as string;
    const sourceType = formData.get("sourceType") as string;
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    if (!codexId || !sourceType) {
      return NextResponse.json({ error: "codexId dan sourceType wajib diisi" }, { status: 400 });
    }

    // Validasi codex milik user
    const [codex] = await db
      .select()
      .from(codexes)
      .where(and(eq(codexes.id, codexId), eq(codexes.userId, session.user.id)))
      .limit(1);

    if (!codex) return NextResponse.json({ error: "Codex tidak ditemukan" }, { status: 404 });

    // 1. Buat log import status processing
    const sourceName = file ? file.name : url ? new URL(url).hostname : "Unknown Source";
    
    const [log] = await db.insert(importLogs).values({
      userId: session.user.id,
      codexId,
      sourceType,
      sourceName,
      status: "processing",
    }).returning();

    try {
      // 2. Parse text dari file/url
      let parsedText = "";
      if (file) {
        if (file.size > 10 * 1024 * 1024) throw new Error("File melebihi batas 10MB");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (sourceType === "docx") parsedText = await parseDocx(buffer);
        else if (sourceType === "pdf") parsedText = await parsePdf(buffer);
        else if (sourceType === "md") parsedText = await parseMarkdown(buffer.toString("utf-8"));
        else if (sourceType === "json") parsedText = await parseJson(buffer.toString("utf-8"));
      } else if (url) {
        if (sourceType === "gdocs") parsedText = await fetchGoogleDoc(url);
        else if (sourceType === "gdrive") parsedText = await fetchGoogleDrive(url);
      }

      if (!parsedText.trim()) throw new Error("Gagal mengekstrak teks atau teks kosong");

      // 3. AI Extraction
      const extractedLore = await extractLoreFromText(parsedText, codex.title, codex.genre || "Fiksi");

      // 4. Insert entries ke DB
      let totalExtracted = 0;
      const categories = ["characters", "locations", "factions", "events", "concepts", "monsters"] as const;
      
      const insertPromises = [];

      for (const cat of categories) {
        const categoryEntries = extractedLore[cat] || [];
        for (const entry of categoryEntries) {
          if (!entry.title) continue; // Skip kalau aneh
          
          insertPromises.push(
            db.insert(entries).values({
              codexId,
              userId: session.user.id,
              category: cat,
              title: entry.title,
              summary: entry.summary || "",
              content: entry.content || "",
              tags: entry.tags || [],
              metadata: entry.metadata || {},
            })
          );
          totalExtracted++;
        }
      }

      if (insertPromises.length > 0) {
        await Promise.all(insertPromises);
        
        // Update codex counter
        await db.update(codexes)
          .set({ entryCount: sql`${codexes.entryCount} + ${totalExtracted}` })
          .where(eq(codexes.id, codexId));
      }

      // 5. Update log done
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
      
      // Update log failed
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
