# Tugas UTS Pemrograman Web 1 - Toko Buku Pustaka

Aplikasi web sederhana untuk pemesanan buku pada toko online. Fokus pada proses **front-end** (HTML, CSS, JavaScript). Data tidak diambil dari server/database, melainkan dari variabel JavaScript pada file terpisah (`js/data.js`) dalam format Array JSON.

- **Nama:**Lucky Danang Aryeswara
- **NIM:**312510482

---

# Bagian 1 - Soal UTS

## Indikator Penilaian

Tugas UTS memiliki tiga indikator untuk menilai hasil belajar mahasiswa:

1. Mahasiswa dapat merancang struktur HTML yang semantik dan valid.
2. Mahasiswa dapat mengelola gaya antarmuka menggunakan CSS (inline, internal, external).
3. Mahasiswa dapat menggunakan JavaScript untuk manipulasi DOM, validasi form, manipulasi data tabel, dan interaksi UI sesuai dengan kreativitas masing-masing seperti pop-up, modal box, dan alert box.

## Soal Tugas

Anda diminta untuk membuat aplikasi web sederhana untuk pemesanan buku pada sebuah toko online. Pada tugas ini, mahasiswa berfokus pada proses front-end aplikasi, sehingga data-data yang dibutuhkan tidak diambil dari server/database, tetapi melalui variabel pada JavaScript berupa file JS terpisah yang berisi data dalam format Array JSON.

Buat **minimal lima halaman** website sebagai berikut:

### 1. Halaman Login (`login.html`)
- Input: email dan password.
- Tombol "Login".
- Jika salah atau tidak sesuai, munculkan pop-up/alert yang berisi bahwa "email/password yang anda masukkan salah".
- Terdapat tombol "Lupa Password" dan "Daftar" yang dimunculkan dalam bentuk modal box/pop up.

### 2. Dashboard Menu (`dashboard.html`)
- Menu utama yang terdiri atas tombol navigasi ke:
  - Informasi Stok/Katalog
  - Tracking Pengiriman
  - Laporan Pemesanan
  - History Transaksi
- Tampilkan "greeting" berdasarkan waktu lokal (pagi/siang/sore).

### 3. Informasi Stok/Katalog (`stok.html`)
- Menampilkan secara dinamis dari data dummy pada `data.js` di variabel konstanta `dataKatalogBuku`.
- Terdapat fitur untuk menambahkan baris stok baru menggunakan JavaScript DOM.

### 4. Halaman Pemesanan (`checkout.html`)
- Menampilkan data pemesanan yang dapat ditambah/diubah.
- Terdapat isian data informasi pemesan dan pembayaran.

### 5. Informasi Pengiriman (`tracking.html`)
- Input: Nomor Delivery Order.
- Ketika tombol "Cari" ditekan, tampilkan:
  - Nama pemesan
  - Status pengiriman (dapat disimulasikan dengan progress bar, warna, tabel, atau list sesuai dengan kemampuan dan kreativitas Anda)
  - Detail ekspedisi, tanggal kirim, jenis paket, dan total pembayaran

## Struktur Folder

Struktur folder project dibuat seperti ini:

```
tugas-uts-web1/
|-- index.html (halaman login)
|-- dashboard.html
|-- stok.html
|-- tracking.html
|-- checkout.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js
|   |-- data.js
|-- assets/
|   |-- logo.png (opsional)
|-- img/
|   |-- buku1.png
|   |-- buku2.png
|   |-- dst...
```

> Catatan: pada soal, halaman login disebut `login.html` di daftar halaman, tetapi pada struktur folder bernama `index.html`. Project ini mengikuti struktur folder. Penulisan `chackout.html` pada struktur folder soal diasumsikan salah ketik, sehingga dipakai `checkout.html`.

## Petunjuk Pengerjaan dan Pembuatan Video Penjelasan

1. Kriteria penilaian dalam tugas ini meliputi:
   - a. Struktur HTML semantik, valid, dan lengkap
   - b. Desain CSS
   - c. JavaScript DOM (bagaimana interaktifnya website yang dibuat, bagaimana manipulasi data yang dibuat)
   - d. Validasi form dan alert (menyediakan feedback saat error)
   - e. Modularitas file dan struktur file
   - f. Kreativitas tambahan (tema, fitur, UI)
   - g. Penjelasan dalam video untuk menyelesaikan tugas, seperti bagaimana sistematika, alur berpikir, dan argumentasi dalam merancang dan membuat aplikasi website menggunakan HTML, CSS, dan JavaScript
