ABSEN GURU - SDN CIKAMPEK BARAT 2
=====================================

Yang sudah dipisahkan:
- index.html       = Dashboard
- guru.html        = Data Guru
- absensi.html     = Pindai Absensi
- laporan.html     = Laporan
- pengaturan.html  = Pengaturan
- css/style.css    = Tampilan
- js/app.js        = fungsi umum
- Code.gs          = Google Apps Script

KONEKSI GOOGLE SHEETS
=====================
URL Apps Script sudah dipasang di js/app.js:
https://script.google.com/macros/s/AKfycbzhjORWsxJ8l_Dy2cCLPcFoW960Kd-FeC89g4GzwrkhFG1AZB5jmmdr5OixZ-rWbYCmrA/exec

ALUR
====
1. Data Guru diisi lewat halaman Data Guru.
2. Website mengirim guru baru ke Google Sheets.
3. QR/barcode dibuat dari ID Guru.
4. Halaman Absensi membaca ID QR/barcode dan memanggil Apps Script.
5. Apps Script mencari guru dan menulis ke sheet Kehadiran.
6. Laporan di website dapat difilter dan diunduh.

PENTING
=======
Setelah mengubah Code.gs, lakukan:
Deploy > Manage deployments > Edit > New version > Deploy.

Untuk GitHub Pages:
Upload seluruh isi folder ini ke repository GitHub, termasuk folder css dan js.
Jangan upload ZIP sebagai isi website.
