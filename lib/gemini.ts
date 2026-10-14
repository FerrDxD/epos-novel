import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireGeminiKey } from "./env";
import { checkTokenBudget, validateExtractedLore } from "./ai-helpers";

function getModel() {
  const apiKey = requireGeminiKey();
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export type ExtractedEntry = {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
};

export type ExtractedLore = {
  characters: ExtractedEntry[];
  locations: ExtractedEntry[];
  factions: ExtractedEntry[];
  events: ExtractedEntry[];
  concepts: ExtractedEntry[];
  monsters: ExtractedEntry[];
};

const FEW_SHOT_EXAMPLE = `
Contoh output (2 entitas, format ringkas):
{
  "characters": [
    {
      "title": "Lyra Altheris",
      "summary": "Penyihir muda pewaris Sihir Bintang yang melarikan diri dari Akademi Obsidian.",
      "content": "## Lyra Altheris\\nLyra lahir di bawah Gerhana Kembar...",
      "tags": ["penyihir", "pelarian", "bintang"],
      "metadata": { "age": "19", "gender": "Perempuan", "role": "Protagonis", "affiliation": "Akademi Obsidian (mantan)", "abilities": ["Sihir Bintang"], "status": "Hidup" }
    }
  ],
  "locations": [
    {
      "title": "Akademi Obsidian",
      "summary": "Menara hitam akademi sihir di puncak Gunung Karst.",
      "content": "Didirikan 300 tahun lalu...",
      "tags": ["akademi", "menara"],
      "metadata": { "type": "Akademi", "climate": "Dingin", "population": "500", "significance": "Pusat sihir gelap" }
    }
  ],
  "factions": [], "events": [], "concepts": [], "monsters": []
}
`;

export async function extractLoreFromText(
  text: string,
  codexTitle: string,
  codexGenre: string
): Promise<ExtractedLore> {
  const truncatedText = text.length > 100000 ? text.slice(0, 100000) + "\n\n...[TEXT TRUNCATED]..." : text;

  // Cost guard before calling the model
  const budget = checkTokenBudget(truncatedText.length + 4000); // prompt overhead
  if (!budget.ok) throw new Error(budget.reason);

  const safePrompt = `
Kamu adalah asisten analisis fiksi. Ekstrak elemen world-building dari teks berikut.

Judul Codex: ${codexTitle}
Genre: ${codexGenre}

Kategori:
- characters: tokoh yang disebutkan atau dideskripsikan
- locations: tempat, wilayah, dunia
- factions: organisasi, kelompok, kerajaan, guild
- events: kejadian penting, perang, peristiwa bersejarah
- concepts: sistem sihir, teknologi, agama, hukum dunia
- monsters: makhluk, beast, monster

Untuk setiap entri berikan: title, summary (1-2 kalimat), content (markdown), tags (array keyword), metadata (objek kategori).

Schema metadata:
Characters: { "age": "string", "gender": "string", "role": "string", "affiliation": "string", "abilities": ["string"], "status": "string" }
Locations: { "type": "string", "climate": "string", "population": "string", "significance": "string" }
Factions: { "type": "string", "alignment": "string", "leader": "string", "memberCount": "string" }
Events: { "timeline": "string", "type": "string", "outcome": "string", "involvedParties": ["string"] }
Concepts: { "type": "string", "scope": "string", "limitations": ["string"] }
Monsters: { "type": "string", "habitat": "string", "dangerLevel": "string", "abilities": ["string"], "weaknesses": ["string"] }

Aturan:
- Kembalikan HANYA JSON valid dengan keys: characters, locations, factions, events, concepts, monsters (array).
- Maksimal 15 entitas paling penting secara keseluruhan.
- Jika kategori kosong, array kosong.

${FEW_SHOT_EXAMPLE}

Teks untuk dianalisis:
${truncatedText}
`;

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const model = getModel();
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: safePrompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });

      const response = result.response.text();
      if (process.env.NODE_ENV !== "production") {
        console.debug("[Gemini] attempt", attempt + 1, "raw len", response.length);
      }

      const parsed = extractJson(response);
      const validated = validateExtractedLore(parsed);

      // Enforce overall 15 cap after validation
      const cats = ["characters", "locations", "factions", "events", "concepts", "monsters"] as const;
      let total = cats.reduce((n, c) => n + (validated as Record<string, unknown[]>)[c].length, 0);
      if (total > 15) {
        // Trim lowest-priority categories last
        for (let i = cats.length - 1; i >= 0 && total > 15; i--) {
          const c = cats[i]!;
          const arr = (validated as Record<string, unknown[]>)[c];
          const excess = total - 15;
          if (arr.length > 0) {
            const drop = Math.min(excess, arr.length);
            (validated as Record<string, unknown[]>)[c] = arr.slice(0, arr.length - drop);
            total -= drop;
          }
        }
      }

      return validated as ExtractedLore;
    } catch (error: unknown) {
      lastErr = error;
      const msg = String((error as Record<string, unknown>)?.message || error);
      // Retry only on JSON/parse/validation errors, not on budget/auth
      const retriable = msg.includes("JSON") || msg.includes("bukan object") || msg.includes("harus array") || msg.includes("Unexpected") || msg.includes("429") || msg.includes("quota");
      if (!retriable || attempt === 2) break;
      await sleep(600 * (attempt + 1));
    }
  }

  console.error("Gemini Extraction Error:", lastErr);
  const m = (lastErr as Record<string, unknown>)?.message ? String((lastErr as Record<string, unknown>).message) : String(lastErr);
  throw new Error(`Sihir AI gagal mengekstrak naskah: ${m || "Unknown Error"}`);
}

