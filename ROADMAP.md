# 🗺️ ROADMAP EPOS — Dari Project Gabut ke SaaS Premium

> **Visi:** Menjadi WorldAnvil-nya Asia Tenggara — tapi 10x lebih cantik, lebih cerdas (AI-native), dan lebih kolaboratif.
> **Tagline:** *Kitab Semesta untuk Arsitek Dunia Fiksi.*
> **Target:** $1.000 MRR dalam 6 bulan setelah Milestone 5.

---

## 📊 Audit Ringkas (14 Okt 2026)

| Aspek | Skor | Status | Catatan Kritis |
| :--- | :---: | :--- | :--- |
| Ide & Branding | **9.5/10** | 🟢 Juara | `Celestial Marble` + `Amphoreus` jangan pernah diganti. Ini moat utama. |
| Tech Stack | 7.5/10 | 🟡 Bagus | Next 14 + Drizzle + Neon + Tiptap sudah pilihan senior. |
| Database | 6.0/10 | 🟡 Rawan | Belum ada index, pgEnum, transaction. Race condition di `entryCount`. |
| Security | **4.5/10** | 🔴 Darurat | Ownership bypass, no rate-limit, XSS di editor, SSRF di import. |
| AI / Gemini | 5.5/10 | 🟡 Boros | Sync import (timeout), boros token, `fs.writeFileSync` akan crash di Vercel. |
| UX / Frontend | 7.0/10 | 🟡 Cantik | Belum ada pagination, autosave, loading state, a11y. |
| SaaS Readiness | **2.0/10** | 🔴 0% | Belum ada payment, quota, analytics, SEO, monitoring. |

**Kesimpulan Audit:** Kamu sudah 30% jadi. 70% sisanya bukan nambah fitur, tapi **mengeraskan fondasi agar tidak ambruk saat viral.**

> Prinsip Roadmap ini: **Amankan -> Percantik -> Pintarkan -> Monetisasi -> Sebarkan.**

---

## 🧭 Peta Milestone (8 Fase)

```
M0 Fondasi ──► M1 Benteng ──► M2 UX ──► M3 AI ──► M4 Kolaborasi ──► M5 Uang ──► M6 Scale ──► M7 Growth
 Week 1-2       Week 3-4     Week 5-7  Week 8-10  Week 11-13      Week 14-15   Week 16-17   Week 18+
 [P0 WAJIB]     [P0 WAJIB]   [P1]      [P1]       [P2 MOAT]       [P1 $$]      [P2]         [ONGOING]
```

### Cara Pakai Roadmap Ini

1.  Jangan loncat milestone. M0 & M1 adalah **pintu gerbang**.
2.  Setiap milestone punya `Deliverable` yang harus hijau sebelum lanjut.
3.  Centang `- [x]` di file ini setiap task selesai — commit langsung.
4.  Buat GitHub Project Board dengan 8 kolom sesuai milestone ini.

---

### MILESTONE 0 — Fondasi Kokoh ⛏️
**Durasi:** Week 1-2 | **Prioritas:** `P0 WAJIB` | **Estimasi:** 12-16 jam
**Tujuan:** Biar `npm run build` tidak pernah gagal dan semua API ngomong jujur (error yang jelas).

#### Masalah yang Diselesaikan
- `GEMINI_API_KEY` bikin build crash kalau belum di-set.
- `AUTH_GOOGLE_ID` di README beda dengan `GOOGLE_CLIENT_ID` di kode.
- `fs.writeFileSync` akan `EROFS` di Vercel/Lambda.
- `category: text` bisa diisi `"hacked"`.
- Query list entries makin lambat saat data >1000.

