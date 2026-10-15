"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import CategoryBadge, {
  CATEGORY_COLORS,
  CategoryType,
} from "../codex/CategoryBadge";
import RelationsPanel from "./RelationsPanel";
import EntryHistoryPanel from "./EntryHistoryPanel";
import RichTextEditor, { clearDraft } from "../ui/RichTextEditor";
import ThemeToggle from "../ui/ThemeToggle";

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

interface Props {
  codexId: string;
  codexTitle: string;
  entry: any;
  relations: any[];
  allEntries: any[];
  canWrite: boolean;
}

export default function EntryDetailView({
  codexId,
  codexTitle,
  entry,
  relations,
  allEntries,
  canWrite,
}: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Edit form states
  const [title, setTitle] = useState(entry.title);
  const [summary, setSummary] = useState(entry.summary || "");
  const [content, setContent] = useState(entry.content || "");
  const [tags, setTags] = useState<string[]>(entry.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [metadata, setMetadata] = useState<Record<string, any>>(entry.metadata || {});

  const draftKey = `epos:draft:${codexId}:${entry.id}`;
  const color = CATEGORY_COLORS[entry.category as CategoryType] || "var(--color-gold)";
  const schema = METADATA_SCHEMAS[entry.category] || [];

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Gelar / Judul entitas wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/entry/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          content,
          tags,
          metadata,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengupdate lembaran.");

      try {
        clearDraft(draftKey);
      } catch {}

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Kirimkan lembaran "${entry.title}" ke Kubah Sampah? Anda dapat memulihkannya nanti jika diperlukan.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/entry/${entry.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuang lembaran.");
      }
      router.push(`/codex/${codexId}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href={`/codex/${codexId}`}
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">
              Tutup Lembaran
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {canWrite && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-2)] text-[var(--color-gold)] font-display text-xs tracking-widest uppercase transition-colors flex items-center gap-2 border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] rounded-sm"
                  title="Pahat Ulang Lembaran"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pahat Ulang</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-crimson)] hover:border-[var(--color-crimson)] transition-colors bg-[var(--color-surface)] rounded-sm"
                  title="Kirim ke Kubah Sampah"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-display text-xs tracking-widest uppercase transition-colors rounded-sm"
              >
                Batal
              </button>
            )}

            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10">
        {error && (
          <div className="mb-8 p-4 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-crimson)] font-mono text-xs uppercase tracking-wide rounded">
            [PERINGATAN] {error}
          </div>
        )}

        {/* Editing Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-7">
              <div className="tome-border rounded-xl bg-[var(--color-surface)] relative overflow-hidden shadow-xl p-7 sm:p-8 space-y-7">
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
                  <h2 className="font-display font-black text-xl text-[var(--color-gold)] tracking-wider uppercase flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    <span>Mode Pahat Ulang</span>
                  </h2>
                  <CategoryBadge category={entry.category} />
                </div>

                {/* Title */}
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                    Gelar / Nama Sebutan *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] font-display text-lg tracking-wide"
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                    Bait Pembuka / Ringkasan Intisari
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] font-body text-base italic resize-none leading-relaxed"
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                    Naskah Lengkap Lembaran
                  </label>
                  <RichTextEditor
                    content={content}
                    onChange={setContent}
                    draftKey={draftKey}
                    placeholder="Tuliskan perubahan naskah di sini..."
                  />
                </div>
              </div>
            </div>

            {/* Sidebar for edit */}
            <div className="space-y-6">
              {/* Dynamic Metadata Attributes */}
              <div className="tome-border rounded-xl bg-[var(--color-surface)] shadow-lg overflow-hidden">
                <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
                  <h3 className="font-display font-bold text-xs tracking-[0.25em] uppercase text-[var(--color-gold)]">
                    Atribut Khas
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {schema.map((field) => (
                    <div key={field.key}>
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
                          className="w-full px-3 py-2 rounded text-base font-body italic bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)]"
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
                          className="w-full px-3 py-2 rounded text-base font-body italic bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)]"
                          placeholder="Pisahkan dengan koma"
                        />
                      )}
                    </div>
                  ))}
                  {schema.length === 0 && (
                    <p className="font-body text-base text-[var(--color-text-muted)] italic text-center py-2">
                      Kategori ini tidak memiliki atribut khusus.
                    </p>
                  )}
                </div>
              </div>

              {/* Tags Editor */}
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
                        className="px-2.5 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] text-xs font-mono tracking-wider flex items-center gap-2 rounded-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-crimson)]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Ketik segel lalu tekan Enter..."
                      className="w-full px-3 py-2 rounded font-body italic text-sm bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)]"
                    />
                    <Plus className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-border)] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-4 rounded-full tome-border font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] bg-[var(--color-surface)] hover:bg-[var(--color-gold)]/10 shadow-[0_0_20px_rgba(232,208,141,0.15)] hover:shadow-[0_0_30px_rgba(232,208,141,0.25)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="font-mono tracking-widest animate-pulse text-xs text-[var(--color-gold-muted)]">
                    [ MENYIMPAN REKAMAN... ]
                  </span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Pahatan Baru</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Reading Mode */
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main Content Column */}
            <div className="lg:w-2/3 space-y-8">
              {/* Header: Title, Category, Summary */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <CategoryBadge category={entry.category} />
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[var(--color-text)] mb-6 tracking-wide leading-tight border-b border-[var(--color-border)] pb-6 relative uppercase">
                  <div
                    className="absolute bottom-0 left-0 w-24 h-[2px]"
                    style={{ backgroundColor: color }}
                  />
                  {entry.title}
                </h1>

                {entry.summary && (
                  <div
                    className="font-body text-xl sm:text-2xl text-[var(--color-text-muted)] leading-relaxed italic border-l-2 pl-6 py-2 my-6"
                    style={{ borderColor: `${color}80` }}
                  >
                    {entry.summary}
                  </div>
                )}

                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {entry.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[var(--color-surface)] text-[var(--color-gold-muted)] text-xs uppercase tracking-wider font-mono border border-[var(--color-border)] rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center py-4 opacity-40">
                <div className="ornate-divider-h w-full" />
              </div>

              {/* Manuscript Content Section */}
              <div
                className="font-body text-lg sm:text-xl leading-loose text-[var(--color-text)] prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-display prose-headings:font-bold prose-headings:tracking-widest prose-headings:uppercase prose-headings:text-[var(--color-gold)]
                prose-a:text-[var(--color-gold)] prose-a:underline prose-a:decoration-[var(--color-gold-muted)] prose-a:underline-offset-4
                prose-strong:text-[var(--color-text)] prose-strong:font-bold
                prose-blockquote:border-l-[var(--color-gold-muted)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-[var(--color-text-muted)]
                prose-img:border prose-img:border-[var(--color-border)] prose-img:shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              >
                {entry.content ? (
                  (() => {
                    let parsed = entry.content;
                    const isHtml = /<[a-z][\s\S]*>/i.test(parsed);
                    const sortedEntries = [...allEntries].sort(
                      (a, b) => b.title.length - a.title.length
                    );

                    sortedEntries.forEach((ent) => {
                      if (ent.id === entry.id) return;
                      const escapedTitle = ent.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

                      if (isHtml) {
                        try {
                          const mentionRegex = new RegExp(
                            `(?<!<[^>]*)@${escapedTitle}\\b(?![^<]*>)`,
                            "gi"
                          );
                          parsed = parsed.replace(
                            mentionRegex,
                            `<a href="/codex/${codexId}/entry/${ent.id}">${ent.title}</a>`
                          );

                          const autoLinkRegex = new RegExp(
                            `(?<!<[^>]*)(?<!<a[^>]*>)\\b${escapedTitle}\\b(?![^<]*</a>)(?![^<]*>)`,
                            "g"
                          );
                          parsed = parsed.replace(
                            autoLinkRegex,
                            `<a href="/codex/${codexId}/entry/${ent.id}">${ent.title}</a>`
                          );
                        } catch (e) {}
                      } else {
                        const mentionRegex = new RegExp(`@${escapedTitle}\\b`, "gi");
                        parsed = parsed.replace(
                          mentionRegex,
                          `[${ent.title}](/codex/${codexId}/entry/${ent.id})`
                        );

                        try {
                          const autoLinkRegex = new RegExp(
                            `(?<!\\[[^\\]]*)\\b${escapedTitle}\\b(?![^\\[]*\\])`,
                            "g"
                          );
                          parsed = parsed.replace(
                            autoLinkRegex,
                            `[${ent.title}](/codex/${codexId}/entry/${ent.id})`
                          );
                        } catch (e) {}
                      }
                    });

                    if (isHtml) {
                      return <div dangerouslySetInnerHTML={{ __html: parsed }} />;
                    } else {
                      return <ReactMarkdown>{parsed}</ReactMarkdown>;
                    }
                  })()
                ) : (
                  <p className="text-[var(--color-text-muted)] italic text-center py-12">
                    Belum ada torehan tinta pada perkamen ini.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar Column: Attributes, Relations, History */}
            <div className="lg:w-1/3 space-y-8">
              {/* Characteristics Attributes Card */}
              <div className="bg-[var(--color-surface)] tome-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-center">
                  <h3 className="font-display font-bold text-xs tracking-[0.25em] uppercase text-[var(--color-gold)]">
                    Karakteristik & Ciri Khusus
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {Object.keys(entry.metadata || {}).length === 0 ? (
                    <p className="text-base font-body italic text-[var(--color-text-muted)] text-center py-4">
                      Tak ada anomali atau ciri spesifik yang terekam.
                    </p>
                  ) : (
                    Object.entries(entry.metadata as Record<string, any>).map(([key, val]) => {
                      if (!val || (Array.isArray(val) && val.length === 0)) return null;
                      return (
                        <div
                          key={key}
                          className="border-b border-dashed border-[var(--color-border)] pb-3 last:border-0 last:pb-0"
                        >
                          <span className="block text-xs font-mono font-bold text-[var(--color-gold-muted)] uppercase tracking-wider mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="font-body text-base text-[var(--color-text)] italic leading-relaxed">
                            {Array.isArray(val) ? val.join(", ") : String(val)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Relations Panel */}
              <RelationsPanel
                codexId={codexId}
                entryId={entry.id}
                relations={relations}
                allEntries={allEntries}
              />

              {/* Version History Panel */}
              <EntryHistoryPanel entryId={entry.id} canWrite={canWrite} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
