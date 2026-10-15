"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, X, Plus } from "lucide-react";
import CategoryBadge, { CATEGORY_LABELS, CategoryType } from "../../../../../../components/codex/CategoryBadge";
import ThemeToggle from "../../../../../../components/ui/ThemeToggle";
import RichTextEditor, { clearDraft } from "../../../../../../components/ui/RichTextEditor";

const METADATA_SCHEMAS: Record<string, { key: string; label: string; type: "text" | "array" }[]> = {
  characters: [
    { key: "age", label: "Usia / Masa Hidup", type: "text" },
    { key: "gender", label: "Perawakan", type: "text" },
    { key: "role", label: "Peran dalam Takdir", type: "text" },
    { key: "affiliation", label: "Afiliasi", type: "text" },
    { key: "status", label: "Status Kehidupan", type: "text" },
    { key: "abilities", label: "Sihir & Kemampuan", type: "array" },
  ],
  locations: [
    { key: "type", label: "Bentuk Wilayah", type: "text" },
    { key: "climate", label: "Iklim Alam", type: "text" },
    { key: "population", label: "Jumlah Jiwa", type: "text" },
    { key: "significance", label: "Nilai Sejarah", type: "text" },
  ],
  factions: [
    { key: "type", label: "Jenis Kelompok", type: "text" },
    { key: "alignment", label: "Arah Moral", type: "text" },
    { key: "leader", label: "Sang Pemimpin", type: "text" },
    { key: "memberCount", label: "Estimasi Pengikut", type: "text" },
  ],
  events: [
    { key: "timeline", label: "Titik Waktu", type: "text" },
    { key: "type", label: "Sifat Insiden", type: "text" },
    { key: "outcome", label: "Dampak Takdir", type: "text" },
    { key: "involvedParties", label: "Pihak Terlibat", type: "array" },
  ],
  concepts: [
    { key: "type", label: "Cabang Pengetahuan", type: "text" },
    { key: "scope", label: "Skala Pengaruh", type: "text" },
    { key: "limitations", label: "Batas Hukum Alam", type: "array" },
  ],
  monsters: [
    { key: "type", label: "Kelas Binatang", type: "text" },
    { key: "habitat", label: "Sarang Utama", type: "text" },
    { key: "dangerLevel", label: "Ancaman Maut", type: "text" },
    { key: "abilities", label: "Kekuatan Buas", type: "array" },
    { key: "weaknesses", label: "Titik Buta / Kelemahan", type: "array" },
  ],
};