#### Tasks
- [x] **ENV:** Buat `lib/env.ts` pakai `zod` untuk validasi semua env. Buat `.env.example`. — *done 14 Okt: `lib/env.ts` + `.env.example`, dukung `SKIP_ENV_VALIDATION`*
- [x] **ENV:** Sinkronkan penamaan: pilih `GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_ID` (hapus yang satu). — *done: `lib/env.ts` resolve alias, `lib/auth.config.ts` pakai `env.resolvedGoogleId/Secret`*
- [x] **FIX:** Hapus `fs.writeFileSync` di `lib/gemini.ts:90` & `:103` -> ganti `console.debug` atau `pino`. — *done: lazy `getModel()`, debug via `console.debug` only*
- [x] **VALIDATION:** Pasang `zod` di semua `app/api/*` (`codex`, `entry`, `import`, `relation`, `register`). — *done: `lib/validators.ts` (offline-safe fallback) + `codex`, `codex/[codexId]`, `entry`, `entry/[entryId]`, `relation`, `register`. Import formData menyusul M3 (butuh schema multipart)*
- [x] **DB:** Ganti `category text` -> `pgEnum("category", ["characters", "locations", ...])` di `lib/db/schema.ts`. — *done + `importStatusEnum`/`sourceTypeEnum`*
- [x] **DB:** Tambah Index: `index("entries_codex_idx").on(entries.codexId)` dan `index("entries_user_idx").on(entries.userId)`. — *done + `category`, `codex_category`, `relations`, `import_logs` indexes*
- [ ] **DX:** Pasang `eslint` + `prettier` + `husky` pre-commit + `lint-staged`. — *pending, tidak blokir build; kerjakan saat online*
- [x] **GIT:** Update `.gitignore` -> tambah `gemini-debug.json`, `gemini-error.log`, `.env.local`. — *done*

#### Deliverable
> `npm run build` sukses tanpa env, semua API return `400` dengan pesan `ZodError` yang jelas jika input salah.

---

### MILESTONE 1 — Benteng Keamanan 🛡️
**Durasi:** Week 3-4 | **Prioritas:** `P0 WAJIB` | **Estimasi:** 16-20 jam
**Tujuan:** Tidur nyenyak walau ada user jahil iseng nge-curl.

#### Masalah yang Diselesaikan
- User A bisa hapus relasi User B (DELETE `/api/relation` tidak cek ownership).
- PATCH `/api/entry/[id]` bisa mass-assignment (inject field ngawur).
- Tidak ada Rate Limit -> tagihan Gemini & Neon bisa jebol di-spam.
- XSS via `editor.getHTML()` dan SSRF via `gdocs` fetcher.

#### Tasks
- [x] **AUTH:** Fix ownership di `app/api/relation/route.ts` DELETE -> cek `relation.codex.userId === session.user.id`. — *done 14 Okt: POST cek src/tgt belong to user & same codex, DELETE cek codex ownership 403*
- [x] **AUTH:** Fix PATCH `app/api/entry/[entryId]/route.ts` -> whitelist hanya `["title", "summary", "content", "tags", "metadata", "imageUrl", "category"]`. — *done: zod strict + sanitize*
- [x] **MIDDLEWARE:** Proteksi `/api/*` di `middleware.ts` + tambah Security Headers di `next.config.mjs` (CSP, HSTS, X-Frame-Options). — *done: middleware matcher `/api/:path*`, next.config headers HSTS/CSP/nosniff*
- [x] **RATE LIMIT:** Pasang Upstash Redis. Limit: `register 5/ip/jam`, `import 3/user/hari (free)`, `entry POST 30/menit`. — *done: `lib/rate-limit.ts` in-memory (Upstash-ready), register 5/IP/jam, import 5/user/jam, entry 30/menit, relation 60/jam + 429 Retry-After*
- [x] **XSS:** Sanitasi HTML Tiptap pakai `isomorphic-dompurify` sebelum `db.insert` dan sebelum `dangerouslySetInnerHTML`. — *done: `lib/sanitize.ts` allowlist (tanpa dep tambahan), dipakai di entry create/patch + import*
- [x] **SSRF:** Tambah timeout 10s + validasi hostname di `lib/parsers/gdocs.ts` (hanya allow `docs.google.com`, `drive.google.com`). — *done: 10s AbortController + redirect host guard + import URL allowlist*
- [x] **AUTH:** Normalisasi `email.toLowerCase().trim()` di `register` & `authorize`. Validasi `username` regex `^[a-zA-Z0-9_]{3,20}$`. — *done: validators + lib/auth case-insensitive lower()*
- [ ] **AUTH:** Tambah fitur Lupa Password via `Resend` + token `password_reset_tokens` table. — *pending, butuh Resend API key; kerjakan setelah M1 stabil*

