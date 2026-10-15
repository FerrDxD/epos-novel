"use client";

import { useState } from "react";
import { Users, MapPin, Flag, Calendar, Lightbulb, Ghost } from "lucide-react";

interface PillarData {
  key: string;
  name: string;
  subtitle: string;
  color: string;
  bgRamp: string;
  borderColor: string;
  icon: any;
  description: string;
  customFields: string[];
  sampleTitle: string;
  sampleMeta: Record<string, string>;
  sampleQuote: string;
}

const PILLARS: PillarData[] = [
  {
    key: "characters",
    name: "Tokoh Utama",
    subtitle: "Pahlawan, Dewa, & Jiwa Fana",
    color: "#C2A878",
    bgRamp: "rgba(194, 168, 120, 0.1)",
    borderColor: "rgba(194, 168, 120, 0.35)",
    icon: Users,
    description: "Dokumentasikan garis keturunan, motivasi psikologis, arah moral (alignment), dan ikatan takdir antar karakter dalam jalinan relasi multidimensi.",
    customFields: ["Usia & Ras", "Arah Moral (Alignment)", "Gelar Kehormatan", "Faksi Naungan", "Senjata Utama"],
    sampleTitle: "Elysia Sang Penganyam Bintang",
    sampleMeta: {
      "Ras": "High Elf / Keturunan Fajar",
      "Gelar": "Penyair Agung Ordo Astralis",
      "Arah Moral": "Chaotic Good",
      "Status": "Mengembara di Dataran Beku"
    },
    sampleQuote: "Kematian hanyalah jeda ketukan sebelum bait lagu kedua dimulai."
  },
  {
    key: "locations",
    name: "Peta Geografis",
    subtitle: "Reruntuhan Kuno, Dimensi, & Kota Bertembok",
    color: "#6C9AA0",
    bgRamp: "rgba(28, 43, 45, 0.3)",
    borderColor: "rgba(108, 154, 160, 0.4)",
    icon: MapPin,
    description: "Petakan iklim, arsitektur, pertahanan wilayah, dan lapisan dimensi. Lokasi bukan sekadar latar belakang, melainkan panggung hidup yang membentuk kebudayaan.",
    customFields: ["Koordinat / Dimensi", "Iklim & Ekologi", "Struktur Pertahanan", "Penguasa Wilayah", "Situs Suci"],
    sampleTitle: "Lembah Kabut Alabaster",
    sampleMeta: {
      "Letak": "Sektor 04 — Benua Selatan",
      "Kondisi": "Tertutup Kabut Abadi",
      "Flora Unik": "Mawar Perak Pemakan Cahaya",
      "Akses": "Hanya via Gerbang Ritus Air"
    },
    sampleQuote: "Siapapun yang melintasi sungai tanpa mengucap mantra akan melupakan namanya sendiri dalam tiga purnama."
  },
  {
    key: "factions",
    name: "Bendera Faksi",
    subtitle: "Guild, Sekte Rahasia, & Dinasti Penguasa",
    color: "#CF5757",
    bgRamp: "rgba(139, 30, 30, 0.2)",
    borderColor: "rgba(207, 87, 87, 0.4)",
    icon: Flag,
    description: "Susun hierarki kekuasaan, doktrin politik, rahasia tertutup, dan permusuhan antar marga yang memicu konflik skala benua.",
    customFields: ["Struktur Dewan", "Doktrin Rahasia", "Sumber Keuangan", "Sekutu & Musuh", "Simbol Panji"],
    sampleTitle: "Konfederasi Besi Hitam",
    sampleMeta: {
      "Pemimpin": "Grand Marshall Vane",
      "Markas": "Benteng Grendel",
      "Doktrin": "Kedaulatan Mutlak Tanpa Sihir",
      "Kekuatan": "30.000 Pasukan Berzirah Runic"
    },
    sampleQuote: "Besi tidak mengenal belas kasihan para dewa; besi hanya patuh pada palu penempa."
  },
  {
    key: "events",
    name: "Kronik Waktu",
    subtitle: "Perang Besar, Titik Balik, & Perjanjian Abadi",
    color: "#C29F83",
    bgRamp: "rgba(96, 71, 51, 0.25)",
    borderColor: "rgba(194, 159, 131, 0.4)",
    icon: Calendar,
    description: "Jelajahi garis masa interaktif. Setiap pertempuran, bencana kosmik, atau kelahiran juru selamat saling terikat dalam rantai kausalitas sebab-akibat.",
    customFields: ["Tahun & Era", "Lokasi Kejadian", "Pihak Terlibat", "Korban & Dampak", "Artefak yang Hilang"],
    sampleTitle: "Malam Pecahnya Segel Aethel",
    sampleMeta: {
      "Era": "Tahun 124 Era Kegelapan",
      "Penyebab": "Pengkhianatan Kardinal Ketiga",
      "Dampak": "Runtuhnya Perlindungan Benua Barat",
      "Hasil": "Perjanjian Tiga Kerajaan Terbakar"
    },
    sampleQuote: "Langit malam itu terbakar menjadi warna tembaga cair selama tujuh hari tujuh malam."
  },
  {
    key: "concepts",
    name: "Hukum Semesta",
    subtitle: "Sistem Sihir, Fisika Fiktif, & Dogma Religi",
    color: "#E8DCC4",
    bgRamp: "rgba(232, 220, 196, 0.1)",
    borderColor: "rgba(232, 220, 196, 0.35)",
    icon: Lightbulb,
    description: "Bangun sistem sihir yang konsisten. Tetapkan hukum kekekalan energi, mantra terlarang, batasan biologis, dan konsekuensi harga yang harus dibayar.",
    customFields: ["Sumber Daya (Prana/Mana)", "Hukum Pembatas", "Tingkatan Inisiasi", "Resiko Gagal", "Mantra Sakral"],
    sampleTitle: "Hukum Alkimia Kristal Jiwa",
    sampleMeta: {
      "Kategori": "Sihir Resonansi Batin",
      "Batas": "Tidak dapat membangkitkan yang mati",
      "Bahan Baku": "Debu Bintang & Darah Murni",
      "Hukuman": "Kekeringan Roh Abadi"
    },
    sampleQuote: "Setiap gram daya yang dipinjam dari alam harus dikembalikan dengan seratus denyut jantung."
  },
  {
    key: "monsters",
    name: "Bestiary",
    subtitle: "Makhluk Mitos, Leviathan, & Entitas Kosmik",
    color: "#C76262",
    bgRamp: "rgba(61, 19, 19, 0.3)",
    borderColor: "rgba(199, 98, 98, 0.4)",
    icon: Ghost,
    description: "Katalog anatomi makhluk buas, kebiasaan berburu, titik lemah elemental, dan drop material langka yang dicari oleh para penjelajah.",
    customFields: ["Tingkat Ancaman (CR)", "Habitat Utama", "Kelemahan Elemental", "Organ Magis", "Metode Penjinakan"],
    sampleTitle: "Leviathan Palung Obsidian",
    sampleMeta: {
      "Klasifikasi": "Behemoth Kelas Bencana",
      "Habitat": "Kedalaman 8.000 Meter Samudra Barat",
      "Kelemahan": "Petir Langit Biru di Mata Ketiga",
      "Drop": "Sisik Kedap Tekanan Kosmik"
    },
    sampleQuote: "Saat ia bernapas, air laut surut sejauh satu mil dari bibir pantai."
  }
];