export default function NewEntryPage({ params }: { params: { codexId: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get("cat") || "characters";

  const draftKey = `epos:draft:${params.codexId}:new`;
  const [category, setCategory] = useState(defaultCat);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Hydrate non-editor fields from draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${draftKey}:fields`);
      if (!raw) return;
      const f = JSON.parse(raw);
      if (f.title) setTitle(f.title);
      if (f.summary) setSummary(f.summary);
      if (Array.isArray(f.tags)) setTags(f.tags);
      if (f.metadata) setMetadata(f.metadata);
      if (f.category) setCategory(f.category);
    } catch {}
  }, [draftKey]);

  // Autosave non-editor fields (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          `${draftKey}:fields`,
          JSON.stringify({ title, summary, tags, metadata, category })
        );
      } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [draftKey, title, summary, tags, metadata, category]);

  useEffect(() => {
    setMetadata({});
  }, [category]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      setError("Judul dan Kategori wajib diukir.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codexId: params.codexId,
          category,
          title,
          summary,
          content,
          tags,
          metadata,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat entri.");

      try {
        clearDraft(draftKey);
        localStorage.removeItem(`${draftKey}:fields`);
      } catch {}

      router.push(`/codex/${params.codexId}/entry/${data.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const schema = METADATA_SCHEMAS[category] || [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href={`/codex/${params.codexId}`}
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">
              Urung Memahat
            </span>
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
        <div className="mb-10 border-b border-[var(--color-border)] pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-[var(--color-gold)]" />
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] mb-2 tracking-wide uppercase">
            Pahat Lembaran Baru
          </h1>
          <p className="font-body italic text-lg text-[var(--color-text-muted)]">
            Ukir detail entitas semesta, garis keturunan, atau kronik masa lalu ke dalam kitab pusaka Anda.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-crimson)] font-mono text-xs uppercase tracking-wide rounded">
            [AURA PENOLAKAN] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Writing Area (2 cols) */}
          <div className="xl:col-span-2 space-y-7">
            <div className="tome-border rounded-xl bg-[var(--color-surface)] relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-60" />

              <div className="p-7 sm:p-8 space-y-7">
                {/* Category & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
                  <div className="sm:col-span-1">
                    <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                      Sifat Entitas
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 text-xs font-mono tracking-widest uppercase rounded border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    >
                      {Object.keys(CATEGORY_LABELS).map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat as CategoryType]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                      Gelar / Nama Sebutan *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Pangeran Terbuang dari Xylos"
                      className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] font-display text-lg tracking-wide placeholder:font-body placeholder:italic placeholder:text-[var(--color-text-muted)]/50"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em]">
                      Bait Pembuka / Ringkasan Intisari
                    </label>
                    <span className="font-mono text-xs text-[var(--color-gold)] uppercase tracking-wider flex items-center gap-1.5 border border-[var(--color-gold-muted)]/50 px-2 py-0.5 rounded bg-[var(--color-surface-2)]">
                      <Sparkles className="w-3 h-3" />
                      <span>Kosongkan untuk Ekstraksi AI</span>
                    </span>
                  </div>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={3}
                    placeholder="Satu atau dua bait untuk merangkum esensi dan posisi entitas ini dalam kosmos..."
                    className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)]/80 text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] font-body text-base italic resize-none leading-relaxed placeholder:text-[var(--color-text-muted)]/50"
                  />
                </div>

                <div className="w-full flex justify-center opacity-40 py-1">
                  <div className="ornate-divider-h w-2/3" />
                </div>

                {/* Rich Text Editor */}
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                    Naskah Lengkap Lembaran
                  </label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    draftKey={draftKey}
                    placeholder="Jabarkan sejarah, karakteristik, asal-usul sihir, tragedi, atau kejayaan mereka di sini..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Attributes, Tags & Actions */}
          <div className="space-y-6">
            {/* Metadata Dynamic Form */}
            <div className="tome-border rounded-xl bg-[var(--color-surface)] shadow-lg overflow-hidden">
              <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-between">
                <h3 className="font-display font-bold text-xs tracking-[0.25em] uppercase text-[var(--color-gold)]">
                  Atribut Khas
                </h3>
                <CategoryBadge category={category} className="border-none bg-transparent scale-90 origin-right" />
              </div>

              <div className="p-5 space-y-5">
                {schema.map((field) => (
                  <div key={field.key} className="relative">
                    <label className="block font-mono text-xs text-[var(--color-gold-muted)] uppercase tracking-wider mb-1.5">
                      {field.label}
                    </label>
                    {field.type === "text" ? (
                      <input
                        type="text"
                        value={metadata[field.key] || ""}
                        onChange={(e) =>
                          setMetadata({ ...metadata, [field.key]: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded text-base font-body italic bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] placeholder-[var(--color-text-muted)]/40"
                        placeholder="Ukir nilai..."
                      />
                    ) : (
                      <input
                        type="text"
                        value={
                          metadata[field.key] ? metadata[field.key].join(", ") : ""
                        }
                        onChange={(e) =>
                          setMetadata({
                            ...metadata,
                            [field.key]: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        className="w-full px-3 py-2 rounded text-base font-body italic bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] placeholder-[var(--color-text-muted)]/40"
                        placeholder="Pisahkan dengan koma"
                      />
                    )}
                  </div>
                ))}
                {schema.length === 0 && (
                  <p className="font-body text-base text-[var(--color-text-muted)] italic text-center py-4">
                    Kategori ini tidak membutuhkan rincian atribut khusus.
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="tome-border rounded-xl bg-[var(--color-surface)] shadow-lg overflow-hidden">
              <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                <h3 className="font-display font-bold text-xs tracking-[0.25em] uppercase text-[var(--color-gold)]">
                  Segel Tanda (Tags)
                </h3>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-mono tracking-wider flex items-center gap-2 rounded-sm group transition-colors hover:border-[var(--color-crimson)]"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[var(--color-text-muted)] group-hover:text-[var(--color-crimson)] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="font-body text-base text-[var(--color-text-muted)] italic">
                      Belum ada segel penanda.
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Ketik segel lalu tekan Enter..."
                    className="w-full px-3 py-2.5 rounded font-body italic text-sm bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] placeholder-[var(--color-text-muted)]/40"
                  />
                  <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-border)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full tome-border font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] bg-[var(--color-surface)] hover:bg-[var(--color-gold)]/10 shadow-[0_0_20px_rgba(232,208,141,0.15)] hover:shadow-[0_0_30px_rgba(232,208,141,0.25)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="font-mono tracking-widest animate-pulse text-xs text-[var(--color-gold-muted)]">
                  [ MENGUKIR TAKDIR... ]
                </span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Pahat Lembaran Ini</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
