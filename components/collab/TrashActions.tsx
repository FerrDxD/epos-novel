"use client";
export default function TrashActions({ kind, id }: { kind: "codex" | "entry"; id: string }) {
  async function restore() {
    const url = kind === "codex" ? `/api/codex/${id}?restore=1` : `/api/entry/${id}?restore=1`;
    const res = await fetch(url, { method: "PATCH" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) alert(data.error || "Gagal restore");
    else location.reload();
  }
  async function hardDelete() {
    if (!confirm("Hapus permanen? Tidak bisa dikembalikan.")) return;
    const url = kind === "codex" ? `/api/codex/${id}?hard=1` : `/api/entry/${id}?hard=1`;
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) alert(data.error || "Gagal hapus permanen");
    else location.reload();
  }
  return (
    <span className="flex gap-2">
      <button onClick={restore} className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-surface-2)]">Restore</button>
      <button onClick={hardDelete} className="px-3 py-1.5 text-[10px] tracking-widest uppercase border border-[var(--color-border)] text-[var(--color-crimson)] hover:border-[var(--color-crimson)]">Hapus Permanen</button>
    </span>
  );
}
