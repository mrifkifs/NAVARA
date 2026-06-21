/**
 * NAVARA ACADEMIC SOCIETY - LIVE FIREBASE CLIENT SCRIPT (VERSI DIRECT LOAD)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// KONFIGURASI FIREBASE ANDA
const firebaseConfig = {
    apiKey: "AIzaSyABpQq2OuXJeXbu2uxLaecRGL8srH01foQ",
    authDomain: "navara-8ac77.firebaseapp.com",
    projectId: "navara-8ac77",
    storageBucket: "navara-8ac77.firebasestorage.app",
    messagingSenderId: "35453814512",
    appId: "1:35453814512:web:cb94f20d324fa0f9e36435"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FUNGSI UTAMA PENARIKAN DATA (Dijalankan Langsung)
async function renderWebUtama() {
    console.log("Script app.js berjalan: Mulai menarik data dari Firebase...");

    // 1. DATA ANGGOTA KELAS
    const containerAnggota = document.getElementById('anggota-container');
    if (containerAnggota) {
        try {
            let htmlAnggota = '';
            const qAnggota = query(collection(db, "anggota"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(qAnggota);
            
            let index = 0;
            querySnapshot.forEach((doc) => {
                const mhs = doc.data();
                const borderStyle = mhs.isHighlighted ? 'style="border-color: var(--accent-gold);"' : '';
                const animationDelay = index * 0.08; 
                
                // Class 'active' ditambahkan agar langsung muncul tanpa harus menunggu di-scroll
                htmlAnggota += `
                    <div class="member-card reveal-up active" ${borderStyle} style="transition-delay: ${animationDelay}s;">
                        <div class="member-name">${mhs.nama}</div>
                        <div class="member-nim">NIM: ${mhs.nim}</div>
                        <div class="badge">Active Student</div>
                    </div>
                `;
                index++;
            });
            
            containerAnggota.innerHTML = htmlAnggota || '<p style="color:var(--text-gray);">Belum ada data anggota. Buka admin.html untuk menambahkan.</p>';
            console.log("Sukses memuat data anggota.");
        } catch (err) {
            console.error("Error load anggota: ", err);
        }
    }

    // 2. DATA JADWAL KULIAH
    const containerJadwal = document.getElementById('jadwal-container');
    if (containerJadwal) {
        try {
            const qJadwal = query(collection(db, "jadwal"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(qJadwal);
            
            const hariMap = { "Senin": [], "Selasa": [], "Rabu": [], "Kamis": [], "Jumat": [] };
            
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                if(hariMap[item.hari]) {
                    hariMap[item.hari].push(item);
                }
            });

            let htmlJadwal = '';
            let dayIndex = 0;

            const urutanHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
            urutanHari.forEach((hari) => {
                const listMatkul = hariMap[hari];
                if (listMatkul.length === 0) return;

                let matkulHtml = '';
                listMatkul.forEach(mk => {
                    matkulHtml += `
                        <div class="subject-card">
                            <div class="time">${mk.waktu}</div>
                            <div class="subject-name">${mk.nama}</div>
                            <div class="room"><i class="fa-solid fa-location-dot" style="font-size:0.75rem;"></i> ${mk.ruang}</div>
                        </div>
                    `;
                });

                const dayDelay = dayIndex * 0.12;
                htmlJadwal += `
                    <div class="day-card reveal-up active" style="transition-delay: ${dayDelay}s;">
                        <div class="day-header">
                            <span>${hari}</span>
                            <i class="fa-regular fa-clock" style="color: var(--accent-gold); font-size: 1.1rem;"></i>
                        </div>
                        <div class="subject-list">
                            ${matkulHtml}
                        </div>
                    </div>
                `;

                if (hari === "Rabu") {
                    htmlJadwal += `
                        <div class="schedule-image-card reveal-up active" style="transition-delay: ${(dayIndex + 1) * 0.12}s;">
                            <h4>Pursue Excellence.</h4>
                            <p>NAVARA SOCIETY</p>
                        </div>
                    `;
                }
                dayIndex++;
            });

            containerJadwal.innerHTML = htmlJadwal || '<p style="color:var(--text-gray);">Belum ada jadwal kuliah. Buka admin.html untuk menambahkan.</p>';
            console.log("Sukses memuat data jadwal.");

        } catch (err) {
            console.error("Error load jadwal: ", err);
        }
    }

    // Tetap panggil observer untuk animasi scroll bagian profil & filosofi
    initScrollObserver();
}

// LANGSUNG PANGGIL FUNGSI TANPA MENUNGGU DOMContentLoaded
renderWebUtama();

function initScrollObserver() {
    const hiddenElements = document.querySelectorAll('.reveal-up:not(.active), .reveal-fade:not(.active)');
    const observerOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.10 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    hiddenElements.forEach((el) => scrollObserver.observe(el));
}