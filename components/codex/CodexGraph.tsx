"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { CATEGORY_COLORS, CategoryType } from "./CategoryBadge";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface GraphNode {
  id: string;
  name: string;
  val: number;
  color: string;
  category: string;
}

interface GraphLink {
  source: string;
  target: string;
  name: string;
}

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
      <div className="w-full py-16 flex flex-col items-center justify-center border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/30 text-center">
        <p className="font-display text-sm tracking-[0.2em] uppercase text-[var(--color-gold-muted)] mb-2">Jaring Takdir</p>
        <p className="font-body italic text-[var(--color-text-muted)] max-w-md">Buat minimal 6 lembaran dengan relasi untuk melihat peta takdir. Graph akan muncul otomatis.</p>
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
    <div ref={containerRef} className="w-full h-[600px] bg-[var(--color-bg)] border border-[var(--color-gold-muted)] overflow-hidden relative tome-border shadow-2xl">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at center, var(--color-gold) 0%, transparent 60%)' }} />
      
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        linkColor={() => "rgba(194, 168, 120, 0.2)"} // Muted gold link
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={handleNodeClick}
        backgroundColor="transparent"
        nodeRelSize={6}
        d3VelocityDecay={0.3}
      />
      
      {/* HUD overlay in tome style */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-gold)] bg-[var(--color-surface)]/90 backdrop-blur px-4 py-2 border border-[var(--color-border)] shadow-md">
          Gulir: Zoom | Seret: Pindah | Klik: Lihat Lembar
        </p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--color-gold)] opacity-50" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--color-gold)] opacity-50" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--color-gold)] opacity-50" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--color-gold)] opacity-50" />
    </div>
  );
}
