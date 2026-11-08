/* =====================================================
   script.js  -  Logika aplikasi Toko Buku Pustaka
   Bagian: Utilitas -> Umum -> Login -> Dashboard -> Stok
           -> Checkout -> Tracking
   ===================================================== */
"use strict";

/* ---------- 1. UTILITAS ---------- */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const KEY = {
  user: "sessionUser",
  pengguna: "penggunaBaru",
  stok: "stokBuku",
  riwayat: "riwayatTransaksi"
};

const formatRupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const formatTanggal = (iso) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const emailValid = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Pembuat elemen DOM (teks selalu lewat text node -> aman dari XSS)
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  children.flat().forEach((c) => node.append(c instanceof Node ? c : document.createTextNode(String(c))));
  return node;
}

function getStok() {
  return load(KEY.stok, null) || JSON.parse(JSON.stringify(dataKatalogBuku));
}
function getRiwayat() {
  return load(KEY.riwayat, []);
}
function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY.user));
  } catch (e) {
    return null;
  }
}
function semuaPengguna() {
  return [...dataPengguna, ...load(KEY.pengguna, [])];
}

/* Toast */
function showToast(pesan, tipe = "ok") {
  const area = $("#toast-area");
  if (!area) return;
  const t = el("div", { class: "toast " + (tipe === "ok" ? "" : tipe), role: "status" }, pesan);
  area.append(t);
  setTimeout(() => t.remove(), 3200);
}

/* Modal */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add("show");
}
function closeModals() {
  $$(".modal.show").forEach((m) => m.classList.remove("show"));
}

/* Validasi: tampilkan / hapus pesan error */
function setError(id, pesan) {
  const input = document.getElementById(id);
  const msg = document.getElementById("err-" + id);
  if (input) input.classList.add("invalid");
  if (msg) msg.textContent = pesan;
}
function clearErrors(form) {
  $$(".invalid", form).forEach((i) => i.classList.remove("invalid"));
  $$(".error", form).forEach((s) => (s.textContent = ""));
}

/* ---------- 2. INISIALISASI UMUM ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const user = getUser();

  // Guard: halaman selain login wajib sudah login
  if (page !== "login" && !user) {
    location.href = "index.html";
    return;
  }
  if (page === "login" && user) {
    location.href = "dashboard.html";
    return;
  }

  setupCommon(user);

  const router = {
    login: initLogin,
    dashboard: initDashboard,
    stok: initStok,
    checkout: initCheckout,
    tracking: initTracking
  };
  if (router[page]) router[page]();
});

function setupCommon(user) {
  if (user && $("#namaUser")) $("#namaUser").textContent = "👤 " + user.nama;

  // Tandai menu aktif
  const file = location.pathname.split("/").pop() || "index.html";
  $$(".topbar nav a").forEach((a) => {
    if (a.getAttribute("href") === file) a.setAttribute("aria-current", "page");
  });

  // Logout
  $$("[data-logout]").forEach((b) =>
    b.addEventListener("click", () => {
      if (confirm("Yakin ingin keluar?")) {
        sessionStorage.removeItem(KEY.user);
        location.href = "index.html";
      }
    })
  );

  // Tutup modal: tombol, klik latar, tombol Esc
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeModals));
  $$(".modal").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target === m) closeModals();
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });
}

/* ---------- 3. HALAMAN LOGIN ---------- */
function initLogin() {
  const form = $("#formLogin");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);
    const email = $("#email").value.trim();
    const pass = $("#password").value;
    let ok = true;

    if (!email) { setError("email", "Email wajib diisi"); ok = false; }
    else if (!emailValid(email)) { setError("email", "Format email tidak valid"); ok = false; }
    if (!pass) { setError("password", "Password wajib diisi"); ok = false; }
    if (!ok) return;

    const user = semuaPengguna().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );
    if (!user) {
      alert("Email/password yang anda masukkan salah");
      return;
    }
    sessionStorage.setItem(KEY.user, JSON.stringify({ nama: user.nama, email: user.email }));
    location.href = "dashboard.html";
  });

  $("#btnLupa").addEventListener("click", () => openModal("modalLupa"));
  $("#btnDaftar").addEventListener("click", () => openModal("modalDaftar"));

  // Lupa password (simulasi)
  const formLupa = $("#formLupa");
  formLupa.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(formLupa);
    const email = $("#l-email").value.trim();
    if (!emailValid(email)) { setError("l-email", "Masukkan email yang valid"); return; }
    const ada = semuaPengguna().some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!ada) { setError("l-email", "Email tidak terdaftar"); return; }
    closeModals();
    formLupa.reset();
    alert("Tautan reset password telah dikirim ke " + email + " (simulasi).");
  });

  // Daftar
  const formDaftar = $("#formDaftar");
  formDaftar.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(formDaftar);
    const nama = $("#d-nama").value.trim();
    const email = $("#d-email").value.trim();
    const pass = $("#d-pass").value;
    const pass2 = $("#d-pass2").value;
    let ok = true;

    if (nama.length < 3) { setError("d-nama", "Nama minimal 3 karakter"); ok = false; }
    if (!emailValid(email)) { setError("d-email", "Format email tidak valid"); ok = false; }
    else if (semuaPengguna().some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError("d-email", "Email sudah terdaftar"); ok = false;
    }
    if (pass.length < 6) { setError("d-pass", "Password minimal 6 karakter"); ok = false; }
    if (pass2 !== pass) { setError("d-pass2", "Konfirmasi password tidak sama"); ok = false; }
    if (!ok) return;

    const baru = load(KEY.pengguna, []);
    baru.push({ nama, email, password: pass });
    save(KEY.pengguna, baru);
    closeModals();
    formDaftar.reset();
    $("#email").value = email;
    showToast("Pendaftaran berhasil! Silakan login.");
  });
}

