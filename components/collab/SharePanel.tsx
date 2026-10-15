"use client";

import { useState } from "react";
import { Users, UserPlus, Trash2, Shield, Eye } from "lucide-react";

export default function SharePanel({
  codexId,
  isOwner,
  owner,
  members,
}: {
  codexId: string;
  isOwner: boolean;
  owner: any;
  members: any[];
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/codex/${codexId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengundang anggota.");
      setMsg(`Berhasil mengundang ${email} sebagai ${role}`);
      setEmail("");
      location.reload();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function remove(userId: string) {
    if (!confirm("Hapus akses kolaborator ini?")) return;
    const res = await fetch(`/api/codex/${codexId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) location.reload();
  }

  async function changeRole(userId: string, newRole: string) {
    const res = await fetch(`/api/codex/${codexId}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });
    if (res.ok) location.reload();
  }

  return (
    <div className="tome-border bg-[var(--color-surface)] p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xs tracking-[0.25em] uppercase font-bold text-[var(--color-gold)] flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>Kolaborasi Kitab</span>
        </h3>
        <span className="font-mono text-xs text-[var(--color-text-muted)]">
          {members.length + 1} Penjaga
        </span>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Pemilik Kitab: <span className="text-[var(--color-text)] font-mono font-medium">{owner?.name || owner?.email}</span>
      </p>

      {members.length > 0 && (
        <ul className="space-y-2 mb-5">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] rounded text-xs"
            >
              <span className="font-mono truncate">
                {m.user?.email || m.userId} <span className="opacity-60">· {m.role}</span>
              </span>
              {isOwner && (
                <div className="flex items-center gap-2">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.userId, e.target.value)}
                    className="text-xs border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 rounded"
                  >
                    <option value="viewer">viewer</option>
                    <option value="editor">editor</option>
                  </select>
                  <button
                    onClick={() => remove(m.userId)}
                    className="p-1 hover:text-[var(--color-crimson)] transition-colors"
                    title="Hapus akses"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {isOwner ? (
        <form onSubmit={invite} className="space-y-3">
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rekan@alamfiksi.com"
              className="flex-1 px-3 py-2 text-xs border border-[var(--color-border)] bg-[var(--color-bg)] font-mono rounded focus:border-[var(--color-gold)] focus:outline-none"
              required
              type="email"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="px-3 py-2 text-xs border border-[var(--color-border)] bg-[var(--color-bg)] rounded focus:border-[var(--color-gold)] focus:outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button
            disabled={loading}
            className="w-full py-2.5 text-xs tracking-[0.2em] uppercase font-bold border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-surface-2)] flex items-center justify-center gap-2 rounded transition-colors disabled:opacity-50"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{loading ? "Mengirim Undangan..." : "Undang Rekan Menulis"}</span>
          </button>
          {err && <p className="text-xs text-[var(--color-crimson)] font-mono">{err}</p>}
          {msg && <p className="text-xs text-emerald-500 font-mono">{msg}</p>}
          <p className="text-xs text-[var(--color-text-muted)] opacity-70">
            Viewer: membaca catatan. Editor: menambah dan memahat entri semesta.
          </p>
        </form>
      ) : (
        <p className="text-xs text-[var(--color-text-muted)] italic">
          Hanya Pemilik Kitab yang berhak mengelola lingkar kolaborator.
        </p>
      )}
    </div>
  );
}
