# 🛡️ MYTELCO GIT PROTOCOL

Dokumen ini mengatur tata cara kolaborasi kode untuk mencegah konflik dan menjaga kestabilan aplikasi.
PELANGGARAN TERHADAP PROTOKOL INI BISA MENYEBABKAN FITUR ANDA DITOLAK.

## 🌳 Struktur Branch (Pohon Cabang)
Hanya ada 3 jenis branch yang diakui dalam repositori ini:
1. 🔴 main (Production/Suci) :
   - DILARANG KERAS push langsung ke sini.
   - Berisi kode yang 100% stabil, bebas bug, dan siap didemokan ke Dosen/Penguji.
   - Hanya Tech Lead yang boleh melakukan merge dari dev ke main.
   - Anda bisa mendapatkan update terbaru (pull update status) disini.
2. 🟡 dev (Development/Integrasi)
   - Tempat berkumpulnya semua fitur dari anggota tim.
   - Tempat testing gabungan (Frontend + Backend + ML).
   - Jika kode Anda error, JANGAN MERGE ke sini. Perbaiki dulu di branch Anda.
3. 🟢 feature/... (Workspace Team)
   - Tempat Anda bekerja sehari-hari.
   - Nama branch wajib deskriptif.


