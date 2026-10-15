/**
 * M3 helpers — cost guard, token estimate, zod validation for Gemini JSON
 * No external dep: uses rough token estimate (~1 token ≈ 4 chars for ID/EN mix)
 */

export function estimateTokens(chars: number): number {
  return Math.ceil(chars / 4);
}

// Allow override via env; default 120k tokens ≈ 480k chars
export function maxInputTokens(): number {
  const raw = process.env.GEMINI_MAX_TOKENS || process.env.NEXT_PUBLIC_GEMINI_MAX_TOKENS || "";
  const n = parseInt(raw, 10);
  if (Number.isFinite(n) && n > 0) return n;
  return 120_000;
}

export type TokenCheck =
  | { ok: true; estimatedTokens: number; inputChars: number }
  | { ok: false; estimatedTokens: number; inputChars: number; reason: string };

export function checkTokenBudget(inputChars: number): TokenCheck {
  const est = estimateTokens(inputChars);
  const max = maxInputTokens();
  if (est > max) {
    return {
      ok: false,
      estimatedTokens: est,
      inputChars,
      reason: `Input terlalu besar (~${est.toLocaleString("id-ID")} token, batas ${max.toLocaleString("id-ID")}). Kurangi ukuran file atau bagi menjadi bagian kecil.`,
    };
  }
  return { ok: true, estimatedTokens: est, inputChars };
}

// ── Gemini JSON schema validation (offline-safe) ─────────────────────────

export type ExtractedEntryLike = {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  metadata: Record<string, unknown>;
};

export type ExtractedLoreLike = {
  characters: ExtractedEntryLike[];
  locations: ExtractedEntryLike[];
  factions: ExtractedEntryLike[];
  events: ExtractedEntryLike[];
  concepts: ExtractedEntryLike[];
  monsters: ExtractedEntryLike[];
};

const ALLOWED_CATS = ["characters", "locations", "factions", "events", "concepts", "monsters"] as const;

function isEntryLike(v: unknown): v is ExtractedEntryLike {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.title === "string" && typeof o.summary === "string" && typeof o.content === "string" && Array.isArray(o.tags);
}

export function validateExtractedLore(raw: unknown): ExtractedLoreLike {
  if (!raw || typeof raw !== "object") throw new Error("Respons AI bukan object");
  const o = raw as Record<string, unknown>;

  // Unwrap common wrapper keys
  const root: Record<string, unknown> =
    (o.ExtractedLore as Record<string, unknown>) ??
    (o.extractedLore as Record<string, unknown>) ??
    (o.data as Record<string, unknown>) ??
    o;

  const out: ExtractedLoreLike = {
    characters: [],
    locations: [],
    factions: [],
    events: [],
    concepts: [],
    monsters: [],
  };

  for (const cat of ALLOWED_CATS) {
    const arr = (root as Record<string, unknown>)[cat];
    if (arr == null) continue;
    if (!Array.isArray(arr)) throw new Error(`Field ${cat} harus array`);
    // Filter to valid entries, cap at 30 per cat (overall cap handled upstream)
    const valid = arr.filter(isEntryLike).slice(0, 30).map((e) => ({
      title: String(e.title).slice(0, 150),
      summary: String(e.summary || "").slice(0, 500),
      content: String(e.content || "").slice(0, 100000),
      tags: (Array.isArray(e.tags) ? e.tags : []).slice(0, 20).map((t: unknown) => String(t).slice(0, 30)),
      metadata: (e.metadata && typeof e.metadata === "object" ? e.metadata : {}) as Record<string, unknown>,
    }));
    (out as Record<string, unknown>)[cat] = valid;
  }

  const total = ALLOWED_CATS.reduce((n, c) => n + (out[c as keyof ExtractedLoreLike]).length, 0);
  if (total === 0) {
    // Not fatal — caller may decide to warn
    // But ensure at least empty arrays are present
  }
  return out;
}

// Consistency check result type — shared with /api/consistency
export type ConsistencyFinding = {
  severity: "info" | "warning" | "contradiction";
  title: string;
  detail: string;
  entryIds?: string[];
};

export function validateConsistencyResponse(raw: unknown): ConsistencyFinding[] {
  if (!raw || typeof raw !== "object") throw new Error("Respons consistency bukan object");
  const arr = (raw as Record<string, unknown>).findings ?? (raw as Record<string, unknown>).results ?? raw;
  if (!Array.isArray(arr)) throw new Error("Field findings harus array");
  return arr
    .filter((x) => x && typeof x === "object" && typeof (x as Record<string, unknown>).title === "string")
    .slice(0, 20)
    .map((x) => {
      const o = x as Record<string, unknown>;
      const sev = String(o.severity || "info").toLowerCase();
      return {
        severity: (sev === "contradiction" ? "contradiction" : sev === "warning" ? "warning" : "info") as ConsistencyFinding["severity"],
        title: String(o.title).slice(0, 200),
        detail: String(o.detail || o.description || "").slice(0, 2000),
        entryIds: Array.isArray(o.entryIds) ? (o.entryIds as unknown[]).map((s) => String(s)).slice(0, 10) : undefined,
      };
    });
}
