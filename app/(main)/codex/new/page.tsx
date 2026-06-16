"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Palette, Plus } from "lucide-react";
import ThemeToggle from "../../../../components/ui/ThemeToggle";

const PRESET_COLORS = [
  "#8B1E1E", // Crimson
  "#C2A878", // Gold
  "#3D332B", // Dark Leather
  "#1C2B2D", // Deep Teal
  "#2C1E30", // Deep Purple
  "#0C0A09", // Obsidian
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
  const [coverColor, setCoverColor] = useState(PRESET_COLORS[0]);
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
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-500">
      <header className="sticky top-0 z-20 w-full px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-widest uppercase">Kembali ke Rak</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display font-black text-4xl text-[var(--color-text)] mb-4 tracking-wide uppercase">
            Pahat Kitab Baru
          </h1>
          <p className="font-body text-xl italic text-[var(--color-text-muted)]">
            Siapkan perkamen kosong untuk semesta fiksi Anda berikutnya.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-text)] font-mono text-sm flex items-center gap-3">
            <div className="w-2 h-2 bg-[var(--color-crimson)] rotate-45" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 tome-border p-10 bg-[var(--color-surface)] relative">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-[var(--color-gold)] opacity-50" />
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
              Judul Kitab *
            </label>
            <input
              id="title"
              type="text"
              required
              disabled={isLoading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-lg font-body italic border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors placeholder-[var(--color-border)]"
              placeholder="Contoh: Babad Tanah Aethelgard"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
              Sinopsis Semesta
            </label>
            <textarea
              id="description"
              disabled={isLoading}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 text-lg font-body italic border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none placeholder-[var(--color-border)]"
              placeholder="Ceritakan secara singkat hukum alam, sejarah, atau konflik utama di dunia ini..."
            />
          </div>

          {/* Genre & Color Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-[var(--color-border)]">
            
            {/* Genre */}
            <div>
              <label htmlFor="genre" className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
                Klasifikasi Era
              </label>
              <select
                id="genre"
                disabled={isLoading}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-3 text-sm font-mono uppercase tracking-widest border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              >
                <option value="">-- Pilih Era --</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Cover Color Picker */}
            <div>
              <label className="flex items-center gap-2 font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
                <Palette className="w-4 h-4 opacity-70" />
                Tinta Sampul
              </label>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setCoverColor(color)}
                    className={`w-10 h-10 border border-[var(--color-border)] transition-all duration-300 ${
                      coverColor === color ? "scale-110 border-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold-muted)]" : "hover:scale-105 hover:border-[var(--color-gold-muted)]"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Pilih warna ${color}`}
                  />
                ))}
                <div className="relative">
                  <input
                    type="color"
                    value={coverColor}
                    onChange={(e) => setCoverColor(e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer"
                  />
                  <div 
                    className={`w-10 h-10 flex items-center justify-center border border-[var(--color-border)] transition-all duration-300 ${
                      !PRESET_COLORS.includes(coverColor) ? "scale-110 border-[var(--color-gold)] shadow-[0_0_10px_var(--color-gold-muted)]" : "hover:scale-105 hover:border-[var(--color-gold-muted)]"
                    }`}
                    style={{ backgroundColor: coverColor }}
                  >
                    <Plus className="w-4 h-4 text-white drop-shadow-md mix-blend-difference" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[var(--color-border)]">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-sm font-display font-bold tracking-[0.2em] uppercase bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] hover:bg-[var(--color-surface)] text-[var(--color-gold)] transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <span className="font-mono tracking-widest animate-pulse text-xs">[ MEMAHAT... ]</span>
              ) : (
                "Segel Kitab Baru"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
