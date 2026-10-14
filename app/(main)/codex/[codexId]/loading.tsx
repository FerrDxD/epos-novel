import { EntryCardSkeleton } from "../../../../components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="h-10 w-48 bg-[var(--color-surface-2)] animate-pulse rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => <EntryCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
