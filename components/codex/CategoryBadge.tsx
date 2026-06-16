import { Users, MapPin, Flag, Calendar, Lightbulb, Ghost, BookOpen } from "lucide-react";

export const CATEGORY_COLORS = {
  characters: "#C2A878", // Gold
  locations: "#1C2B2D", // Deep Teal/Green
  factions: "#8B1E1E", // Crimson
  events: "#604733", // Aged Brown
  concepts: "#E8DCC4", // Faded Parchment
  monsters: "#3D1313", // Deep Blood
} as const;

export const CATEGORY_ICONS = {
  characters: Users,
  locations: MapPin,
  factions: Flag,
  events: Calendar,
  concepts: Lightbulb,
  monsters: Ghost,
};

export const CATEGORY_LABELS = {
  characters: "Tokoh Utama",
  locations: "Peta Geografis",
  factions: "Bendera Faksi",
  events: "Kronik Waktu",
  concepts: "Hukum Semesta",
  monsters: "Bestiary",
};

export type CategoryType = keyof typeof CATEGORY_COLORS;

interface Props {
  category: string;
  className?: string;
}

export default function CategoryBadge({ category, className = "" }: Props) {
  const catKey = category as CategoryType;
  const Icon = CATEGORY_ICONS[catKey] || BookOpen;
  const label = CATEGORY_LABELS[catKey] || category;
  const color = CATEGORY_COLORS[catKey] || "var(--color-gold)";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[10px] font-display font-bold uppercase tracking-[0.2em] border border-[var(--color-border)] bg-[var(--color-bg)] ${className}`}
      style={{
        color: color,
      }}
    >
      <Icon className="w-3.5 h-3.5 mr-2 opacity-80" />
      {label}
    </span>
  );
}
