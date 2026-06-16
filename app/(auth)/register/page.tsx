import RegisterForm from "../../../components/auth/RegisterForm";
import ThemeToggle from "../../../components/ui/ThemeToggle";

import CelestialBackground from "../../../components/ui/CelestialBackground";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] transition-colors duration-200 relative overflow-hidden">
      <CelestialBackground />

      {/* Floating ThemeToggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
