import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="tome-border bg-[var(--color-surface)] px-10 py-12 max-w-lg">
        <div className="font-display text-xs tracking-[0.3em] text-[var(--color-gold-muted)] uppercase mb-4">404 — Lembaran Hilang</div>
        <h2 className="font-display font-black text-2xl tracking-widest uppercase text-[var(--color-text)] mb-4">Kitab Tak Ditemukan</h2>
        <p className="font-body italic text-[var(--color-text-muted)] mb-8">Gulungan yang kau cari telah musnah atau belum pernah dipahat.</p>
        <Link href="/dashboard" className="inline-block px-8 py-3 border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] text-[var(--color-gold)] font-display text-xs tracking-[0.2em] uppercase">
          Kembali ke Perpustakaan
        </Link>
      </div>
    </div>
  );
}
