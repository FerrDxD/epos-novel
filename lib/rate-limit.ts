/**
 * Simple in-memory rate limiter — Milestone 1
 * Works without Redis (dev / single instance).
 * If UPSTASH_REDIS_* is set, you should replace this with @upstash/ratelimit.
 *
 * Usage:
 *   const r = checkRateLimit(`register:${ip}`, 5, 60*60*1000);
 *   if (!r.success) return NextResponse.json({ error: "Terlalu banyak..." }, { status: 429 });
 */

type Hit = number[]; // timestamps ms

const store = new Map<string, Hit>();

function now() { return Date.now(); }

// Periodic cleanup every 10 min to avoid memory leak
let lastCleanup = now();
function maybeCleanup() {
  if (now() - lastCleanup < 10 * 60 * 1000) return;
  lastCleanup = now();
  for (const [k, arr] of store.entries()) {
    // keep only last 5 min of hits arbitrarily
    const filtered = arr.filter((t) => now() - t < 60 * 60 * 1000);
    if (filtered.length === 0) store.delete(k);
    else store.set(k, filtered);
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  maybeCleanup();
  const t = now();
  const windowStart = t - windowMs;
  const hits = (store.get(key) || []).filter((ts) => ts > windowStart);

  if (hits.length >= limit) {
    const oldest = hits[0]!;
    const retryAfterMs = oldest + windowMs - t;
    return {
      success: false,
      remaining: 0,
      resetMs: retryAfterMs > 0 ? retryAfterMs : windowMs,
      limit,
    };
  }

  hits.push(t);
  store.set(key, hits);
  return {
    success: true,
    remaining: limit - hits.length,
    resetMs: windowMs,
    limit,
  };
}

export function getClientIp(req: Request): string {
  const h = (req.headers as any).get?.bind(req.headers) as ((k: string) => string | null) | undefined;
  const xf = h ? h("x-forwarded-for") : (req.headers as any)["x-forwarded-for"];
  if (xf) return String(xf).split(",")[0]!.trim();
  const xr = h ? h("x-real-ip") : null;
  if (xr) return String(xr).trim();
  return "unknown";
}

/** Helper to return 429 JSON with Retry-After */
export function rateLimitResponse(resetMs: number) {
  const retryAfterSec = Math.ceil(resetMs / 1000);
  const { NextResponse } = require("next/server") as typeof import("next/server");
  // Lazy require to avoid circular — we construct manually here
  return { retryAfterSec };
}