/* ---------- 4. DASHBOARD ---------- */
function sapaan(jam) {
  if (jam < 11) return "Selamat pagi";
  if (jam < 15) return "Selamat siang";
  if (jam < 18) return "Selamat sore";
  return "Selamat malam";
}

function initDashboard() {
  const user = getUser();
  const tampilWaktu = () => {
    const now = new Date();
    $("#greeting").textContent = `${sapaan(now.getHours())}, ${user.nama}! 👋`;
    $("#waktuLokal").textContent =
      now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) +
      " · " + now.toLocaleTimeString("id-ID");
  };
  tampilWaktu();
  setInterval(tampilWaktu, 1000);

  // Statistik
  const stok = getStok();
  $("#statJudul").textContent = stok.length;
  $("#statStok").textContent = stok.reduce((a, b) => a + b.stok, 0);
  $("#statTrx").textContent = getRiwayat().length;

  $("#btnLaporan").addEventListener("click", () => { renderLaporan(); openModal("modalLaporan"); });
  $("#btnHistory").addEventListener("click", () => { renderHistory(); openModal("modalHistory"); });
  $("#btnReset").addEventListener("click", () => {
    if (confirm("Reset stok dan riwayat transaksi ke data awal?")) {
      localStorage.removeItem(KEY.stok);
      localStorage.removeItem(KEY.riwayat);
      showToast("Data demo direset.", "info");
      setTimeout(() => location.reload(), 700);
    }
  });
}

function renderLaporan() {
  const riwayat = getRiwayat();
  const rekap = {};
  let totalItem = 0;
  let omzet = 0;
  riwayat.forEach((o) =>
    o.items.forEach((it) => {
      rekap[it.judul] = rekap[it.judul] || { qty: 0, nilai: 0 };
      rekap[it.judul].qty += it.qty;
      rekap[it.judul].nilai += it.qty * it.harga;
      totalItem += it.qty;
      omzet += it.qty * it.harga;
    })
  );

  const ringkasan = $("#lapRingkasan");
  ringkasan.replaceChildren(
    el("article", { class: "stat" }, el("span", {}, "Total Transaksi"), el("strong", {}, riwayat.length)),
    el("article", { class: "stat" }, el("span", {}, "Buku Terjual"), el("strong", {}, totalItem)),
    el("article", { class: "stat" }, el("span", {}, "Pendapatan Buku"), el("strong", {}, formatRupiah(omzet)))
  );

  const body = $("#lapBody");
  body.replaceChildren();
  const baris = Object.entries(rekap);
  if (!baris.length) {
    body.append(el("tr", {}, el("td", { colspan: "3", class: "empty" }, "Belum ada transaksi. Buat pesanan terlebih dahulu.")));
    return;
  }
  baris.forEach(([judul, d]) =>
    body.append(el("tr", {}, el("td", {}, judul), el("td", { class: "num" }, d.qty), el("td", { class: "num" }, formatRupiah(d.nilai))))
  );
}

