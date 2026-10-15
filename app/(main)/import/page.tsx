"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";
import ThemeToggle from "../../../components/ui/ThemeToggle";

interface Codex {
  id: string;
  title: string;
}

function GlobalImportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectCodexId = searchParams.get("codexId") || "";

  const [codexes, setCodexes] = useState<Codex[]>([]);
  const [selectedCodex, setSelectedCodex] = useState(preselectCodexId);
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [sourceType, setSourceType] = useState("docx");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ extractedCount: number } | null>(null);

  useEffect(() => {
    fetch("/api/codex")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCodexes(data);
          if (!selectedCodex && data.length > 0) {
            setSelectedCodex(data[0].id);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch codexes", err));
  }, [selectedCodex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (!selectedCodex) {
      setError("Silakan pilih Kitab tujuan.");
      return;
    }
    if (activeTab === "file" && !file) {
      setError("Silakan letakkan perkamen untuk diunggah.");
      return;
    }
    if (activeTab === "url" && !url.trim()) {
      setError("Silakan masukkan benang penghubung (URL).");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("codexId", selectedCodex);
    formData.append("sourceType", sourceType);

    if (activeTab === "file" && file) {
      formData.append("file", file);
    } else if (activeTab === "url" && url) {
      formData.append("url", url.trim());
    }

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sihir transmutasi gagal dilakukan.");

      setSuccess({ extractedCount: data.extractedCount });
      setFile(null);
      setUrl("");

      setTimeout(() => {
        router.push(`/codex/${selectedCodex}`);
        router.refresh();
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href={preselectCodexId ? `/codex/${preselectCodexId}` : "/dashboard"}
            className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">
              Batal Transmutasi
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-[var(--color-surface)] border border-[var(--color-gold)] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(232,208,141,0.15)] rotate-45">
            <Sparkles className="w-8 h-8 text-[var(--color-gold)] -rotate-45" />
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] mb-3 tracking-wide uppercase">
            Transmutasi Naskah
          </h1>
          <p className="font-body text-xl italic text-[var(--color-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Biarkan kecerdasan AI membaca naskah cerita Anda dan memahat elemen dunia ke dalam kitab secara otomatis.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-crimson)] font-mono text-xs uppercase tracking-wide rounded">
            [AURA PENOLAKAN] {error}
          </div>
        )}

        {success ? (
          <div className="mb-8 p-10 tome-border border-[var(--color-gold)] bg-[var(--color-surface)] text-center flex flex-col items-center rounded-xl shadow-2xl">
            <CheckCircle2 className="w-16 h-16 mb-4 text-[var(--color-gold)]" />
            <h3 className="font-display font-bold text-2xl mb-2 text-[var(--color-text)] uppercase tracking-widest">
              Transmutasi Berhasil
            </h3>
            <p className="font-body italic text-lg text-[var(--color-text-muted)]">
              Berhasil mengekstrak {success.extractedCount} intisari ke dalam kitab. Mengarahkan Anda kembali ke perpustakaan…
            </p>
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] tome-border rounded-xl shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-60" />

            {/* Codex Selector Header */}
            <div className="p-6 sm:p-8 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
              <label className="flex items-center gap-2.5 font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">
                <BookOpen className="w-4 h-4" />
                <span>Kitab Tujuan Pemahatan</span>
              </label>
              <select
                value={selectedCodex}
                onChange={(e) => setSelectedCodex(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 text-xs font-mono tracking-widest uppercase rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              >
                <option value="" disabled>
                  -- Pilih Kitab Pusaka --
                </option>
                {codexes.map((codex) => (
                  <option key={codex.id} value={codex.id}>
                    {codex.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("file");
                  setSourceType("docx");
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 font-display text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                  activeTab === "file"
                    ? "text-[var(--color-gold)] bg-[var(--color-surface)] border-b-2 border-[var(--color-gold)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-2)]"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Perkamen Dokumen</span>
              </button>
              <div className="w-[1px] bg-[var(--color-border)]" />
              <button
                type="button"
                onClick={() => {
                  setActiveTab("url");
                  setSourceType("gdocs");
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-4 font-display text-xs font-bold tracking-[0.2em] uppercase transition-colors ${
                  activeTab === "url"
                    ? "text-[var(--color-gold)] bg-[var(--color-surface)] border-b-2 border-[var(--color-gold)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface-2)]"
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Ikatan Naskah Daring (Link)</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-7">
              {/* Source Type Selector */}
              <div>
                <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                  Format Naskah Sumber
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-xs font-mono tracking-widest uppercase rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                >
                  {activeTab === "file" ? (
                    <>
                      <option value="docx">Berkas Word (.docx)</option>
                      <option value="pdf">Perkamen PDF (.pdf)</option>
                      <option value="md">Batu Tulis Markdown (.md)</option>
                    </>
                  ) : (
                    <>
                      <option value="gdocs">Ruang Tulis Google Docs</option>
                      <option value="gdrive">Gudang Google Drive</option>
                    </>
                  )}
                </select>
              </div>

              {/* Upload Input */}
              {activeTab === "file" ? (
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                    Letakkan Berkas (Maksimal 10MB)
                  </label>
                  <div className="border border-dashed border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] bg-[var(--color-bg)] rounded-lg p-10 text-center transition-colors relative shadow-inner">
                    <input
                      type="file"
                      disabled={isLoading}
                      accept={
                        sourceType === "docx"
                          ? ".docx"
                          : sourceType === "pdf"
                          ? ".pdf"
                          : ".md"
                      }
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {file ? (
                      <div className="font-display font-bold text-[var(--color-gold)] text-lg flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8" />
                        <span>{file.name}</span>
                        <span className="text-xs font-mono tracking-widest text-[var(--color-text-muted)]">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div className="text-[var(--color-text-muted)] flex flex-col items-center">
                        <div className="w-10 h-10 rounded border border-[var(--color-gold)] rotate-45 mb-4 flex items-center justify-center bg-[var(--color-surface)]">
                          <Upload className="w-4 h-4 text-[var(--color-gold)] -rotate-45" />
                        </div>
                        <span className="font-display text-xs tracking-[0.2em] uppercase text-[var(--color-text)] mb-1">
                          Klik atau jatuhkan naskah ke altar ini
                        </span>
                        <span className="font-mono text-xs opacity-60">
                          Mendukung DOCX, PDF, dan Markdown
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-2">
                    Tautan Dokumen Publik
                  </label>
                  <input
                    type="url"
                    disabled={isLoading}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://docs.google.com/..."
                    className="w-full px-4 py-3 font-mono text-xs border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                  />
                  <div className="mt-3 p-3.5 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-[var(--color-gold)] shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wide leading-relaxed">
                      Pastikan segel dokumen dibuka (<strong>"Anyone with the link"</strong>) agar sistem dapat mengakses dan membaca isinya.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-[var(--color-border)]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full tome-border font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] bg-[var(--color-surface)] hover:bg-[var(--color-gold)]/10 shadow-[0_0_20px_rgba(232,208,141,0.15)] hover:shadow-[0_0_30px_rgba(232,208,141,0.25)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="font-mono tracking-widest animate-pulse text-xs text-[var(--color-gold-muted)]">
                      [ MEMBEDAH AURA CERITA... ]
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Mulai Transmutasi</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GlobalImportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <div className="font-mono text-xs text-[var(--color-gold-muted)] tracking-[0.3em] animate-pulse">
            [ MENYIAPKAN ALTAR TRANSMUTASI... ]
          </div>
        </div>
      }
    >
      <GlobalImportContent />
    </Suspense>
  );
}
