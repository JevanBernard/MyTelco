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