function renderHistory() {
  const body = $("#historyBody");
  body.replaceChildren();
  const riwayat = getRiwayat();
  if (!riwayat.length) {
    body.append(el("tr", {}, el("td", { colspan: "6", class: "empty" }, "Belum ada riwayat transaksi.")));
    return;
  }
  [...riwayat].reverse().forEach((o) =>
    body.append(
      el("tr", {},
        el("td", {}, o.nomorDO),
        el("td", {}, formatTanggal(o.tanggal)),
        el("td", {}, o.nama),
        el("td", { class: "num" }, o.items.reduce((a, b) => a + b.qty, 0)),
        el("td", { class: "num" }, formatRupiah(o.total)),
        el("td", {}, el("span", { class: "badge ok" }, tahapPengiriman[o.statusIndex]))
      )
    )
  );
}

/* ---------- 5. STOK / KATALOG ---------- */
function coverEl(b) {
  const wrap = el("div", { class: "cover" });
  const fallback = () => el("span", { class: "cover-fallback" }, "📘");
  if (!b.cover) { wrap.append(fallback()); return wrap; }
  const img = el("img", { src: b.cover, alt: "Sampul " + b.judul, loading: "lazy" });
  img.addEventListener("error", () => img.replaceWith(fallback()));
  wrap.append(img);
  return wrap;
}