2. Durasi video penjelasan maksimal **15 menit**.
3. Hasil pekerjaan di-submit pada form berikut: https://forms.gle/1Ez1YkxUGHoVMrEs6
4. File assets gambar dan data dapat diunduh pada tautan "disini" yang tercantum di file soal.

---

# Bagian 2 - Dokumentasi Hasil Pengerjaan

## Cara Menjalankan

1. Ekstrak project, lalu pastikan gambar sampul buku berada di folder `img/` dengan nama `buku1.png` sampai `buku8.png`. Jika belum ada, halaman tetap berjalan dan menampilkan ikon pengganti.
2. Buka `index.html` di browser (tidak perlu server).
3. Login dengan akun demo:
   - Email: `mahasiswa@ut.ac.id`
   - Password: `mahasiswa123`
4. Nomor Delivery Order untuk mencoba tracking: `DO2026001` sampai `DO2026005`. Pesanan baru dari halaman pemesanan juga otomatis dapat dilacak.

## Fitur per Halaman

| Halaman | File | Fitur |
|---|---|---|
| Login | `index.html` | Validasi email dan password, `alert` "Email/password yang anda masukkan salah", modal Lupa Password dan Daftar |
| Dashboard | `dashboard.html` | Greeting pagi/siang/sore/malam sesuai waktu lokal, jam berjalan, empat menu utama, statistik ringkas, modal Laporan Pemesanan dan History Transaksi |
| Stok / Katalog | `stok.html` | Tabel dinamis dari `dataKatalogBuku`, tambah baris stok via DOM, pencarian, ubah stok, hapus, badge status stok |
| Pemesanan | `checkout.html` | Tambah/ubah/hapus item pesanan, data pemesan, pilihan ekspedisi, paket, dan pembayaran, ongkir dan total otomatis, stok berkurang setelah pesanan dibuat |
| Tracking | `tracking.html` | Pencarian nomor DO, progress bar 5 tahap, detail ekspedisi, tanggal kirim, jenis paket, total, dan riwayat perjalanan paket |

## Pemetaan ke Kriteria Penilaian

| Kriteria | Implementasi |
|---|---|
| a. HTML semantik | `header`, `nav`, `main`, `section`, `article`, `form`, `label for`, `table` dengan `caption`, atribut ARIA pada modal |
| b. Desain CSS | Satu file external `css/style.css`, CSS variables, Flexbox dan Grid, media query responsif, animasi |
| c. JavaScript DOM | Render tabel dengan `createElement`, tambah/ubah/hapus data, pencarian, penyimpanan `localStorage` |
| d. Validasi dan alert | Pesan error per input, border merah, `alert`, toast, validasi regex email dan telepon, cek stok |
| e. Modularitas | Pemisahan `style.css`, `data.js` (data), dan `script.js` (logika dengan router berdasarkan `data-page`) |
| f. Kreativitas | Greeting dinamis, jam real-time, ongkir otomatis, nomor DO otomatis, stepper animasi, toast, tutup modal dengan Esc |
| g. Video | Lihat naskah pada `materi-video-penjelasan-uts.md` |

## Struktur Data (`js/data.js`)

- `dataKatalogBuku`: daftar buku (kode, judul, kategori, penulis, stok, harga, cover)
- `dataPengguna`: akun untuk login
- `dataEkspedisi`: tarif ongkir per ekspedisi (reguler dan express)
- `tahapPengiriman`: urutan status pengiriman
- `dataTracking`: contoh data pengiriman berdasarkan nomor DO

Data yang berubah (stok, riwayat transaksi, pengguna baru) disimpan di `localStorage` browser, sedangkan sesi login di `sessionStorage`. Tombol **Reset Data Demo** di dashboard mengembalikan stok dan riwayat ke kondisi awal.

## Teknologi

HTML5, CSS3, dan JavaScript (ES6+) tanpa framework maupun library eksternal.