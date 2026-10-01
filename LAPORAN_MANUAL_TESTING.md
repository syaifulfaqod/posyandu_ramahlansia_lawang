# Laporan Hasil Manual Testing (Static Testing)

Dokumen ini berisi hasil pengujian manual (Static Code Inspection) pada source code sistem **PosyanduWeb**. Pengujian dilakukan berdasarkan Software Inspection Checklist.

Berikut adalah daftar file dan baris kode yang telah diperiksa (di-test):

### 1. Aspek Readability (Keterbacaan Kode)
- **Lokasi Code:** `server/src/services/user.service.ts` (baris 8-17) & `server/src/routes/user.routes.ts` (baris 36-43)
- **Kriteria:** Nama variabel dan fungsi jelas, konsisten, dan mudah dipahami.
- **Hasil Inspeksi:** Penggunaan nama variabel sangat deskriptif (contoh: `existingUser`, `failedLoginAttempts`, `isAdminKkn`) dan fungsi (contoh: `getAllUsers()`). Memudahkan pembacaan alur kode tanpa harus menebak fungsi dari variabel tersebut.
- **Status:** ✅ Sesuai

### 2. Aspek Security (Keamanan)
- **Lokasi Code:** `server/src/services/user.service.ts` (baris 63-69)
- **Kriteria:** Tidak ada penyimpanan password dalam bentuk plaintext di dalam kode maupun database.
- **Hasil Inspeksi:** Sistem tidak menyimpan password secara *hardcoded*. Saat melakukan update password, sistem menggunakan fungsi `hashPassword(data.password)` sebelum menyimpannya ke dalam database (table account).
- **Status:** ✅ Sesuai

### 3. Aspek Input Validation
- **Lokasi Code:** `server/src/routes/user.routes.ts` (baris 29-31 atau 56-58)
- **Kriteria:** Semua input pengguna harus melewati validasi sebelum diproses lebih lanjut.
- **Hasil Inspeksi:** Terdapat pengecekan eksplisit pada endpoint `/login-failed` dan `/login-success`. Jika input email kosong, sistem menolak proses dan mengembalikan status HTTP 400 (Bad Request) dengan pesan error "Email is required".
- **Status:** ✅ Sesuai

### 4. Aspek Error Handling
- **Lokasi Code:** `server/src/routes/user.routes.ts` (baris 77-85)
- **Kriteria:** Penanganan error sudah tepat, tidak ada error yang diabaikan (diam-diam).
- **Hasil Inspeksi:** Seluruh endpoint dibungkus menggunakan blok `try...catch`. Jika terjadi kegagalan sistem (seperti database terputus), *catch* menangkap error tersebut, mencetaknya di log server (`console.error`), dan memberikan respons status HTTP 500 (Internal Server Error) kepada pengguna.
- **Status:** ✅ Sesuai

### 5. Aspek Documentation
- **Lokasi Code:** `server/src/routes/user.routes.ts` (baris 27, 54, dan 67)
- **Kriteria:** Fungsi utama memiliki komentar penjelasan singkat.
- **Hasil Inspeksi:** Setiap blok endpoint memiliki komentar berbahasa Indonesia yang sangat jelas (contoh: `// Endpoint untuk mencatat kegagalan login`). Ini sangat membantu sebagai dokumentasi *inline* kode.
- **Status:** ✅ Sesuai

### 6. Aspek Performance (Kinerja)
- **Lokasi Code:** `server/src/services/lansia.service.ts` (baris 61-71 dan 26-31)
- **Kriteria:** Algoritma efisien, tidak ada bottleneck yang jelas, penggunaan resource wajar.
- **Hasil Inspeksi:**
  - Penyimpanan banyak data lansia menggunakan metode *Bulk Insert* (`db.insert(lansia).values(insertData)`). Tidak melakukan *looping insert* satu per satu yang memberatkan database.
  - Saat mengambil data riwayat lansia, sistem menggunakan klausa `inArray` untuk mengambil data secara sekaligus, sehingga menghindari masalah *N+1 Query Problem*.
- **Status:** ✅ Sesuai

---
**Catatan Tambahan:**
Untuk pengecekan lebih lanjut ke depannya, sangat disarankan menggunakan kakas bantu (Automated Testing Tool) seperti **ESLint** dan **SonarQube** untuk otomasi pengecekan kualitas kode.
