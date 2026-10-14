export async function fetchGoogleDoc(url: string): Promise<string> {
  try {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) throw new Error("URL Google Docs tidak valid.");
    const docId = match[1];

    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=txt`;
    const res = await fetchWithTimeout(exportUrl, 10_000);
    if (!res.ok) throw new Error("Gagal mengambil teks. Pastikan link di-set ke 'Public/Anyone with the link'.");

    // Guard SSRF: ensure we stayed on google domain
    assertSafeResponse(res, exportUrl);

    return await res.text();
  } catch (error: any) {
    console.error("Google Docs Fetch Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat mem-fetch Google Docs.");
  }
}

export async function fetchGoogleDrive(url: string): Promise<string> {
  try {
    let fileId = "";
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);

    if (fileMatch) fileId = fileMatch[1];
    else if (idMatch) fileId = idMatch[1];
    else throw new Error("URL Google Drive tidak valid.");

    const exportUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const res = await fetchWithTimeout(exportUrl, 10_000);
    if (!res.ok) throw new Error("Gagal mengambil file. Pastikan link di-set ke 'Public/Anyone with the link'.");

    assertSafeResponse(res, exportUrl);

    return await res.text();
  } catch (error: any) {
    console.error("Google Drive Fetch Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat mem-fetch Google Drive.");
  }
}

// ── helpers ───────────────────────────────────────────────────────────────

function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal, redirect: "follow" as const }).finally(() => clearTimeout(t));
}

function assertSafeResponse(res: Response, requestedUrl: string) {
  // Allow only google-hosted responses; block private IP redirects
  try {
    const finalUrl = res.url || requestedUrl;
    const u = new URL(finalUrl);
    const host = u.hostname.toLowerCase();
    const allowed = host.endsWith("google.com") || host.endsWith("googleusercontent.com") || host.endsWith("gstatic.com");
    if (!allowed) {
      throw new Error(`Redirect ke host tidak diizinkan: ${host}`);
    }
  } catch (e: any) {
    // if it's our own error, rethrow
    if (String(e.message).includes("Redirect ke host")) throw e;
  }
}
