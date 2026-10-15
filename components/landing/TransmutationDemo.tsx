"use client";

import { useState } from "react";
import { Sparkles, FileText, CheckCircle2, Cpu, Database } from "lucide-react";

export default function TransmutationDemo() {
  const [isTransmuting, setIsTransmuting] = useState<boolean>(false);

  const sampleRawText = `Bab 14: Pertempuran Lembah Es.
Jenderal Kaelan memimpin 500 ksatria berzirah runic dari Konfederasi Besi Hitam melintasi Danau Beku Morvath. Mereka mengejar penyihir pelarian bernama Vespera, yang dikabarkan membawa Fragmen Kristal Astral menuju Menara Jam Kuno. Vespera merapalkan mantra kabut pembeku sebelum gerbang tertutup selamanya.`;

  const handleTransmute = () => {
    setIsTransmuting(true);
    setTimeout(() => {
      setIsTransmuting(false);
    }, 1000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 relative">
      
      {/* Hairline top divider */}
      <div className="w-full flex justify-center mb-16 opacity-60">
        <div className="ornate-divider-h w-2/3" />
      </div>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] tracking-wider uppercase mb-4">
          Transmutasi Naskah Kasar
        </h2>
        <p className="font-body text-xl text-[var(--color-text-muted)] italic leading-relaxed">
          Unggah bab novel dari Google Docs, PDF, atau Word. Kecerdasan buatan mengekstrak tokoh, faksi, lokasi, dan hukum sihir ke dalam entitas kanon secara instan.
        </p>
      </div>

      <div className="tome-border p-6 sm:p-10 rounded-xl bg-[var(--color-surface)]/90 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Raw Draft Excerpt (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)]">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-border)]/60">
                <span className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-[var(--color-gold)]">
                  <FileText className="w-4 h-4 text-[var(--color-gold)]" />
                  Naskah Kasar (.DOCX / PDF)
                </span>
                <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase">
                  128 Kata
                </span>
              </div>
              <p className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line p-4 rounded bg-[var(--color-surface)]/60 border border-[var(--color-border)]/40 font-normal">
                {sampleRawText}
              </p>
            </div>

            <button
              onClick={handleTransmute}
              disabled={isTransmuting}
              className="mt-6 w-full py-3 px-4 rounded border border-[var(--color-gold)] bg-[var(--color-gold)]/10 hover:bg-[var(--color-gold)]/20 text-[var(--color-gold)] font-display text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isTransmuting ? "animate-spin" : ""}`} />
              {isTransmuting ? "Mengekstrak Inti Lore..." : "Jalankan Transmutasi"}
            </button>
          </div>

          {/* Center: Conduit Indicator (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4 py-4 text-center">
            <div className="w-12 h-12 rounded-full border border-[var(--color-gold)] flex items-center justify-center bg-[var(--color-surface-2)] text-[var(--color-gold)] shadow-[0_0_20px_rgba(232,208,141,0.2)]">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="hidden lg:block w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-gold-muted)]">
              AI ENGINE PARSER
            </span>
          </div>

          {/* Right: Extracted Structured Lore Entities (5 cols) */}
          <div className="lg:col-span-5 bg-[var(--color-bg)] p-6 rounded-lg border border-[var(--color-border)]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-border)]/60">
              <span className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Database className="w-4 h-4" />
                Entitas Hasil Ekstraksi
              </span>
              <span className="font-mono text-xs text-emerald-400 uppercase">
                4 Entitas Ditemukan
              </span>
            </div>

            <div className="space-y-3">
              {/* Entity 1: Kaelan */}
              <div className="p-3 rounded bg-[var(--color-surface)] border border-[rgba(194,168,120,0.3)] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-display font-bold uppercase tracking-wider bg-[rgba(194,168,120,0.15)] text-[#C2A878] rounded">
                      Tokoh Utama
                    </span>
                    <span className="font-display text-sm font-bold text-[var(--color-text)]">
                      Jenderal Kaelan
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-text-muted)]">
                    Pimpinan 500 ksatria berzirah runic • Konfederasi Besi Hitam
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              </div>

              {/* Entity 2: Danau Beku */}
              <div className="p-3 rounded bg-[var(--color-surface)] border border-[rgba(108,154,160,0.4)] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-display font-bold uppercase tracking-wider bg-[rgba(28,43,45,0.3)] text-[#6C9AA0] rounded">
                      Peta Geografis
                    </span>
                    <span className="font-display text-sm font-bold text-[var(--color-text)]">
                      Danau Beku Morvath
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-text-muted)]">
                    Kawasan perbatasan beku • Rute pelarian menuju Menara Jam
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              </div>

              {/* Entity 3: Vespera */}
              <div className="p-3 rounded bg-[var(--color-surface)] border border-[rgba(194,168,120,0.3)] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-display font-bold uppercase tracking-wider bg-[rgba(194,168,120,0.15)] text-[#C2A878] rounded">
                      Tokoh Utama
                    </span>
                    <span className="font-display text-sm font-bold text-[var(--color-text)]">
                      Vespera Sang Pelarian
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-text-muted)]">
                    Pembawa Fragmen Kristal Astral • Menguasai Mantra Kabut
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              </div>

              {/* Entity 4: Fragmen Kristal */}
              <div className="p-3 rounded bg-[var(--color-surface)] border border-[rgba(232,220,196,0.3)] flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-display font-bold uppercase tracking-wider bg-[rgba(232,220,196,0.15)] text-[#E8DCC4] rounded">
                      Hukum Semesta
                    </span>
                    <span className="font-display text-sm font-bold text-[var(--color-text)]">
                      Fragmen Kristal Astral
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-text-muted)]">
                    Artefak sihir pembeku • Kunci segel Menara Jam Kuno
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
