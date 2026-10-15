"use client";

import { useState } from "react";
import { Download, Upload, FileJson, FileText } from "lucide-react";

export default function ExportPanel({
  codexId,
  canWrite,
}: {
  codexId: string;
  canWrite: boolean;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch(`/api/codex/${codexId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengimpor berkas.");
      setMsg(`Berhasil memuat ${data.inserted} lembaran kitab.`);
      setTimeout(() => location.reload(), 800);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
      (e.target as HTMLInputElement).value = "";
    }
  }

  return (
    <div className="tome-border bg-[var(--color-surface)] p-6 rounded-lg shadow-sm">
      <h3 className="font-display text-xs tracking-[0.25em] uppercase font-bold text-[var(--color-gold)] flex items-center gap-2 mb-4">
        <Download className="w-4 h-4" />
        <span>Portabilitas & Arsip</span>
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <a
          href={`/api/codex/${codexId}/export?format=json`}
          className="px-3 py-2.5 text-xs tracking-wider uppercase font-mono border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-gold-muted)] flex items-center justify-center gap-2 rounded transition-colors"
        >
          <FileJson className="w-3.5 h-3.5 text-[var(--color-gold)]" />
          <span>Arsip JSON</span>
        </a>
        <a
          href={`/api/codex/${codexId}/export?format=html`}
          className="px-3 py-2.5 text-xs tracking-wider uppercase font-mono border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-gold-muted)] flex items-center justify-center gap-2 rounded transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[var(--color-gold)]" />
          <span>Cetak Kitab</span>
        </a>
      </div>

      {canWrite ? (
        <label className="block">
          <span className="px-3 py-2.5 text-xs tracking-wider uppercase font-mono border border-[var(--color-gold-muted)] text-[var(--color-gold)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] flex items-center justify-center gap-2 cursor-pointer rounded transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{busy ? "Memulihkan Kitab..." : "Impor Arsip JSON"}</span>
          </span>
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={importJson}
            disabled={busy}
          />
        </label>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          Hanya Penulis dengan hak editor/owner yang dapat mengimpor data.
        </p>
      )}

      {err && <p className="mt-2 text-xs text-[var(--color-crimson)] font-mono">{err}</p>}
      {msg && <p className="mt-2 text-xs text-emerald-500 font-mono">{msg}</p>}

      <p className="mt-3 text-xs text-[var(--color-text-muted)] opacity-70 leading-relaxed">
        Format JSON menyimpan struktur data lengkap. Cetak Kitab menghasilkan format naskah siap cetak / simpan ke PDF.
      </p>
    </div>
  );
}
