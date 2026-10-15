"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { CATEGORY_COLORS, CategoryType } from "./CategoryBadge";
import { Network } from "lucide-react";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface Props {
  codexId: string;
  entries: any[];
  relations: any[];
}

export default function CodexGraph({ codexId, entries, relations }: Props) {
  const router = useRouter();
  const fgRef = useRef<any>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize observer to make graph responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Early return: don't mount heavy ForceGraph for tiny codexes
  if (entries.length <= 5) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center border border-[var(--color-border)] bg-[var(--color-surface)]/50 text-center rounded-xl p-8 tome-border">
        <div className="w-10 h-10 rounded-full border border-[var(--color-gold)] flex items-center justify-center mb-4 bg-[var(--color-bg)]">
          <Network className="w-5 h-5 text-[var(--color-gold)]" />
        </div>
        <p className="font-display text-sm tracking-[0.2em] uppercase text-[var(--color-gold)] font-bold mb-2">
          Jaring Takdir Belum Terjalin
        </p>
        <p className="font-body text-base italic text-[var(--color-text-muted)] max-w-md">
          Ukir minimal 6 lembaran ensiklopedia dengan relasi keterikatan untuk mengaktifkan visualisasi peta takdir semesta.
        </p>
      </div>
    );
  }

  const graphData = {
    nodes: entries.map((e) => ({
      id: e.id,
      name: e.title,
      val: 2,
      color: CATEGORY_COLORS[e.category as CategoryType] || "var(--color-gold)",
      category: e.category,
    })),
    links: relations.map((r) => ({
      source: r.sourceEntryId,
      target: r.targetEntryId,
      name: r.relationLabel,
    })),
  };

  const handleNodeClick = useCallback(
    (node: any) => {
      router.push(`/codex/${codexId}/entry/${node.id}`);
    },
    [router, codexId]
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] bg-[var(--color-bg)] border border-[var(--color-gold-muted)] overflow-hidden relative tome-border shadow-2xl rounded-xl"
    >
      {/* Background Ornaments */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--color-gold) 0%, transparent 70%)",
        }}
      />

      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        linkColor={() => "rgba(232, 208, 141, 0.25)"}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        backgroundColor="transparent"
        nodeRelSize={6}
        d3VelocityDecay={0.3}
      />

      {/* HUD overlay in tome style */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)] bg-[var(--color-surface)]/90 backdrop-blur px-4 py-2 border border-[var(--color-border)] shadow-md rounded">
          Gulir: Zoom | Seret: Pindah | Klik: Buka Lembaran
        </p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[var(--color-gold)] opacity-50" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-[var(--color-gold)] opacity-50" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-[var(--color-gold)] opacity-50" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[var(--color-gold)] opacity-50" />
    </div>
  );
}
