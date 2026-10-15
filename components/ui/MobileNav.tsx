import Link from "next/link";
import { Users, MapPin, Flag, Calendar, Lightbulb, Ghost } from "lucide-react";

const CATEGORY_LINKS = [
  { key: "characters", label: "Tokoh", icon: Users },
  { key: "locations", label: "Geografis", icon: MapPin },
  { key: "factions", label: "Faksi", icon: Flag },
  { key: "events", label: "Kronik", icon: Calendar },
  { key: "concepts", label: "Hukum", icon: Lightbulb },
  { key: "monsters", label: "Bestiary", icon: Ghost },
];

export default function MobileNav({
  codexId,
  codexTitle,
}: {
  codexId: string;
  codexTitle: string;
}) {
  return (
    <div className="md:hidden sticky top-0 z-30 w-full bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between px-5 py-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-display font-black text-base tracking-[0.25em] text-[var(--color-gold)] uppercase"
        >
          <div className="w-4 h-4 border border-[var(--color-gold)] rotate-45 flex items-center justify-center">
            <div className="w-1 h-1 bg-[var(--color-gold)]" />
          </div>
          <span>EPOS</span>
        </Link>
        <Link
          href={`/codex/${codexId}`}
          className="font-display font-bold text-xs tracking-wider uppercase text-[var(--color-text)] truncate max-w-[180px] hover:text-[var(--color-gold)] transition-colors"
        >
          {codexTitle}
        </Link>
      </div>

      <div className="flex overflow-x-auto custom-scrollbar px-3 py-2 gap-2 border-t border-[var(--color-border)]/50">
        {CATEGORY_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.key}
              href={`/codex/${codexId}/${link.key}`}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold-muted)] transition-colors rounded-full text-xs font-display tracking-wider uppercase"
            >
              <Icon className="w-3 h-3" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
