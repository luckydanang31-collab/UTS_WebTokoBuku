/* =====================================================
   data.js  -  Data dummy (pengganti server/database)
   Format: Array of Object (JSON)
   ===================================================== */

// Data katalog / stok buku
const dataKatalogBuku = [
  { kode: "BK001", judul: "Pemrograman Web Dasar",        kategori: "Teknologi", penulis: "Andi Wijaya",    stok: 25, harga: 85000,  cover: "img/buku1.png" },
  { kode: "BK002", judul: "Dasar-Dasar JavaScript",        kategori: "Teknologi", penulis: "Rina Kartika",   stok: 18, harga: 92000,  cover: "img/buku2.png" },
  { kode: "BK003", judul: "Desain Antarmuka Modern",       kategori: "Desain",    penulis: "Dewi Lestari",   stok: 9,  harga: 110000, cover: "img/buku3.png" },
  { kode: "BK004", judul: "Basis Data untuk Pemula",       kategori: "Teknologi", penulis: "Hendra Gunawan", stok: 30, harga: 78000,  cover: "img/buku4.png" },
  { kode: "BK005", judul: "Manajemen Proyek Digital",      kategori: "Bisnis",    penulis: "Sari Puspita",   stok: 12, harga: 99000,  cover: "img/buku5.png" },
  { kode: "BK006", judul: "Statistika Terapan",            kategori: "Sains",     penulis: "Bambang Sutrisno", stok: 6, harga: 125000, cover: "img/buku6.png" },
  { kode: "BK007", judul: "Bahasa Indonesia Akademik",     kategori: "Bahasa",    penulis: "Maya Anggraini", stok: 40, harga: 65000,  cover: "img/buku7.png" },
  { kode: "BK008", judul: "Kewirausahaan Era Digital",     kategori: "Bisnis",    penulis: "Fajar Nugroho",  stok: 0,  harga: 89000,  cover: "img/buku8.png" }
];

// Data pengguna untuk login
const dataPengguna = [
  { nama: "Budi Santoso", email: "mahasiswa@ut.ac.id",  password: "mahasiswa123" },
  { nama: "Admin Toko",   email: "admin@tokobuku.com",  password: "admin123" }
];

// Data ekspedisi dan tarif ongkir
const dataEkspedisi = [
  { nama: "JNE",     reguler: 15000, express: 30000 },
  { nama: "J&T",     reguler: 14000, express: 28000 },
  { nama: "SiCepat", reguler: 13000, express: 26000 },
  { nama: "Pos Indonesia", reguler: 12000, express: 24000 }
];

// Tahapan status pengiriman (urutan progress)
const tahapPengiriman = [
  "Pesanan Diterima",
  "Diproses Gudang",
  "Dikirim",
  "Dalam Perjalanan",
  "Terkirim"
];

// Data tracking pengiriman (dummy)
const dataTracking = [
  {
    nomorDO: "DO2026001", nama: "Budi Santoso", statusIndex: 4,
    ekspedisi: "JNE", paket: "Reguler", tanggalKirim: "2026-10-20", total: 192000,
    items: ["Pemrograman Web Dasar x1", "Dasar-Dasar JavaScript x1"],
    perjalanan: [
      { waktu: "2026-10-19 09:12", ket: "Pesanan diterima sistem" },
      { waktu: "2026-10-19 14:40", ket: "Pesanan dikemas di gudang" },
      { waktu: "2026-10-20 08:05", ket: "Paket diserahkan ke kurir JNE" },
      { waktu: "2026-10-21 11:30", ket: "Paket tiba di kota tujuan" },
      { waktu: "2026-10-22 13:15", ket: "Paket diterima oleh pemesan" }
    ]
  },
  {
    nomorDO: "DO2026002", nama: "Siti Rahmawati", statusIndex: 3,
    ekspedisi: "J&T", paket: "Express", tanggalKirim: "2026-11-05", total: 138000,
    items: ["Desain Antarmuka Modern x1"],
    perjalanan: [
      { waktu: "2026-11-04 10:00", ket: "Pesanan diterima sistem" },
      { waktu: "2026-11-04 16:20", ket: "Pesanan dikemas di gudang" },
      { waktu: "2026-11-05 09:00", ket: "Paket diserahkan ke kurir J&T" },
      { waktu: "2026-11-06 07:45", ket: "Paket dalam perjalanan ke kota tujuan" }
    ]
  },
  {
    nomorDO: "DO2026003", nama: "Agus Prasetyo", statusIndex: 2,
    ekspedisi: "SiCepat", paket: "Reguler", tanggalKirim: "2026-11-06", total: 91000,
    items: ["Bahasa Indonesia Akademik x1"],
    perjalanan: [
      { waktu: "2026-11-05 13:10", ket: "Pesanan diterima sistem" },
      { waktu: "2026-11-05 17:00", ket: "Pesanan dikemas di gudang" },
      { waktu: "2026-11-06 10:25", ket: "Paket dikirim dari gudang" }
    ]
  },
  {
    nomorDO: "DO2026004", nama: "Dewi Anggraeni", statusIndex: 1,
    ekspedisi: "Pos Indonesia", paket: "Reguler", tanggalKirim: "2026-11-08", total: 261000,
    items: ["Statistika Terapan x2"],
    perjalanan: [
      { waktu: "2026-11-07 08:30", ket: "Pesanan diterima sistem" },
      { waktu: "2026-11-07 15:45", ket: "Pesanan sedang diproses gudang" }
    ]
  },
  {
    nomorDO: "DO2026005", nama: "Rizky Maulana", statusIndex: 0,
    ekspedisi: "JNE", paket: "Express", tanggalKirim: "2026-11-09", total: 129000,
    items: ["Basis Data untuk Pemula x1"],
    perjalanan: [
      { waktu: "2026-11-07 18:20", ket: "Pesanan diterima sistem" }
    ]
  }
];