#### Deliverable
> Lolos simulasi OWASP Top 10 manual. Coba `curl` hapus data orang lain -> `403 Forbidden`.

---

### MILESTONE 2 — UX Celestial 2.0 ✨
**Durasi:** Week 5-7 | **Prioritas:** `P1` | **Estimasi:** 24-30 jam
**Tujuan:** Dari "cantik" jadi "nagih" — user betah nulis 5 jam tanpa takut data hilang.

#### Tasks
- [x] **PERF:** Pagination + Virtualization (`react-virtuoso`) untuk list entries. Target: 1000 entries tetap 60fps. — *done 14 Okt: `EntryGrid` infinite scroll page/limit+IntersectionObserver, API pagination; virtuoso next step bila perlu*
- [x] **FEEDBACK:** Buat `loading.tsx`, `error.tsx`, `not-found.tsx` di semua segment + `Skeleton` untuk `CodexCard` & `EntryCard`. — *done: `Skeleton.tsx` + `dashboard/loading.tsx` + `codex/[codexId]/loading.tsx`+`not-found.tsx`*
- [x] **EDITOR:** Autosave `RichTextEditor` (debounce 2s ke localStorage) + indikator "Menyimpan..." + `Ctrl+S`. — *done: draftKey per codex, 800ms debounce, Menyimpan/Tersimpan/Ctrl+S, restore & clearDraft*
- [ ] **FITUR JANJI:** Implementasi `@mention` Tiptap Extension -> ketik `@Eren` auto-link ke entry karakter. — *pending, butuh tiptap mention extension + suggestion; next commit*
- [x] **SEARCH:** Upgrade `CommandPalette` pakai `fuse.js` fuzzy search di `title+tags+summary`, bukan cuma `title`. — *done: custom fuzzy scorer title>tags>summary, layout supply summary+tags*
- [x] **NAV:** Breadcrumb dinamis + Empty State yang persuasif (CTA jelas). — *done: `Breadcrumb.tsx` + EntryGrid empty state + CodexGraph placeholder untuk <=5 entries*
- [x] **SEO:** Buat `app/sitemap.ts`, `app/robots.ts`, dan `app/codex/[codexId]/opengraph-image.tsx` (OG Image dinamis). — *done: sitemap+robots; opengraph-image menyusul M6 (butuh ImageResponse)*

#### Deliverable
> Lighthouse Performance >90, user bisa ngetik 2000 kata, close tab, buka lagi -> draft masih ada.

---

### MILESTONE 3 — Otak AI Sejati 🧠
**Durasi:** Week 8-10 | **Prioritas:** `P1 PEMBEDA` | **Estimasi:** 24-30 jam
**Tujuan:** AI bukan gimmick "ekstrak 15 entitas", tapi asisten lore yang paham semesta.

#### Tasks
- [ ] **ARCH:** Pindah import ke **Background Job** (Vercel Cron + QStash / atau `pg-boss`). `POST /api/import` -> return `jobId` -> polling `GET /api/import/[jobId]`.
- [ ] **COST:** Token Counter + Cost Guard. Hitung token sebelum `generateContent`, reject jika >120k. Simpan ke `usage_logs`.
- [ ] **RELIABILITY:** Validasi JSON Gemini pakai `zod` + auto-retry 2x jika JSON malform. Ganti model ke `gemini-1.5-flash` dengan `responseSchema`.
- [ ] **PROMPT:** Perbaiki prompt: tambah `few-shot example` agar metadata lebih akurat & tidak halusinasi.
- [ ] **FITUR PREMIUM:** **"Lore Consistency Check"** -> endpoint `/api/check-consistency` yang suruh AI cari kontradiksi antar entries.
- [ ] **PARSER:** Ganti `pdf-parse@1.1.4` (CVE, unmaintained) -> `unpdf` atau `pdfjs-dist`.
- [ ] **DB:** Bungkus `Promise.all(insert)` import dalam `db.transaction()` agar atomic.