function initStok() {
  let daftar = getStok();
  let kata = "";
  const tbody = $("#tbodyStok");

  function badgeStok(n) {
    const kelas = n === 0 ? "danger" : n < 10 ? "warn" : "ok";
    return el("span", { class: "badge " + kelas }, n === 0 ? "Habis" : n);
  }

  function render(kodeBaru = "") {
    tbody.replaceChildren();
    const data = daftar.filter((b) => (b.kode + b.judul + b.kategori).toLowerCase().includes(kata));

    if (!data.length) {
      tbody.append(el("tr", {}, el("td", { colspan: "8", class: "empty" }, "Data tidak ditemukan.")));
    }
    data.forEach((b, i) => {
      const tr = el("tr", { class: b.kode === kodeBaru ? "new-row" : "" },
        el("td", {}, i + 1),
        el("td", {}, coverEl(b)),
        el("td", {}, b.kode),
        el("td", {}, el("strong", {}, b.judul), el("br"), el("small", { class: "hint" }, b.penulis || "-")),
        el("td", {}, b.kategori),
        el("td", { class: "num" }, badgeStok(b.stok)),
        el("td", { class: "num" }, formatRupiah(b.harga)),
        el("td", {}, el("div", { class: "actions" },
          el("button", { type: "button", class: "btn btn-light btn-sm", onclick: () => ubahStok(b.kode) }, "Ubah Stok"),
          el("button", { type: "button", class: "btn btn-danger btn-sm", onclick: () => hapus(b.kode) }, "Hapus")
        ))
      );
      tbody.append(tr);
    });
    $("#infoJumlah").textContent = `${data.length} dari ${daftar.length} judul ditampilkan`;
  }

  function ubahStok(kode) {
    const b = daftar.find((x) => x.kode === kode);
    const input = prompt(`Ubah stok "${b.judul}" (saat ini ${b.stok}):`, b.stok);
    if (input === null) return;
    const n = Number(input);
    if (input.trim() === "" || !Number.isInteger(n) || n < 0) {
      alert("Stok harus berupa bilangan bulat 0 atau lebih.");
      return;
    }
    b.stok = n;
    save(KEY.stok, daftar);
    render();
    showToast("Stok berhasil diperbarui.");
  }

  function hapus(kode) {
    const b = daftar.find((x) => x.kode === kode);
    if (!confirm(`Hapus "${b.judul}" dari katalog?`)) return;
    daftar = daftar.filter((x) => x.kode !== kode);
    save(KEY.stok, daftar);
    render();
    showToast("Buku dihapus.", "info");
  }

  $("#cari").addEventListener("input", (e) => {
    kata = e.target.value.trim().toLowerCase();
    render();
  });

  // Tambah baris stok baru
  const form = $("#formStok");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);
    const kode = $("#s-kode").value.trim().toUpperCase();
    const judul = $("#s-judul").value.trim();
    const kategori = $("#s-kategori").value;
    const stokTxt = $("#s-stok").value;
    const hargaTxt = $("#s-harga").value;
    let ok = true;

    if (!/^[A-Z0-9-]{3,10}$/.test(kode)) { setError("s-kode", "Kode 3-10 karakter (huruf/angka)"); ok = false; }
    else if (daftar.some((b) => b.kode === kode)) { setError("s-kode", "Kode sudah digunakan"); ok = false; }
    if (judul.length < 3) { setError("s-judul", "Judul minimal 3 karakter"); ok = false; }
    if (!kategori) { setError("s-kategori", "Pilih kategori"); ok = false; }
    if (stokTxt === "" || !Number.isInteger(Number(stokTxt)) || Number(stokTxt) < 0) { setError("s-stok", "Stok harus bilangan bulat ≥ 0"); ok = false; }
    if (hargaTxt === "" || Number(hargaTxt) <= 0) { setError("s-harga", "Harga harus lebih dari 0"); ok = false; }
    if (!ok) { showToast("Periksa kembali isian form.", "error"); return; }

    daftar.push({ kode, judul, kategori, penulis: "-", stok: Number(stokTxt), harga: Number(hargaTxt), cover: "" });
    save(KEY.stok, daftar);
    kata = "";
    $("#cari").value = "";
    render(kode);
    form.reset();
    showToast("Baris stok baru ditambahkan.");
  });

  render();
}

