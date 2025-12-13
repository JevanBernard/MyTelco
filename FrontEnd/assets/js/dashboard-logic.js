const API_BASE_URL = "http://127.0.0.1:8000";

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

async function initDashboard() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
        window.location.href = 'auth.html#login';
        return;
    }

    let user;
    try {
        user = JSON.parse(userJson);
    } catch (e) {
        return;
    }

    const userId = user.id || user.user_id;

    try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/${userId}`);
        
        if (response.status === 404) {
            renderDefaultDashboard(user);
            return;
        }

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        renderDashboard(data);

    } catch (error) {
        console.error("Dashboard Error:", error);
        renderDefaultDashboard(user);
    }
}

function renderDashboard(data) {
    // Profil
    document.getElementById('userName').innerText = data.user.name;
    
    // REVISI: Tampilkan Nomor Telepon, bukan Plan Type
    // Backend mengirim phone di data.user.phone
    const phone = data.user.phone || "-";
    document.getElementById('userPhone').innerText = phone;
    
    // Stats
    const spend = parseInt(data.profile.monthly_spend || 0);
    document.getElementById('userSpend').innerText = "Rp " + spend.toLocaleString('id-ID');
    
    const usage = parseFloat(data.profile.data_usage || 0).toFixed(1);
    document.getElementById('userUsage').innerText = usage;
    
    document.getElementById('topupFreq').innerText = (data.profile.topup_freq || 0) + "x";

    // Rekomendasi
    const rec = data.recommendation;
    if (rec) {
        // Tampilkan Nama Penawaran (Kategori)
        // Contoh: "Kamu cocok dengan paket Streaming Partner Pack kami!"
        const offerName = rec.offer_name || "General Offer";
        
        // Update Judul Rekomendasi
        const recTitleElement = document.getElementById('recTitle');
        // Reset isi dulu agar bersih
        recTitleElement.innerHTML = `Kamu cocok dengan paket <span style="color: #FFDB43;">${offerName}</span> kami!`;
        
        // Update Alasan (Reasoning)
        // Kita bisa buat logic teks marketing sederhana di sini atau ambil dari backend jika ada
        const reasonElement = document.getElementById('recReason');
        if (offerName.includes('Streaming')) {
            reasonElement.innerText = "Pola datamu banyak habis untuk Streaming. Hemat pengeluaran dengan paket khusus ini.";
        } else if (offerName.includes('Booster')) {
            reasonElement.innerText = "Kuota utamamu sering habis duluan? Booster adalah solusi hemat.";
        } else if (offerName.includes('Roaming')) {
            reasonElement.innerText = "Terdeteksi sering bepergian. Tetap terkoneksi di luar negeri tanpa repot.";
        } else {
            reasonElement.innerText = "Paket terbaik yang disesuaikan dengan budget dan gaya hidupmu.";
        }

        // REVISI: Tidak merender kartu produk di sini. 
        // Tombol "Lihat Semua Rekomendasi" di HTML yang akan mengarah ke product.html
    }

    // History
    renderHistory(data.history);
}

function renderDefaultDashboard(user) {
    document.getElementById('userName').innerText = user.name;
    // Tampilkan No HP dari local storage jika backend gagal
    document.getElementById('userPhone').innerText = user.phone || user.username || "-";
    
    document.getElementById('userSpend').innerText = "Rp 0";
    document.getElementById('userUsage').innerText = "0";
    document.getElementById('topupFreq').innerText = "0x";
    
    // Default Text Rekomendasi
    const recTitle = document.getElementById('recTitle');
    recTitle.innerHTML = `Selamat Datang di <span style="color: #FFDB43;">MyTelco</span>`;
    document.getElementById('recReason').innerText = "Isi survey atau mulai transaksi untuk mendapatkan rekomendasi AI.";
}

function renderHistory(list) {
    const container = document.querySelector('.history-frames');
    if (!container) return;

    if (!list || list.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#888; padding:20px;">Belum ada transaksi</div>`;
        return;
    }

    container.innerHTML = '';
    list.forEach(item => {
        const date = new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const time = new Date(item.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const price = (item.amount / 1000).toFixed(0) + "k";
        
        const html = `
            <div class="history-frame">
                <div class="history-group">
                    <img src="./assets/img/icon/global.svg" alt="history">
                    <div class="history-list">
                        <h3>${item.product_name}</h3>
                        <p>${date}, ${time}</p>
                    </div>
                </div>
                <b>Rp ${price}</b>
            </div>
        `;
        container.innerHTML += html;
    });
}