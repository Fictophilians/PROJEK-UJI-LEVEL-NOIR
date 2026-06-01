const STORAGE_USERS_KEY = "app_users";
const STORAGE_CURRENT_USER_KEY = "current_user";

function getStoredUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || [];
}

function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function showAuthMessage(message, type = "error") {
  const messageElement = document.getElementById("auth-message");
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.className =
      type === "success"
        ? "text-green-600 text-center mb-4"
        : "text-red-600 text-center mb-4";
  } else {
    alert(message);
  }
}

function login() {
  const email = document.getElementById("login-email")?.value.trim();
  const password = document.getElementById("login-password")?.value;

  if (!email || !password) {
    return alert("Isi email dan password terlebih dahulu.");
  }

  const users = getStoredUsers();
  const user = users.find(
    (item) =>
      item.email.toLowerCase() === email.toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    return alert("Email atau password tidak cocok.");
  }

  localStorage.setItem(
    STORAGE_CURRENT_USER_KEY,
    JSON.stringify({ email: user.email }),
  );
  alert("Login berhasil! Mengalihkan...");
  setTimeout(() => {
    window.location.href = "../view/product.html";
  }, 600);
}

function register() {
  const email = document.getElementById("register-email")?.value.trim();
  const password = document.getElementById("register-password")?.value;
  const confirmPassword = document.getElementById(
    "register-confirm-password",
  )?.value;

  if (!email || !password || !confirmPassword) {
    return alert("Isi email dan password terlebih dahulu.");
  }

  if (password !== confirmPassword) {
    return alert("Password dan konfirmasi password tidak sama.");
  }

  const users = getStoredUsers();
  const exists = users.some(
    (item) => item.email.toLowerCase() === email.toLowerCase(),
  );

  if (exists) {
    return alert("Email sudah terdaftar. Silakan login.");
  }

  users.push({ email, password });
  saveStoredUsers(users);
  alert("Registrasi berhasil! Mengalihkan ke login...");
  setTimeout(() => {
    window.location.href = "./login.html";
  }, 800);
}

function logout() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  window.location.href = "../view/login.html";
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_CURRENT_USER_KEY) || "null");
}

window.auth = {
  login,
  register,
  logout,
  getCurrentUser,
};
