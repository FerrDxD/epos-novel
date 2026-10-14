"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo, Save } from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  draftKey?: string; // localStorage key for autosave, e.g. `draft:codexId:new`
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  const btn = (active: boolean) =>
    `p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${active ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`;
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }} disabled={!editor.can().chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}><Bold className="w-4 h-4" /></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }} disabled={!editor.can().chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}><Italic className="w-4 h-4" /></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }} disabled={!editor.can().chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}><Strikethrough className="w-4 h-4" /></button>
      <div className="w-[1px] h-6 bg-[var(--color-border)] mx-1" />
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }} className={btn(editor.isActive('heading', { level: 1 }))}><Heading1 className="w-4 h-4" /></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }} className={btn(editor.isActive('heading', { level: 2 }))}><Heading2 className="w-4 h-4" /></button>
      <div className="w-[1px] h-6 bg-[var(--color-border)] mx-1" />
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }} className={btn(editor.isActive('bulletList'))}><List className="w-4 h-4" /></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }} className={btn(editor.isActive('orderedList'))}><ListOrdered className="w-4 h-4" /></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }} className={btn(editor.isActive('blockquote'))}><Quote className="w-4 h-4" /></button>
      <div className="w-[1px] h-6 bg-[var(--color-border)] mx-1" />
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }} disabled={!editor.can().chain().focus().undo().run()} className="p-2 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-30"><Undo className="w-4 h-4" /></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }} disabled={!editor.can().chain().focus().redo().run()} className="p-2 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-30"><Redo className="w-4 h-4" /></button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = "Mulai mengukir naskah...", draftKey }: Props) {
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder, emptyEditorClass: 'is-editor-empty' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      if (!draftKey) return;
      setSaveState("saving");
      if (saveTimer.current) window.clearTimeout(saveTimer.current as unknown as number);
      saveTimer.current = window.setTimeout(() => {
        try {
          localStorage.setItem(draftKey, html);
          localStorage.setItem(`${draftKey}:ts`, String(Date.now()));
          setSaveState("saved");
          window.setTimeout(() => setSaveState("idle"), 1500);
        } catch {}
      }, 800) as unknown as number;
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-6 font-body text-lg text-[var(--color-text)] prose-headings:font-display prose-headings:font-bold prose-headings:tracking-widest prose-headings:uppercase prose-headings:text-[var(--color-gold)] prose-strong:text-[var(--color-gold)] prose-blockquote:border-l-[var(--color-gold-muted)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-[var(--color-text-muted)]',
      },
    },
  });

  // Restore draft on mount if content is empty and draft exists
  useEffect(() => {
    if (!draftKey || !editor) return;
    if (content && content.trim().length > 0) return;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved && saved.trim()) {
        // Only restore if editor is effectively empty
        const cur = editor.getHTML();
        const isEmpty = !cur || cur === "<p></p>" || cur.trim() === "";
        if (isEmpty) {
          editor.commands.setContent(saved);
          onChange(saved);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, draftKey]);

  // Ctrl+S: force save
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (!draftKey || !editor) return;
      try {
        const html = editor.getHTML();
        localStorage.setItem(draftKey, html);
        localStorage.setItem(`${draftKey}:ts`, String(Date.now()));
        setSaveState("saved");
        window.setTimeout(() => setSaveState("idle"), 1200);
      } catch {}
    }
  }, [draftKey, editor]);

  const clearDraft = () => {
    if (!draftKey) return;
    try { localStorage.removeItem(draftKey); localStorage.removeItem(`${draftKey}:ts`); } catch {}
    setSaveState("idle");
  };

  // Expose clearDraft via attribute for parent to call after successful submit
  useEffect(() => {
    if (!draftKey) return;
    const handler = () => clearDraft();
    window.addEventListener(`epos:clear-draft:${draftKey}`, handler);
    return () => window.removeEventListener(`epos:clear-draft:${draftKey}`, handler);
  }, [draftKey]);

  return (
    <div onKeyDown={handleKeyDown} className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] transition-colors shadow-inner flex flex-col focus-within:border-[var(--color-gold)] focus-within:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
      <MenuBar editor={editor} />
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]/50">
        <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] flex items-center gap-2">
          {saveState === "saving" && <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Menyimpan…</>}
          {saveState === "saved" && <><Save className="w-3 h-3 text-emerald-400" /> Tersimpan</>}
          {saveState === "idle" && draftKey && <span className="opacity-60">Ctrl+S simpan cepat</span>}
        </span>
        {draftKey && saveState !== "saving" && (
          <button type="button" onClick={clearDraft} className="font-mono text-[10px] tracking-widest uppercase text-[var(--color-text-muted)] hover:text-[var(--color-crimson)]">
            Hapus draft
          </button>
        )}
      </div>
      <div className="flex-1 custom-scrollbar overflow-y-auto" style={{ maxHeight: "60vh" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/** Call after successful submit to clear autosave */
export function clearDraft(key: string) {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}:ts`);
    window.dispatchEvent(new Event(`epos:clear-draft:${key}`));
  } catch {}
}
