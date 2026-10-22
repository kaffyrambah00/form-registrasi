const form = document.querySelector("#formDaftar");
const statusForm = document.querySelector("#statusForm");

const nama = document.querySelector("#nama");
const hp = document.querySelector("#hp");
const password = document.querySelector("#password");
const konfirmasi = document.querySelector("#konfirmasi");
const tanggal = document.querySelector("#tanggal");

const fields = [nama, hp, password, konfirmasi, tanggal];

const pesan = {
  nama: {
    kosong: "Nama wajib diisi.",
    pendek: "Nama minimal 3 huruf."
  },
  hp: {
    kosong: "Nomor WhatsApp wajib diisi.",
    format: "Nomor harus diawali 08 dan terdiri dari 10–13 digit."
  },
  password: {
    kosong: "Password wajib diisi.",
    pendek: "Password minimal 8 karakter."
  },
  konfirmasi: {
    kosong: "Konfirmasi password wajib diisi.",
    beda: "Konfirmasi belum sama dengan password."
  },
  tanggal: {
    kosong: "Tanggal lahir wajib diisi.",
    terlaluMuda: "Usia pendaftar harus minimal 20 tahun."
  }
};

function formatTanggalLokal(date) {
  const tahun = date.getFullYear();
  const bulan = String(date.getMonth() + 1).padStart(2, "0");
  const hari = String(date.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

// Tanggal lahir paling baru agar pendaftar sudah berusia 20 tahun.
function hitungBatasUsia() {
  const batas = new Date();
  batas.setFullYear(batas.getFullYear() - 20);

  // Menangani 29 Februari pada tahun yang bukan tahun kabisat.
  if (batas.getMonth() !== new Date().getMonth()) {
    batas.setDate(0);
  }

  return formatTanggalLokal(batas);
}

tanggal.max = hitungBatasUsia();

function showError(input, teks) {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  document.querySelector(`#${input.id}-error`).textContent = teks;

  return false;
}

function clearError(input) {
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-invalid");
  document.querySelector(`#${input.id}-error`).textContent = "";

  return true;
}

function cekField(input) {
  const value = input.value.trim();

  if (value === "") {
    return showError(input, pesan[input.id].kosong);
  }

  if (input === nama && value.length < 3) {
    return showError(input, pesan.nama.pendek);
  }

  if (input === hp && !/^08\d{8,11}$/.test(value)) {
    return showError(input, pesan.hp.format);
  }

  if (input === password && input.value.length < 8) {
    return showError(input, pesan.password.pendek);
  }

  if (input === konfirmasi && input.value !== password.value) {
    return showError(input, pesan.konfirmasi.beda);
  }

  if (input === tanggal && input.value > tanggal.max) {
    return showError(input, pesan.tanggal.terlaluMuda);
  }

  return clearError(input);
}

function cekSemuaField() {
  let semuaValid = true;

  for (const input of fields) {
    if (!cekField(input)) {
      semuaValid = false;
    }
  }

  return semuaValid;
}

// Tampilkan error saat pengguna meninggalkan field.
for (const input of fields) {
  input.addEventListener("blur", () => {
    cekField(input);
  });

  // Perbarui error saat pengguna memperbaiki isi field.
  input.addEventListener("input", () => {
    if (input.classList.contains("is-invalid")) {
      cekField(input);
    }

    // Jika password diubah, cek kembali kolom konfirmasi.
    if (
      input === password &&
      konfirmasi.classList.contains("is-invalid")
    ) {
      cekField(konfirmasi);
    }

    statusForm.textContent = "";
    statusForm.className = "";
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  statusForm.textContent = "";
  statusForm.className = "";

  if (!cekSemuaField()) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  statusForm.textContent = "Registrasi berhasil!";
  statusForm.className = "alert alert-success mt-3";
  form.reset();

  for (const input of fields) {
    clearError(input);
  }
});