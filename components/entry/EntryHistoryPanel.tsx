"use client";

import { useEffect, useState } from "react";
import { History, RotateCcw } from "lucide-react";

type V = {
  id: string;
  versionNumber: number;
  title: string;
  summary: string | null;
  createdAt: string;
};

export default function EntryHistoryPanel({
  entryId,
  canWrite,
}: {
  entryId: string;
  canWrite: boolean;
}) {
  const [versions, setVersions] = useState<V[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/entry/${entryId}/versions`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setVersions(d);
        else if (Array.isArray(d.versions)) setVersions(d.versions);
        else setErr(d.error || "");
      })
      .catch((e) => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [entryId]);

  async function restore(versionId: string) {
    if (!confirm("Pulihkan ke versi ini? Versi saat ini akan disimpan sebagai rekaman baru."))
      return;
    setRestoring(versionId);
    try {
      const res = await fetch(`/api/entry/${entryId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memulihkan versi.");
      location.reload();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setRestoring(null);
    }
  }

  return (
    <div className="tome-border bg-[var(--color-surface)] p-5 rounded-xl shadow-lg">
      <h3 className="font-display text-xs tracking-[0.25em] uppercase font-bold text-[var(--color-gold)] flex items-center gap-2 mb-3">
        <History className="w-4 h-4" />
        <span>Riwayat Versi Lembaran</span>
      </h3>
      {loading ? (
        <p className="text-xs text-[var(--color-text-muted)] font-mono animate-pulse">
          Membuka lembaran masa lalu…
        </p>
      ) : err ? (
        <p className="text-xs text-[var(--color-crimson)] font-mono">{err}</p>
      ) : versions.length === 0 ? (
        <p className="text-xs italic text-[var(--color-text-muted)]">
          Belum ada riwayat. Setiap pemahatan ulang akan tersimpan otomatis di sini.
        </p>
      ) : (
        <ul className="space-y-2 max-h-72 overflow-auto pr-1 custom-scrollbar">
          {versions.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] rounded text-xs"
            >
              <div className="truncate flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--color-gold)] opacity-80">
                  v{v.versionNumber}
                </span>
                <span className="font-display font-medium truncate max-w-[120px]">
                  {v.title}
                </span>
                <span className="font-mono text-xs opacity-50 hidden sm:inline">
                  {new Date(v.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              {canWrite && (
                <button
                  onClick={() => restore(v.id)}
                  disabled={!!restoring}
                  className="ml-2 px-2.5 py-1 text-xs tracking-wider uppercase font-display border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-surface-2)] flex items-center gap-1 rounded transition-colors disabled:opacity-50"
                  title="Kembalikan isi ke versi ini"
                >
                  {restoring === v.id ? (
                    "..."
                  ) : (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      <span>Pulihkan</span>
                    </>
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
