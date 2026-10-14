/**
 * Validators — Milestone 0
 * Tries to use `zod` if installed. Falls back to manual validation so
 * `npm install` / offline builds never crash. When zod is present you get
 * richer error messages; when not, behavior is identical (safeParse API).
 */

let z: any = null;
let zodAvailable = false;
try {
  z = require("zod").z;
  zodAvailable = true;
} catch {}

// ── helpers for fallback mode ──────────────────────────────────────────────
type SafeParseResult<T> = { success: true; data: T } | { success: false; error: { issues: { path: (string|number)[]; message: string }[] } };
function fail(path: string[], message: string): SafeParseResult<never> {
  return { success: false, error: { issues: [{ path, message }] } as any };
}
function ok<T>(data: T): SafeParseResult<T> { return { success: true, data }; }

function isUUID(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
function isHexColor(v: string) { return /^#[0-9A-Fa-f]{6}$/.test(v); }
function isEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

// ── ZOD MODE ───────────────────────────────────────────────────────────────
let categoryEnum: any;
let uuidSchema: any;
let codexCreateSchema: any;
let codexPatchSchema: any;
let entryCreateSchema: any;
let entryPatchSchema: any;
let relationCreateSchema: any;
let registerSchema: any;
let shareInviteSchema: any;
let shareRoleSchema: any;
let entryVersionRestoreSchema: any;

if (zodAvailable) {
  categoryEnum = z.enum(["characters", "locations", "factions", "events", "concepts", "monsters"]);
  uuidSchema = z.string().uuid("ID harus UUID valid");
  codexCreateSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi").max(100, "Judul maksimal 100 karakter"),
    description: z.string().max(2000).optional().nullable(),
    genre: z.string().max(50).optional().nullable(),
    coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "coverColor harus hex #RRGGBB").optional().nullable(),
  });
  codexPatchSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(2000).optional().nullable(),
    genre: z.string().max(50).optional().nullable(),
    coverColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
  });
  entryCreateSchema = z.object({
    codexId: uuidSchema,
    category: categoryEnum,
    title: z.string().min(1, "Judul entri wajib diisi").max(150),
    summary: z.string().max(500).optional().nullable().default(""),
    content: z.string().max(100000, "Konten terlalu panjang").optional().nullable().default(""),
    tags: z.array(z.string().max(30)).max(20, "Maksimal 20 tags").optional().default([]),
    metadata: z.record(z.any()).optional().default({}),
    imageUrl: z.string().url().optional().nullable(),
  });
  entryPatchSchema = z.object({
    title: z.string().min(1).max(150).optional(),
    summary: z.string().max(500).optional().nullable(),
    content: z.string().max(100000).optional().nullable(),
    tags: z.array(z.string().max(30)).max(20).optional(),
    metadata: z.record(z.any()).optional(),
    imageUrl: z.string().url().optional().nullable(),
    category: categoryEnum.optional(),
  }).strict();
  relationCreateSchema = z.object({
    codexId: uuidSchema,
    sourceEntryId: uuidSchema,
    targetEntryId: uuidSchema,
    relationLabel: z.string().min(1).max(50),
  });
  registerSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi").max(50),
    username: z.string().min(3, "Username minimal 3 karakter").max(20).regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, underscore"),
    email: z.string().email("Email tidak valid").transform((v: string) => v.toLowerCase().trim()),
    password: z.string().min(6, "Password minimal 6 karakter").max(100),
  });
  shareInviteSchema = z.object({
    email: z.string().email("Email tidak valid").transform((v: string) => v.toLowerCase().trim()),
    role: z.enum(["editor", "viewer"]).default("viewer"),
  });
  shareRoleSchema = z.object({
    userId: uuidSchema,
    role: z.enum(["editor", "viewer"]),
  });
  entryVersionRestoreSchema = z.object({
    versionId: uuidSchema,
  });
} else {
  // ── FALLBACK MODE (no zod) — manual safeParse shims ─────────────────────
  const ALLOWED_CATS = ["characters", "locations", "factions", "events", "concepts", "monsters"] as const;

  categoryEnum = {
    safeParse(v: unknown) {
      return ALLOWED_CATS.includes(v as any) ? ok(v) : fail(["category"], `Kategori harus salah satu: ${ALLOWED_CATS.join(", ")}`);
    },
  };
  uuidSchema = {
    safeParse(v: unknown) {
      return typeof v === "string" && isUUID(v) ? ok(v) : fail(["id"], "ID harus UUID valid");
    },
  };
  function str(v: unknown, path: string[], min = 0, max = Infinity): SafeParseResult<string> | null {
    if (typeof v !== "string") return fail(path, `${path.join(".")} harus string`);
    if (v.length < min) return fail(path, `${path.join(".")} minimal ${min} karakter`);
    if (v.length > max) return fail(path, `${path.join(".")} maksimal ${max} karakter`);
    return null;
  }
  codexCreateSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      let e = str(b.title, ["title"], 1, 100); if (e) return e;
      if (b.coverColor != null && b.coverColor !== "" && !isHexColor(b.coverColor)) return fail(["coverColor"], "coverColor harus hex #RRGGBB");
      if (b.description != null && typeof b.description === "string" && b.description.length > 2000) return fail(["description"], "Deskripsi maksimal 2000 karakter");
      if (b.genre != null && typeof b.genre === "string" && b.genre.length > 50) return fail(["genre"], "Genre maksimal 50 karakter");
      return ok({ title: b.title, description: b.description ?? null, genre: b.genre ?? null, coverColor: b.coverColor ?? null });
    },
  };
  codexPatchSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      if (b.title !== undefined) { const e = str(b.title, ["title"], 1, 100); if (e) return e; }
      if (b.coverColor != null && b.coverColor !== "" && !isHexColor(b.coverColor)) return fail(["coverColor"], "coverColor harus hex #RRGGBB");
      return ok(b);
    },
  };
  entryCreateSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      if (!b.codexId || !isUUID(String(b.codexId))) return fail(["codexId"], "codexId harus UUID valid");
      if (!ALLOWED_CATS.includes(b.category)) return fail(["category"], `category harus salah satu: ${ALLOWED_CATS.join(", ")}`);
      let e = str(b.title, ["title"], 1, 150); if (e) return e;
      if (b.tags !== undefined) {
        if (!Array.isArray(b.tags)) return fail(["tags"], "tags harus array");
        if (b.tags.length > 20) return fail(["tags"], "Maksimal 20 tags");
        for (let i = 0; i < b.tags.length; i++) if (typeof b.tags[i] !== "string" || b.tags[i].length > 30) return fail(["tags", String(i)], "Tag maksimal 30 karakter");
      }
      if (b.content != null && typeof b.content === "string" && b.content.length > 100000) return fail(["content"], "Konten terlalu panjang");
      if (b.summary != null && typeof b.summary === "string" && b.summary.length > 500) return fail(["summary"], "Summary maksimal 500 karakter");
      return ok({
        codexId: b.codexId, category: b.category, title: b.title,
        summary: b.summary ?? "", content: b.content ?? "",
        tags: b.tags ?? [], metadata: b.metadata ?? {}, imageUrl: b.imageUrl ?? null,
      });
    },
  };
  entryPatchSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      const allowed = new Set(["title", "summary", "content", "tags", "metadata", "imageUrl", "category"]);
      for (const k of Object.keys(b)) if (!allowed.has(k)) return fail([k], `Field '${k}' tidak diizinkan`);
      if (b.title !== undefined) { const e = str(b.title, ["title"], 1, 150); if (e) return e; }
      if (b.category !== undefined && !ALLOWED_CATS.includes(b.category)) return fail(["category"], "Kategori tidak valid");
      if (b.tags !== undefined) {
        if (!Array.isArray(b.tags)) return fail(["tags"], "tags harus array");
        if (b.tags.length > 20) return fail(["tags"], "Maksimal 20 tags");
      }
      return ok(b);
    },
  };
  relationCreateSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      if (!isUUID(String(b.codexId))) return fail(["codexId"], "codexId harus UUID");
      if (!isUUID(String(b.sourceEntryId))) return fail(["sourceEntryId"], "sourceEntryId harus UUID");
      if (!isUUID(String(b.targetEntryId))) return fail(["targetEntryId"], "targetEntryId harus UUID");
      let e = str(b.relationLabel, ["relationLabel"], 1, 50); if (e) return e;
      return ok(b);
    },
  };
  registerSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      let e = str(b.name, ["name"], 1, 50); if (e) return e;
      if (typeof b.username !== "string" || b.username.length < 3 || b.username.length > 20) return fail(["username"], "Username 3-20 karakter");
      if (!/^[a-zA-Z0-9_]+$/.test(b.username)) return fail(["username"], "Username hanya huruf, angka, underscore");
      if (typeof b.email !== "string" || !isEmail(b.email)) return fail(["email"], "Email tidak valid");
      if (typeof b.password !== "string" || b.password.length < 6) return fail(["password"], "Password minimal 6 karakter");
      if (b.password.length > 100) return fail(["password"], "Password maksimal 100 karakter");
      return ok({ name: b.name, username: b.username, email: b.email.toLowerCase().trim(), password: b.password });
    },
  };
  shareInviteSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      if (typeof b.email !== "string" || !isEmail(b.email)) return fail(["email"], "Email tidak valid");
      const role = b.role || "viewer";
      if (!["editor", "viewer"].includes(role)) return fail(["role"], "Role harus editor/viewer");
      return ok({ email: b.email.toLowerCase().trim(), role });
    },
  };
  shareRoleSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      if (!isUUID(String(b.userId))) return fail(["userId"], "userId harus UUID");
      if (!["editor", "viewer"].includes(b.role)) return fail(["role"], "Role harus editor/viewer");
      return ok(b);
    },
  };
  entryVersionRestoreSchema = {
    safeParse(b: any) {
      if (!b || typeof b !== "object") return fail([], "Body harus object");
      if (!isUUID(String(b.versionId))) return fail(["versionId"], "versionId harus UUID");
      return ok(b);
    },
  };
}

export { categoryEnum, uuidSchema, codexCreateSchema, codexPatchSchema, entryCreateSchema, entryPatchSchema, relationCreateSchema, registerSchema, shareInviteSchema, shareRoleSchema, entryVersionRestoreSchema };

export function formatZodError(error: any): string {
  const first = error?.issues?.[0];
  return first ? `${first.path.join(".")}: ${first.message}` : "Input tidak valid";
}
