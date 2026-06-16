import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using the fast 2.0 flash model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

export async function extractLoreFromText(
  text: string,
  codexTitle: string,
  codexGenre: string
): Promise<ExtractedLore> {
  try {
    // Batasi teks maksimal 100.000 karakter (~30 halaman) agar tidak RTO/overload
    const truncatedText = text.length > 100000 ? text.slice(0, 100000) + "\n\n...[TEXT TRUNCATED]..." : text;
    
    // Replace the massive original text with the truncated one manually, or just use substring
    // Since prompt evaluates early, we will just slice the prompt if we know where the text starts
    // Actually, let's just rebuild the prompt completely to be safe!
    const safePrompt = `
Kamu adalah asisten analisis fiksi. Tugasmu adalah mengekstrak elemen world-building dari teks novel/cerita fiksi.

Judul Codex: ${codexTitle}
Genre: ${codexGenre}

Analisis teks berikut dan ekstrak semua elemen ke dalam kategori:
- characters: tokoh yang disebutkan atau dideskripsikan
- locations: tempat, wilayah, dunia yang disebutkan
- factions: organisasi, kelompok, kerajaan, guild
- events: kejadian penting, perang, peristiwa bersejarah
- concepts: sistem sihir, teknologi, agama, hukum dunia
- monsters: makhluk, beast, monster yang disebutkan

Untuk setiap entri berikan:
- title: nama entri
- summary: deskripsi singkat 1-2 kalimat
- content: detail lengkap dalam markdown
- tags: array kata kunci relevan
- metadata: objek sesuai kategori (lihat schema metadata)

Schema metadata per kategori:
Characters: { "age": "string", "gender": "string", "role": "string", "affiliation": "string", "abilities": ["string"], "status": "string" }
Locations: { "type": "string", "climate": "string", "population": "string", "significance": "string" }
Factions: { "type": "string", "alignment": "string", "leader": "string", "memberCount": "string" }
Events: { "timeline": "string", "type": "string", "outcome": "string", "involvedParties": ["string"] }
Concepts: { "type": "string", "scope": "string", "limitations": ["string"] }
Monsters: { "type": "string", "habitat": "string", "dangerLevel": "string", "abilities": ["string"], "weaknesses": ["string"] }

Kembalikan HANYA JSON valid dengan struktur ExtractedLore (characters, locations, factions, events, concepts, monsters array).
PENTING: Ekstrak MAKSIMAL 15 entitas paling penting/utama saja secara keseluruhan (bukan per kategori). Jangan mencoba mengekstrak semua entitas kecil untuk menghindari JSON terpotong.
Jika kategori tidak ditemukan, kembalikan array kosong.

Teks untuk dianalisis:
${truncatedText}
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: safePrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });
    
    const response = result.response.text();
    
    // Log raw response untuk debugging lokal
    try {
      require("fs").writeFileSync("gemini-debug.json", response);
    } catch(e) {}

    const parsed = JSON.parse(response);
    
    // Handle jika AI membungkusnya dalam root object yang salah
    if (parsed.ExtractedLore) return parsed.ExtractedLore as ExtractedLore;
    if (parsed.extractedLore) return parsed.extractedLore as ExtractedLore;
    
    return parsed as ExtractedLore;
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error);
    try {
      require("fs").writeFileSync("gemini-error.log", String(error.message || error));
    } catch(e) {}
    throw new Error(`Sihir AI gagal mengekstrak naskah: ${error.message || "Unknown Error"}`);
  }
}

export async function generateEntrySummary(
  entry: Partial<ExtractedEntry>,
  category: string
): Promise<string> {
  const prompt = `
Buat ringkasan (summary) singkat 1-2 kalimat untuk entri world-building berikut:
Kategori: ${category}
Nama/Judul: ${entry.title || "Unknown"}
Konten detail: ${entry.content || ""}

Hanya kembalikan teks ringkasannya, tanpa tanda kutip atau penjelasan tambahan.
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "";
  }
}
