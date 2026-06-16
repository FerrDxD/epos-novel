"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import CategoryBadge from "../codex/CategoryBadge";

interface Props {
  codexId: string;
  entryId: string;
  relations: any[];
  allEntries: any[];
}

export default function RelationsPanel({ codexId, entryId, relations, allEntries }: Props) {
  const router = useRouter();
  const [targetId, setTargetId] = useState("");
  const [relationLabel, setRelationLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId || !relationLabel) {
      setError("Tenun benang takdir dengan sempurna.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/relation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codexId,
          sourceEntryId: entryId,
          targetEntryId: targetId,
          relationLabel
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTargetId("");
      setRelationLabel("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (relationId: string) => {
    try {
      await fetch("/api/relation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationId })
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const possibleTargets = allEntries.filter(e => e.id !== entryId);

  return (
    <div className="bg-[var(--color-surface)] tome-border">
      <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <LinkIcon className="w-24 h-24 text-[var(--color-gold)]" />
        </div>
        <h3 className="font-display font-bold text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] relative z-10">
          Jaring Takdir
        </h3>
      </div>

      <div className="p-6">
        {/* List of relations */}
        <div className="space-y-4 mb-8">
          {relations.length === 0 ? (
            <p className="font-body text-sm text-[var(--color-text-muted)] italic text-center py-4">
              Belum ada benang takdir yang terhubung dari atau menuju entri ini.
            </p>
          ) : (
            relations.map((rel) => {
              const isSource = rel.sourceEntryId === entryId;
              const otherId = isSource ? rel.targetEntryId : rel.sourceEntryId;
              const otherEntry = allEntries.find(e => e.id === otherId);

              if (!otherEntry) return null;

              return (
                <div key={rel.id} className="relative p-4 border border-[var(--color-border)] bg-[var(--color-bg)] group transition-all hover:border-[var(--color-gold-muted)]">
                  
                  {/* Decorative connection line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[var(--color-surface)] border border-[var(--color-gold-muted)]" />

                  <div className="flex justify-between items-start pl-2">
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[9px] text-[var(--color-gold-muted)] uppercase tracking-[0.2em]">
                        {isSource ? "[ Terhubung Menuju ]" : "[ Terhubung Dari ]"}
                      </span>
                      <span className="font-display text-sm font-bold tracking-widest uppercase text-[var(--color-text)]">
                        {rel.relationLabel}
                      </span>
                      <Link 
                        href={`/codex/${codexId}/entry/${otherEntry.id}`}
                        className="font-body text-lg italic text-[var(--color-gold)] hover:underline decoration-[var(--color-gold-muted)] underline-offset-4 mt-1"
                      >
                        {otherEntry.title}
                      </Link>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(rel.id)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-crimson)] border border-transparent hover:border-[var(--color-crimson)] opacity-0 group-hover:opacity-100 transition-all bg-[var(--color-surface)]"
                      title="Putus Benang Takdir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="w-full flex justify-center mb-6 opacity-50">
          <div className="ornate-divider-h w-2/3" />
        </div>

        {/* Add Relation Form */}
        <form onSubmit={handleAddRelation}>
          <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)] text-center mb-5">Rajut Benang Baru</h4>
          
          {error && <div className="text-xs font-mono text-[var(--color-crimson)] mb-4 text-center">{error}</div>}
          
          <div className="space-y-4">
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-4 py-3 font-mono text-xs uppercase tracking-widest bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)]"
            >
              <option value="">-- Pilih Ujung Benang --</option>
              {possibleTargets.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={relationLabel}
              onChange={(e) => setRelationLabel(e.target.value)}
              placeholder="Sifat Ikatan (Misal: Kawan Seperjuangan)"
              className="w-full px-4 py-3 font-body text-sm italic bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-gold)] placeholder-[var(--color-border)]"
            />
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 font-display text-[10px] font-bold tracking-[0.3em] uppercase bg-[var(--color-surface-2)] text-[var(--color-gold)] border border-[var(--color-gold-muted)] hover:border-[var(--color-gold)] hover:bg-[var(--color-surface)] transition-all flex items-center justify-center gap-3"
            >
              <Plus className="w-3 h-3" />
              Rajut Takdir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
