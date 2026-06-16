import { Suspense } from "react";
import LoginForm from "../../../components/auth/LoginForm";
import ThemeToggle from "../../../components/ui/ThemeToggle";

import CelestialBackground from "../../../components/ui/CelestialBackground";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-200 relative overflow-hidden">
      <CelestialBackground />

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <Suspense fallback={
          <div className="w-full max-w-md p-10 tome-border text-center bg-[var(--color-bg)]">
            <div className="font-mono text-[var(--color-gold-muted)] tracking-widest animate-pulse text-xs">[ MEMBACA GULUNGAN... ]</div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
