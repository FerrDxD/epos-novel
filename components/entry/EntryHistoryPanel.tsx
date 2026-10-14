"use client";
import { useEffect, useState } from "react";
import { History, RotateCcw } from "lucide-react";
type V = { id: string; versionNumber: number; title: string; summary: string | null; createdAt: string };
export default function EntryHistoryPanel({ entryId, canWrite }: { entryId: string; canWrite: boolean }) {
  const [versions, setVersions] = useState<V[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);
  useEffect(() => {
    fetch(`/api/entry/${entryId}/versions`).then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setVersions(d);
      else if (Array.isArray(d.versions)) setVersions(d.versions);
      else setErr(d.error || "");
    }).catch((e) => setErr(String(e))).finally(() => setLoading(false));
  }, [entryId]);
  async function restore(versionId: string) {
    if (!confirm("Restore ke versi ini? Versi saat ini akan disimpan sebagai versi baru.")) return;
    setRestoring(versionId);
    try {
      const res = await fetch(`/api/entry/${entryId}/versions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ versionId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal restore");
      location.reload();
    } catch (e: any) { alert(e.message); } finally { setRestoring(null); }
  }
  return (
    <div className="tome-border bg-[var(--color-surface)] p-5">
      <h3 className="font-display text-xs tracking-[0.25em] uppercase font-bold text-[var(--color-gold)] flex items-center gap-2 mb-3"><History className="w-4 h-4" /> Riwayat Versi</h3>
      {loading ? <p className="text-xs text-[var(--color-text-muted)]">Memuat...</p> : err ? <p className="text-[11px] text-[var(--color-crimson)]">{err}</p> : versions.length === 0 ? <p className="text-xs italic text-[var(--color-text-muted)]">Belum ada riwayat. Edit entri untuk membuat versi.</p> : (
        <ul className="space-y-2 max-h-72 overflow-auto pr-1">
          {versions.map((v) => (
            <li key={v.id} className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-xs">
              <span className="truncate"><span className="font-mono text-[10px] opacity-60">v{v.versionNumber}</span> <span className="font-display ml-2">{v.title.slice(0, 60)}</span><span className="ml-2 font-mono text-[10px] opacity-50">{new Date(v.createdAt).toLocaleString("id-ID")}</span></span>
              {canWrite && <button onClick={() => restore(v.id)} disabled={!!restoring} className="ml-2 px-2 py-1 text-[10px] tracking-widest uppercase border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-surface-2)] flex items-center gap-1">{restoring === v.id ? "..." : <><RotateCcw className="w-3 h-3" /> Restore</>}</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
