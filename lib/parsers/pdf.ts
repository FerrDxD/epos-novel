// Lazy loader for PDF — M3: try `unpdf` first, fall back to `pdf-parse` so offline/dummy builds don't crash.
// `unpdf` is ESM-only; we import it dynamically.
export async function parsePdf(buffer: Buffer): Promise<string> {
  // Try unpdf (modern, maintained)
  try {
    const mod: any = await import("unpdf").catch(() => null);
    if (mod?.extractText) {
      const { text } = await mod.extractText(new Uint8Array(buffer), { mergePages: true });
      const t = Array.isArray(text) ? text.join("\n") : String(text || "");
      if (t.trim()) return t;
    }
    if (mod?.getTextContent) {
      const data = await mod.getTextContent(new Uint8Array(buffer));
      const t = (data?.items || []).map((it: any) => it.str || "").join(" ");
      if (t.trim()) return t;
    }
  } catch {}

  // Fallback: pdf-parse (legacy, still works offline)
  try {
    const pdfParse = (await import("pdf-parse").then((m: any) => m.default || m)) as (b: Buffer) => Promise<{ text: string }>;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw new Error("Gagal mem-parsing file PDF.");
  }
}
