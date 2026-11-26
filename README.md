# AgroForge - Laporan Progres Proyek RESTful API (PAW2)

Dokumen ini berisi laporan progres pengembangan backend RESTful API untuk platform marketplace agrikultur **AgroForge**, disesuaikan dengan template pelaporan mata kuliah Pemrograman Aplikasi Web II (PAW2).

---

## 1. Database
- **Jenis**: Local (MongoDB Server: `mongodb://localhost:27017/agroforge_db`) / Siap migrasi ke MongoDB Atlas
- **Koleksi yang dibuat**:
  1. `users` (Menyimpan data pengguna: pembeli, penjual, admin)
  2. `products` (Menyimpan katalog produk, spesifikasi mesin, harga, kategori, brand, rating, dan stok)
  3. `orders` (Menyimpan data transaksi/checkout, alamat pengiriman, status pengiriman, nomor resi)
  4. `complaints` (Menyimpan laporan/komplain pelanggan pada dashboard admin)

---

## 2. RESTful API CRUD (SUB-CPMK-9)
Endpoint yang sudah selesai (method + URL):
- `GET /` (Info status server & dokumentasi daftar endpoint API)
- `GET /products` (Mendapatkan seluruh daftar produk dengan fitur filter kategori, pencarian kata kunci, rentang harga, rating, dan sorting)
- `GET /products/:id` (Mendapatkan detail satu produk berdasarkan ID / SKU)
- `POST /products` (Menambahkan produk baru oleh penjual atau admin)
- `PUT /products/:id` (Memperbarui data dan stok produk)
- `DELETE /products/:id` (Menghapus produk dari katalog)
- `GET /orders` (Melihat daftar seluruh pesanan atau pesanan milik pengguna)
- `GET /orders/:id` (Melihat detail pesanan tertentu)
- `POST /orders` (Membuat pesanan baru saat proses checkout)
- `PUT /orders/:id/status` (Memperbarui status tahapan pesanan: processing, confirmed, shipped, out_for_delivery, delivered)
- `GET /admin/stats` (Mendapatkan statistik sistem & ringkasan operasional)
- `GET /admin/complaints` (Melihat daftar seluruh komplain pengguna)
- `POST /admin/complaints` (Membuat tiket komplain baru)
- `PUT /admin/complaints/:id/resolve` (Menandai komplain telah terselesaikan)
- `GET /admin/sellers` (Mendapatkan daftar mitra penjual terdaftar)

---

## 3. Autentikasi JWT (SUB-CPMK-10)
- **Register**: Sudah (`POST /auth/register` dengan hashing password menggunakan `bcrypt` 10 salt rounds)
- **Login**: Sudah (`POST /auth/login` menghasilkan Bearer JSON Web Token berdurasi 24 jam)
- **Middleware verifikasi token**: Sudah (`middlewares/verifyToken.js` & Role-Based Access Control `middlewares/hanyaRole.js`)
- **Endpoint yang sudah diproteksi**:
  - `GET /auth/me` (Hanya user dengan token valid)
  - `POST /products` (Wajib token dengan role `penjual` atau `admin`)
  - `PUT /products/:id` (Wajib token dengan role `penjual` atau `admin`)
  - `DELETE /products/:id` (Wajib token dengan role `penjual` atau `admin`)
  - `GET /orders` (Wajib token user terotentikasi)
  - `GET /orders/:id` (Wajib token user terotentikasi)
  - `POST /orders` (Wajib token pembeli/user)
  - `PUT /orders/:id/status` (Wajib token dengan role `penjual` atau `admin`)
  - `GET /admin/stats` (Wajib token dengan role `admin`)
  - `GET /admin/complaints` (Wajib token dengan role `admin`)
  - `PUT /admin/complaints/:id/resolve` (Wajib token dengan role `admin`)
  - `GET /admin/sellers` (Wajib token dengan role `admin`)

---

## 4. Deploy Vercel
- **Status**: Siap dideploy ke Vercel (dikonfigurasi melalui `vercel.json`)

---

## 5. Pengujian Postman
- **Endpoint yang sudah diuji**:
  - Semua endpoint autentikasi (`POST /auth/register`, `POST /auth/login`, `GET /auth/me`)
  - Semua endpoint katalog produk (`GET /products`, query filter/search, `GET /products/:id`, `POST /products`, `DELETE /products/:id`)
  - Semua endpoint pesanan (`POST /orders`, `GET /orders`)
  - Semua endpoint admin monitoring (`GET /admin/stats`, `GET /admin/complaints`, `POST /admin/complaints`, `PUT /admin/complaints/:id/resolve`, `GET /admin/sellers`)
- **File Postman Tersedia**:
  - `postman/AgroForge_Postman_Collection.json`
  - `postman/AgroForge_Postman_Environment.json`
  - Folder native request YAML: `postman/collections/AgroForge/`

---

## 6. Pembuat Proyek

- **Darma Lopi (2327240123)**:
  - Setup struktur arsitektur modular Express.js (MVC: controllers, models, routes, middlewares)
  - Pembuatan Schema Mongoose & relasi database MongoDB (`User`, `Product`, `Order`, `Complaint`)
  - Implementasi CRUD RESTful API lengkap (Products, Orders, Admin Stats & Complaints)
  - Implementasi autentikasi JWT, hashing password Bcrypt, dan middleware otorisasi RBAC (`verifyToken`, `hanyaRole`)
  - Pembuatan script inisialisasi database (`seed.js`)
  - Konfigurasi deployment Vercel (`vercel.json`) dan perbaikan build error
  - Pembuatan koleksi pengujian otomatis Postman (JSON & format workspace YAML)

---

## 7. Kendala yang Dihadapi:
1. **Error Build Deployment Vercel**:
   - *Masalah*: Saat pertama kali melakukan deployment ke Vercel, proses build gagal dengan error `Command "pnpm install" exited with 1` karena Vercel mendeteksi adanya file `pnpm-lock.yaml` bawaan template, sedangkan dependensi project dikelola menggunakan `npm`.
   - *Solusi*: Telah diatasi dengan menghapus file konflik `pnpm-lock.yaml` dan menambahkan file konfigurasi `vercel.json` yang secara eksplisit menetapkan `installCommand: "npm install"` dan `buildCommand: "npm run build"`.
2. **Koneksi Database saat Transisi Deployment**:
   - *Solusi*: Untuk deployment production cloud, koneksi database disiapkan agar dapat beralih ke MongoDB Atlas dengan mendaftarkan IP whitelist `0.0.0.0/0` pada Network Access serta memasukkan variabel `DB_URI` dan `JWT_SECRET` pada menu *Environment Variables* di Vercel.

---

## 8. Rencana Sebelum Demonstrasi:
1. Melakukan pengujian ulang menyeluruh (*end-to-end*) seluruh skenario request di Postman Collection sebelum demonstrasi berlangsung.
2. Memastikan koneksi database dan environment token JWT terkonfigurasi dengan baik.
3. Memastikan integrasi antarmuka frontend dengan endpoint backend berjalan sinkron tanpa kendala CORS.
4. Menyiapkan skenario demo alur pengguna lengkap: mulai dari registrasi akun baru, login dengan role berbeda (pembeli, penjual, admin), melihat katalog & filter produk, proses checkout pesanan, hingga pemantauan statistik dan komplain pada dashboard admin.

---

> ⚠️ **Pengingat Jadwal Demonstrasi via Google Meet:**
> - **Selasa, 1 Desember 2026**: Kelompok 1–4
> - **Kamis, 3 Desember 2026**: Kelompok 5–7
> *(Seluruh anggota wajib hadir saat kelompoknya demonstrasi).*
