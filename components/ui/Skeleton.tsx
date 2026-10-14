"use client";

export function CodexCardSkeleton() {
  return (
    <div className="tome-border bg-[var(--color-surface)] p-6 animate-pulse">
      <div className="h-3 w-20 bg-[var(--color-surface-2)] mb-6 rounded" />
      <div className="h-6 w-3/4 bg-[var(--color-surface-2)] mb-3 rounded" />
      <div className="h-4 w-full bg-[var(--color-surface-2)] mb-2 rounded" />
      <div className="h-4 w-5/6 bg-[var(--color-surface-2)] mb-6 rounded" />
      <div className="flex gap-2">
        <div className="h-5 w-12 bg-[var(--color-surface-2)] rounded" />
        <div className="h-5 w-16 bg-[var(--color-surface-2)] rounded" />
      </div>
    </div>
  );
}

export function EntryCardSkeleton() {
  return (
    <div className="tome-border bg-[var(--color-surface)] p-6 animate-pulse">
      <div className="h-3 w-12 bg-[var(--color-surface-2)] mb-4 rounded" />
      <div className="h-5 w-3/4 bg-[var(--color-surface-2)] mb-3 rounded" />
      <div className="h-4 w-full bg-[var(--color-surface-2)] mb-2 rounded" />
      <div className="h-4 w-4/5 bg-[var(--color-surface-2)] mb-6 rounded" />
      <div className="flex gap-2 mb-4">
        <div className="h-4 w-10 bg-[var(--color-surface-2)] rounded" />
        <div className="h-4 w-14 bg-[var(--color-surface-2)] rounded" />
      </div>
      <div className="h-3 w-24 bg-[var(--color-surface-2)] rounded" />
    </div>
  );
}

export function PageSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-4 p-8">
      <div className="h-8 w-1/3 bg-[var(--color-surface-2)] rounded" />
      <div className="h-4 w-2/3 bg-[var(--color-surface-2)] rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 w-full bg-[var(--color-surface-2)] rounded" />
      ))}
    </div>
  );
}