/* ---------- 6. CHECKOUT / PEMESANAN ---------- */
function initCheckout() {
  let stok = getStok();
  let keranjang = []; // { kode, qty }
  const tbody = $("#tbodyKeranjang");
  const pilih = $("#pilihBuku");
  const selEkspedisi = $("#c-ekspedisi");

  // Isi dropdown
  function isiPilihan() {
    pilih.replaceChildren(el("option", { value: "" }, "-- Pilih buku --"));
    stok.filter((b) => b.stok > 0).forEach((b) =>
      pilih.append(el("option", { value: b.kode }, `${b.judul} - ${formatRupiah(b.harga)} (stok ${b.stok})`))
    );
  }
  selEkspedisi.append(el("option", { value: "" }, "-- Pilih ekspedisi --"));
  dataEkspedisi.forEach((x) => selEkspedisi.append(el("option", { value: x.nama }, x.nama)));
  isiPilihan();

  const cari = (kode) => stok.find((b) => b.kode === kode);

  function hitungOngkir() {
    const ek = dataEkspedisi.find((x) => x.nama === selEkspedisi.value);
    const paket = $("#c-paket").value;
    if (!ek || !paket || !keranjang.length) return 0;
    return ek[paket];
  }

  function hitungSubtotal() {
    return keranjang.reduce((a, it) => a + cari(it.kode).harga * it.qty, 0);
  }

  function updateRingkasan() {
    const sub = hitungSubtotal();
    const ong = hitungOngkir();
    $("#sumSubtotal").textContent = formatRupiah(sub);
    $("#sumOngkir").textContent = formatRupiah(ong);
    $("#sumTotal").textContent = formatRupiah(sub + ong);
  }

  function renderKeranjang() {
    tbody.replaceChildren();
    if (!keranjang.length) {
      tbody.append(el("tr", {}, el("td", { colspan: "5", class: "empty" }, "Belum ada buku dalam pesanan.")));
    }
    keranjang.forEach((it) => {
      const b = cari(it.kode);
      const qty = el("input", { type: "number", class: "qty-input", min: "1", max: b.stok, value: it.qty, "aria-label": "Jumlah " + b.judul });
      qty.addEventListener("change", () => {
        let n = parseInt(qty.value, 10);
        if (!n || n < 1) n = 1;
        if (n > b.stok) { n = b.stok; showToast(`Stok "${b.judul}" hanya ${b.stok}.`, "error"); }
        it.qty = n;
        renderKeranjang();
      });
      tbody.append(
        el("tr", {},
          el("td", {}, b.judul),
          el("td", { class: "num" }, formatRupiah(b.harga)),
          el("td", {}, qty),
          el("td", { class: "num" }, formatRupiah(b.harga * it.qty)),
          el("td", {}, el("button", { type: "button", class: "btn btn-danger btn-sm", onclick: () => {
            keranjang = keranjang.filter((x) => x.kode !== it.kode);
            renderKeranjang();
          } }, "Hapus"))
        )
      );
    });
    updateRingkasan();
  }

  // Tambah buku ke pesanan
  $("#btnTambah").addEventListener("click", () => {
    $("#err-keranjang").textContent = "";
    const kode = pilih.value;
    const qty = parseInt($("#jumlahBuku").value, 10);
    if (!kode) { $("#err-keranjang").textContent = "Pilih buku terlebih dahulu."; return; }
    if (!qty || qty < 1) { $("#err-keranjang").textContent = "Jumlah minimal 1."; return; }

    const b = cari(kode);
    const ada = keranjang.find((x) => x.kode === kode);
    const total = (ada ? ada.qty : 0) + qty;
    if (total > b.stok) {
      $("#err-keranjang").textContent = `Stok tidak cukup. Tersedia ${b.stok}, di pesanan ${ada ? ada.qty : 0}.`;
      return;
    }
    if (ada) ada.qty = total; else keranjang.push({ kode, qty });
    $("#jumlahBuku").value = 1;
    pilih.value = "";
    renderKeranjang();
    showToast("Buku ditambahkan ke pesanan.");
  });

  selEkspedisi.addEventListener("change", updateRingkasan);
  $("#c-paket").addEventListener("change", updateRingkasan);

  // Submit pesanan
  const form = $("#formCheckout");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);
    $("#err-keranjang").textContent = "";

    const nama = $("#c-nama").value.trim();
    const email = $("#c-email").value.trim();
    const telp = $("#c-telp").value.trim();
    const alamat = $("#c-alamat").value.trim();
    const ekspedisi = selEkspedisi.value;
    const paket = $("#c-paket").value;
    const bayar = $("#c-bayar").value;
    let ok = true;

    if (!keranjang.length) { $("#err-keranjang").textContent = "Tambahkan minimal satu buku ke pesanan."; ok = false; }
    if (nama.length < 3) { setError("c-nama", "Nama minimal 3 karakter"); ok = false; }
    if (!emailValid(email)) { setError("c-email", "Format email tidak valid"); ok = false; }
    if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(telp)) { setError("c-telp", "Nomor telepon tidak valid (mis. 081234567890)"); ok = false; }
    if (alamat.length < 10) { setError("c-alamat", "Alamat minimal 10 karakter"); ok = false; }
    if (!ekspedisi) { setError("c-ekspedisi", "Pilih ekspedisi"); ok = false; }
    if (!paket) { setError("c-paket", "Pilih jenis paket"); ok = false; }
    if (!bayar) { setError("c-bayar", "Pilih metode pembayaran"); ok = false; }
    if (!ok) { showToast("Lengkapi data pesanan dengan benar.", "error"); return; }

    const riwayat = getRiwayat();
    const nomorDO = "DO" + new Date().getFullYear() + String(riwayat.length + 101);
    const items = keranjang.map((it) => {
      const b = cari(it.kode);
      return { kode: b.kode, judul: b.judul, qty: it.qty, harga: b.harga };
    });
    const ongkir = hitungOngkir();
    const total = hitungSubtotal() + ongkir;
    const sekarang = new Date();

    riwayat.push({
      nomorDO, tanggal: sekarang.toISOString(), nama, email, telp, alamat,
      ekspedisi, paket: paket === "express" ? "Express" : "Reguler", bayar,
      items, ongkir, total, statusIndex: 0
    });
    save(KEY.riwayat, riwayat);

    // Kurangi stok
    keranjang.forEach((it) => { cari(it.kode).stok -= it.qty; });
    save(KEY.stok, stok);

    // Reset tampilan
    keranjang = [];
    form.reset();
    isiPilihan();
    renderKeranjang();

    $("#noDoBaru").textContent = nomorDO;
    $("#linkTracking").href = "tracking.html?do=" + nomorDO;
    openModal("modalSukses");
  });

  renderKeranjang();
}

