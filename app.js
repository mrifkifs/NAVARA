/**
 * NAVARA ACADEMIC SOCIETY - LIVE FIREBASE CLIENT SCRIPT
 * Membaca data langsung secara Cloud dari Firestore yang diinput oleh Admin
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// CONFIGURATION FIREBASE: Samakan persis dengan yang Anda isi di admin.html
const firebaseConfig = {
    apiKey: "PASTE_API_KEY_ANDA_DISINI",
    authDomain: "PROJECT_ANDA.firebaseapp.com",
    projectId: "PROJECT_ANDA",
    storageBucket: "PROJECT_ANDA.appspot.com",
    messagingSenderId: "SENDER_ID_ANDA",
    appId: "APP_ID_ANDA"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    
    // ==========================================
    // 1. AMBIL LIVE DATA ANGGOTA KELAS
    // ==========================================
    const containerAnggota = document.getElementById('anggota-container');
    if (containerAnggota) {
        try {
            let htmlAnggota = '';
            // Ambil koleksi "anggota" diurutkan dari yang paling lama diinput atau berdasarkan kriteria Anda
            const qAnggota = query(collection(db, "anggota"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(qAnggota);
            
            let index = 0;
            querySnapshot.forEach((doc) => {
                const mhs = doc.data();
                const borderStyle = mhs.isHighlighted ? 'style="border-color: var(--accent-gold);"' : '';
                const animationDelay = index * 0.08; 
                
                htmlAnggota += `
                    <div class="member-card reveal-up" ${borderStyle} style="transition-delay: ${animationDelay}s;">
                        <div class="member-name">${mhs.nama}</div>
                        <div class="member-nim">NIM: ${mhs.nim}</div>
                        <div class="badge">Active Student</div>
                    </div>
                `;
                index++;
            });
            
            // Jika database kosong, tampilkan pesan informatif
            containerAnggota.innerHTML = htmlAnggota || '<p style="color:var(--text-gray);">Belum ada data anggota. Input lewat halaman admin.</p>';
        } catch (err) {
            console.error("Error load anggota: ", err);
        }
    }

    // ==========================================
    // 2. AMBIL LIVE DATA JADWAL KULIAH
    // ==========================================
    const containerJadwal = document.getElementById('jadwal-container');
    if (containerJadwal) {
        try {
            const qJadwal = query(collection(db, "jadwal"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(qJadwal);
            
            // Kelompokkan data flat dari Firestore ke dalam Array Hari struktur aslinya
            const hariMap = { "Senin": [], "Selasa": [], "Rabu": [], "Kamis": [], "Jumat": [] };
            
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                if(hariMap[item.hari]) {
                    hariMap[item.hari].push(item);
                }
            });

            let htmlJadwal = '';
            let dayIndex = 0;

            // Render loop berurutan berdasarkan hari Senin - Jumat
            const urutanHari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
            urutanHari.forEach((hari) => {
                const listMatkul = hariMap[hari];
                
                // Lewati atau tampilkan kotak kosong jika hari tersebut tidak ada kuliah
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
                    <div class="day-card reveal-up" style="transition-delay: ${dayDelay}s;">
                        <div class="day-header">
                            <span>${hari}</span>
                            <i class="fa-regular fa-clock" style="color: var(--accent-gold); font-size: 1.1rem;"></i>
                        </div>
                        <div class="subject-list">
                            ${matkulHtml}
                        </div>
                    </div>
                `;

                // SISIPAN KARTU GAMBAR KAMPUS UNIVERSITAS 'AISYIYAH BANDUNG (Sesuai Layout di sebelah Hari Rabu)
                if (hari === "Rabu") {
                    htmlJadwal += `
                        <div class="schedule-image-card reveal-up" style="transition-delay: ${(dayIndex + 1) * 0.12}s;">
                            <h4>Pursue Excellence.</h4>
                            <p>NAVARA SOCIETY</p>
                        </div>
                    `;
                }
                dayIndex++;
            });

            containerJadwal.innerHTML = htmlJadwal || '<p style="color:var(--text-gray);">Belum ada jadwal kuliah.</p>';

        } catch (err) {
            console.error("Error load jadwal: ", err);
        }
    }

    // Memicu ulang sistem pengawasan scroll agar animasi muncul mulus bekerja untuk elemen dari Firebase
    initScrollObserver();
});

function initScrollObserver() {
    const hiddenElements = document.querySelectorAll('.reveal-up, .reveal-fade');
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