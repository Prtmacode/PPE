document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Fungsi scroll untuk navbar background
  window.addEventListener("scroll", () => {
    // Ubah background navbar jika scroll lebih dari 60px
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Highlight menu berdasarkan posisi scroll
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100; // offset buffer
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });

  // Jalankan satu kali saat halaman pertama dimuat
  window.dispatchEvent(new Event("scroll"));
});
