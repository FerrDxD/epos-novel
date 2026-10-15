"use client";

import { RotateCcw, Trash2 } from "lucide-react";

export default function TrashActions({
  kind,
  id,
}: {
  kind: "codex" | "entry";
  id: string;
}) {
  async function restore() {
    const url = kind === "codex" ? `/api/codex/${id}?restore=1` : `/api/entry/${id}?restore=1`;
    const res = await fetch(url, { method: "PATCH" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) alert(data.error || "Gagal memulihkan.");
    else location.reload();
  }

  async function hardDelete() {
    if (!confirm("Hapus secara permanen dari alam semesta? Tindakan ini tidak dapat dibatalkan."))
      return;
    const url = kind === "codex" ? `/api/codex/${id}?hard=1` : `/api/entry/${id}?hard=1`;
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) alert(data.error || "Gagal menghapus permanen.");
    else location.reload();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={restore}
        className="px-3 py-1.5 text-xs font-display font-bold tracking-widest uppercase border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-surface-2)] rounded transition-colors flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Pulihkan</span>
      </button>
      <button
        onClick={hardDelete}
        className="px-3 py-1.5 text-xs font-display font-bold tracking-widest uppercase border border-[var(--color-border)] text-[var(--color-crimson)] hover:border-[var(--color-crimson)] hover:bg-[var(--color-crimson)]/10 rounded transition-colors flex items-center gap-1.5"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Musnahkan</span>
      </button>
    </div>
  );
}
