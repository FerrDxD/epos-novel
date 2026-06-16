export async function parseMarkdown(content: string): Promise<string> {
  try {
    // Strip YAML frontmatter if exists (starts with --- and ends with ---)
    const stripped = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
    return stripped.trim();
  } catch (error) {
    console.error("Markdown Parse Error:", error);
    throw new Error("Gagal mem-parsing file Markdown.");
  }
}
