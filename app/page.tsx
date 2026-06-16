import Link from "next/link";
import ThemeToggle from "../components/ui/ThemeToggle";

// Animated celestial text
function CelestialReveal() {
  return (
    <div className="font-mono text-xs text-[var(--color-gold)] opacity-70 mb-10 uppercase text-center encrypt-reveal flex flex-col items-center gap-2">
      <div className="w-8 h-8 rounded-full border border-[var(--color-gold)] flex items-center justify-center opacity-50 relative">
        <div className="w-1 h-1 bg-[var(--color-gold)] rounded-full animate-ping" />
        <div className="absolute w-full h-[1px] bg-[var(--color-gold)] -rotate-45" />
        <div className="absolute h-full w-[1px] bg-[var(--color-gold)] rotate-45" />
      </div>
      [ MENGHUBUNGKAN KE ARSIP EPOS ]<br/>
      <span className="text-[10px] tracking-[0.5em] opacity-50">AKASHIC RECORDS: SYNCHRONIZED</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--color-bg)]">
      
      {/* Ethereal Amphoreus Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.1] dark:opacity-[0.15]">
        {/* Star chart rings */}
        <div className="w-[1000px] h-[1000px] rounded-full border-[1px] border-[var(--color-gold)] absolute border-dashed opacity-30 animate-[spin_240s_linear_infinite]" />
        <div className="w-[800px] h-[800px] rounded-full border-[1px] border-[var(--color-gold)] absolute opacity-50" />
        <div className="w-[600px] h-[600px] rounded-full border-[1px] border-[var(--color-gold)] absolute animate-[spin_120s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-gold)] rotate-45 shadow-[0_0_20px_var(--color-gold)]" />
        </div>
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[var(--color-gold)] to-transparent absolute opacity-50" />
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent absolute opacity-50" />
      </div>

      {/* NAVBAR */}
      <nav className="w-full px-8 py-8 flex items-center justify-between z-20 relative backdrop-blur-sm border-b border-[var(--color-gold-muted)] bg-[var(--color-bg)]/50">
        <div className="font-display font-black text-2xl tracking-[0.4em] text-[var(--color-gold)] uppercase flex items-center gap-4 drop-shadow-[0_0_15px_rgba(232,208,141,0.5)]">
          <div className="w-8 h-8 flex items-center justify-center border border-[var(--color-gold)] rotate-45 mr-2">
            <div className="w-3 h-3 bg-[var(--color-gold)]" />
          </div>
          E P O S
        </div>
        
        <div className="flex items-center gap-8">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text)] hover:text-[var(--color-gold)] transition-colors border border-[var(--color-gold-muted)] px-6 py-2 rounded-full hover:bg-[var(--color-gold-muted)] hover:shadow-[0_0_15px_rgba(232,208,141,0.2)]"
          >
            Akses Ingatan
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 z-10 relative">
        
        <CelestialReveal />

        {/* Headline */}
        <div className="text-center mb-10 space-y-4 max-w-5xl relative">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-[var(--color-gold)]" />
          
          <h1 className="font-display font-black text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-[1.05] text-[var(--color-text)] tracking-wider">
            E P O S<br/>
            <span className="text-[var(--color-gold)] italic font-medium font-body text-[2.5rem] sm:text-[4rem] md:text-[5rem] drop-shadow-[0_0_30px_rgba(232,208,141,0.3)]">
              Kitab Semesta
            </span>
          </h1>
        </div>

        {/* Subtext */}
        <p className="font-body text-[var(--color-text-muted)] text-center max-w-3xl text-xl sm:text-2xl leading-relaxed mb-16 italic font-medium">
          Sebuah wadah epik dari imajinasi tanpa batas. Rajut kembali kepingan semesta fiksi Anda, dokumentasikan sejarahnya, dan lindungi konsistensi mahakarya Anda di dalam lembaran keabadian digital.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-6">
          <Link 
            href="/register" 
            className="relative px-12 py-5 tome-border overflow-hidden group flex items-center justify-center gap-4 rounded-full"
          >
            <span className="relative z-10 text-[var(--color-gold)] font-display text-sm font-bold tracking-[0.3em] uppercase drop-shadow-md">
              Buka Lembaran Epos
            </span>
            <div className="relative z-10 w-2 h-2 bg-[var(--color-gold)] rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_var(--color-gold)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-muted)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-0" />
          </Link>
        </div>
        
      </main>

      {/* THREE PILLARS / FEATURES */}
      <section className="w-full max-w-6xl mx-auto px-6 py-32 z-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
        
        <div className="flex items-center justify-center gap-6 mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-[var(--color-gold-muted)] rounded-full opacity-20" />
          <div className="ornate-divider-h w-12 md:w-24" />
          <h2 className="font-display text-xl tracking-[0.3em] text-[var(--color-gold)] uppercase font-bold text-center bg-[var(--color-bg)] px-8 z-10 border border-[var(--color-gold-muted)] py-3 rounded-full">
            Tiga Titik Bintang
          </h2>
          <div className="ornate-divider-h w-12 md:w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative z-10">
          {/* Pillar 1 */}
          <div className="text-center group tome-border p-8 hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center">
            <div className="w-20 h-20 mb-8 border border-[var(--color-gold)] rounded-full flex items-center justify-center text-[var(--color-gold)] relative shadow-[inset_0_0_15px_rgba(232,208,141,0.2)]">
              <div className="absolute w-full h-[1px] bg-[var(--color-gold)] opacity-30" />
              <div className="absolute h-full w-[1px] bg-[var(--color-gold)] opacity-30" />
              <span className="font-display text-2xl font-bold z-10 drop-shadow-[0_0_10px_var(--color-gold)]">I</span>
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--color-text)] mb-4 uppercase tracking-widest group-hover:text-[var(--color-gold)] transition-colors">
              Inkarnasi Naskah
            </h3>
            <p className="font-body text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed italic">
              Sihir pencatatan memindai fragmen memori tertulis, mengubah teks fiksi pasif menjadi entitas data dewa yang hidup.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="text-center group tome-border p-8 hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center">
            <div className="w-20 h-20 mb-8 border border-[var(--color-gold)] rounded-full flex items-center justify-center text-[var(--color-gold)] relative shadow-[inset_0_0_15px_rgba(232,208,141,0.2)]">
              <div className="absolute w-full h-[1px] bg-[var(--color-gold)] opacity-30 rotate-45" />
              <div className="absolute h-full w-[1px] bg-[var(--color-gold)] opacity-30 rotate-45" />
              <span className="font-display text-2xl font-bold z-10 drop-shadow-[0_0_10px_var(--color-gold)]">II</span>
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--color-text)] mb-4 uppercase tracking-widest group-hover:text-[var(--color-gold)] transition-colors">
              Peta Takdir
            </h3>
            <p className="font-body text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed italic">
              Rajut rasi bintang hubungan antar faksi dan roh pahlawan. Sebuah peta pikiran celestial tanpa batas.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="text-center group tome-border p-8 hover:-translate-y-2 transition-transform duration-500 flex flex-col items-center">
            <div className="w-20 h-20 mb-8 border border-[var(--color-gold)] rounded-full flex items-center justify-center text-[var(--color-gold)] relative shadow-[inset_0_0_15px_rgba(232,208,141,0.2)]">
              <div className="w-[80%] h-[80%] border border-[var(--color-gold)] rounded-full absolute" />
              <span className="font-display text-2xl font-bold z-10 drop-shadow-[0_0_10px_var(--color-gold)]">III</span>
            </div>
            <h3 className="font-display font-bold text-xl text-[var(--color-text)] mb-4 uppercase tracking-widest group-hover:text-[var(--color-gold)] transition-colors">
              Perisai Keabadian
            </h3>
            <p className="font-body text-[1.1rem] text-[var(--color-text-muted)] leading-relaxed italic">
              Jaga pusaka memori dari erosi Waktu. Data world-building Anda disegel dalam lembaran kristal abadi.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-8 py-12 border-t border-[var(--color-gold-muted)] z-10 flex flex-col items-center justify-center bg-[var(--color-surface)]/50 backdrop-blur-md">
        <div className="font-display text-sm text-[var(--color-text-muted)] tracking-[0.4em] uppercase mb-4 flex items-center gap-4">
          <div className="w-2 h-2 bg-[var(--color-gold)] rotate-45" />
          EPOS © MMXXVI
          <div className="w-2 h-2 bg-[var(--color-gold)] rotate-45" />
        </div>
        <div className="font-mono text-[10px] text-[var(--color-gold-muted)] tracking-[0.5em] opacity-50">
          SYSTEM: EPOS INITIALIZED
        </div>
      </footer>
    </div>
  );
}
