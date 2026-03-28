# 📱 CuanKlik

**CuanKlik** adalah aplikasi penghitung Harga Pokok Penjualan (HPP) dan analisis profitabilitas yang dirancang khusus untuk membantu Pelaku Usaha Mikro Kecil dan Menengah (UMKM). 

Dengan memasukkan variabel Biaya Tetap, Biaya Variabel per produk, serta Target Margin Keuntungan, aplikasi ini akan mengkalkulasikan prediksi penjualan produk yang harus dicapai agar pengguna memperoleh keuntungan yang maksimal dan mencapai titik impas (Break-Even Point).

🎯 **Target Pengguna:** Pelaku Usaha Mikro Kecil dan Menengah (UMKM)

---

## ✨ Kebutuhan Fungsional (Fitur Utama)

* **🔐 Autentikasi / Login:** Pengguna dapat memasukkan *username* dan *password* untuk mengakses fitur perhitungan dan menyimpan riwayat data keuangan secara permanen.
* **📝 Input Komponen Biaya Operasional:** Pengguna dapat memasukkan variabel biaya bisnis yang terbagi menjadi dua bagian:
  * Biaya Tetap
  * Biaya Variabel (bahan baku, kemasan per unit, dll.)
* **🧮 Kalkulasi HPP & Target Harga Jual:** Sistem mengkalkulasi total HPP per unit produk. Pengguna dapat mengatur target margin (%), dan sistem akan merekomendasikan harga jual minimum.
* **📈 Analisis Break-Even Point (BEP):** Menghitung dan menampilkan target penjualan dalam bentuk Unit (BEP Unit) dan estimasi pendapatan (BEP Rupiah) agar bisnis mencapai titik balik modal.
* **💾 Manajemen Riwayat Kalkulasi (CRUD):** Setiap hasil perhitungan dapat disimpan ke dalam *database* lokal untuk dilihat kembali (Read), diedit (Update), atau dihapus (Delete).
* **⚡ Data Binding Real-Time:** Setiap kali pengguna mengubah angka pada form input, *backend* akan langsung memproses ulang dan mengirimkan hasilnya ke *frontend* secara instan tanpa perlu *reload* halaman.

---

## 🔄 Alur Penggunaan (User Flow)
**Skenario: Analisis Profit Produk Baru**

1. Pengguna membuka aplikasi dan diarahkan ke tampilan Dashboard & Opsi Login.
   * *Opsi:* Jika ingin menyimpan riwayat secara permanen, pengguna melakukan Autentikasi Login (mengisi Nama UMKM, Nama Pengelola, dan Kontak). Jika tidak, pengguna dapat langsung melanjutkan sebagai *Guest*.
2. Pengguna memasukkan data numerik ke dalam kolom yang disediakan:
   * Biaya Tetap
   * Biaya Variabel
   * Target Margin (%)
3. Pengguna menekan tombol **"Analisis Profit"**.
4. Aplikasi (melalui *frontend* HTML) mengirimkan data ke fungsi *backend* untuk diproses menggunakan jembatan WebUI.
5. Aplikasi menampilkan hasil akhir secara langsung di bagian bawah layar, yang meliputi:
   * HPP (Harga Pokok Penjualan)
   * Harga Jual Ideal
   * Target Unit BEP & Rupiah BEP
6. Data hasil kalkulasi tersebut secara otomatis disimpan sebagai rekap riwayat pengguna (jika *login*).

---

## 🛠️ Tech Stack & Kebutuhan Non-Fungsional

| Kategori | Teknologi yang Digunakan |
| :--- | :--- |
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **Backend** | Go (Golang) |
| **Database** | SQLite |
| **UI/UX Design** | Figma |
| **Library** | WebUI |
| **Target OS** | Multi-platform (Desktop / Mobile Web View) |

---

## ⚠️ Batasan Sistem (Limitations)

* **Mobile-First Orientation:** Aplikasi difokuskan dan didesain berjalan optimal pada perangkat *mobile* berbasis Android (orientasi UI/UX *mobile-first*).
* **Local Storage Only:** Penyimpanan data sepenuhnya menggunakan SQLite lokal yang tertanam di dalam perangkat. Aplikasi tidak menggunakan layanan *cloud server* (seperti AWS, GCP, dll.).
* **Basic Financial Scope:** Fitur analisis keuangan dibatasi pada HPP, BEP, dan Harga Jual Ideal, tanpa menyertakan sistem akuntansi yang kompleks (seperti neraca lajur atau arus kas).
* **Static Market Data:** Kalkulasi murni berdasarkan input data statis dari pengguna, tanpa mempertimbangkan fluktuasi harga pasar secara *real-time*.