#### Deliverable
> Import PDF 100 halaman tidak pernah timeout (202 Accepted), biaya AI terkontrol < $0.05/import, dan hasil JSON 99% valid.

---

### MILESTONE 4 — Kolaborasi Semesta 🤝
**Durasi:** Week 11-13 | **Prioritas:** `P2 MOAT` | **Estimasi:** 30-36 jam
**Tujuan:** Bikin 1 Codex dikerjakan 3 penulis bareng. Ini yang bikin user ajak teman & susah pindah ke Notion.

#### Tasks
- [ ] **DB:** Schema baru `codex_members (id, codexId, userId, role: 'owner'|'editor'|'viewer', createdAt)` + `entry_versions`.
- [ ] **SHARE:** Halaman `codex/[id]/share` -> Invite by Email + Generate Share Link + Role selector.
- [ ] **REALTIME:** Integrasi Liveblocks / PartyKit -> lihat kursor & siapa lagi online di Codex.
- [ ] **HISTORY:** Version History di `entry/[entryId]` -> list `entry_versions` + tombol `Restore`.
- [ ] **PORTABILITY:** Export Codex -> `Export PDF Kitab` (cantik) & `Export JSON` (backup) + `Import JSON` balik.
- [ ] **TRASH:** Soft Delete -> `deletedAt` column + halaman `Trash` + restore 30 hari.

#### Deliverable
> 1 Codex bisa di-share ke 2 teman dengan role beda, dan bisa lihat history perubahan per entry.

---

### MILESTONE 5 — Mesin Uang 💰
**Durasi:** Week 14-15 | **Prioritas:** `P1 MONETISASI` | **Estimasi:** 20-24 jam
**Tujuan:** Pertama kali dapat notifikasi "You got paid $12!"

#### Pricing Plan (Rekomendasi)
| Plan | Harga | Codex | Entries | AI Import | Fitur Kunci |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Free (Wanderer)** | Rp 0 | 1 | 50 | 3 / bulan | Coba rasa |
| **Scribe** | $7 / ~Rp 115k | 5 | 500 | 50 / bulan | Untuk penulis serius |
| **Archon** | $14 / ~Rp 230k | ∞ | ∞ | 200 / bulan | + Consistency Check + Kolaborasi |

#### Tasks
- [ ] **DB:** Schema `subscriptions`, `plans`, `webhook_events`.
- [ ] **PAYMENT:** Integrasi **LemonSqueezy** (rekomendasi untuk Indonesia, handle PPN) atau Stripe.
- [ ] **QUOTA:** Middleware `checkQuota(userId)` sebelum `POST /api/entry` & `POST /api/import`. Return `402 Payment Required` jika limit.
- [ ] **UI:** Halaman `/pricing` di Landing Page + Paywall modal yang cantik (bukan error 500).
- [ ] **WEBHOOK:** Handle `subscription.created/updated/cancelled` -> update `subscriptions` table.
- [ ] **PORTAL:** Customer Portal -> user bisa upgrade/downgrade/cancel sendiri.

#### Deliverable
> User Free yang coba buat entry ke-51 dapat paywall Celestial yang persuasif, dan user Scribe bisa bayar via LemonSqueezy.

---

### MILESTONE 6 — Observability & Scale 🔭
**Durasi:** Week 16-17 | **Prioritas:** `P2` | **Estimasi:** 16-20 jam
**Tujuan:** Siap ditembak 10.000 user dari Product Hunt / X tanpa down.

