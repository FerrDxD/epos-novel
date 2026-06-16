# EPOS: Kitab Semesta 📜✨

> **"Sebuah wadah epik dari imajinasi tanpa batas. Rajut kembali kepingan semesta fiksi Anda, dokumentasikan sejarahnya, dan lindungi konsistensi mahakarya Anda di dalam lembaran keabadian digital."**

EPOS (sebelumnya dikenal sebagai Codex) adalah platform manajemen *world-building* tingkat lanjut yang dirancang khusus untuk penulis fantasi, *Dungeon Masters*, kreator *game lore*, dan arsitek semesta fiksi. Dengan antarmuka *celestial marble* yang terinspirasi dari literatur fantasi tingkat tinggi, EPOS memastikan setiap goresan tinta sejarah fiksi Anda saling terhubung dan tersimpan abadi.

![EPOS Interface Preview](./codex_dashboard_dark_1781607393867.jpg)

## 🌟 Fitur Unggulan (The Three Pillars)

1. **Inkarnasi Naskah (Smart Entity Management)**
   Simpan dan organisir entitas penting dalam dunia Anda melalui 6 kategori fundamental:
   - 👑 **Tokoh Utama (Characters):** Pahlawan, raja, dewa, atau rakyat jelata.
   - 🗺️ **Peta Geografis (Locations):** Kerajaan, dimensi, atau reruntuhan kuno.
   - 🏴 **Bendera Faksi (Factions):** Sekte rahasia, guild, atau ras dominan.
   - ⏳ **Kronik Waktu (Events):** Peperangan, kelahiran alam semesta, atau perjanjian damai (Tersedia dalam format *Interactive Timeline*).
   - 💡 **Hukum Semesta (Concepts):** Sistem sihir, hukum fisika fiktif, atau dogma agama.
   - 🐉 **Bestiary (Monsters):** Binatang buas atau entitas kosmik.

2. **Peta Takdir (Smart Mentions & Auto-Linking)**
   Tulis nama entri di dalam naskah Anda (contoh: `@Raja Arthur`), dan EPOS akan secara otomatis membuat tautan dinamis yang menghubungkannya ke halaman entitas tersebut. Jaringan relasi terbangun dengan sendirinya tanpa perlu *hyperlink* manual.

3. **Mata Pengetahuan (Omnisearch Command Palette)**
   Tekan `Ctrl + K` di manapun untuk membuka *Command Palette* dan memanggil informasi dari sudut semesta mana pun secara instan.

4. **Editor Visual (Rich Text Editor)**
   Tak perlu pusing dengan sintaks Markdown. Gunakan Editor Visual bergaya *Amphoreus* untuk menebalkan teks, membuat daftar, atau menulis ramalan dalam blok *quote* yang estetik.

## 🚀 Arsitektur & Teknologi

EPOS dibangun dengan standar industri modern untuk memastikan performa dan keamanan berskala *startup*:
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Design System: "Celestial Marble")
- **Database ORM:** Drizzle ORM
- **Database Engine:** PostgreSQL (Neon Serverless)
- **Authentication:** NextAuth.js (v5) + Google OAuth
- **Editor:** TipTap (Headless Rich Text)

## 💻 Membangkitkan EPOS di Lokal (Installation)

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm / pnpm / yarn
- PostgreSQL URL

### Langkah-langkah
1. Kloning repositori suci ini:
   ```bash
   git clone https://github.com/your-username/epos.git
   cd epos
   ```

2. Unduh segel dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Atur variabel lingkungan. Buat file `.env` di *root* dan masukkan:
   ```env
   DATABASE_URL="postgresql://user:password@host/dbname"
   NEXTAUTH_SECRET="your_secret_key_here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Opsional untuk Integrasi Google
   AUTH_GOOGLE_ID="your_google_client_id"
   AUTH_GOOGLE_SECRET="your_google_client_secret"
   ```

4. Pahat struktur *database*:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Mulai ritual pemanggilan (Jalankan server):
   ```bash
   npm run dev
   ```
   EPOS kini beresonansi di `http://localhost:3000`.

## 📖 Panduan Menulis (How to Add Entities)

Untuk menambahkan entitas baru, ikuti pedoman ini:
1. Buka salah satu kitab (Codex) Anda.
2. Klik tombol **"Pahat [Kategori] Baru"** di sudut kanan atas layar.
3. Anda akan dihadapkan pada **Papan Ketik Celestial**:
   - **Atribut Khas:** Setiap kategori memiliki metadata khusus (contoh: Karakter memiliki "Usia", Faksi memiliki "Arah Moral"). Isi sesuai *lore* Anda.
   - **Tinta Cerita:** Gunakan *Rich Text Editor* untuk menulis naskah. Tekan tombol `B`, `I`, atau *Heading* di *toolbar* untuk memformat teks.
   - **Segel Tanda (Tags):** Ketik kata kunci (seperti "Elf", "Magic", "Zaman Keemasan") lalu tekan Enter untuk mengelompokkan entri.
4. Klik **"Pahat Lembaran Ini"** untuk menyimpannya ke *database* abadi.

---
Dikembangkan dengan 🤍 dan debu bintang.