function extractJson(raw: string): unknown {
  const s = raw.trim();
  // Gemini with responseMimeType JSON should be pure JSON, but be defensive
  try {
    return JSON.parse(s);
  } catch {}
  // Try to salvage ```json ... ``` fences
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence?.[1]) {
    try { return JSON.parse(fence[1]); } catch {}
  }
  // Try outermost { ... }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    const slice = s.slice(first, last + 1);
    try { return JSON.parse(slice); } catch {}
  }
  throw new Error("Respons AI bukan JSON valid");
}

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

export async function generateEntrySummary(
  entry: Partial<ExtractedEntry>,
  category: string
): Promise<string> {
  const prompt = `Buat ringkasan 1-2 kalimat untuk entri world-building:\nKategori: ${category}\nNama: ${entry.title || "Unknown"}\nKonten: ${entry.content || ""}\nHanya kembalikan ringkasannya.`;
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "";
  }
}

// ── Consistency check (premium) ────────────────────────────────────────────

export async function checkLoreConsistency(
  loreJson: string, // stringified subset of entries [{title, category, content/summary}]
): Promise<import("./ai-helpers").ConsistencyFinding[]> {
  const budget = checkTokenBudget(loreJson.length + 2000);
  if (!budget.ok) throw new Error(budget.reason);

  const prompt = `
Kamu adalah editor lore. Periksa inkonsistensi/kontradiksi antar entitas world-building berikut.

Fokus: usia/timeline yang bertentangan, lokasi yang berpindah tanpa penjelasan, afiliasi ganda, sihir yang melanggar aturannya sendiri, monster vs habitat.

Kembalikan HANYA JSON:
{ "findings": [ { "severity": "info"|"warning"|"contradiction", "title": "...", "detail": "...", "entryIds": ["..."] } ] }
Maksimal 12 findings. Jika konsisten, kembalikan findings: [].

Data lore (JSON array ringkas):
${loreJson}
`;

  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const model = getModel();
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      });
      const raw = result.response.text();
      const parsed = extractJson(raw);
      const { validateConsistencyResponse } = await import("./ai-helpers");
      return validateConsistencyResponse(parsed);
    } catch (e) {
      lastErr = e;
      const msg = String((e as Record<string, unknown>)?.message || e);
      if (msg.includes("bukan object") || msg.includes("JSON") || msg.includes("429")) {
        if (attempt === 0) { await sleep(600); continue; }
      }
      break;
    }
  }
  throw new Error(String((lastErr as Record<string, unknown>)?.message || lastErr || "Gagal cek konsistensi"));
}