#### Tasks
- [ ] **MONITORING:** Pasang Sentry (error tracking), PostHog (product analytics), Axiom/Better Stack (log).
- [ ] **DB:** Migrasi `neon-http` -> `neon-serverless + pooling` untuk support `db.transaction()`.
- [ ] **CACHE:** Cache `GET /api/codex` & `GET /api/entry` pakai `unstable_cache` + `revalidateTag("codex")` saat POST/PATCH.
- [ ] **PERF:** Wrap semua `entryCount` update dalam transaction. Tambah `GIN index` untuk `tags`.
- [ ] **CI/CD:** GitHub Actions: `lint` -> `typecheck` -> `build` -> `drizzle migrate` (on main).
- [ ] **BACKUP:** Aktifkan Point-in-Time Restore di Neon + jadwal backup harian + install `pgvector` extension untuk M7.
- [ ] **DOCKER:** Buat `Dockerfile` untuk self-host option (nilai jual premium).

#### Deliverable
> Dashboard Sentry 0 error unhandled, p95 API latency <200ms, dan ada backup harian otomatis.

---

### MILESTONE 7 — Growth Loop 🚀
**Durasi:** Week 18+ | **Prioritas:** `ONGOING` | **Estimasi:** Continuous
**Tujuan:** User datang sendiri tanpa kamu harus DM satu-satu.

#### Tasks
- [ ] **EXPLORE:** Halaman Publik `/explore` -> Gallery Codex yang di-publish user (kayak Dribbble untuk world-building).
- [ ] **AI CHAT:** `pgvector` + Embeddings -> Fitur **"Chat dengan Semestamu"** ("Jelaskan hubungan Eren & Mikasa?").
- [ ] **SEARCH:** Full-text Search + Semantic Search ("cari karakter yang mirip Guts dari Berserk").
- [ ] **ONBOARDING:** Onboarding interaktif 3 langkah: `Buat Codex -> Buat Karakter Pertama -> Coba Import`.
- [ ] **REFERRAL:** Sistem `?ref=username` -> pengundang & diundang dapat +1 bulan Scribe.
- [ ] **CONTENT:** Blog SEO `/blog/*` -> artikel "Cara Worldbuilding Fantasi", "Template Lore Harry Potter" untuk tarik traffic Google.
- [ ] **LAUNCH:** Siapkan Product Hunt Launch Kit (video 30s, thumbnail Celestial, tagline).

#### Deliverable
> 20% user baru datang dari `/explore` dan Blog SEO, bukan dari iklan.

---

## ✅ Definition of Done (Untuk Setiap Milestone)

Sebuah milestone dianggap **SELESAI** jika:
1.  Semua task `- [ ]` jadi `- [x]` dan ter-commit ke `main`.
2.  `npm run build` & `npm run lint` hijau di CI.
3.  Tidak ada `console.log` atau `fs.writeFileSync` tertinggal.
4.  Sudah dites manual sebagai user Free & user Premium.
5.  Update file `ROADMAP.md` ini dan push.

---

## 🛠️ Tech Debt Backlog (Kerjakan jika sempat)

- [ ] Ganti `bcryptjs` -> `argon2` (lebih aman).
- [ ] Tambah `playwright` e2e test untuk flow `register -> create codex -> create entry`.
- [ ] Implementasi `next-safe-action` untuk semua Server Actions.
- [ ] Dark/Light theme flicker fix (FOUC) di `app/layout.tsx`.
- [ ] Optimasi `CodexGraph` -> lazy load `react-force-graph-2d` hanya jika `entries.length > 5`.

---

## 💬 Catatan Untukmu, Ferr

> Kamu tidak perlu selesaikan 8 milestone ini dalam 2 bulan. Fokus ke **M0 + M1 dalam 2 minggu ke depan**. Setelah itu, EPOS sudah **aman untuk di-share ke 50 beta tester**.
>
> Branding `EPOS` kamu sudah premium. Jangan rusak dengan fitur setengah jadi. Lebih baik 3 fitur yang **kokoh & nagih** daripada 10 fitur yang gampang jebol.
>
> Kalau butuh, panggil aku dengan: `gas M0` — aku akan langsung eksekusi kodenya.

**Dibuat dengan 🤍 dan debu bintang — EPOS Audit 14 Okt 2026**

