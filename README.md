# Rifalvisuals

Website dokumentasi Umroh/Haji dan CMS admin. Next.js 16, React 19, Tailwind 4, Prisma 6, PostgreSQL. Booking dikonfirmasi manual melalui WhatsApp.

## Persiapan lokal

Gunakan Node.js 24 (lihat .nvmrc) dan PostgreSQL 16 atau lebih baru. Pilih Node.js 24 juga pada konfigurasi aplikasi production; CI menggunakan versi yang sama dari .nvmrc.

1. Jalankan npm ci dan npx prisma generate.
2. Salin .env.example menjadi .env, isi DATABASE_URL dan JWT_SECRET. Secret wajib acak minimal 32 byte; nilai lama yang pernah tertulis di source ditolak. Buat dengan node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))" dan simpan hasilnya secara privat.
3. Untuk **database baru/kosong** saja, jalankan npm run db:migrate, lalu npm run prisma:seed.
4. Buat admin memakai npm run admin:setup dengan ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_NAME, dan ADMIN_PASSWORD melalui environment. Password minimal 12 karakter dan maksimal 72 byte. Tidak ada akun/password bawaan. Perintah menolak mengganti akun yang sudah ada tanpa opsi --reset-password.
5. Jalankan npm run dev, atau npm run build kemudian npm start untuk produksi.

Contoh reset akun yang sudah ada: isi variabel ADMIN_* secara privat, lalu npm run admin:setup -- --reset-password. Perintah ini hanya mengganti password akun tersebut. Bersihkan variabel password setelah selesai. Jangan menaruh password pada argumen CLI atau commit Git.

Font disimpan lokal beserta lisensi OFL di src/app/fonts. Build tidak memerlukan Google Fonts. Gambar CMS dipilih dari pustaka lokal public/images; URL media eksternal tidak diterima.

## Database lama dan migrasi

**Jangan menjalankan reset, db push, atau seed lama pada database produksi.** Implementasi dan CI tidak melakukan koneksi deploy atau perubahan database produksi.

- Backup database dan uji pemulihannya terlebih dahulu. Gunakan salinan database untuk latihan migrasi.
- Migrasi 20261113000000_initial merepresentasikan skema aplikasi sebelum perbaikan. Pada database lama tanpa riwayat migrasi, buat database pembanding kosong dan terapkan **hanya migrasi awal** di sana. Bandingkan salinan database lama dengan pembanding memakai prisma migrate diff --from-url <URL_SALINAN> --to-url <URL_PEMBANDING> --exit-code. Hindari memasukkan password pada riwayat shell; gunakan environment.
- Baseline hanya jika diff kosong (exit 0): jalankan npx prisma migrate resolve --applied 20261113000000_initial pada salinan database lama, kemudian npm run db:migrate. Jika berbeda (exit 2) atau gagal (exit 1), hentikan proses dan tinjau drift; jangan menandai baseline sebagai selesai.
- Migrasi berikutnya mengubah default consent baru menjadi false dan menormalkan lokasi MEKKAH menjadi MAKKAH. Consent dan konten lama tidak dihapus atau disetel ulang.
- Setelah latihan berhasil dan backup tersedia, langkah yang sama dapat dijalankan manual oleh operator pada produksi. Tidak ada CD.

Seed aplikasi mengisi katalog dan pengaturan yang belum ada, tanpa menghapus atau menimpa harga, pengaturan, admin, konten, maupun histori audit. Testimoni/foto contoh hanya dibuat dalam fixture pengujian. Konten yang izinnya tidak dapat dipastikan harus ditinjau operator sebelum dipublikasikan.

Sebelum menggunakan perbaikan autentikasi di produksi, ganti secret lama dengan nilai baru dan reset password akun yang dibuat oleh seed lama. Rotasi JWT_SECRET membatalkan seluruh sesi. Jangan membagikan atau menyalin secret produksi ke pengujian.

## Pengujian terisolasi

Buat database PostgreSQL khusus tes dengan nama berakhiran _test dan berbeda dari database aplikasi. Salin .env.test.example menjadi .env.test.local, lalu isi TEST_DATABASE_URL. Variabel shell dengan nama yang sama juga didukung.

- npm run test:unit: tes unit, tanpa database aplikasi.
- npm run test:db:setup: migrasi dan reset fixture **khusus database tes**. Semua isinya akan diganti.
- npm run test:integration: tes PostgreSQL, route admin, transaksi audit, seed idempoten, dan integritas katalog.
- npm test: unit dan integrasi; siapkan database tes terlebih dahulu.
- npm run typecheck: next typegen dan TypeScript.
- npm run lint: ESLint.
- npm run build: build produksi dengan webpack.
- npx playwright install chromium: instal browser sekali.
- npm run test:e2e: browser desktop/mobile terhadap build produksi; lakukan build dan setup fixture dahulu.

Runner menolak TEST_DATABASE_URL yang hilang, nama database tanpa akhiran _test, atau nama yang sama dengan database aplikasi. Tidak ada fallback ke DATABASE_URL. Jangan menjalankan setup fixture pada database yang menyimpan data penting, termasuk database bernama _test.

E2E menggunakan akun test-admin dengan password fixture khusus tes yang terdapat di tests/fixtures/credentials.ts. Akun tersebut tidak dibuat oleh seed aplikasi. Tes yang mengubah harga, consent, atau pengaturan memulihkan nilainya. Jalankan test:db:setup untuk mengembalikan seluruh fixture jika proses tes terputus. Server lama tidak dipakai ulang, dan port 3000 harus tersedia.

## CI tanpa CD

GitHub Actions menjalankan workflow CI pada pull request ke main, push ke main, dan pemicu manual:

1. Lint, pemeriksaan tipe, dan tes unit.
2. PostgreSQL service terpisah, migrasi/fixture, tes integrasi, build produksi, lalu E2E Chromium desktop/mobile.

Kunci sesi CI dibuat acak setiap run. CI tidak membutuhkan secret produksi. Hasil tes, build log, screenshot kegagalan, dan trace disimpan sebagai artifact selama tujuh hari. Tidak ada SSH, Rsync, perubahan database remote, atau restart PM2.

Untuk mewajibkan CI sebelum merge, aktifkan branch protection/ruleset main di GitHub dan pilih kedua check: "Lint, types and unit tests" serta "PostgreSQL, build and browser tests". Pengaturan ini dilakukan manual setelah workflow muncul di GitHub. Secret deploy lama boleh dicabut oleh pemilik repository setelah memastikan tidak dipakai workflow lain.
