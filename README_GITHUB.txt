ABSEN GURU SDN CIKAMPEK BARAT 2 — VERSI FINAL

URL Google Apps Script yang sudah dipasang:
https://script.google.com/macros/s/AKfycbwBMa-FK8ZM57wkyR1MXEHnxXoSEk1qFOiU4Zi-fMWSKIXYGByEJWzkxBXBMEbV3yY6yA/exec

UPLOAD KE GITHUB:
1. Ekstrak ZIP.
2. Masuk ke repository GitHub.
3. Upload SEMUA isi folder ini, jangan upload ZIP.
4. Pastikan index.html berada di halaman utama repository.
5. Settings > Pages.
6. Source: Deploy from a branch.
7. Branch: main.
8. Folder: / (root).
9. Save.

STRUKTUR:
index.html       = Dashboard
guru.html        = Data Guru + Kartu Barcode
absensi.html     = Pindai Absensi
laporan.html     = Laporan
pengaturan.html  = Pengaturan
css/style.css    = Desain
js/app.js        = Fungsi + koneksi Google Apps Script
Code.gs          = Salinan kode backend

CATATAN:
- Data guru dan absensi akan menggunakan Google Sheets setelah website memakai URL Apps Script di atas.
- Untuk scanner kamera, akses kamera browser biasanya memerlukan HTTPS; GitHub Pages menyediakan HTTPS.

