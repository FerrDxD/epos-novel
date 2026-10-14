import { CodexCardSkeleton } from "../../../components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <div className="w-full px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80">
        <div className="max-w-7xl mx-auto h-8 bg-[var(--color-surface-2)] animate-pulse rounded w-32" />
      </div>
      <div className="max-w-7xl mx-auto px-8 py-16 w-full">
        <div className="h-10 w-64 bg-[var(--color-surface-2)] animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => <CodexCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}
