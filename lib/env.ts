/**
 * Centralized environment validation — Milestone 0
 * Uses `zod` if available, otherwise falls back to manual checks
 * so `next build` never crashes due to missing dependency.
 */

let z: any = null;
try {
  z = require("zod").z;
} catch {
  // zod not installed yet — will use manual fallback
}

type Env = {
  DATABASE_URL: string;
  NEXTAUTH_SECRET?: string;
  AUTH_SECRET?: string;
  NEXTAUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
  GEMINI_API_KEY?: string;
  NODE_ENV: string;
  resolvedGoogleId: string;
  resolvedGoogleSecret: string;
  resolvedAuthSecret: string;
};

function buildEnv(): Env {
  if (z) {
    const schema = z.object({
      DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
      NEXTAUTH_SECRET: z.string().optional(),
      AUTH_SECRET: z.string().optional(),
      NEXTAUTH_URL: z.string().optional(),
      GOOGLE_CLIENT_ID: z.string().optional(),
      GOOGLE_CLIENT_SECRET: z.string().optional(),
      AUTH_GOOGLE_ID: z.string().optional(),
      AUTH_GOOGLE_SECRET: z.string().optional(),
      GEMINI_API_KEY: z.string().optional(),
      NODE_ENV: z.string().default("development"),
    });
    const parsed = schema.safeParse(process.env);
    if (!parsed.success && process.env.SKIP_ENV_VALIDATION !== "1") {
      const msg = parsed.error.issues.map((i: any) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
      if (process.env.NODE_ENV === "production" && !process.env.VERCEL) {
        throw new Error(`❌ Invalid environment variables:\n${msg}`);
      }
      console.warn(`⚠️  Env warnings (non-blocking):\n${msg}`);
    }
  } else {
    // Manual fallback — only warn if critical vars missing in production
    if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production" && process.env.SKIP_ENV_VALIDATION !== "1") {
      console.warn("⚠️  DATABASE_URL belum di-set");
    }
    if (process.env.SKIP_ENV_VALIDATION === "1" && !process.env.DATABASE_URL) {
      process.env.DATABASE_URL = "postgresql://skip:skip@localhost:5432/skip";
    }
  }

  const e = process.env as any;
  return {
    DATABASE_URL: e.DATABASE_URL || "",
    NEXTAUTH_SECRET: e.NEXTAUTH_SECRET,
    AUTH_SECRET: e.AUTH_SECRET,
    NEXTAUTH_URL: e.NEXTAUTH_URL,
    GOOGLE_CLIENT_ID: e.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: e.GOOGLE_CLIENT_SECRET,
    AUTH_GOOGLE_ID: e.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: e.AUTH_GOOGLE_SECRET,
    GEMINI_API_KEY: e.GEMINI_API_KEY,
    NODE_ENV: e.NODE_ENV || "development",
    resolvedGoogleId: e.GOOGLE_CLIENT_ID || e.AUTH_GOOGLE_ID || "",
    resolvedGoogleSecret: e.GOOGLE_CLIENT_SECRET || e.AUTH_GOOGLE_SECRET || "",
    resolvedAuthSecret: e.AUTH_SECRET || e.NEXTAUTH_SECRET || "",
  };
}

export const env = buildEnv();

/** Call-time check — never throws at import */
export function requireGeminiKey(): string {
  const key = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY belum di-set. Tambahkan di .env");
  return key;
}
