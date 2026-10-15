"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  MapPin, 
  Flag, 
  Calendar, 
  Lightbulb, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

interface LoreEntity {
  id: string;
  name: string;
  category: "characters" | "locations" | "factions" | "events" | "concepts";
  role: string;
  excerpt: string;
  attributes: Record<string, string>;
  connections: string[];
}

const SAMPLE_ENTITIES: Record<string, LoreEntity> = {
  arthur: {
    id: "arthur",
    name: "Raja Arthur Pendragon",
    category: "characters",
    role: "Penguasa Agung & Pemegang Janji Avalon",
    excerpt: "Dilahirkan di bawah gerhana kembar. Menyatukan dua belas marga Briton dengan menancapkan panji di puncak Bukit Badon.",
    attributes: {
      "Gelar": "Archon Camelot",
      "Afiliasi": "Ordo Meja Bundar",
      "Kondisi": "Hidup — Era Keemasan"
    },
    connections: ["camelot", "mejabundar", "excalibur", "gerhana"]
  },
  camelot: {
    id: "camelot",
    name: "Benteng Kristal Camelot",
    category: "locations",
    role: "Ibukota Kekaisaran Alabaster",
    excerpt: "Benteng berdinding marmer putih yang dipahat langsung dari punggung pegunungan purba. Tidak dapat ditembus selama lentera suci menyala.",
    attributes: {
      "Wilayah": "Lembah Uther",
      "Pertahanan": "Tembok Tiga Lapis",
      "Penguasa": "Raja Arthur"
    },
    connections: ["arthur", "mejabundar"]
  },
  mejabundar: {
    id: "mejabundar",
    name: "Ordo Meja Bundar",
    category: "factions",
    role: "Persaudaraan Ksatria Sumpah Abadi",
    excerpt: "Dua belas kesatria yang bersumpah darah di hadapan cawan suci untuk melindungi perbatasan dunia manusia dari makhluk bayangan.",
    attributes: {
      "Jumlah Kursi": "12 Kesatria",
      "Hukum": "Sumpah Alabaster",
      "Markas": "Aula Camelot"
    },
    connections: ["arthur", "camelot", "excalibur"]
  },
  excalibur: {
    id: "excalibur",
    name: "Pedang Cahaya Excalibur",
    category: "concepts",
    role: "Pusaka Inti Sistem Sihir Eter",
    excerpt: "Senjata yang ditempa dari meteorit bintang jatuh. Mengonsumsi prana pemiliknya untuk memotong jalinan ruang dan waktu fiktif.",
    attributes: {
      "Tipe": "Sihir Transmutasi Ruang",
      "Batas": "3 Kali Ayunan per Hari",
      "Asal": "Danau Kabut Avalon"
    },
    connections: ["arthur", "mejabundar", "gerhana"]
  },
  gerhana: {
    id: "gerhana",
    name: "Gerhana Kembar Tahun 502",
    category: "events",
    role: "Titik Balik Perang Alabaster",
    excerpt: "Peristiwa langit ketika dua bulan semesta sejajar. Menyebabkan anomali sihir yang melahirkan kembali gerbang menuju dimensi fajar.",
    attributes: {
      "Waktu": "Tahun 502 Era Keemasan",
      "Dampak": "Pelemahan Segel Void",
      "Status": "Tercatat dalam Kronik"
    },
    connections: ["arthur", "excalibur"]
  }
};

