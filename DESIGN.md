---
name: EPOS
description: Kitab Semesta untuk Arsitek Dunia Fiksi — Celestial Marble Design System
colors:
  primary: "#E8D08D"
  primary-hover: "#FDE08B"
  secondary: "#C15C5C"
  neutral-bg: "#0F111A"
  neutral-surface: "#171924"
  neutral-surface-2: "#212433"
  neutral-border: "#4A4657"
  text-primary: "#F2EFE9"
  text-muted: "#9F9EA6"
  gold-muted: "rgba(232, 208, 141, 0.3)"
  char-gold: "#C2A878"
  loc-teal: "#1C2B2D"
  fac-crimson: "#8B1E1E"
  eve-brown: "#604733"
  con-parchment: "#E8DCC4"
  mon-blood: "#3D1313"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0.3em"
  headline:
    fontFamily: "Cinzel, serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.2em"
  title:
    fontFamily: "Cinzel, serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.15em"
  body:
    fontFamily: "Cormorant Garamond, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Courier Prime, monospace"
    fontSize: "0.5625rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.25em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.pill}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.pill}"
    padding: "12px 32px"
  button-tome:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "14px 36px"
  card-codex:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "32px"
  card-entry:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "24px"
  input-field:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  badge-category:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "4px 12px"
---

# Design System: EPOS

## Overview

**Creative North Star: "The Celestial Scriptorium"**

EPOS is an ancient starlit observatory and marble library where cosmic lore is engraved into digital tablets with gold inlay. The visual world—termed *Celestial Marble*—fuses the solemnity and architectural permanence of classical antiquity with the infinite depth of deep cosmic space. Every surface, border, and typographical choice is tuned to make authors feel as though they are not merely operating a productivity database, but transcribing sacred canon (*Kitab Semesta*) into the immutable Akashic records.

The system embraces an austere and restrained philosophy for writing surfaces: clean, translucent containers with refined borders that prioritize raw authorial flow, legibility, and distraction-free creation over frivolous or heavy decorative clutter. Contrast is purposeful and sharp: midnight-sky backdrops (`#0F111A`) allow Chrysos Brilliant Gold (`#E8D08D`) accents to shine with celestial luminosity, while delicate hairline star-chart dividers provide architectural grounding without visual noise.

Confirmed visual anti-references are strictly honored: EPOS categorically rejects the sterile, cold, generic gray-and-blue SaaS template look, while equally refusing the chaotic faux-parchment textures, illegible gothic blackletter fonts, and grungy fantasy clichés that overwhelm readability in legacy tabletop wikis.

**Key Characteristics:**
- Deep celestial midnight canvases (`#0F111A`) paired with brilliant Chrysos Gold (`#E8D08D`) illumination.
- Classical, authoritative titling in all-caps tracked Cinzel balanced by deeply readable Cormorant Garamond literature prose.
- Austere, translucent glassmorphic surfaces (`tome-border`) with subtle 3px inset borders and ambient golden hover glows.
- Mythic ceremony in functional micro-details: book spine simulations, bookmark ribbons, rotated diamond seals, and star-chart alignment dividers.

## Colors

The palette is anchored in deep astronomical midnight tones punctuated by sacred solar gold, celestial parchment, and fate-bound crimson.

### Primary
- **Chrysos Brilliant Gold** (`#E8D08D`): The divine illumination token. Reserved for primary CTA typography, active navigational states, signature book titles, and delicate illuminated borders. In light mode, transforms into **Olympian Gold** (`#C29A38`).
- **Chrysos Hover Glow** (`#FDE08B`): The elevated radiant gold state for hovered buttons and interactive emblems.

### Secondary
- **Fate's Crimson** (`#C15C5C`): The thread of destiny and critical action. Used for logout/seal actions, destructive states, warning banners, and high-tension entity badges. In light mode, shifts to (`#A34E4E`).

### Neutral
- **Celestial Night** (`#0F111A`): The foundational void background canvas. Represents absolute cosmic stillness.
- **Deep Sky Panel** (`#171924`): Primary container and card surface level 1.
- **Elevated Surface** (`#212433`): Layer 2 surface for hovered cards, active navigation items, and toolbar strips.
- **Starry Slate Border** (`#4A4657`): The structural boundary token. Subtle and restrained, providing structure without competing with gold accents.
- **Starlight White** (`#F2EFE9`): Primary high-contrast body text. Softened slightly from stark `#FFFFFF` to reduce eye fatigue across multi-hour writing sessions.
- **Distant Star Grey** (`#9F9EA6`): Secondary muted text for metadata, timestamps, word counts, and placeholder text.
- **Soft Divine Glow** (`rgba(232, 208, 141, 0.3)`): Semi-transparent gold border and divider aura.

