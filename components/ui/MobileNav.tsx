import Link from "next/link";
import { User, Map, Flag, Clock, Lightbulb, Ghost, Menu } from "lucide-react";

const CATEGORY_LINKS = [
  { key: "characters", label: "Tokoh Utama", icon: User },
  { key: "locations", label: "Geografis", icon: Map },
  { key: "factions", label: "Faksi", icon: Flag },
  { key: "events", label: "Kronik", icon: Clock },
  { key: "concepts", label: "Hukum", icon: Lightbulb },
  { key: "monsters", label: "Bestiary", icon: Ghost },
];

export default function MobileNav({ codexId, codexTitle }: { codexId: string, codexTitle: string }) {
  return (
    <div className="md:hidden sticky top-0 z-30 w-full bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="font-display font-black text-lg tracking-[0.3em] text-[var(--color-gold)] uppercase">
          E P O S
        </Link>
        <Link href={`/codex/${codexId}`} className="font-display font-bold text-xs text-[var(--color-text)] truncate max-w-[150px]">
          {codexTitle}
        </Link>
      </div>
      
      <div className="flex overflow-x-auto custom-scrollbar px-2 py-2 gap-2 border-t border-[var(--color-border)]/50">
        {CATEGORY_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link 
              key={link.key} 
              href={`/codex/${codexId}/${link.key}`}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors rounded-full text-xs font-display tracking-widest uppercase"
            >
              <Icon className="w-3 h-3" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
