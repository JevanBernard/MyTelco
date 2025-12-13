// --- BAGIAN 1: IMPORT HALAMAN LOGIN, REGISTER & SURVEY ---
import Login from './login-page.js';
import Register from './register-page.js';
// import Survey from './survey-page.js';

// --- BAGIAN 2: KODE ASLI (TIDAK DIUBAH) ---

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

// --- FUNGSI HAMBURGER MENU ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('open');
        });
    }
});

// --- BAGIAN 3: LOGIKA ROUTING (LOGIN & REGISTER) ---

window.kirimData = kirimData;

// Logika Pindah Halaman
const initRouter = async () => {
    const landingPage = document.querySelector('#landing-page');
    const appContainer = document.querySelector('#app');
    const hash = window.location.hash;

    if (hash === '#/login') {
        // Halaman Login
        landingPage.style.display = 'none';
        appContainer.style.display = 'block';

        const loginPage = new Login();
        appContainer.innerHTML = await loginPage.render();
        await loginPage.afterRender();
        
    } else if (hash === '#/register') {
        // Halaman Register
        landingPage.style.display = 'none';
        appContainer.style.display = 'block';

        const registerPage = new Register();
        appContainer.innerHTML = await registerPage.render();
        await registerPage.afterRender();
        
    } else if (hash === '#/survey') {
        // Halaman Survey
        landingPage.style.display = 'none';
        appContainer.style.display = 'block';

        const surveyPage = new Survey();
        appContainer.innerHTML = await surveyPage.render();
        await surveyPage.afterRender();
        
    } else {
        // Halaman Home
        landingPage.style.display = 'block';
        appContainer.style.display = 'none';
        appContainer.innerHTML = '';
    }
};

// Jalankan saat URL berubah
window.addEventListener('hashchange', initRouter);
// Jalankan saat halaman pertama kali dibuka
window.addEventListener('load', initRouter);
