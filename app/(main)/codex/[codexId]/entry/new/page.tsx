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
      try { localStorage.setItem(`${draftKey}:fields`, JSON.stringify({ title, summary, tags, metadata, category })); } catch {}
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
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      setError("Judul dan Kategori wajib diisi.");
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
          metadata
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat entri.");

      // Clear autosave draft on success
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
      <header className="sticky top-0 z-20 w-full px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={`/codex/${params.codexId}`} className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">Urung Memahat</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 flex items-center justify-between border-b border-[var(--color-border)] pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-[var(--color-gold)]" />
          <div>
            <h1 className="font-display font-black text-4xl text-[var(--color-text)] mb-2 tracking-widest uppercase">
              Tulis Lembaran Baru
            </h1>
            <p className="font-body italic text-lg text-[var(--color-text-muted)]">
              Tambahkan detail sejarah, jiwa, atau tempat ke dalam pustaka semesta Anda.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-crimson)] font-mono text-sm uppercase tracking-wide">
            [AURA PENOLAKAN] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          
          {/* Editor Column */}
          <div className="xl:col-span-2 space-y-8">
            <div className="tome-border bg-[var(--color-surface)] relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-[var(--color-gold)] opacity-50" />
              
              <div className="p-8 space-y-8">
                {/* Category & Title */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/3">
                    <label className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
                      Sifat Entitas
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 text-sm font-mono tracking-widest uppercase border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                    >
                      {Object.keys(CATEGORY_LABELS).map((cat) => (
                        <option key={cat} value={cat}>{CATEGORY_LABELS[cat as CategoryType]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full md:flex-1">
                    <label className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
                      Gelar / Nama Sebutan *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Misal: Pangeran Terbuang dari Xylos"
                      className="w-full px-4 py-3 font-display text-xl tracking-wide border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors placeholder:font-body placeholder:italic placeholder:text-[var(--color-text-muted)]"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em]">
                      Bait Pembuka (Opsional)
                    </label>
                    <span className="font-mono text-[10px] text-[var(--color-gold)] uppercase tracking-wider flex items-center gap-2 border border-[var(--color-gold-muted)]/50 px-2 py-1 bg-[var(--color-surface-2)]">
                      <Sparkles className="w-3 h-3" />
                      Kosongkan untuk Sihir AI
                    </span>
                  </div>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={2}
                    placeholder="Satu atau dua bait untuk merangkum esensi dari entitas ini..."
                    className="w-full px-4 py-4 font-body text-lg italic border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none placeholder:text-[var(--color-text-muted)]"
                  />
                </div>

                <div className="w-full flex justify-center opacity-50 py-2">
                  <div className="ornate-divider-h w-2/3" />
                </div>

                {/* Content / Rich Text Editor */}
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold-muted)] uppercase tracking-[0.2em] mb-3">
                    Naskah Lengkap
                  </label>
                  <RichTextEditor 
                    content={content} 
                    onChange={setContent}
                    draftKey={draftKey}
                    placeholder="Jabarkan sejarah, karakteristik, tragedi, atau kejayaan mereka di sini..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Metadata Dynamic Form */}
            <div className="tome-border bg-[var(--color-surface)]">
              <h3 className="font-display font-bold text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-center justify-between">
                <span>Atribut Khas</span>
                <CategoryBadge category={category} className="border-none bg-transparent scale-90 origin-right" />
              </h3>
              
              <div className="p-6 space-y-6">
                {schema.map((field) => (
                  <div key={field.key} className="relative">
                    <label className="block font-mono text-[10px] text-[var(--color-gold-muted)] uppercase tracking-widest mb-2">
                      [ {field.label} ]
                    </label>
                    {field.type === "text" ? (
                      <input
                        type="text"
                        value={metadata[field.key] || ""}
                        onChange={(e) => setMetadata({ ...metadata, [field.key]: e.target.value })}
                        className="w-full px-3 py-2 text-sm font-body italic bg-[var(--color-bg)] border-b border-t-0 border-l-0 border-r-0 border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-0 placeholder-[var(--color-border)]"
                        placeholder="Ukir nilai..."
                      />
                    ) : (
                      <input
                        type="text"
                        value={metadata[field.key] ? metadata[field.key].join(", ") : ""}
                        onChange={(e) => setMetadata({ 
                          ...metadata, 
                          [field.key]: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                        })}
                        className="w-full px-3 py-2 text-sm font-body italic bg-[var(--color-bg)] border-b border-t-0 border-l-0 border-r-0 border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-0 placeholder-[var(--color-border)]"
                        placeholder="Pisahkan dengan koma"
                      />
                    )}
                  </div>
                ))}
                {schema.length === 0 && (
                  <p className="font-body text-sm text-[var(--color-text-muted)] italic text-center py-4">
                    Kategori ini tidak membutuhkan rincian atribut khusus.
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="tome-border bg-[var(--color-surface)]">
              <h3 className="font-display font-bold text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                Segel Tanda (Tags)
              </h3>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-mono tracking-wider flex items-center gap-2 group transition-colors hover:border-[var(--color-crimson)]">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-crimson)] transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {tags.length === 0 && (
                    <span className="font-body text-sm text-[var(--color-text-muted)] italic">Belum ada segel penanda.</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Tulis segel lalu tekan Enter..."
                    className="w-full px-4 py-3 font-body italic text-sm bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] placeholder-[var(--color-border)]"
                  />
                  <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-border)] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 text-sm font-display font-bold tracking-[0.3em] uppercase bg-[var(--color-surface-2)] border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] hover:bg-[var(--color-surface)] text-[var(--color-gold)] transition-all shadow-[0_0_15px_rgba(194,168,120,0.1)] hover:shadow-[0_0_20px_rgba(194,168,120,0.2)] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="font-mono tracking-widest animate-pulse text-xs text-[var(--color-gold-muted)]">[ MENGUKIR TAKDIR... ]</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Pahat Lembaran Ini
                </>
              )}
            </button>
            
          </div>
        </form>
      </main>
    </div>
  );
}
