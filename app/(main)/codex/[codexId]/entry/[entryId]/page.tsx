import { db } from "../../../../../../lib/db";
import { entries, entryRelations } from "../../../../../../lib/db/schema";
import { auth } from "../../../../../../lib/auth";
import { eq, or, and } from "drizzle-orm";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ThemeToggle from "../../../../../../components/ui/ThemeToggle";
import CategoryBadge, { CATEGORY_COLORS, CategoryType } from "../../../../../../components/codex/CategoryBadge";
import RelationsPanel from "../../../../../../components/entry/RelationsPanel";

export default async function EntryDetailPage({ params }: { params: { codexId: string, entryId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { codexId, entryId } = params;

  // Fetch target entry
  const [entry] = await db
    .select()
    .from(entries)
    .where(and(eq(entries.id, entryId), eq(entries.codexId, codexId)))
    .limit(1);

  if (!entry) notFound();

  // Fetch all relations involving this entry
  const relations = await db
    .select()
    .from(entryRelations)
    .where(
      and(
        eq(entryRelations.codexId, codexId),
        or(eq(entryRelations.sourceEntryId, entryId), eq(entryRelations.targetEntryId, entryId))
      )
    );

  // Fetch all entries in codex for the dropdown in relations panel
  const allEntries = await db
    .select({ id: entries.id, title: entries.title, category: entries.category })
    .from(entries)
    .where(eq(entries.codexId, codexId));

  const color = CATEGORY_COLORS[entry.category as CategoryType] || "var(--color-gold)";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-200 pb-20">
      <header className="sticky top-0 z-20 w-full px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href={`/codex/${codexId}`} className="flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-xs font-bold tracking-[0.2em] uppercase">Tutup Lembaran</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Column */}
          <div className="lg:w-2/3 space-y-8">
            
            {/* Header Section (Title & Summary) */}
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <CategoryBadge category={entry.category} className="border-none bg-[var(--color-surface-2)]" />
                <div className="flex gap-3">
                  <button className="p-2.5 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors bg-[var(--color-surface)]">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-crimson)] hover:border-[var(--color-crimson)] transition-colors bg-[var(--color-surface)]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="font-display font-black text-5xl md:text-6xl text-[var(--color-text)] mb-8 tracking-wide leading-tight border-b border-[var(--color-border)] pb-8 relative">
                <div 
                  className="absolute bottom-0 left-0 w-24 h-[2px]"
                  style={{ backgroundColor: color }}
                />
                {entry.title}
              </h1>

              {entry.summary && (
                <div className="font-body text-2xl text-[var(--color-text-muted)] leading-relaxed italic border-l-4 pl-6 py-2 my-8" style={{ borderColor: `${color}80` }}>
                  {entry.summary}
                </div>
              )}

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {entry.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-[var(--color-surface)] text-[var(--color-gold-muted)] text-[10px] uppercase tracking-widest font-mono border border-[var(--color-border)]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full flex justify-center py-6 opacity-50">
              <div className="ornate-divider-h w-full" />
            </div>

            {/* Content Section */}
            <div className="font-body text-lg leading-loose text-[var(--color-text)] prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-display prose-headings:font-bold prose-headings:tracking-widest prose-headings:uppercase prose-headings:text-[var(--color-gold)]
              prose-a:text-[var(--color-gold)] prose-a:underline prose-a:decoration-[var(--color-gold-muted)] prose-a:underline-offset-4
              prose-strong:text-[var(--color-text)] prose-strong:font-bold
              prose-blockquote:border-l-[var(--color-gold-muted)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-[var(--color-text-muted)]
              prose-img:border prose-img:border-[var(--color-border)] prose-img:shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {entry.content ? (
                (() => {
                  let parsed = entry.content;
                  const isHtml = /<[a-z][\s\S]*>/i.test(parsed);
                  const sortedEntries = [...allEntries].sort((a, b) => b.title.length - a.title.length);
                  
                  sortedEntries.forEach(ent => {
                    if (ent.id === entryId) return;
                    const escapedTitle = ent.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    
                    if (isHtml) {
                      // HTML linking: avoid replacing inside tags
                      try {
                        const mentionRegex = new RegExp(`(?<!<[^>]*)@${escapedTitle}\\b(?![^<]*>)`, 'gi');
                        parsed = parsed.replace(mentionRegex, `<a href="/codex/${codexId}/entry/${ent.id}">${ent.title}</a>`);
                        
                        const autoLinkRegex = new RegExp(`(?<!<[^>]*)(?<!<a[^>]*>)\\b${escapedTitle}\\b(?![^<]*</a>)(?![^<]*>)`, 'g');
                        parsed = parsed.replace(autoLinkRegex, `<a href="/codex/${codexId}/entry/${ent.id}">${ent.title}</a>`);
                      } catch (e) {}
                    } else {
                      // Markdown linking
                      const mentionRegex = new RegExp(`@${escapedTitle}\\b`, 'gi');
                      parsed = parsed.replace(mentionRegex, `[${ent.title}](/codex/${codexId}/entry/${ent.id})`);
                      
                      try {
                        const autoLinkRegex = new RegExp(`(?<!\\[[^\\]]*)\\b${escapedTitle}\\b(?![^\\[]*\\])`, 'g');
                        parsed = parsed.replace(autoLinkRegex, `[${ent.title}](/codex/${codexId}/entry/${ent.id})`);
                      } catch (e) {}
                    }
                  });

                  if (isHtml) {
                    return <div dangerouslySetInnerHTML={{ __html: parsed }} />;
                  } else {
                    return <ReactMarkdown>{parsed}</ReactMarkdown>;
                  }
                })()
              ) : (
                <p className="text-[var(--color-text-muted)] italic text-center py-12">Belum ada torehan tinta pada perkamen ini.</p>
              )}
            </div>
            
          </div>

          {/* Sidebar Column */}
          <div className="lg:w-1/3 space-y-8">
            
            {/* Metadata Properties Panel */}
            <div className="bg-[var(--color-surface)] tome-border">
              <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-center">
                <h3 className="font-display font-bold text-sm tracking-[0.3em] uppercase text-[var(--color-gold)]">Karakteristik</h3>
              </div>
              <div className="p-6 space-y-5">
                {Object.keys(entry.metadata || {}).length === 0 ? (
                  <p className="text-sm font-body italic text-[var(--color-text-muted)] text-center py-4">
                    Tak ada anomali atau ciri spesifik yang terekam.
                  </p>
                ) : (
                  Object.entries(entry.metadata as Record<string, any>).map(([key, val]) => {
                    if (!val || (Array.isArray(val) && val.length === 0)) return null;
                    return (
                      <div key={key} className="border-b border-dashed border-[var(--color-border)] pb-4 last:border-0 last:pb-0">
                        <span className="block text-[10px] font-mono font-bold text-[var(--color-gold-muted)] uppercase tracking-widest mb-2">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-body text-lg text-[var(--color-text)] italic">
                          {Array.isArray(val) ? val.join(", ") : String(val)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Relations Panel */}
            <RelationsPanel 
              codexId={codexId} 
              entryId={entryId} 
              relations={relations} 
              allEntries={allEntries} 
            />

          </div>
        </div>
      </main>
    </div>
  );
}