### Category Palette (The 6 Pillars)
- **Tokoh Utama (Characters)** (`#C2A878`): Olympian Warm Gold.
- **Peta Geografis (Locations)** (`#1C2B2D`): Deep Abyssal Teal.
- **Bendera Faksi (Factions)** (`#8B1E1E`): Ceremonial War Crimson.
- **Kronik Waktu (Events)** (`#604733`): Aged Chronicle Umber.
- **Hukum Semesta (Concepts)** (`#E8DCC4`): Faded Akashic Parchment.
- **Bestiary (Monsters)** (`#3D1313`): Void Blood Carmine.

### Named Rules
**The Golden Ratio of Gold Rule.** Chrysos Gold is a sacred illumination, not wallpaper. It must never exceed 10% of any screen viewport. Its rarity is what gives it authority; overuse renders the application gaudy rather than mythic.
**The Dual-Phase Realm Rule.** Themes are cosmological shifts, not simple color inversions. Dark mode is "Night of Chrysos" (deep void with starlight luster); Light mode is "Dawn of Strife" (pearlescent Olympian marble `#F4F5F8` with deep navy typography `#1C2633` and rich gold leaf `#C29A38`).

## Typography

The typographical system establishes a deliberate dialogue between imperial monumentality (Cinzel) and intimate, literary humanism (Cormorant Garamond), disciplined by crisp cataloging monospace (Courier Prime).

**Display Font:** Cinzel (with serif fallback)
**Body Font:** Cormorant Garamond (with serif fallback)
**Label/Mono Font:** Courier Prime (with monospace fallback)

**Character:** Inscribed Roman lapidary majesty in headings paired with the flowing, contemplative grace of 16th-century Italian bookmaking for prose.

### Hierarchy
- **Display** (Cinzel 900, `clamp(2rem, 5vw, 3.75rem)`, line-height: 1.05, letter-spacing: `0.3em`, uppercase): Hero title, landing proclamations, and major realm headers.
- **Headline** (Cinzel 700, `1.75rem` / 28px, line-height: 1.2, letter-spacing: `0.2em`, uppercase): Modal titles, codex overview headers, and section landmarks.
- **Title** (Cinzel 700, `1.25rem` / 20px, line-height: 1.3, letter-spacing: `0.15em`, uppercase): Card titles, entry item names, and category headings.
- **Body** (Cormorant Garamond 400/500/600, `1.125rem` / 18px, line-height: 1.6, normal case): Manuscript editor text, lore summaries, descriptions, and article reading. Maximum line length: 70ch for optimal reading rhythm.
- **Label** (Courier Prime 400/700, `0.5625rem` / 9px to `0.625rem` / 10px, line-height: 1.4, letter-spacing: `0.25em`, uppercase): Timestamps ("Terakhir diukir"), system telemetry, status tags, count badges, and code snippets.

### Named Rules
**The Inscription Case Rule.** Cinzel is an epigraphic typeface and must always be rendered in uppercase (`uppercase`) with generous tracking (`tracking-[0.15em]` or wider). Never render Cinzel in lowercase or with collapsed letter spacing.
**The Manuscript Line Rule.** Story prose and lore summaries set in Cormorant Garamond must maintain generous vertical breathing room (`line-height: 1.6` or greater) and an italic posture for introspective summaries and blockquotes.

## Layout

