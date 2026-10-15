import Link from "next/link";
import ThemeToggle from "../components/ui/ThemeToggle";
import ScriptoriumDesk from "../components/landing/ScriptoriumDesk";
import PillarsLedger from "../components/landing/PillarsLedger";
import TransmutationDemo from "../components/landing/TransmutationDemo";
import { ArrowRight, BookOpen, Compass, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      
      {/* Background Star Chart Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-[1200px] pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08] dark:opacity-[0.14]">
        <div className="w-[1200px] h-[1200px] rounded-full border border-[var(--color-gold)] absolute border-dashed opacity-30 animate-[spin_300s_linear_infinite]" />
        <div className="w-[850px] h-[850px] rounded-full border border-[var(--color-gold)] absolute opacity-40" />
        <div className="w-[600px] h-[600px] rounded-full border border-[var(--color-gold)] absolute animate-[spin_150s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-gold)] rotate-45 shadow-[0_0_15px_var(--color-gold)]" />
        </div>
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent absolute opacity-40" />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent absolute opacity-40" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <nav className="w-full px-6 sm:px-10 py-6 flex items-center justify-between z-30 relative backdrop-blur-md border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)]/80 sticky top-0">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-8 h-8 flex items-center justify-center border border-[var(--color-gold)] rotate-45 transition-transform group-hover:rotate-90 duration-500 bg-[var(--color-surface)]">
            <div className="w-2.5 h-2.5 bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
          </div>
          <span className="font-display font-black text-2xl tracking-[0.35em] text-[var(--color-gold)] uppercase">
            E P O S
          </span>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
          <a href="#meja-penulis" className="hover:text-[var(--color-gold)] transition-colors">
            Meja Penulis
          </a>
          <a href="#enam-fondasi" className="hover:text-[var(--color-gold)] transition-colors">
            Enam Fondasi
          </a>
          <a href="#transmutasi" className="hover:text-[var(--color-gold)] transition-colors">
            Transmutasi AI
          </a>
        </div>
        
        {/* Actions & Theme */}
        <div className="flex items-center gap-4 sm:gap-6">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="hidden sm:inline-block font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors px-4 py-2 border border-transparent hover:border-[var(--color-border)] rounded-full"
          >
            Akses Ingatan
          </Link>
          <Link 
            href="/register" 
            className="font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-gold)] border border-[var(--color-gold-muted)] px-5 py-2.5 rounded-full hover:bg-[var(--color-gold)] hover:text-[var(--color-on-primary)] transition-all duration-300 shadow-[0_0_15px_rgba(232,208,141,0.15)]"
          >
            Buka Lembaran
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 z-20 relative text-center">
        
        {/* Monumental Headline (Craft floor: No kicker above heading, no gradient text) */}
        <div className="max-w-5xl space-y-4 mb-8">
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-[0.2em] uppercase text-[var(--color-text)]">
            E P O S
            <span className="block mt-3 font-display font-bold text-3xl sm:text-5xl md:text-6xl text-[var(--color-gold)] tracking-[0.15em] drop-shadow-[0_0_25px_rgba(232,208,141,0.3)]">
              Kitab Semesta
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-body text-xl sm:text-2xl md:text-3xl text-[var(--color-text-muted)] max-w-3xl leading-relaxed italic font-medium mb-12">
          Sebuah wadah epik dari imajinasi tanpa batas. Dokumentasikan sejarah fiksi, rajut takdir tokoh, dan lindungi konsistensi mahakarya Anda di dalam lembaran keabadian digital.
        </p>

        {/* Primary Ceremonial CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-16">
          <Link 
            href="/register" 
            className="relative px-12 py-5 tome-border overflow-hidden group flex items-center justify-center gap-4 rounded-full shadow-[0_0_30px_rgba(232,208,141,0.2)] hover:shadow-[0_0_40px_rgba(232,208,141,0.35)] transition-all hover:scale-[1.02]"
          >
            <span className="relative z-10 text-[var(--color-gold)] font-display text-sm font-bold tracking-[0.3em] uppercase">
              Pahat Lembaran Epos Anda
            </span>
            <div className="relative z-10 w-2 h-2 bg-[var(--color-gold)] rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_var(--color-gold)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-muted)] to-transparent opacity-0 group-hover:opacity-25 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-0" />
          </Link>

          <a 
            href="#meja-penulis" 
            className="px-8 py-5 font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors flex items-center gap-2"
          >
            Uji Coba Meja Penulis <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </main>

      {/* CORE WORKPLACE ANCHOR: THE LIVING SCRIPTORIUM DESK */}
      <section id="meja-penulis" className="w-full z-20 relative scroll-mt-24">
        <ScriptoriumDesk />
      </section>

      {/* SECTION 2: THE 6 PILLARS OF WORLD-BUILDING */}
      <section id="enam-fondasi" className="w-full z-20 relative scroll-mt-24">
        <PillarsLedger />
      </section>

      {/* SECTION 3: RAW MANUSCRIPT TRANSMUTATION ENGINE */}
      <section id="transmutasi" className="w-full z-20 relative scroll-mt-24">
        <TransmutationDemo />
      </section>

      {/* SECTION 4: SACRED OATH & FINAL REGISTRATION PORTAL */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-28 z-20 relative text-center">
        
        {/* Hairline top divider */}
        <div className="w-full flex justify-center mb-16 opacity-60">
          <div className="ornate-divider-h w-2/3" />
        </div>

        <div className="tome-border p-8 sm:p-14 rounded-2xl bg-[var(--color-surface)]/95 shadow-2xl relative overflow-hidden">
          
          <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45 bg-[var(--color-bg)]">
            <Sparkles className="w-6 h-6 text-[var(--color-gold)] -rotate-45" />
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-[var(--color-text)] tracking-wider uppercase mb-6 leading-tight">
            Mulai Mengukir Semesta Anda
          </h2>

          <p className="font-body text-xl sm:text-2xl text-[var(--color-text-muted)] italic max-w-2xl mx-auto mb-10 leading-relaxed">
            Bergabunglah dengan para arsitek dunia, penulis novel, dan Dungeon Master yang telah mempercayakan kanon imajinasi mereka pada EPOS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-12 py-5 tome-border overflow-hidden group flex items-center justify-center gap-4 rounded-full shadow-[0_0_25px_rgba(232,208,141,0.2)] hover:scale-[1.02] transition-all"
            >
              <span className="relative z-10 text-[var(--color-gold)] font-display text-sm font-bold tracking-[0.3em] uppercase">
                Buka Kitab Pertama (Gratis)
              </span>
              <div className="relative z-10 w-2 h-2 bg-[var(--color-gold)] rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_var(--color-gold)]" />
            </Link>
          </div>

          <p className="mt-8 font-mono text-xs text-[var(--color-text-muted)] tracking-wider opacity-75">
            Dukungan ekspor JSON & HTML Cetak • Tanpa batasan penulisan lokal • Siap kolaborasi
          </p>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-6 sm:px-12 py-12 border-t border-[var(--color-gold-muted)] z-20 relative bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-[var(--color-gold)] rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[var(--color-gold)]" />
            </div>
            <span className="font-display text-sm font-bold tracking-[0.3em] text-[var(--color-gold)] uppercase">
              EPOS © MMXXVI
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-mono ml-2">
              — Kitab Semesta untuk Arsitek Dunia Fiksi
            </span>
          </div>

          <div className="flex items-center gap-6 font-display text-xs font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
            <Link href="/login" className="hover:text-[var(--color-gold)] transition-colors">
              Akses Ingatan
            </Link>
            <Link href="/register" className="hover:text-[var(--color-gold)] transition-colors">
              Inisiasi
            </Link>
            <a href="#meja-penulis" className="hover:text-[var(--color-gold)] transition-colors">
              Meja Penulis
            </a>
          </div>

          <div className="font-mono text-xs text-[var(--color-gold-muted)] tracking-widest uppercase">
            Dibuat dengan debu bintang & kode kokoh
          </div>

        </div>
      </footer>

    </div>
  );
}
