let users = [];

async function getUser() {
  try {
    let response = await fetch("./data/users.json");
    if (!response.ok) {
      throw new Error("Data pengguna tidak ditemukan");
    }
    users = await response.json();
    return users;
  } catch (error) {
    console.error("Gagal memuat data pengguna:", error);
    return [];
  }
}

async function ensureUsersLoaded() {
  if (!users.length) {
    await getUser();
  }

  if (!users.length) {
    alert("Data pengguna belum bisa dimuat.");
    return false;
  }

  return true;
}

function saveUserSession(user) {
  sessionStorage.setItem("nama", user.nama);
  sessionStorage.setItem("email", user.email);
}

function getCurrentUser() {
  const nama = sessionStorage.getItem("nama");
  const email = sessionStorage.getItem("email");
  return nama ? { nama, email } : null;
}

function updateAuthUI() {
  const user = getCurrentUser();
  const authGuest = document.getElementById("auth-guest");
  const profileInitial = document.getElementById("profile-initial");
  const profileName = document.getElementById("profile-name");

  if (user) {
    if (authGuest) authGuest.style.display = "none";
    if (profileInitial)
      profileInitial.textContent = user.nama.charAt(0).toUpperCase();
    if (profileName) {
      profileName.textContent = user.nama;
      profileName.classList.remove("hidden");
    }
  } else {
    if (authGuest) authGuest.style.display = "flex";
    if (profileName) profileName.classList.add("hidden");
  }
}

function showProfile() {
  const profile = document.getElementById("profile");
  if (!profile) return;

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  profile.innerHTML = `
    <div class="bg-white rounded-3xl border border-[#E4D7C8] p-8 shadow-sm max-w-3xl">
      <div class="flex flex-col gap-6">
        <div>
          <div class="text-xs uppercase tracking-[0.28em] text-[#7B3F1A] mb-2">
            Informasi Akun
          </div>
          <div class="text-3xl font-serif text-[#3D1F0D]">${user.nama}</div>
          <div class="mt-2 text-sm text-[#3D1F0D]/70">Data akun yang tersimpan di sesi saat ini.</div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-3xl border border-[#E4D7C8] bg-[#F9F3EE] p-5">
            <div class="text-xs uppercase tracking-[0.28em] text-[#7B3F1A] mb-2">Nama</div>
            <div class="text-sm text-[#3D1F0D]">${user.nama}</div>
          </div>
          <div class="rounded-3xl border border-[#E4D7C8] bg-[#F9F3EE] p-5">
            <div class="text-xs uppercase tracking-[0.28em] text-[#7B3F1A] mb-2">Email</div>
            <div class="text-sm text-[#3D1F0D]">${user.email || "-"}</div>
          </div>
        </div>

        <button
          type="button"
          onclick="logout()"
          class="w-full max-w-xs rounded-full bg-[#3D1F0D] px-6 py-3 text-sm font-semibold text-[#F9F3EE] hover:bg-[#5A2E14] transition"
        >
          Logout
        </button>
      </div>
    </div>
  `;
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Silakan isi email dan password.");
    return;
  }

  const usersLoaded = await ensureUsersLoaded();
  if (!usersLoaded) return;

  const foundUser = users.find(
    (user) =>
      email.toLowerCase() === user.email.toLowerCase() &&
      password === user.password
  );

  if (!foundUser) {
    alert("Login gagal Password / email salah");
    document.getElementById("password").value = "";
    document.getElementById("email").value = "";
    return;
  }

  saveUserSession(foundUser);
  window.location.href = "index.html";
}

async function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Silakan isi semua field untuk mendaftar.");
    return;
  }

  const usersLoaded = await ensureUsersLoaded();
  if (!usersLoaded) return;

  const foundUser = users.find(
    (user) =>
      name.toLowerCase() === user.nama.toLowerCase() &&
      email.toLowerCase() === user.email.toLowerCase() &&
      password === user.password
  );

  if (!foundUser) {
    alert("Register gagal data tidak terdeteksi");
    return;
  }

  saveUserSession(foundUser);
  window.location.href = "index.html";
}

function logout() {
  sessionStorage.removeItem("nama");
  sessionStorage.removeItem("email");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  showProfile();
});
getUser();