EPOS employs an architecturally disciplined spatial model designed around prolonged immersive writing:
- **Spatial Rhythm:** Fixed 4px base increment (`4px`, `8px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Sidebar Dock:** Fixed 260px - 280px left rail containing celestial branding, realm status, category tally links, and scribe controls.
- **Manuscript Canvas:** Fluid main writing area bounded to `max-w-4xl` for single-entry editing to ensure comfortable eye tracking, expanding to `max-w-6xl` or `max-w-7xl` for multi-column entry grids and relationship graphs.
- **Modal Containment:** Dialogs, command palettes, and auth cards are tightly framed (`max-w-md` to `max-w-xl`) floating centrally at `15vh` top offset.
- **Dividers:** Ornate hairline dividers (`.ornate-divider-h` and `.ornate-divider-v`) that fade out seamlessly via linear gradients (`linear-gradient(to right, transparent, var(--color-gold), transparent)`), avoiding harsh, mechanical border breaks.

## Elevation & Depth

EPOS rejects drop-shadow-heavy skeumorphism in favor of **Atmospheric Layering with Inset Luster**. Surfaces are flat, quiet planes at rest. Depth is established through subtle translucency, luminous hairline borders, and gentle inset halos.

### Shadow Vocabulary
- **Inset Halos** (`box-shadow: inset 0 0 20px rgba(232, 208, 141, 0.05)`): Applied to `.tome-border` panels, simulating light trapped inside translucent marble.
- **Card Hover Elevation** (`box-shadow: 0 0 30px rgba(194, 168, 120, 0.15), -translate-y-1`): Active hover state on Codex and Entry cards, creating a gentle solar levitation effect.
- **Modal Cosmic Depth** (`box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(212,175,55,0.05)`): Floating Command Palette and dialog windows over a backdrop blur (`backdrop-blur-sm bg-black/60`).

### Named Rules
**The Inset Glow Rule.** Surfaces glow from the inside before casting shadows outside. Outer shadows are reserved exclusively for interactive elevation responses (hover) and high-priority modal interruptions.

## Shapes

- **Form Language:** Austere rectilinear geometry softened by precision corner radii.
- **Corner Radii:**
  - `sm` (`4px`): Input fields, monospace badges, category pills, and buttons.
  - `md` (`8px`): Content cards, entry items, and preview panels.
  - `lg` (`12px`): Modal containers, dropdown menus, and command palettes.
  - `pill` (`9999px`): Sacred primary action triggers ("Buka Lembaran Epos") and theme toggle buttons.
- **The Tome Border Framing:** Distinctive double-frame motif (`.tome-border::before` inset by 3px with a 1px border that shifts from 50% opacity to 100% Chrysos Gold on hover).
- **Diamond Emblems:** 45-degree rotated squares (`rotate-45`) used as decorative corner brackets, spine markers, and divider medallions.

## Components

### Buttons
- **Shape:** Pill (`rounded-full`, 9999px) for primary ceremonial actions; crisp 4px rounded rectangles (`rounded-input`) for secondary tools.
- **Primary Tome Action:** Dual-layer border (`tome-border`), Chrysos Gold uppercase Cinzel text with `0.3em` tracking, trailing gold jewel dot that scales 150% on hover, and an ethereal linear shimmer gradient translating across the button surface.
- **Secondary Tool Button:** Rectangular 4px border in Starry Slate (`#4A4657`), background `#171924`, hover background `#212433` with gold border transition.
- **Editor Icon Buttons:** 32x32px square buttons with 4px radius; inactive states are muted grey, active states adopt gold text, dark background, and subtle inset shadow.

### Cards / Containers
- **Codex Card (Kitab Semesta):** Represents a physical tome. Features a left-side spine block colored with the user's custom cover tint and ribbed indentations; parchment paper content body; L-shaped decorative gold corner brackets that reveal on hover; and centered diamond medallion dividing the footer stats.
- **Entry Card (Lembaran Naskah):** Clean rectangular `.tome-border` card with a 32x4px top color ribbon indicating the entity's category, bold Cinzel title, italic Cormorant excerpt, and monospace tags.

### Inputs / Fields
- **Inscribed Input:** Dark background (`#171924`), crisp 4px corners, 1px Starry Slate border (`#4A4657`), Courier Prime monospace text (`14px`), with smooth transition to Chrysos Gold border on focus. No harsh native browser rings.
- **Search Command Bar:** Integrated within the Command Palette, full-bleed transparent background with display Cinzel typography and a gold-accented search icon.

### Navigation
- **Celestial Sidebar:** Fixed vertical dock with full-height right border, diamond emblem logo, hairline gradient dividers, and active links highlighted with a subtle gold-to-transparent gradient wash and gold monospace entry counters.
- **Category Badge:** Minimalist inline pill with 1px border, category-specific icon, and uppercase tracked Cinzel label.

### Signature Component: Command Palette ("Mata Pengetahuan")
Floating celestial search modal triggered by `Ctrl + K`. Centers at 15vh from top, features frosted backdrop blur (`bg-black/60 backdrop-blur-sm`), gold-lined chassis, instantaneous fuzzy scoring prioritizing title > tags > summary, and keyboard navigation with instant route dispatch.

## Do's and Don'ts

### Do:
- **Do** maintain a strict 90/10 ratio between midnight void surfaces and Chrysos Gold accents.
- **Do** set all Cinzel headings in uppercase with generous letter spacing (`tracking-[0.15em]` to `tracking-[0.3em]`).
- **Do** use italic Cormorant Garamond for story excerpts, lore descriptions, and blockquotes to preserve literary elegance.
- **Do** wrap primary interactive cards in `.tome-border` or double-line gold corner accents.
- **Do** use subtle hairline gradient dividers (`.ornate-divider-h`) instead of harsh solid 1px horizontal lines.
- **Do** preserve the mythic Indonesian nomenclature (*Kitab Semesta*, *Pahat Lembaran*, *Segel*, *Tinta Cerita*, *Mata Pengetahuan*).

### Don't:
- **Don't** use standard sans-serif system fonts (Inter, Roboto, Arial) for headings or body prose; the entire brand moat relies on Cinzel and Cormorant Garamond.
- **Don't** use solid bright gold backgrounds for large containers or cards; gold is an ink, wireframe, and aura, never a slab.
- **Don't** apply heavy, blurry black drop shadows; depth is created with luminous inset glows and subtle elevation shifts.
- **Don't** use garish neon colors; category accents must remain grounded in rich historical mineral pigments (lapis, crimson, brass, umber).
- **Don't** introduce noisy medieval paper textures or grungy distressed edges that degrade text clarity.
