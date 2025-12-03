// --- BAGIAN 1: IMPORT HALAMAN LOGIN ---
import Login from './login-page.js';

// --- BAGIAN 2: KODE ASLI TEMANMU (TIDAK DIUBAH) ---

// Fungsi untuk memanggil API Machine Learning (Backend)
async function kirimData() {
    const internetValue = document.getElementById('internetInput').value;
    const resultDiv = document.getElementById('result');

    if (!internetValue) {
        alert("Mohon isi penggunaan internet!");
        return;
    }

    resultDiv.innerHTML = "Sedang memproses (Loading)...";

    const dataToSend = {
        internet: parseInt(internetValue),
        call: 0 
    };

    try {
        const response = await fetch('http://localhost:3000/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        const data = await response.json();
        console.log("Respon dari Server:", data);
        
        if (data.prediction) {
            resultDiv.innerHTML = `
                Status: <span style="color: green">Sukses</span><br>
                Prediksi Churn: <strong>${data.prediction}</strong>
            `;
        } else {
            resultDiv.innerHTML = "Gagal mendapatkan prediksi.";
        }

    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerHTML = `<span style="color: red">Error: Pastikan Server Backend (Node.js) menyala!</span>`;
    }
}

// --- FUNGSI BARU: HAMBURGER MENU ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            // Toggle class 'active' untuk menampilkan/menyembunyikan menu
            mainNav.classList.toggle('active');
            
            // Opsional: Animasi hamburger menjadi 'X'
            menuToggle.classList.toggle('open');
        });
    }
});


// --- BAGIAN 3: TAMBAHAN LOGIKA ROUTING (LOGIN) ---

// PENTING: Karena kita pakai type="module", fungsi kirimData jadi tersembunyi.
// Kita harus pasang ke 'window' agar tombol HTML <button onclick="kirimData()"> tetap bisa membacanya.
window.kirimData = kirimData;

// Logika Pindah Halaman
const initRouter = async () => {
    const landingPage = document.querySelector('#landing-page');
    const appContainer = document.querySelector('#app');
    const hash = window.location.hash; // Cek URL (misal: #/login)

    if (hash === '#/login') {
        // Jika URL akhiran #/login:
        landingPage.style.display = 'none'; // Sembunyikan Home
        appContainer.style.display = 'block'; // Tampilkan Wadah Login

        // Render halaman Login
        const loginPage = new Login();
        appContainer.innerHTML = await loginPage.render();
        await loginPage.afterRender();
        
    } else {
        // Jika URL kosong atau #home:
        landingPage.style.display = 'block'; // Tampilkan Home
        appContainer.style.display = 'none'; // Sembunyikan Wadah Login
        appContainer.innerHTML = ''; // Bersihkan memori login
    }
};

// Jalankan saat tombol diklik (URL berubah)
window.addEventListener('hashchange', initRouter);
// Jalankan saat halaman pertama kali dibuka
window.addEventListener('load', initRouter);
