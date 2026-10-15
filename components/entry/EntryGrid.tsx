"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import EntryCard from "./EntryCard";
import { Plus, BookOpen } from "lucide-react";

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
      <div className="tome-border rounded-xl p-12 sm:p-16 text-center bg-[var(--color-surface)]/80 shadow-xl relative overflow-hidden">
        <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-[var(--color-gold)] rotate-45 bg-[var(--color-bg)]">
          <BookOpen className="w-6 h-6 text-[var(--color-gold)] -rotate-45" />
        </div>

        <h3 className="font-display font-black text-2xl text-[var(--color-text)] mb-3 tracking-widest uppercase">
          Lembaran Masih Kosong
        </h3>
        <p className="font-body text-xl text-[var(--color-text-muted)] mb-8 italic max-w-lg mx-auto leading-relaxed">
          Belum ada goresan tinta sejarah, tokoh, maupun tempat di dalam kitab ini. Mulailah mengukir entri ensiklopedia pertama Anda.
        </p>
        <Link
          href={`/codex/${codexId}/entry/new`}
          className="inline-flex items-center gap-3 px-8 py-3.5 tome-border rounded-full font-display text-xs font-bold tracking-[0.25em] uppercase text-[var(--color-gold)] shadow-[0_0_15px_rgba(232,208,141,0.15)] hover:scale-105 transition-all"
        >
          <span>Pahat Lembaran Pertama</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shadow-[0_0_6px_var(--color-gold)]" />
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

      {/* Sentinel / Infinite scroll loader */}
      <div ref={loaderRef} className="h-16 flex items-center justify-center mt-10">
        {loading && (
          <span className="font-mono text-xs tracking-widest text-[var(--color-gold)] uppercase animate-pulse">
            [ Membuka Gulungan Tambahan... ]
          </span>
        )}
        {!hasMore && entries.length > 0 && (
          <div className="flex items-center gap-4 opacity-50">
            <div className="w-8 h-[1px] bg-[var(--color-gold-muted)]" />
            <span className="font-mono text-xs tracking-widest text-[var(--color-text-muted)] uppercase">
              Akhir Gulungan Kitab
            </span>
            <div className="w-8 h-[1px] bg-[var(--color-gold-muted)]" />
          </div>
        )}
      </div>
    </>
  );
}
