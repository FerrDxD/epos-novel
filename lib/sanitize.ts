/**
 * Minimal HTML sanitizer — Milestone 1
 * Prevents XSS from Tiptap `getHTML()` before storing.
 * Uses simple allowlist without extra dependency; good enough until
 * you add `isomorphic-dompurify` later.
 *
 * Allowed: p, br, strong/b, em/i, s/strike, h1-h3, ul/ol/li, blockquote, code, pre, a
 * All event handlers, javascript: urls, style, script, iframe, img onerror, etc. stripped.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "s", "strike", "del",
  "h1", "h2", "h3", "ul", "ol", "li", "blockquote", "code", "pre", "a", "span",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  span: new Set(["class"]),
  code: new Set(["class"]),
  pre: new Set(["class"]),
};

function isSafeHref(href: string): boolean {
  const v = href.trim().toLowerCase();
  if (v.startsWith("javascript:")) return false;
  if (v.startsWith("data:")) return false;
  if (v.startsWith("vbscript:")) return false;
  return true;
}

// Very small HTML parser/sanitizer — regex-based, no DOM needed (edge/server safe)
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  let s = String(html);

  // Strip HTML comments
  s = s.replace(/<!--[\s\S]*?-->/g, "");

  // Strip <script>, <style>, <iframe>, <form>, <object>, <embed>, <link>, <meta> entirely
  s = s.replace(/<(script|style|iframe|form|object|embed|link|meta|base|title)[^>]*>[\s\S]*?<\/\1\s*>/gi, "");
  s = s.replace(/<(script|style|iframe|form|object|embed|link|meta|base|title)[^>]*\/?>/gi, "");

  // Remove event handlers: onerror=, onclick=, etc. and style=, src with javascript:
  s = s.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  s = s.replace(/\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");

  // Process each tag
  s = s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) {
      // For disallowed tags: strip tag but keep inner text. For closing, just remove.
      return "";
    }

    if (isClosing) return `</${tag}>`;

    // Opening / self-closing
    const allowedAttrSet = ALLOWED_ATTRS[tag];
    if (!allowedAttrSet || rawAttrs.trim() === "") {
      // No attrs allowed for this tag -> strip all attrs
      return tag === "br" ? "<br>" : `<${tag}>`;
    }

    let kept = "";
    // Parse attributes: name="value" | name='value' | name=value | name
    const attrRe = /([a-zA-Z_:][a-zA-Z0-9:_\-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`=<>`]+)))?/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(rawAttrs)) !== null) {
      const name = m[1]!.toLowerCase();
      const value = m[2] ?? m[3] ?? m[4] ?? "";
      if (!allowedAttrSet.has(name)) continue;
      if (name === "href" && !isSafeHref(value)) continue;
      // Escape attribute value
      const esc = value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
      kept += ` ${name}="${esc}"`;
    }

    // Add rel noopener for target blank
    if (tag === "a" && kept.includes("target=") && !kept.includes("rel=")) {
      kept += ` rel="noopener noreferrer"`;
    }

    return `<${tag}${kept}>`;
  });

  return s;
}
