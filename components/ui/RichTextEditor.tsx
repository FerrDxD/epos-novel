"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('bold') ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('italic') ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('strike') ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-6 bg-[var(--color-border)] mx-1" />
      
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <div className="w-[1px] h-6 bg-[var(--color-border)] mx-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('bulletList') ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('orderedList') ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run() }}
        className={`p-2 rounded hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors ${editor.isActive('blockquote') ? 'text-[var(--color-gold)] bg-[var(--color-bg)] shadow-inner' : 'text-[var(--color-text-muted)]'}`}
      >
        <Quote className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-6 bg-[var(--color-border)] mx-1" />

      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-30"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-gold)] transition-colors disabled:opacity-30"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = "Mulai mengukir naskah..." }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-6 font-body text-lg text-[var(--color-text)] prose-headings:font-display prose-headings:font-bold prose-headings:tracking-widest prose-headings:uppercase prose-headings:text-[var(--color-gold)] prose-strong:text-[var(--color-gold)] prose-blockquote:border-l-[var(--color-gold-muted)] prose-blockquote:bg-[var(--color-surface)] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-[var(--color-text-muted)]',
      },
    },
  });

  return (
    <div className="w-full border border-[var(--color-border)] bg-[var(--color-bg)] transition-colors shadow-inner flex flex-col focus-within:border-[var(--color-gold)] focus-within:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
      <MenuBar editor={editor} />
      <div className="flex-1 custom-scrollbar overflow-y-auto" style={{ maxHeight: "60vh" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
