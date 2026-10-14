"use client";
import { useState } from "react";
import { Download, Upload, FileJson, FileText } from "lucide-react";
export default function ExportPanel({ codexId, canWrite }: { codexId: string; canWrite: boolean }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setBusy(true); setErr(null); setMsg(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch(`/api/codex/${codexId}/export`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import gagal");
      setMsg(`Berhasil import ${data.inserted} entri`);
      setTimeout(() => location.reload(), 800);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); (e.target as HTMLInputElement).value = ""; }
  }
  return (
    <div className="tome-border bg-[var(--color-surface)] p-5">
      <h3 className="font-display text-xs tracking-[0.25em] uppercase font-bold text-[var(--color-gold)] flex items-center gap-2 mb-3"><Download className="w-4 h-4" /> Portability</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <a href={`/api/codex/${codexId}/export?format=json`} className="px-3 py-2 text-[11px] tracking-widest uppercase font-mono border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-gold-muted)] flex items-center justify-center gap-2"><FileJson className="w-3.5 h-3.5" /> Export JSON</a>
        <a href={`/api/codex/${codexId}/export?format=html`} className="px-3 py-2 text-[11px] tracking-widest uppercase font-mono border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-gold-muted)] flex items-center justify-center gap-2"><FileText className="w-3.5 h-3.5" /> Export Kitab</a>
      </div>
      {canWrite ? (
        <label className="block">
          <span className="px-3 py-2 text-[11px] tracking-widest uppercase font-mono border border-[var(--color-gold-muted)] text-[var(--color-gold)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] flex items-center justify-center gap-2 cursor-pointer"><Upload className="w-3.5 h-3.5" /> {busy ? "Mengimpor..." : "Import JSON"}</span>
          <input type="file" accept=".json,application/json" className="hidden" onChange={importJson} disabled={busy} />
        </label>
      ) : <p className="text-[11px] text-[var(--color-text-muted)]">Hanya editor/owner yang bisa import.</p>}
      {err && <p className="mt-2 text-[11px] text-[var(--color-crimson)]">{err}</p>}
      {msg && <p className="mt-2 text-[11px] text-emerald-600">{msg}</p>}
      <p className="mt-2 text-[10px] text-[var(--color-text-muted)]">JSON = backup penuh. Kitab = HTML cetak cantik (Print → Save as PDF).</p>
    </div>
  );
}
