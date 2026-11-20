# TeFa-POS

Aplikasi kasir web modern, cepat, dan ringan untuk operasional kantin dan kafe Teaching Factory.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)

---

## Installation

Pastikan sistem Anda telah terpasang PHP 8.2+, Composer, dan pnpm (Node.js 20+).

```bash
# Clone repository
git clone https://github.com/your-org/TeFa-POS.git
cd TeFa-POS

# Install dependencies backend & frontend
composer install
pnpm install

# Setup environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
```

---

## Quick Start

Jalankan server pengembangan lokal:

```bash
# Terminal 1: Jalankan Laravel server
php artisan serve

# Terminal 2: Jalankan Vite Plus dev server
pnpm run dev
```

Buka browser di `http://127.0.0.1:8000`. Login menggunakan akun default:
- **Email:** `kasir@tefa.sch.id`
- **Password:** `password`

---

## What

TeFa-POS adalah sistem kasir berbasis web yang dirancang khusus untuk memenuhi ritme transaksi cepat di kantin dan unit produksi Teaching Factory (TeFa). Aplikasi ini menyederhanakan alur penjualan menjadi empat modul inti: Kasir POS dengan kalkulator pecahan uang instan, Dashboard analitik omset harian, Laporan penjualan berkala (Tunai vs QRIS), dan Manajemen katalog menu. Seluruh komponen dibangun dengan antarmuka yang bersih dan responsif, menghilangkan kompleksitas berlebih tanpa mengorbankan fungsionalitas.

---

## Why

Banyak sistem POS yang ada di pasaran terlalu rumit dengan modul meja tamu, gateway pembayaran online yang lambat, serta dependensi cloud yang berat. TeFa-POS hadir sebagai solusi yang tepat guna:
- **Super Cepat:** Layout kasir 2-kolom terkunci dalam satu layar tanpa perlu scroll naik-turun.
- **Kalkulasi Uang Pintar:** Tombol pintas pecahan uang (*Uang Pas, 10k, 20k, 50k, 100k*) serta perhitungan kembalian otomatis.
- **Siap Cetak Struk:** Mendukung cetak struk kasir termal (58mm/80mm) langsung dari peramban (`window.print()`).
- **Analitik Bernyawa:** Visualisasi tren penjualan 7 hari terakhir dengan Recharts dan rekapitulasi metode bayar instan.

---

## API / Routes

### Halaman Web (Inertia)
- `GET /dashboard`: Ringkasan omset hari ini, tren 7 hari, dan 5 transaksi terkini.
- `GET /pos`: Layar utama kasir kasir kantin.
- `GET /laporan`: Rekap penjualan dengan filter rentang tanggal.
- `GET /menu`: Manajemen katalog makanan dan minuman.

### Endpoint API Publik & Internal
- `GET /api/pos/menu`: Mengambil daftar kategori beserta produk yang aktif.
- `POST /api/pos/checkout`: Memproses pesanan secara atomik (`DB::transaction`).
  - *Payload:* `{ items: [{ menu_item_id: int, quantity: int }], payment_method: "cash"|"qris", cash_given: int }`
  - *Response:* Data struk lengkap (`invoice_no`, item list, total, uang diterima, kembalian).
- `GET /api/laporan`: Mengambil data analitik penjualan berdasarkan parameter `start_date` dan `end_date`.
- `POST /api/menu`: Menambahkan menu baru ke katalog.
- `PUT /api/menu/{id}`: Memperbarui data menu dan harga jual.
- `PATCH /api/menu/{id}/toggle`: Mengubah status ketersediaan menu (Tersedia / Habis).
- `DELETE /api/menu/{id}`: Menghapus menu dari sistem.

---

## Examples

### 1. Memproses Transaksi Tunai di Kasir
1. Buka halaman `/pos`.
2. Klik menu makanan/minuman dari grid kiri; item akan masuk ke keranjang di sisi kanan.
3. Tekan tombol **Bayar Pesanan (F9)**.
4. Klik tombol pintas uang yang diserahkan (misal: *Rp 50.000*) — nilai kembalian akan otomatis terhitung.
5. Klik **Selesaikan Transaksi** untuk menampilkan struk termal siap cetak.

### 2. Mengakses Laporan Penjualan Harian
1. Buka halaman `/laporan`.
2. Pilih filter cepat **7 Hari Terakhir** atau tentukan rentang tanggal manual.
3. Periksa rasio pendapatan Tunai vs QRIS serta rincian kuantitas per menu.
4. Klik tombol **Cetak Laporan / PDF** untuk mencetak rekap setoran kasir.

---

## Architecture & Development Guides

Panduan teknis mendalam mengenai arsitektur kode, aturan pengujian, dan workflow pengembangan agen dapat dilihat di [AGENTS.md](file:///D:/Project/Web%20Project/Private%20Web/TeFa-POS/AGENTS.md).

---

## License

Didistribusikan di bawah lisensi MIT. Silakan lihat berkas [LICENSE](file:///D:/Project/Web%20Project/Private%20Web/TeFa-POS/LICENSE) untuk ketentuan lengkap.
