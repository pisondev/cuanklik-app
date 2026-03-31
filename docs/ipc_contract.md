# Dokumentasi WebUI IPC Contract - CuanKlik

Dokumen ini berisi daftar fungsi Backend (Go) yang dapat dipanggil langsung dari Frontend (JavaScript) melalui WebUI. 

**Cara Pemanggilan di JavaScript:**
```javascript
const responseString = await NamaFungsi(JSON.stringify(payload));
const response = JSON.parse(responseString);
```

---

## 1. Register
Mendaftarkan UMKM baru. Password akan otomatis di-hash oleh sistem.

* **Nama Fungsi:** `Register`
* **Payload:**
  ```json
  {
    "username": "pebisnis_sukses",
    "password": "rahasia123",
    "email": "pebisnissukses@gmail.com",
    "phone_number": "081234567890",
    "umkm_name": "Toko Kopi Solo"
  }
  ```
* **Response:**
  ```json
  {
    "success": true,
    "message": "Account created successfully"
  }
  ```

---

## 2. Login
Melakukan autentikasi dan mengambil data User.

* **Nama Fungsi:** `Login`
* **Payload:**
  ```json
  {
    "username": "pebisnis_sukses",
    "password": "rahasia123"
  }
  ```
* **Response (Sukses):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user_id": 1,
      "umkm_name": "Toko Kopi Solo",
      "email": "pebisnissukses@gmail.com"
    }
  }
  ```

---

## 3. UpdateProfile
Memperbarui data profil UMKM.

* **Nama Fungsi:** `UpdateProfile`
* **Payload:**
  ```json
  {
    "user_id": 1,
    "email": "pebisnissukses@gmail.com",
    "phone_number": "089876543210",
    "umkm_name": "Toko Kopi & Roti Solo"
  }
  ```
* **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully"
  }
  ```

---

## 4. CalculateProfit
Menghitung Harga Pokok Penjualan (HPP) dan Break Even Point (BEP).
*Catatan: Fungsi ini secara otomatis menyimpan riwayat kalkulasi ke dalam database, sehingga UI tidak perlu memanggil fungsi Save terpisah.*

* **Nama Fungsi:** `CalculateProfit`
* **Payload:**
  ```json
  {
    "item_name": "Produk A",
    "fixed_cost": 500000,
    "variable_cost": 8000,
    "target_margin_percentage": 30
  }
  ```
* **Response:**
  ```json
  {
    "item_name": "Produk A",
    "cogs": 8000,
    "ideal_selling_price": 10400,
    "bep_units": 208,
    "bep_revenue": 2163200
  }
  ```

---

## 5. GetHistory
Mengambil daftar riwayat perhitungan berdasarkan User ID.

* **Nama Fungsi:** `GetHistory`
* **Payload:**
  ```json
  {
    "user_id": 1
  }
  ```
* **Response:**
  ```json
  [
    {
      "history_id": 1,
      "item_name": "Produk A",
      "selling_price": 10400,
      "created_at": "2026-03-27T10:00:00Z",
      "updated_at": "2026-03-27T10:00:00Z"
    }
  ]
  ```

---

## 6. DeleteHistory
Melakukan *Soft Delete* pada riwayat agar tidak tampil lagi di UI.

* **Nama Fungsi:** `DeleteHistory`
* **Payload:**
  ```json
  {
    "history_id": 1
  }
  ```
* **Response:**
  ```json
  {
    "success": true,
    "message": "Data moved to trash"
  }
  ```