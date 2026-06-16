"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("codex-theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("codex-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  if (!mounted) {
    return <div className="w-10 h-10 opacity-0" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors rounded-full border border-transparent hover:border-[var(--color-gold-muted)] flex items-center justify-center"
      title={theme === "light" ? "Tutup Lentera (Dark Mode)" : "Nyalakan Lentera (Light Mode)"}
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
}
