"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import EntryCard from "./EntryCard";

interface Entry {
  id: string;
  codexId: string;
  category: string;
  title: string;
  summary: string | null;
  tags: string[];
  updatedAt: string | Date;
}

interface Props {
  codexId: string;
  initialEntries: Entry[];
  totalCount: number;
}

const PAGE_SIZE = 12;

export default function EntryGrid({ codexId, initialEntries, totalCount }: Props) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialEntries.length < totalCount);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Reset when codex changes
  useEffect(() => {
    setEntries(initialEntries);
    setPage(1);
    setHasMore(initialEntries.length < totalCount);
  }, [codexId, initialEntries, totalCount]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/entry?codexId=${codexId}&page=${nextPage}&limit=${PAGE_SIZE}`);
      if (!res.ok) throw new Error("Failed");
      const data: Entry[] = await res.json();
      // API may return { entries } or plain array — handle both
      const list = Array.isArray(data) ? data : (data as any).entries || [];
      if (list.length === 0) {
        setHasMore(false);
      } else {
        setEntries((prev) => [...prev, ...list]);
        setPage(nextPage);
        if (list.length < PAGE_SIZE) setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [codexId, page, loading, hasMore]);

  useEffect(() => {
    if (!hasMore) return;
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 border border-[var(--color-border)] bg-[var(--color-surface)]/30 text-center px-4">
        <h3 className="font-display font-bold text-2xl text-[var(--color-gold)] mb-4 tracking-widest uppercase">Lembaran Kosong</h3>
        <p className="font-body text-xl text-[var(--color-text-muted)] mb-8 italic max-w-lg">Belum ada goresan tinta sejarah, tokoh, maupun tempat di dalam kitab ini.</p>
        <Link
          href={`/codex/${codexId}/entry/new`}
          className="px-8 py-3 border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] text-[var(--color-gold)] font-display text-xs font-bold tracking-[0.2em] uppercase transition-colors"
        >
          Pahat Lembaran Pertama
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {entries.map((e) => (
          <EntryCard key={e.id} entry={e as any} />
        ))}
      </div>
      {/* sentinel */}
      <div ref={loaderRef} className="h-12 flex items-center justify-center mt-8">
        {loading && <span className="font-mono text-xs tracking-widest text-[var(--color-gold-muted)] animate-pulse">Memuat…</span>}
        {!hasMore && entries.length > 0 && (
          <span className="font-mono text-[10px] tracking-widest text-[var(--color-text-muted)] uppercase opacity-60">— Akhir gulungan —</span>
        )}
      </div>
    </>
  );
}
