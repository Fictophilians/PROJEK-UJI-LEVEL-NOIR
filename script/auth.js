function login(){
  if (document.getElementById("email").value === "adi@mail.com" && document.getElementById("password").value === "123") {
    alert("Login berhasil!");
    window.location.href = "index.html";
  } 
  if (document.getElementById("email").value === "" || document.getElementById("password").value === "") {
    alert("Email dan password tidak boleh kosong.");
  }
  else {
    alert("Email atau password tidak cocok.");
  }
}

function register() {
  if (document.getElementById("email").value === "adi@mail.com" && document.getElementById("password").value === "123") {
    alert("Akun berhasil terdaftar")
    window.location.href = "index.html";
  }
  if (document.getElementById("email").value === "" || document.getElementById("password").value === "") {
    alert("Email dan password tidak boleh kosong.");
  }
}




