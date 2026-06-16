# Panduan Berkontribusi (Contributing Guide)

Terima kasih atas minat Anda untuk mengembangkan **EPOS**. Kami sangat menghargai kontribusi dari *developer*, penulis, dan desainer untuk membuat wadah *world-building* ini menjadi lebih epik.

## 1. Kode Etik
Dengan berpartisipasi dalam proyek ini, Anda setuju untuk mematuhi [Code of Conduct](./CODE_OF_CONDUCT.md) kami. Kami berkomitmen untuk menyediakan lingkungan kolaborasi yang aman dan inklusif.

## 2. Alur Kerja Standar (Workflow)
1. **Fork** repositori ini ke akun GitHub Anda.
2. Buat *branch* baru untuk fitur atau perbaikan Anda:
   `git checkout -b feature/nama-fitur-epik` atau `git checkout -b fix/perbaikan-bug-krusial`
3. Tulis kode Anda. Pastikan untuk mematuhi *style guide* dan *design system* Celestial Marble kami.
4. Jalankan Linter dan periksa *build*:
   `npm run lint` & `npm run build`
5. Lakukan *Commit* dengan pesan yang deskriptif menggunakan format *Conventional Commits*:
   `feat(editor): menambahkan fitur undo/redo pada text editor`
6. *Push* ke *branch* Anda: `git push origin feature/nama-fitur-epik`
7. Buka **Pull Request (PR)** ke *branch* `main` di repositori asli kami.

## 3. Gaya Penulisan Kode (Style Guide)
- Gunakan **TypeScript** secara ketat (*strict mode*). Hindari penggunaan `any` sebisa mungkin.
- Untuk komponen UI, kami menggunakan **Tailwind CSS**. Pastikan untuk menggunakan variabel CSS kustom kami (seperti `var(--color-gold)`) daripada warna *hard-coded* agar *Dark/Light mode* tetap selaras.
- Pisahkan logika *fetching* ke sisi server (Server Components) jika memungkinkan, dan biarkan komponen klien (*use client*) hanya untuk interaktivitas UI.

## 4. Melaporkan Bug (Issue Reporting)
Jika Anda menemukan keretakan dalam matriks semesta (Bug), silakan buka *Issue* dengan format:
- **Deskripsi Bug:** Apa yang terjadi?
- **Cara Reproduksi:** Langkah demi langkah memunculkan bug.
- **Harapan:** Apa yang seharusnya terjadi?
- **Tangkapan Layar:** Lampirkan gambar jika berhubungan dengan UI.

Bersama-sama, kita akan memahat sejarah *open-source* yang indah.
