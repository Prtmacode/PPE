document.addEventListener("DOMContentLoaded", function () {
  // === SIDEBAR TOGGLE ===
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("sidebarToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // === STREAM KAMERA (DUMMY SAJA) ===
  const videoEl = document.getElementById("kameraUtama");
  if (navigator.mediaDevices?.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        videoEl.srcObject = stream;
      })
      .catch((err) => {
        console.error("Gagal mengakses kamera:", err);
      });
  }

  // === INFORMASI KAMERA ===
  const cameraInfo = {
    deviceName: "PPE-Cam-01",
    eventId: "EVT123456",
    cameraId: "CAM001",
    date: new Date().toLocaleString("id-ID"),
    modules: "Helm, Rompi, Masker, Sarung Tangan",
    location: "Workshop Area 1",
    results: "Pelanggaran Terdeteksi",
    snapshotUrl: "snapshoot/tester1.jpeg", // <== GANTI DENGAN GAMBAR STATIS
  };

  document.getElementById("deviceName").textContent = cameraInfo.deviceName;
  document.getElementById("eventId").textContent = cameraInfo.eventId;
  document.getElementById("cameraId").textContent = cameraInfo.cameraId;
  document.getElementById("date").textContent = cameraInfo.date;
  document.getElementById("modules").textContent = cameraInfo.modules;
  document.getElementById("location").textContent = cameraInfo.location;
  document.getElementById("results").textContent = cameraInfo.results;
  document.getElementById("snapshot").src = cameraInfo.snapshotUrl;
  document.getElementById("labelKamera").textContent =
    "Cam 1 - " + cameraInfo.location;

  // === FUNGSI AMBIL STATS DARI DOM ===
  const getStats = () => {
    const hari =
      parseInt(document.getElementById("stat-hari").textContent) || 0;
    const minggu =
      parseInt(document.getElementById("stat-minggu").textContent) || 0;
    const bulan =
      parseInt(document.getElementById("stat-bulan").textContent) || 0;
    const total = hari + minggu + bulan;
    return { hari, minggu, bulan, total };
  };

  // === DATA DUMMY CHART ===
  const dummyData = {
    daily: Array.from({ length: 70 }, () => Math.floor(Math.random() * 5 + 1)),
    weekly: Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 25 + 10)
    ),
    monthly: [132, 145, 88],
  };

  const labels = {
    daily: Array.from({ length: 70 }, (_, i) => `Hari ${i + 1}`),
    weekly: Array.from({ length: 10 }, (_, i) => `Minggu ${i + 1}`),
    monthly: ["Mei", "Juni", "Juli"],
    all: ["Hari Ini", "Minggu Ini", "Bulan Ini", "Total"],
  };

  // === INISIALISASI CHART.JS ===
  const ctx = document.getElementById("violationChart").getContext("2d");

  const violationChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.weekly,
      datasets: [
        {
          label: "Jumlah Pelanggaran",
          data: dummyData.weekly,
          fill: true,
          tension: 0.4,
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          pointBackgroundColor: "#007bff",
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10,
          },
        },
      },
    },
  });

  // === HANDLER DROPDOWN FILTER CHART ===
  document
    .getElementById("filterSelect")
    .addEventListener("change", function () {
      const { hari, minggu, bulan, total } = getStats();
      const filter = this.value;

      let newLabels = [];
      let newData = [];

      switch (filter) {
        case "daily":
          newLabels = labels.daily;
          newData = dummyData.daily;
          break;
        case "weekly":
          newLabels = labels.weekly;
          newData = dummyData.weekly;
          break;
        case "monthly":
          newLabels = labels.monthly;
          newData = dummyData.monthly;
          break;
        default:
          newLabels = labels.all;
          newData = [hari, minggu, bulan, total];
      }

      violationChart.data.labels = newLabels;
      violationChart.data.datasets[0].data = newData;
      violationChart.update();
    });

  // === LOGOUT HANDLER ===
  const logoutLink = document.querySelector(".logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault(); // mencegah default <a>
      localStorage.removeItem("token"); // jika menggunakan token auth
      window.location.href = "index.html"; // arahkan ke halaman login
    });
  }

  // === AI PPE ANALISIS BERDASARKAN NAMA FILE GAMBAR SAJA (SIMULASI) ===
  async function isPPECompleteFromImage(imageName) {
    const imageUrl = `/snapshoot/${imageName}`;

    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageUrl }),
    });

    const result = await response.json();
    return result.status === "complete";
  }

  async function handleSnapshotPPE() {
    const snapshotUrl = "snapshoot/tester.jpeg";

    try {
      const res = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_path: snapshotUrl }),
      });

      const result = await res.json();
      console.log("AI response:", result);

      const hasilEl = document.getElementById("hasilAI");
      if (hasilEl) {
        hasilEl.innerText = `Hasil AI: ${result.status.toUpperCase()} - ${
          result.action
        }`;
      }
    } catch (err) {
      console.error("Gagal analisis AI:", err);

      const hasilEl = document.getElementById("hasilAI");
      if (hasilEl) {
        hasilEl.innerText = "Gagal menghubungi server AI";
      }
    }
  }

  // === JALANKAN PENGECEKAN PPE PADA LOAD PERTAMA ===
  handleSnapshotPPE();

  window.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/analyze", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        const hasil = data.status;
        const messageDiv = document.getElementById("message");
        if (hasil === "lengkap") {
          messageDiv.innerText = "✅ APD LENGKAP – Lampu hijau dinyalakan";
        } else {
          messageDiv.innerText = "❌ APD TIDAK LENGKAP – Suara dibunyikan";
        }
      })
      .catch((err) => {
        console.error("Gagal fetch ke AI:", err);
        const messageDiv = document.getElementById("message");
        messageDiv.innerText = "⚠️ Gagal menghubungi AI";
      });
  });
});
