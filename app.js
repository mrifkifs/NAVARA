/**
 * NAVARA ACADEMIC SOCIETY - APP SCRIPT
 * Konfigurasi Array Data untuk Anggota Kelas & Jadwal Kuliah.
 * Terstruktur & Dinamis, Siap Dikoneksikan ke Firebase Firestore Cloud.
 */

// ==========================================================================
// DATA SOURCE DATA ANGGOTA (11 DATA UTUH SESUAI SCREENSHOT)
// ==========================================================================
const dataAnggota = [
    { nama: "M. AGHISNA AL GHIFARI SUDRAJAT", nim: "300225001", status: "Active Student", isHighlighted: false },
    { nama: "KHALIFAH SYAKIB MUHAJIR", nim: "300225003", status: "Active Student", isHighlighted: false },
    { nama: "MUHAMMAD SYAFIQ ABIDIN", nim: "300225004", status: "Active Student", isHighlighted: false },
    { nama: "GINA AGUSTINA", nim: "300225008", status: "Active Student", isHighlighted: false },
    { nama: "MUHAMMAD RIFKI QURROTA A'YUN", nim: "300225009", status: "Active Student", isHighlighted: false },
    { nama: "SITI SARAH AZ ZAHRA SOMANTRI", nim: "300225010", status: "Active Student", isHighlighted: true }, // Border Emas Spesifik
    { nama: "WIDIYASNANI ANNABILAH", nim: "300225011", status: "Active Student", isHighlighted: false },
    { nama: "RIDHO AKBAR", nim: "300225014", status: "Active Student", isHighlighted: false },
    { nama: "YULIA SUNDARI", nim: "300225016", status: "Active Student", isHighlighted: false },
    { nama: "KEYSA SHABIRALILLAH", nim: "300225019", status: "Active Student", isHighlighted: false },
    { nama: "MOHAMMAD SYAFI WIDAYANTO", nim: "300225001", status: "Active Student", isHighlighted: false }
];

// ==========================================================================
// DATA SOURCE JADWAL KULIAH (LENGKAP SENIN - JUMAT SESUAI SCREENSHOT)
// ==========================================================================
const dataJadwal = [
    {
        hari: "Senin",
        matkul: [
            { waktu: "10:00 - 12:00", nama: "Kewarganegaraan", ruang: "Ruang 3B Kampus 2" }
        ]
    },
    {
        hari: "Selasa",
        matkul: [
            { waktu: "08:00 - 10:30", nama: "Pengantar Akuntansi Lanjutan", ruang: "Ruang 3B Kampus 2" },
            { waktu: "13:00 - 15:30", nama: "Ekonomi Internasional", ruang: "Ruang 3B Kampus 2" }
        ]
    },
    {
        hari: "Rabu",
        matkul: [
            { waktu: "08:00 - 10:30", nama: "Pengantar Manajemen", ruang: "Ruang 3B Kampus 2" },
            { waktu: "13:00 - 15:30", nama: "Statistika Bisnis", ruang: "Ruang 3B Kampus 2" }
        ]
    },
    {
        hari: "Kamis",
        matkul: [
            { waktu: "08:00 - 10:30", nama: "Bahasa Inggris", ruang: "Ruang 3B Kampus 2" },
            { waktu: "13:00 - 15:30", nama: "AIK", ruang: "Ruang 3B Kampus 2" }
        ]
    },
    {
        hari: "Jumat",
        matkul: [
            { waktu: "08:00 - 10:30", nama: "Etika Bisnis", ruang: "Ruang 3B Kampus 2" }
        ]
    }
];

// ==========================================================================
// LOGIKA PEMROSESAN RENDER UI KE HTML
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Pemrosesan Otomatis Elemen Kartu Anggota
    const containerAnggota = document.getElementById('anggota-container');
    if (containerAnggota) {
        let htmlAnggota = '';
        dataAnggota.forEach((mhs, index) => {
            // Pengkondisian style border emas jika data isHighlighted bernilai true
            const borderStyle = mhs.isHighlighted ? 'style="border-color: var(--accent-gold);"' : '';
            // Jeda waktu (delay) dinamis untuk efek cascade animasi dramatis
            const animationDelay = index * 0.08; 
            
            htmlAnggota += `
                <div class="member-card reveal-up" ${borderStyle} style="transition-delay: ${animationDelay}s;">
                    <div class="member-name">${mhs.nama}</div>
                    <div class="member-nim">NIM: ${mhs.nim}</div>
                    <div class="badge">Active Student</div>
                </div>
            `;
        });
        containerAnggota.innerHTML = htmlAnggota;
    }

    // 2. Pemrosesan Otomatis Elemen Jadwal Kuliah
    const containerJadwal = document.getElementById('jadwal-container');
    if (containerJadwal) {
        let htmlJadwal = '';
        
        dataJadwal.forEach((jadwalHari, index) => {
            let matkulHtml = '';
            jadwalHari.matkul.forEach(mk => {
                matkulHtml += `
                    <div class="subject-card">
                        <div class="time">${mk.waktu}</div>
                        <div class="subject-name">${mk.nama}</div>
                        <div class="room"><i class="fa-solid fa-location-dot" style="font-size:0.75rem;"></i> ${mk.ruang}</div>
                    </div>
                `;
            });

            // Hitung jeda animasi per blok hari
            const dayDelay = index * 0.12;

            // Template Hari Biasa
            htmlJadwal += `
                <div class="day-card reveal-up" style="transition-delay: ${dayDelay}s;">
                    <div class="day-header">
                        <span>${jadwalHari.hari}</span>
                        <i class="fa-regular fa-clock" style="color: var(--accent-gold); font-size: 1.1rem;"></i>
                    </div>
                    <div class="subject-list">
                        ${matkulHtml}
                    </div>
                </div>
            `;

            // SISIPAN KHUSUS: Jika hari itu adalah Rabu, maka setelah kotak Rabu dirender,
            // sistem akan langsung menyisipkan Kartu Gambar "Pursue Excellence" di sampingnya persis sesuai gambar desain.
            if (jadwalHari.hari === "Rabu") {
                htmlJadwal += `
                    <div class="schedule-image-card reveal-up" style="transition-delay: ${(index + 1) * 0.12}s;">
                        <h4>Pursue Excellence.</h4>
                        <p>NAVARA SOCIETY</p>
                    </div>
                `;
            }
        });
        
        containerJadwal.innerHTML = htmlJadwal;
    }

    // ==========================================================================
    // MESIN DETEKTOR INTERSECTION OBSERVER (ANIMASI DRAMATIS SAAT SCROLL)
    // ==========================================================================
    const hiddenElements = document.querySelectorAll('.reveal-up, .reveal-fade');

    const observerOptions = {
        root: null, // Berdasarkan viewport browser
        rootMargin: '0px 0px -60px 0px', // Elemen terpicu 60px sebelum masuk penuh ke layar
        threshold: 0.12 // Minimal 12% bagian elemen harus terlihat
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Berikan class active untuk mengaktifkan transisi CSS
                entry.target.classList.add('active');
                // Unobserve agar animasi berjalan sekali saja dan konstan stabil
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Daftarkan semua elemen ke dalam sistem pengawasan scroll
    hiddenElements.forEach((el) => scrollObserver.observe(el));
});