const CATEGORY_STYLES = {
  characters: {
    color: "#C2A878",
    bg: "rgba(194, 168, 120, 0.12)",
    border: "rgba(194, 168, 120, 0.4)",
    label: "Tokoh Utama",
    icon: Users
  },
  locations: {
    color: "#6C9AA0",
    bg: "rgba(28, 43, 45, 0.3)",
    border: "rgba(108, 154, 160, 0.4)",
    label: "Peta Geografis",
    icon: MapPin
  },
  factions: {
    color: "#CF5757",
    bg: "rgba(139, 30, 30, 0.2)",
    border: "rgba(207, 87, 87, 0.4)",
    label: "Bendera Faksi",
    icon: Flag
  },
  events: {
    color: "#C29F83",
    bg: "rgba(96, 71, 51, 0.25)",
    border: "rgba(194, 159, 131, 0.4)",
    label: "Kronik Waktu",
    icon: Calendar
  },
  concepts: {
    color: "#E8DCC4",
    bg: "rgba(232, 220, 196, 0.12)",
    border: "rgba(232, 220, 196, 0.4)",
    label: "Hukum Semesta",
    icon: Lightbulb
  }
};

export default function ScriptoriumDesk() {
  const [selectedId, setSelectedId] = useState<string>("arthur");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanComplete, setScanComplete] = useState<boolean>(false);

  const activeEntity = SAMPLE_ENTITIES[selectedId] || SAMPLE_ENTITIES.arthur;
  const activeStyle = CATEGORY_STYLES[activeEntity.category];
  const ActiveIcon = activeStyle.icon;

  const handleRunSentinel = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6">
      
      {/* Container framing desk */}
      <div className="tome-border p-4 sm:p-8 md:p-10 bg-[var(--color-surface)]/95 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative celestial corner accents */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[var(--color-gold)] opacity-40" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[var(--color-gold)] opacity-40" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[var(--color-gold)] opacity-40" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[var(--color-gold)] opacity-40" />

        {/* Desk Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[var(--color-gold)] rotate-45 shadow-[0_0_8px_var(--color-gold)]" />
            <span className="font-display text-xs sm:text-sm font-bold tracking-[0.25em] text-[var(--color-gold)] uppercase">
              Meja Penulis: Naskah Interaktif & Sentinental Lore
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest text-[var(--color-text-muted)] uppercase">
              STATUS KANON:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TERHUBUNG PENUH
            </span>
          </div>
        </div>

        {/* Main 2-Leaf Split: Left is Manuscript with live clickable mentions, Right is Lore Sentinel + Constellation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: The Open Manuscript (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[var(--color-bg)]/80 p-6 sm:p-8 rounded-lg border border-[var(--color-border)] relative">
            
            {/* Manuscript header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--color-border)]/60">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--color-gold-muted)]" />
                <span className="font-display text-xs font-semibold tracking-wider text-[var(--color-text)] uppercase">
                  Kronik Avalon — Lembaran IX
                </span>
              </div>
              <span className="font-mono text-xs text-[var(--color-text-muted)] tracking-wider">
                TipTap Engine v3.2
              </span>
            </div>

            {/* Manuscript Body with interactive @mentions */}
            <div className="prose prose-invert max-w-none font-body text-lg sm:text-xl text-[var(--color-text)] leading-relaxed space-y-5">
              <p>
                Ketika fajar menyingsing di atas tembok marmer{" "}
                <button
                  onClick={() => setSelectedId("camelot")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded text-sm font-display font-bold uppercase tracking-wider transition-all border ${
                    selectedId === "camelot"
                      ? "bg-[rgba(108,154,160,0.3)] border-[#6C9AA0] text-white shadow-[0_0_12px_rgba(108,154,160,0.5)] scale-105"
                      : "bg-[rgba(28,43,45,0.4)] border-[rgba(108,154,160,0.4)] text-[#93C2C9] hover:border-[#93C2C9]"
                  }`}
                >
                  <MapPin className="w-3 h-3 inline" />
                  @Benteng Camelot
                </button>
                , kabut tebal menyelimuti parit pertahanan. Belum pernah terjadi keheningan sedalam ini semenjak peristiwa{" "}
                <button
                  onClick={() => setSelectedId("gerhana")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded text-sm font-display font-bold uppercase tracking-wider transition-all border ${
                    selectedId === "gerhana"
                      ? "bg-[rgba(194,159,131,0.3)] border-[#C29F83] text-white shadow-[0_0_12px_rgba(194,159,131,0.5)] scale-105"
                      : "bg-[rgba(96,71,51,0.3)] border-[rgba(194,159,131,0.4)] text-[#DFCAA8] hover:border-[#DFCAA8]"
                  }`}
                >
                  <Calendar className="w-3 h-3 inline" />
                  @Gerhana Kembar 502
                </button>
                .
              </p>

              <p>
                Di tengah aula utama yang lengang,{" "}
                <button
                  onClick={() => setSelectedId("arthur")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded text-sm font-display font-bold uppercase tracking-wider transition-all border ${
                    selectedId === "arthur"
                      ? "bg-[rgba(194,168,120,0.25)] border-[var(--color-gold)] text-white shadow-[0_0_12px_rgba(232,208,141,0.5)] scale-105"
                      : "bg-[rgba(194,168,120,0.12)] border-[rgba(194,168,120,0.4)] text-[var(--color-gold)] hover:border-[var(--color-gold)]"
                  }`}
                >
                  <Users className="w-3 h-3 inline" />
                  @Raja Arthur
                </button>
                {" "}mengangkat pusaka keramatnya,{" "}
                <button
                  onClick={() => setSelectedId("excalibur")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded text-sm font-display font-bold uppercase tracking-wider transition-all border ${
                    selectedId === "excalibur"
                      ? "bg-[rgba(232,220,196,0.25)] border-[#E8DCC4] text-white shadow-[0_0_12px_rgba(232,220,196,0.5)] scale-105"
                      : "bg-[rgba(232,220,196,0.12)] border-[rgba(232,220,196,0.4)] text-[#F6F1E6] hover:border-[#F6F1E6]"
                  }`}
                >
                  <Lightbulb className="w-3 h-3 inline" />
                  @Excalibur
                </button>
                . Seluruh perwira dari{" "}
                <button
                  onClick={() => setSelectedId("mejabundar")}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded text-sm font-display font-bold uppercase tracking-wider transition-all border ${
                    selectedId === "mejabundar"
                      ? "bg-[rgba(207,87,87,0.3)] border-[#CF5757] text-white shadow-[0_0_12px_rgba(207,87,87,0.5)] scale-105"
                      : "bg-[rgba(139,30,30,0.25)] border-[rgba(207,87,87,0.4)] text-[#E38484] hover:border-[#E38484]"
                  }`}
                >
                  <Flag className="w-3 h-3 inline" />
                  @Ordo Meja Bundar
                </button>
                {" "}menghunus bilah mereka serentak, menyatukan sumpah bahwa hukum alam tak akan lagi tunduk pada anomali kegelapan.
              </p>
            </div>

            {/* Instruction tooltip below manuscript */}
            <div className="mt-8 pt-4 border-t border-[var(--color-border)]/60 flex items-center justify-between text-xs font-mono text-[var(--color-text-muted)]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-gold)]" />
                Klik salah satu sebutan <code className="text-[var(--color-gold)]">@entitas</code> untuk memeriksa takdirnya
              </span>
              <span className="hidden sm:inline opacity-60">Autosave: Aktif</span>
            </div>
          </div>

          {/* RIGHT COLUMN: The Lore Sentinel & Constellation Hub (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Entity Dossier Card */}
            <div 
              className="p-6 rounded-lg border transition-all duration-300 relative overflow-hidden bg-[var(--color-surface-2)]"
              style={{ borderColor: activeStyle.border }}
            >
              {/* Category indicator bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: activeStyle.color }}
              />

              <div className="flex items-center justify-between mb-4 mt-1">
                <span 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-display font-bold uppercase tracking-widest border"
                  style={{ 
                    color: activeStyle.color, 
                    backgroundColor: activeStyle.bg,
                    borderColor: activeStyle.border
                  }}
                >
                  <ActiveIcon className="w-3 h-3" />
                  {activeStyle.label}
                </span>

                <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  ID: #{activeEntity.id}
                </span>
              </div>

              <h4 className="font-display font-bold text-xl text-[var(--color-text)] mb-1 tracking-wide">
                {activeEntity.name}
              </h4>
              <p className="font-mono text-xs text-[var(--color-gold-muted)] mb-4 tracking-wider">
                {activeEntity.role}
              </p>

              <p className="font-body text-base italic text-[var(--color-text-muted)] mb-5 leading-relaxed bg-[var(--color-bg)]/50 p-3 rounded border border-[var(--color-border)]/50">
                "{activeEntity.excerpt}"
              </p>

              {/* Attributes breakdown */}
              <div className="space-y-2 mb-5">
                {Object.entries(activeEntity.attributes).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-xs font-mono py-1 border-b border-[var(--color-border)]/40">
                    <span className="text-[var(--color-text-muted)] uppercase tracking-wider text-xs">{key}</span>
                    <span className="text-[var(--color-text)] font-semibold">{val}</span>
                  </div>
                ))}
              </div>

              {/* Connected entities */}
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] block mb-2">
                  Jalinan Terhubung:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeEntity.connections.map((connId) => {
                    const conn = SAMPLE_ENTITIES[connId];
                    if (!conn) return null;
                    const cStyle = CATEGORY_STYLES[conn.category];
                    return (
                      <button
                        key={connId}
                        onClick={() => setSelectedId(connId)}
                        className="px-2.5 py-1 text-xs font-mono rounded border hover:scale-105 transition-all text-left"
                        style={{
                          borderColor: cStyle.border,
                          backgroundColor: cStyle.bg,
                          color: cStyle.color
                        }}
                      >
                        @{conn.name.split(" ")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Lore Sentinel Inspector */}
            <div className="p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/90 flex flex-col justify-between flex-1">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-gold)]" />
                    <span className="font-display text-xs font-bold tracking-wider text-[var(--color-gold)] uppercase">
                      Sentinental Lore AI
                    </span>
                  </div>
                  <button
                    onClick={handleRunSentinel}
                    disabled={isScanning}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono uppercase tracking-wider rounded border border-[var(--color-gold-muted)] text-[var(--color-gold)] hover:bg-[var(--color-gold-muted)]/20 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isScanning ? "animate-spin" : ""}`} />
                    {isScanning ? "Memindai..." : "Pindai Kontradiksi"}
                  </button>
                </div>

                <p className="font-body text-xs text-[var(--color-text-muted)] mb-4">
                  Mesin verifikasi membandingkan kronologi waktu, garis keturunan, dan hukum sihir di seluruh naskah Anda.
                </p>

                {/* Findings box */}
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-display font-semibold text-emerald-200 block">Kronik Usia & Genealogi: Valid</span>
                      <span className="font-body text-xs text-emerald-300/80">Kelahiran Arthur (478 M) selaras dengan pengangkatan takhta Camelot (500 M).</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-display font-semibold text-amber-200 block">Catatan Anomali Hukum Semesta</span>
                      <span className="font-body text-xs text-amber-300/80">Excalibur dipakai pada malam hari; bab 4 menyatakan prana eter hanya aktif di bawah sinar matahari.</span>
                    </div>
                  </div>

                  {scanComplete && (
                    <div className="p-2 rounded bg-indigo-950/40 border border-indigo-500/30 text-xs font-mono text-indigo-300 flex items-center justify-between animate-in fade-in">
                      <span>✓ 42 Entri saling tervalidasi</span>
                      <span className="text-xs opacity-70">Waktu respons: 0.18s</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase">
                  Siap memahat semesta sendiri?
                </span>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-xs font-display font-bold tracking-wider text-[var(--color-gold)] hover:text-white transition-colors"
                >
                  Buka Kitab <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
