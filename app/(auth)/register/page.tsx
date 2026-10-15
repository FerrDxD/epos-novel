import Link from "next/link";
import RegisterForm from "../../../components/auth/RegisterForm";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import CelestialBackground from "../../../components/ui/CelestialBackground";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300 relative overflow-hidden">
      <CelestialBackground />

      {/* Top Header Controls */}
      <header className="w-full px-6 sm:px-10 py-6 flex items-center justify-between z-20 relative">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 font-display text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kitab Semesta</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Center Stage */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <RegisterForm />
      </main>

      {/* Footer watermark */}
      <footer className="w-full py-4 text-center z-10 relative">
        <span className="font-mono text-xs text-[var(--color-gold-muted)] tracking-widest uppercase opacity-60">
          EPOS • INISIASI ARSITEK DUNIA
        </span>
      </footer>
    </div>
  );
}
