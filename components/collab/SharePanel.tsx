"use client";
import { useState } from "react";
import { Users, UserPlus, Trash2, Shield, Eye } from "lucide-react";
export default function SharePanel({ codexId, isOwner, owner, members }: { codexId: string; isOwner: boolean; owner: any; members: any[] }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("viewer");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setMsg(null); setLoading(true);
    try {
      const res = await fetch(`/api/codex/${codexId}/members`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal undang");
      setMsg(`Berhasil undang ${email} sebagai ${role}`);
      setEmail("");
      location.reload();
    } catch (e: any) { setErr(e.message); } finally { setLoading(false); }
  }
  async function remove(userId: string) {
    if (!confirm("Hapus akses kolaborator ini?")) return;
    const res = await fetch(`/api/codex/${codexId}/members`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
    if (res.ok) location.reload();
  }
  async function changeRole(userId: string, newRole: string) {
    const res = await fetch(`/api/codex/${codexId}/members`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role: newRole }) });
    if (res.ok) location.reload();
  }
  return (
    <div className="tome-border bg-[var(--color-surface)] p-5">
      <h3 className="font-display text-xs tracking-[0.25em] uppercase font-bold text-[var(--color-gold)] flex items-center gap-2 mb-3"><Users className="w-4 h-4" /> Kolaborasi</h3>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">Owner: <span className="text-[var(--color-text)] font-mono">{owner?.name || owner?.email}</span></p>
      {members.length > 0 && (
        <ul className="space-y-2 mb-4">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-3 py-2 border border-[var(--color-border)] bg-[var(--color-bg)] text-xs">
              <span className="font-mono truncate">{m.user?.email || m.userId} <span className="opacity-60">· {m.role}</span></span>
              {isOwner && (
                <span className="flex items-center gap-2">
                  <select value={m.role} onChange={(e) => changeRole(m.userId, e.target.value)} className="text-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-1 py-1">
                    <option value="viewer">viewer</option><option value="editor">editor</option>
                  </select>
                  <button onClick={() => remove(m.userId)} className="p-1 hover:text-[var(--color-crimson)]"><Trash2 className="w-3.5 h-3.5" /></button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {isOwner ? (
        <form onSubmit={invite} className="space-y-2">
          <div className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@teman.com" className="flex-1 px-3 py-2 text-xs border border-[var(--color-border)] bg-[var(--color-bg)] font-mono" required type="email" />
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="px-2 py-2 text-xs border border-[var(--color-border)] bg-[var(--color-bg)]">
              <option value="viewer"><Eye className="inline w-3 h-3" /> viewer</option><option value="editor"><Shield className="inline w-3 h-3" /> editor</option>
            </select>
          </div>
          <button disabled={loading} className="w-full py-2 text-[10px] tracking-[0.2em] uppercase font-bold border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-surface-2)] flex items-center justify-center gap-2"><UserPlus className="w-3 h-3" /> {loading ? "Mengundang..." : "Undang Kolaborator"}</button>
          {err && <p className="text-[11px] text-[var(--color-crimson)]">{err}</p>}
          {msg && <p className="text-[11px] text-emerald-600">{msg}</p>}
          <p className="text-[10px] text-[var(--color-text-muted)]">Viewer: baca saja. Editor: buat/edit entri & relasi.</p>
        </form>
      ) : (
        <p className="text-[11px] text-[var(--color-text-muted)]">Hanya owner yang bisa kelola kolaborator.</p>
      )}
    </div>
  );
}
