// /sidebar/sidebar.js

// Ambil file sidebar.html dan masukkan ke dalam #sidebar-container
fetch("/sidebar/sidebar.html")
  .then((response) => response.text())
  .then((html) => {
    document.getElementById("sidebar-container").innerHTML = html;

    // 🔘 Sidebar toggle (jika ada tombol toggle di layout)
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.getElementById("sidebar");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }

    // 🔐 Tombol Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "../index.html"; // redirect ke root
      });
    }
  })
  .catch((error) => {
    console.error("Gagal memuat sidebar:", error);
  });
