"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Palette, Plus, Sparkles, BookOpen } from "lucide-react";
import ThemeToggle from "../../../../components/ui/ThemeToggle";
import CelestialBackground from "../../../../components/ui/CelestialBackground";

const PRESET_COLORS = [
  { hex: "#0C0A09", label: "Obsidian" },
  { hex: "#8B1E1E", label: "Rubedo" },
  { hex: "#3D332B", label: "Leather" },
  { hex: "#1C2B2D", label: "Deep Teal" },
  { hex: "#2C1E30", label: "Royal Dusk" },
  { hex: "#C2A878", label: "Chrysos" },
];

const GENRES = [
  "High Fantasy",
  "Dark Fantasy",
  "Sci-Fi / Space Opera",
  "Romance / Drama",
  "Horror / Eldritch",
  "Thriller / Mystery",
  "Historical Fiction",
  "Mythology",
  "Lainnya",
];

export default function NewCodexPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverColor, setCoverColor] = useState(PRESET_COLORS[0].hex);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Nama kitab pusaka wajib diukir.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/codex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, genre, coverColor }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memahat Codex.");

      router.push(`/codex/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300 relative overflow-hidden flex flex-col">
      <CelestialBackground />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 w-full px-6 sm:px-10 py-5 border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">
              Kembali ke Perpustakaan
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45 bg-[var(--color-surface)]">
                <div className="w-1.5 h-1.5 bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
              </div>
              <span className="font-display font-black text-sm tracking-[0.3em] text-[var(--color-gold)] uppercase hidden sm:inline">
                E P O S
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-12 flex-1 w-full z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] mb-3 tracking-widest uppercase">
            Pahat Kitab Baru
          </h1>
          <p className="font-body text-xl italic text-[var(--color-text-muted)]">
            Siapkan lembaran kosong untuk memetakan hukum alam, silsilah darah, dan misteri semesta fiksi Anda berikutnya.
          </p>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-text)] font-mono text-sm flex items-center gap-3 rounded">
            <div className="w-2 h-2 bg-[var(--color-crimson)] rotate-45 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-7 tome-border rounded-xl p-8 sm:p-10 bg-[var(--color-surface)]/90 backdrop-blur-sm shadow-2xl relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-60" />

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2"
                >
                  Judul Kitab Pusaka *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  disabled={isLoading}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]/80 focus:bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/40 transition-all font-body text-lg italic placeholder:text-[var(--color-text-muted)]/50"
                  placeholder="Contoh: Babad Tanah Aethelgard"
                />
              </div>

              {/* Classification / Genre */}
              <div>
                <label
                  htmlFor="genre"
                  className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2"
                >
                  Klasifikasi Era & Genre
                </label>
                <select
                  id="genre"
                  disabled={isLoading}
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]/80 focus:bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/40 transition-all font-mono text-xs uppercase tracking-widest"
                >
                  <option value="">-- Pilih Klasifikasi --</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2"
                >
                  Sinopsis & Intisari Semesta
                </label>
                <textarea
                  id="description"
                  disabled={isLoading}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]/80 focus:bg-[var(--color-bg)] text-[var(--color-text)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/40 transition-all font-body text-base italic placeholder:text-[var(--color-text-muted)]/50 resize-none leading-relaxed"
                  placeholder="Uraikan secara singkat hukum alam, intrik wangsa, atau malapetaka purba yang membayangi dunia ini..."
                />
              </div>

              {/* Cover Color Picker */}
              <div>
                <label className="flex items-center gap-2 font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">
                  <Palette className="w-3.5 h-3.5 opacity-80" />
                  <span>Tinta & Warna Sampul</span>
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {PRESET_COLORS.map((color) => {
                    const isSelected = coverColor === color.hex;
                    return (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setCoverColor(color.hex)}
                        title={color.label}
                        className={`w-10 h-10 rounded border transition-all duration-300 relative ${
                          isSelected
                            ? "scale-110 border-[var(--color-gold)] ring-2 ring-[var(--color-gold)] ring-offset-2 ring-offset-[var(--color-surface)] shadow-[0_0_12px_rgba(232,208,141,0.3)]"
                            : "border-[var(--color-border)] hover:border-[var(--color-gold-muted)] hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={`Pilih warna ${color.label}`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white mx-auto shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                  <div className="relative">
                    <input
                      type="color"
                      value={coverColor}
                      onChange={(e) => setCoverColor(e.target.value)}
                      className="absolute opacity-0 w-full h-full cursor-pointer"
                      title="Pilih warna kustom"
                    />
                    <div
                      className={`w-10 h-10 rounded flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                        !PRESET_COLORS.some((c) => c.hex === coverColor)
                          ? "scale-110 border-[var(--color-gold)] ring-2 ring-[var(--color-gold)] ring-offset-2 ring-offset-[var(--color-surface)] shadow-[0_0_12px_rgba(232,208,141,0.3)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-gold-muted)] hover:scale-105"
                      }`}
                      style={{ backgroundColor: coverColor }}
                    >
                      <Plus className="w-4 h-4 text-white drop-shadow mix-blend-difference" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full tome-border font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] bg-[var(--color-surface)] hover:bg-[var(--color-gold)]/10 shadow-[0_0_20px_rgba(232,208,141,0.15)] hover:shadow-[0_0_30px_rgba(232,208,141,0.25)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="font-mono tracking-widest animate-pulse text-xs">
                      [ MEMAHAT KITAB PUSAKA... ]
                    </span>
                  ) : (
                    <>
                      <span>Pahat Kitab Pusaka</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Scriptorium Preview */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold)]" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                Pratinjau Bentuk Kitab
              </span>
            </div>

            {/* Miniature Codex Preview Card */}
            <div className="group relative bg-[var(--color-surface)] border border-[var(--color-gold-muted)] rounded-sm shadow-xl min-h-[300px] flex flex-col overflow-hidden">
              {/* Decorative Corner Brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--color-gold)] opacity-70" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--color-gold)] opacity-70" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--color-gold)] opacity-70" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--color-gold)] opacity-70" />

              <div className="flex h-full flex-1 relative z-10">
                {/* Book Spine Simulation */}
                <div
                  className="w-8 shrink-0 relative flex flex-col items-center py-6 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.5)] border-r border-[var(--color-border)] transition-colors duration-500"
                  style={{ backgroundColor: coverColor }}
                >
                  <div className="w-full h-[1px] bg-white opacity-25 mt-4" />
                  <div className="w-full h-[1px] bg-white opacity-25 mt-1" />
                  <div className="w-full h-[1px] bg-white opacity-25 mt-auto mb-1" />
                  <div className="w-full h-[1px] bg-white opacity-25 mb-4" />
                </div>

                {/* Inner Content */}
                <div className="p-7 flex-1 flex flex-col h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-2)]">
                  <div className="mb-4">
                    <h3 className="font-display font-black text-xl text-[var(--color-text)] tracking-wider uppercase leading-snug">
                      {title.trim() ? title : "Nama Kitab Belum Terukir"}
                    </h3>
                    <div className="w-12 h-[1px] bg-[var(--color-gold)] mt-2 opacity-50" />
                  </div>

                  <p className="font-body text-base text-[var(--color-text-muted)] italic line-clamp-4 mb-6 flex-1 border-l border-[var(--color-gold-muted)] pl-3.5 leading-relaxed">
                    {description.trim()
                      ? description
                      : "Prolog dan intisari semesta Anda akan terpahat anggun di sini..."}
                  </p>

                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div className="font-display text-xs text-[var(--color-gold)] font-bold tracking-[0.2em] uppercase bg-[var(--color-bg)] px-2.5 py-1 border border-[var(--color-border)] rounded-sm">
                      0 Lembar
                    </div>
                    {genre ? (
                      <div className="font-mono text-xs text-[var(--color-text-muted)] tracking-wider uppercase bg-[var(--color-surface-2)] px-2.5 py-1 rounded-sm border border-[var(--color-border)]/50">
                        {genre}
                      </div>
                    ) : (
                      <div className="font-mono text-xs text-[var(--color-text-muted)] tracking-wider uppercase opacity-50">
                        Era Bebas
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scriptorium Guidance Note */}
            <div className="mt-6 p-4 rounded border border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2 mb-1.5 text-[var(--color-gold)] font-display text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Petunjuk Penulisan</span>
              </div>
              <p className="font-body text-base italic leading-relaxed">
                Setiap kitab pusaka yang dipahat otomatis dilengkapi 6 pilar ensiklopedia semesta (Karakter, Wilayah, Faksi, Peristiwa, Konsep, dan Monster) serta Ruang Tulis Naskah yang siap dihubungkan secara instan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer watermark */}
      <footer className="w-full py-6 text-center z-10 relative border-t border-[var(--color-border)]/50">
        <span className="font-mono text-xs text-[var(--color-gold-muted)] tracking-widest uppercase opacity-60">
          EPOS • SISTEM MANAJEMEN DUNIA FIKSI TINGKAT LANJUT
        </span>
      </footer>
    </div>
  );
}
