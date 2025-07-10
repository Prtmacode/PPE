document.addEventListener("DOMContentLoaded", function () {
  // Muat isi navbar.html
  fetch("../navbar/navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;

      // Setelah isi dimuat, pasang event listener toggle & logout
      const toggle = document.getElementById("navbarToggle");
      const links = document.getElementById("navbarLinks");

      if (toggle && links) {
        toggle.addEventListener("click", function () {
          links.classList.toggle("show");
        });
      }

      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
          localStorage.removeItem("token");
          // Tidak perlu preventDefault, karena kita ingin tetap redirect ke /index.html
          // Link akan tetap berjalan setelah token dihapus
        });
      }
    })
    .catch((err) => {
      console.error("Gagal memuat navbar:", err);
    });
});
