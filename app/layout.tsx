import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Courier_Prime } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "900"]
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const courier = Courier_Prime({ 
  subsets: ["latin"],
  variable: "--font-courier",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "EPOS — Kitab Semesta",
  description: "Pusaka penempah semesta fiksi. Buka segel dan rajut takdir duniamu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('codex-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${cinzel.variable} ${cormorant.variable} ${courier.variable} font-body antialiased min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] relative`}>
        {/* Global Grain/Noise Overlay to give a textured, ancient paper feel */}
        <div 
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.04] mix-blend-overlay" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
