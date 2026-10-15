"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authError = searchParams.get("error");
  const getErrorMessage = (err: string) => {
    if (err === "OAuthSignin") return "Gagal memulai otorisasi Google.";
    if (err === "OAuthCallback") return "Gagal memproses segel dari Google.";
    if (err === "OAuthCreateAccount") return "Gagal mengukir akun Google.";
    if (err === "EmailCreateAccount") return "Gagal memahat akun.";
    if (err === "Callback") return "Terjadi anomali saat otorisasi.";
    if (err === "OAuthAccountNotLinked") return "Email ini telah diukir dengan kata sandi. Silakan gunakan form.";
    return "Terjadi kesalahan saat membuka segel. Silakan periksa kredensial Anda.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Silakan isi nama pena dan kata sandi rahasia.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Kredensial salah. Periksa kembali nama pena dan kata sandi Anda.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Ikatan magis terputus. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (err) {
      setError("Gagal membuka segel Google.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 tome-border rounded-xl shadow-2xl relative z-10 bg-[var(--color-surface)]/95">
      
      {/* Decorative Corner Brackets */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[var(--color-gold)] opacity-40 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[var(--color-gold)] opacity-40 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[var(--color-gold)] opacity-40 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[var(--color-gold)] opacity-40 pointer-events-none" />

      {/* Brand & Form Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <Link href="/" className="flex flex-col items-center group mb-3">
          <div className="w-8 h-8 flex items-center justify-center border border-[var(--color-gold)] rotate-45 mb-4 bg-[var(--color-bg)] transition-transform group-hover:rotate-90 duration-500">
            <div className="w-2.5 h-2.5 bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
          </div>
          <span className="font-display font-black text-2xl tracking-[0.3em] text-[var(--color-gold)] uppercase">
            E P O S
          </span>
        </Link>
        <h2 className="font-display font-bold text-lg text-[var(--color-text)] tracking-widest uppercase">
          Buka Segel Ingatan
        </h2>
        <p className="font-body italic text-[var(--color-text-muted)] mt-1 text-base">
          Lanjutkan pahatan takdir dunia fiksi Anda
        </p>
      </div>

      {(error || authError) && (
        <div className="mb-6 p-3.5 border border-[var(--color-crimson)] bg-[var(--color-crimson)]/10 text-[var(--color-text)] text-xs flex items-start gap-2.5 font-mono rounded">
          <AlertCircle className="w-4 h-4 text-[var(--color-crimson)] shrink-0 mt-0.5" />
          <span>{error || getErrorMessage(authError!)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-widest mb-2"
          >
            Nama Pena / Email
          </label>
          <input
            id="identifier"
            type="text"
            required
            disabled={isLoading}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-4 py-3 text-xs sm:text-sm font-mono rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-gold)] focus:shadow-[0_0_10px_rgba(232,208,141,0.15)] transition-all"
            placeholder="Ketik identitas terukir..."
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block font-display text-xs font-bold text-[var(--color-gold)] uppercase tracking-widest mb-2"
          >
            Kata Sandi Rahasia
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-xs sm:text-sm font-mono rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)]/50 focus:outline-none focus:border-[var(--color-gold)] focus:shadow-[0_0_10px_rgba(232,208,141,0.15)] transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative py-4 tome-border rounded-full overflow-hidden group flex items-center justify-center gap-3 mt-6 disabled:opacity-50 hover:scale-[1.01] transition-all shadow-[0_0_20px_rgba(232,208,141,0.15)]"
        >
          <span className="relative z-10 text-[var(--color-gold)] font-display text-xs font-bold tracking-[0.3em] uppercase">
            {isLoading ? "MEMBUKA SEGEL..." : "Buka Lembaran Epos"}
          </span>
          <div className="relative z-10 w-2 h-2 bg-[var(--color-gold)] rounded-full group-hover:scale-150 transition-transform shadow-[0_0_8px_var(--color-gold)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-gold-muted)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-0" />
        </button>
      </form>

      {/* Ornate Divider with Diamond */}
      <div className="relative my-7 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--color-border)]" />
        </div>
        <span className="relative z-10 px-4 font-mono text-xs text-[var(--color-gold-muted)] bg-[var(--color-surface)] tracking-[0.25em] uppercase">
          ATAU
        </span>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        type="button"
        className="w-full py-3 px-4 text-xs font-display font-bold tracking-[0.2em] uppercase rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] hover:bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-gold)] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
      >
        <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24">
          <path fill="currentColor" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.5 3.77v3.13h3.96c2.3-2.11 3.6-5.22 3.6-8.75z"/>
          <path fill="currentColor" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.96-3.13c-1.1.74-2.51 1.18-4 1.18-3.08 0-5.69-2.08-6.62-4.88H1.31v3.23A12 12 0 0 0 12 24z"/>
          <path fill="currentColor" d="M5.38 14.26A7.17 7.17 0 0 1 5 12c0-.79.13-1.57.38-2.34V6.43H1.31A11.96 11.96 0 0 0 0 12c0 2.05.52 4 1.31 5.57l4.07-3.31z"/>
          <path fill="currentColor" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.95 11.95 0 0 0 12 0 12 12 0 0 0 1.31 6.43l4.07 3.31c.93-2.8 3.54-4.88 6.62-4.88z"/>
        </svg>
        Segel Google
      </button>

      <p className="mt-8 text-center text-xs font-mono text-[var(--color-text-muted)]">
        Belum memahat nama pena?{" "}
        <Link href="/register" className="font-display font-bold tracking-widest text-[var(--color-gold)] hover:text-white transition-colors ml-1">
          INISIASI
        </Link>
      </p>
    </div>
  );
}
