# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Indonesian and Southeast Asian fantasy authors, fiction novel writers, game lore creators, and tabletop RPG Dungeon Masters/Game Masters. They build intricate, multi-layered fictional universes and need to organize sprawling mythologies, maintain narrative consistency over months or years of writing, and connect characters, places, factions, and lore without losing plot threads.

Secondary audience: Creative writing teams and collaborators expanding shared literary universes.

## Product Purpose

EPOS exists to give worldbuilders and storytellers an exalted, distraction-free digital tome (*Kitab Semesta*) that weaves fragmented fictional lore into an interconnected, permanent repository. Success means an author can write thousands of words, effortlessly cross-reference entities via dynamic mentions, immediately detect lore contradictions, and feel as though they are engraving their world into an ancient, celestial archive rather than typing into a sterile spreadsheet or generic note app.

## Positioning

Unlike sterile productivity tools (Notion, Obsidian) or complex, cluttered Western worldbuilding platforms (WorldAnvil, Campfire), EPOS couples a distinctive high-fantasy ceremonial aesthetic (*Celestial Marble* / *Amphoreus*) with AI-native lore awareness (contradiction detection, automated lore extraction from documents, and organic dynamic auto-linking) tailored for Indonesian and Southeast Asian creators.

## Operating Context

- Used in long, focused creative writing and worldbuilding sessions (often hours at a time).
- Works with manuscript files, drafts, and lore notes imported from Google Docs, PDFs, and Word documents (`.docx`).
- Interacted with via keyboard shortcuts (`Ctrl+K` Omnisearch Command Palette, `@mentions` in rich text editor, `Ctrl+S` quick save).
- Requires dependable offline/local draft autosaving to prevent any loss of creative work.
- Operates primarily on desktop and tablet browsers where authors write and reference interconnected graphs.

## Capabilities and Constraints

- **Core Entity Categories (6 Pillars):**
  - Tokoh Utama (Characters)
  - Peta Geografis (Locations)
  - Bendera Faksi (Factions)
  - Kronik Waktu (Events / Interactive Timeline)
  - Hukum Semesta (Concepts / Magic Systems / Physics)
  - Bestiary (Monsters / Cosmic Entities)
- **Smart Mentions & Auto-Linking:** `@mention` in TipTap rich text editor automatically links entities and populates relation graphs.
- **Lore Consistency Engine:** AI-powered verification scans entries for conflicting facts, dates, and lineage.
- **Lore Ingestion:** Document parsing (PDF, DOCX, Google Docs) with entity extraction via Gemini API.
- **Collaboration & Versioning:** Multi-user roles (owner, editor, viewer), entry revision snapshots, soft-delete trash with restore.
- **Technical & Security Constraints:**
  - Next.js 14 App Router with TypeScript and Tailwind CSS.
  - PostgreSQL (Neon Serverless) via Drizzle ORM.
  - NextAuth.js v5 authentication (Credentials + Google OAuth).
  - Rate limiting on AI generation and entity creation.
  - Strict input sanitization (XSS mitigation for rich text content).

## Brand Commitments

- **Name:** EPOS (*Kitab Semesta*), previously known during early development as Codex.
- **Identity & Voice:** Celestial Marble and Amphoreus styling. High fantasy, mythological reverence, cosmic scholarship ("Dibuat dengan debu bintang", "Pahat Lembaran", "Segel", "Tinta Cerita", "Akashic Records").
- **Visual & Tone Invariant:** The mythic, celestial tone and Indonesian literary terminology are intentional brand moats and must not be replaced with generic corporate SaaS terminology.

## Evidence on Hand

- Fully functional Next.js 14 web application codebase with schema, authentication, API routes, and components.
- Existing landing page (`app/page.tsx`) embodying the Celestial Marble aesthetic.
- Dashboard, Codex management, entry editor, and relation graph views in `app/` and `components/`.
- Project documentation: `README.md` and detailed milestone tracker `ROADMAP.md`.
- Reference mockups and screenshots: `codex_dashboard_dark_1781607393867.jpg`.

## Product Principles

1. **Reverence for Lore:** Treat the author's world not as arbitrary database records, but as sacred history engraved in a digital tome.
2. **Effortless Continuity:** Never lose a word, broken link, or plot thread; auto-link organically and safeguard drafts aggressively.
3. **Intelligence with Restraint:** AI serves as a vigilant archivist that flags contradictions and extracts structure, never as an intrusive generator that hijacks authorial voice.
4. **Cultural Resonance:** Champion the mythic Indonesian and Southeast Asian storytelling voice while maintaining world-class software standards.

## Accessibility & Inclusion

- Keyboard navigability across the core writing experience (Command Palette `Ctrl+K`, editor shortcuts, modal traversal).
- High-contrast readability across Celestial Dark and Light themes (avoiding unreadable low-contrast gold-on-white text).
- Resilient feedback states (skeletons, loading indicators, clear Indonesian/bilingual error toasts).