/* ---------- 7. TRACKING ---------- */
function semuaDataTracking() {
  const dariRiwayat = getRiwayat().map((o) => ({
    nomorDO: o.nomorDO,
    nama: o.nama,
    statusIndex: o.statusIndex,
    ekspedisi: o.ekspedisi,
    paket: o.paket,
    tanggalKirim: o.tanggal,
    total: o.total,
    items: o.items.map((i) => `${i.judul} x${i.qty}`),
    perjalanan: [{ waktu: new Date(o.tanggal).toLocaleString("id-ID"), ket: "Pesanan diterima sistem" }]
  }));
  return [...dataTracking, ...dariRiwayat];
}

function initTracking() {
  const form = $("#formCari");
  const input = $("#nomorDO");

  // Chip contoh nomor DO
  dataTracking.forEach((d) =>
    $("#chipDO").append(el("button", { type: "button", class: "chip", onclick: () => { input.value = d.nomorDO; form.requestSubmit(); } }, d.nomorDO))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(form);
    $("#hasil").hidden = true;
    const no = input.value.trim().toUpperCase();

    if (!no) { setError("nomorDO", "Nomor Delivery Order wajib diisi"); return; }
    const data = semuaDataTracking().find((d) => d.nomorDO === no);
    if (!data) {
      setError("nomorDO", "Nomor DO tidak ditemukan");
      alert("Nomor Delivery Order \"" + no + "\" tidak ditemukan.");
      return;
    }
    tampilkanHasil(data);
  });

  // Dukungan tautan dari halaman checkout (?do=...)
  const param = new URLSearchParams(location.search).get("do");
  if (param) { input.value = param; form.requestSubmit(); }
}

function tampilkanHasil(d) {
  $("#hNama").textContent = d.nama;
  $("#hStatus").textContent = tahapPengiriman[d.statusIndex];
  $("#hDO").textContent = d.nomorDO;
  $("#hEkspedisi").textContent = d.ekspedisi;
  $("#hTanggal").textContent = formatTanggal(d.tanggalKirim);
  $("#hPaket").textContent = d.paket;
  $("#hItems").textContent = d.items.join(", ");
  $("#hTotal").textContent = formatRupiah(d.total);

  // Progress stepper
  const stepper = $("#stepper");
  const fill = el("span", { class: "fill" });
  stepper.replaceChildren(fill);
  const terakhir = tahapPengiriman.length - 1;
  tahapPengiriman.forEach((label, i) => {
    const kelas = [i <= d.statusIndex ? "done" : "", i === d.statusIndex ? "current" : "", i === terakhir ? "final" : ""].join(" ");
    stepper.append(el("li", { class: kelas.trim() }, el("div", { class: "dot" }, i <= d.statusIndex ? "✓" : i + 1), label));
  });
  fill.style.width = "0";
  requestAnimationFrame(() => { fill.style.width = (84 * d.statusIndex) / terakhir + "%"; });

  // Timeline perjalanan
  const tl = $("#timeline");
  tl.replaceChildren();
  [...d.perjalanan].reverse().forEach((p) => tl.append(el("li", {}, el("time", {}, p.waktu), p.ket)));

  $("#hasil").hidden = false;
}
