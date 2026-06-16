"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Link as LinkIcon, FileText, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import ThemeToggle from "../../../../../components/ui/ThemeToggle";

export default function ImportPage({ params }: { params: { codexId: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const [sourceType, setSourceType] = useState("docx");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ extractedCount: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    if (activeTab === "file" && !file) {
      setError("Silakan pilih file untuk diunggah.");
      return;
    }
    if (activeTab === "url" && !url.trim()) {
      setError("Silakan masukkan URL.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("codexId", params.codexId);
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
      
      if (!res.ok) throw new Error(data.error || "Gagal mengimport dokumen.");

      setSuccess({ extractedCount: data.extractedCount });
      setFile(null);
      setUrl("");
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        router.push(`/codex/${params.codexId}`);
        router.refresh();
      }, 3000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200">
      <header className="sticky top-0 z-20 w-full px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href={`/codex/${params.codexId}`} className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Batal</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto bg-[var(--color-surface-2)] rounded-full flex items-center justify-center mb-4 border border-[var(--color-border)] shadow-sm">
            <UploadCloud className="w-8 h-8 text-[var(--color-primary)]" />
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-[var(--color-text)] mb-2">
            Import Lore Otomatis (AI)
          </h1>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
            Unggah dokumen atau masukkan link Google Docs. Gemini AI akan membaca cerita Anda dan mengekstrak karakter, lokasi, faksi, dan event secara otomatis.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-input border border-red-200 bg-red-50 text-red-700 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success ? (
          <div className="mb-6 p-8 rounded-card border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 mb-3" />
            <h3 className="font-bold text-xl mb-1">Import Berhasil!</h3>
            <p className="text-sm">Berhasil mengekstrak {success.extractedCount} entri ke dalam Codex. Mengalihkan ke halaman Codex...</p>
          </div>
        ) : (
          <div className="bg-[var(--color-surface)] rounded-card border border-[var(--color-border)] shadow-light overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)]">
              <button
                type="button"
                onClick={() => { setActiveTab("file"); setSourceType("docx"); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${activeTab === "file" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-surface-2)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface)]"}`}
              >
                <FileText className="w-4 h-4" />
                Upload File Lokal
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("url"); setSourceType("gdocs"); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${activeTab === "url" ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-[var(--color-surface-2)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] bg-[var(--color-surface)]"}`}
              >
                <LinkIcon className="w-4 h-4" />
                Link URL
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              {/* Source Type Selector */}
              <div>
                <label className="block text-xs font-mono font-medium text-[var(--color-text)] uppercase tracking-wider mb-2">
                  Format Sumber
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 text-sm rounded-input border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                >
                  {activeTab === "file" ? (
                    <>
                      <option value="docx">Microsoft Word (.docx)</option>
                      <option value="pdf">PDF Document (.pdf)</option>
                      <option value="md">Markdown (.md)</option>
                      <option value="json">JSON Export (.json)</option>
                    </>
                  ) : (
                    <>
                      <option value="gdocs">Google Docs</option>
                      <option value="gdrive">Google Drive</option>
                    </>
                  )}
                </select>
              </div>

              {/* Input Area */}
              {activeTab === "file" ? (
                <div>
                  <label className="block text-xs font-mono font-medium text-[var(--color-text)] uppercase tracking-wider mb-2">
                    Pilih File (Max 10MB)
                  </label>
                  <div className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-input p-6 text-center transition-colors relative bg-[var(--color-bg)]">
                    <input
                      type="file"
                      disabled={isLoading}
                      accept={sourceType === 'docx' ? '.docx' : sourceType === 'pdf' ? '.pdf' : sourceType === 'md' ? '.md' : '.json'}
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {file ? (
                      <div className="text-[var(--color-primary)] font-semibold flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ) : (
                      <div className="text-[var(--color-text-muted)]">
                        <UploadCloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <span className="text-sm">Klik atau drag file ke sini</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono font-medium text-[var(--color-text)] uppercase tracking-wider mb-2">
                    URL Link Publik
                  </label>
                  <input
                    type="url"
                    disabled={isLoading}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://docs.google.com/document/d/..."
                    className="w-full px-4 py-2.5 text-sm rounded-input border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">
                    * Pastikan pengaturan sharing file di-set ke "Anyone with the link".
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-sm font-bold rounded-input bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-on-primary)] transition-all shadow-medium flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[var(--color-on-primary)] border-t-transparent rounded-full animate-spin" />
                    Memproses dengan AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Mulai Ekstraksi
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