export default function PillarsLedger() {
  const [activePillarKey, setActivePillarKey] = useState<string>("characters");

  const current = PILLARS.find(p => p.key === activePillarKey) || PILLARS[0];
  const CurrentIcon = current.icon;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-20 relative">
      
      {/* Hairline top divider */}
      <div className="w-full flex justify-center mb-16 opacity-60">
        <div className="ornate-divider-h w-2/3" />
      </div>

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--color-text)] tracking-wider uppercase mb-4">
          Enam Fondasi Semesta
        </h2>
        <p className="font-body text-xl text-[var(--color-text-muted)] italic leading-relaxed">
          Struktur terklasifikasi yang menjaga keteraturan semesta Anda. Dari karakter terkecil hingga hukum fisika fiktif yang melandasi peradaban.
        </p>
      </div>

      {/* Pillar Tab Selector (6 horizontal badges) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          const isActive = p.key === activePillarKey;
          return (
            <button
              key={p.key}
              onClick={() => setActivePillarKey(p.key)}
              className={`p-4 rounded-lg border transition-all duration-300 flex flex-col items-center text-center gap-2 relative ${
                isActive
                  ? "bg-[var(--color-surface-2)] shadow-[0_0_20px_rgba(232,208,141,0.15)] scale-[1.02]"
                  : "bg-[var(--color-surface)]/60 hover:bg-[var(--color-surface-2)] border-[var(--color-border)] opacity-75 hover:opacity-100"
              }`}
              style={{
                borderColor: isActive ? p.color : undefined
              }}
            >
              {isActive && (
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ backgroundColor: p.color }}
                />
              )}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center border transition-transform"
                style={{
                  borderColor: p.borderColor,
                  backgroundColor: p.bgRamp,
                  color: p.color
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`font-display text-xs font-bold tracking-wider uppercase ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"}`}>
                {p.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Specimen Showcase Spread for Selected Pillar */}
      <div 
        className="tome-border p-6 sm:p-10 rounded-xl bg-[var(--color-surface)]/90 relative overflow-hidden transition-all duration-500"
        style={{ borderColor: current.borderColor }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Pillar Anatomy & Capabilities (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-widest border"
                style={{
                  backgroundColor: current.bgRamp,
                  borderColor: current.borderColor,
                  color: current.color
                }}
              >
                <CurrentIcon className="w-3.5 h-3.5" />
                {current.name}
              </span>
              <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                {current.subtitle}
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-text)] tracking-wide">
              Manajemen Khusus untuk {current.name}
            </h3>

            <p className="font-body text-lg text-[var(--color-text-muted)] leading-relaxed italic">
              {current.description}
            </p>

            {/* Configured fields tags */}
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-gold-muted)] block mb-3">
                Metadata Khas Kategori Ini:
              </span>
              <div className="flex flex-wrap gap-2">
                {current.customFields.map((field, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 text-xs font-mono rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] tracking-wider"
                  >
                    + {field}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Specimen Card Preview (6 cols) */}
          <div className="lg:col-span-6">
            <div className="bg-[var(--color-bg)]/95 border border-[var(--color-border)] p-6 sm:p-8 rounded-lg shadow-xl relative">
              
              {/* Category indicator ribbon */}
              <div 
                className="w-12 h-1 mb-4 rounded-full"
                style={{ backgroundColor: current.color }}
              />

              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-[var(--color-gold-muted)] uppercase tracking-widest">
                  CONTOH LEMBARAN KANON
                </span>
                <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  STATUS: TERVERIFIKASI
                </span>
              </div>

              <h4 className="font-display font-bold text-2xl text-[var(--color-text)] mb-4 tracking-wide">
                {current.sampleTitle}
              </h4>

              {/* Specimen Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-[var(--color-surface)]/60 p-4 rounded border border-[var(--color-border)]/50">
                {Object.entries(current.sampleMeta).map(([k, v]) => (
                  <div key={k} className="text-xs font-mono">
                    <span className="text-[var(--color-text-muted)] block uppercase text-xs tracking-wider opacity-80">{k}</span>
                    <span className="text-[var(--color-text)] font-semibold mt-0.5 block">{v}</span>
                  </div>
                ))}
              </div>

              {/* Lore quote */}
              <blockquote className="font-body text-base italic text-[var(--color-gold-muted)] pl-4 border-l-2 border-[var(--color-gold)]">
                "{current.sampleQuote}"
              </blockquote>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
